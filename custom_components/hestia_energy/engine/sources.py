"""Home Assistant's Energy page, read once into one shape whatever its format (lot 1.1).

Home Assistant changed the page's format in 2026: a grid used to be one source with lists `flow_from` and `flow_to`;
it is now one source per meter, each with `stat_energy_from` and/or `stat_energy_to`, its prices and its `power_config`.
Both are read here into the same `EnergyPage`; nothing else in the engine knows there were two formats.

Plain Python: the page comes in as the dict `energy/get_prefs` returns, the statistics' metadata as the list
`recorder/list_statistic_ids` returns (or a dict by id). No Home Assistant import.
"""
from __future__ import annotations

from dataclasses import dataclass, field
import re
import unicodedata

FORMAT_2026 = "2026"
FORMAT_OLD = "ancien"

# Words that make a meter an off-peak or a peak one (French and English names, entity ids, price entities).
_HC = re.compile(r"(?<![a-z])(hc|heures? creuses?|creuses?|off ?peak|low ?tariff)(?![a-z])")
# « Pointe » (Enercoop, EJP): peak hours at a dearer price, counted on a register of their own.
_HP = re.compile(r"(?<![a-z])(hp|heures? pleines?|pleines?|pointes?|peak|high ?tariff)(?![a-z])")
# A « gas » source that is really a stove: Home Assistant's page has no pellets or wood (D6, F1.6).
_STOVE = re.compile(r"(poele|pellet|granule|bois|wood|stove|insert)")


def _plain(text: str | None) -> str:
    """Lower case without accents: « Poêle » and « sensor.poele_energie » read alike."""
    text = unicodedata.normalize("NFKD", text or "")
    return "".join(c for c in text if not unicodedata.combining(c)).lower()


@dataclass(frozen=True)
class Price:
    """A price as the page gives it: an entity to read, or a number written in the page, or a cost statistic."""
    entity: str | None = None
    number: float | None = None
    stat_cost: str | None = None

    @property
    def known(self) -> bool:
        return bool(self.entity or self.number is not None or self.stat_cost)


@dataclass(frozen=True)
class Power:
    """How the page reads live power for a source: one signed sensor, an inverted one, or two positive ones."""
    rate: str | None = None
    inverted: bool = False
    rate_from: str | None = None
    rate_to: str | None = None

    @property
    def entities(self) -> tuple[str, ...]:
        return tuple(e for e in (self.rate, self.rate_from, self.rate_to) if e)


@dataclass(frozen=True)
class Meter:
    """One statistic of the page: what it counts, its name, its price, its live power."""
    kind: str  # import, export, solar, gas, water, battery_in, battery_out, device, water_device
    stat: str
    name: str | None = None
    price: Price = Price()
    power: Power = Power()
    # import meters only: « hc » or « hp » when the meter counts one period (Frank's two LiXee meters), else None.
    period: str | None = None
    # devices only: the meter that contains this one (sub-meters: its remainder only, nothing counted twice).
    included_in: str | None = None
    forecasts: tuple[str, ...] = ()

    @property
    def external(self) -> bool:
        """An imported statistic (« linky:… » from HA Linky): no live state behind it, and no price possible in the page."""
        return ":" in self.stat


@dataclass
class Remark:
    """Something the page says that the user should look at: a phrase id of PHRASES.md and its values."""
    id: str
    values: dict = field(default_factory=dict)


@dataclass
class EnergyPage:
    format: str
    imports: list[Meter] = field(default_factory=list)
    exports: list[Meter] = field(default_factory=list)
    solar: list[Meter] = field(default_factory=list)
    gas: list[Meter] = field(default_factory=list)
    water: list[Meter] = field(default_factory=list)
    batteries_in: list[Meter] = field(default_factory=list)
    batteries_out: list[Meter] = field(default_factory=list)
    devices: list[Meter] = field(default_factory=list)
    water_devices: list[Meter] = field(default_factory=list)
    remarks: list[Remark] = field(default_factory=list)

    @property
    def meters(self) -> list[Meter]:
        return [*self.imports, *self.exports, *self.solar, *self.gas, *self.water, *self.batteries_in,
                *self.batteries_out, *self.devices, *self.water_devices]

    @property
    def empty(self) -> bool:
        return not self.imports


def _num(value) -> float | None:
    try:
        return None if value is None else float(value)
    except (TypeError, ValueError):
        return None


def _period(*texts: str | None) -> str | None:
    """« hc » or « hp » when the names say so, the off-peak words first."""
    text = " ".join(_plain(t).replace(".", " ").replace("_", " ").replace("-", " ") for t in texts if t)
    if _HC.search(text):
        return "hc"
    if _HP.search(text):
        return "hp"
    return None


def _power(source: dict) -> Power:
    config = source.get("power_config") or {}
    if config.get("stat_rate_from") or config.get("stat_rate_to"):
        return Power(rate_from=config.get("stat_rate_from"), rate_to=config.get("stat_rate_to"))
    if config.get("stat_rate_inverted"):
        return Power(rate=config["stat_rate_inverted"], inverted=True)
    if config.get("stat_rate"):
        return Power(rate=config["stat_rate"])
    return Power(rate=source.get("stat_rate"))


def _grid_2026(page: EnergyPage, source: dict) -> None:
    name, power = source.get("name"), _power(source)
    if source.get("stat_energy_from"):
        price = Price(source.get("entity_energy_price"), _num(source.get("number_energy_price")), source.get("stat_cost"))
        page.imports.append(Meter("import", source["stat_energy_from"], name, price, power,
                                  _period(name, source["stat_energy_from"], source.get("entity_energy_price"))))
    if source.get("stat_energy_to"):
        price = Price(source.get("entity_energy_price_export"), _num(source.get("number_energy_price_export")),
                      source.get("stat_compensation"))
        page.exports.append(Meter("export", source["stat_energy_to"], name, price, power))


def _grid_old(page: EnergyPage, source: dict) -> None:
    rates = [p.get("stat_rate") for p in source.get("power") or [] if p.get("stat_rate")]
    power = Power(rate=rates[0]) if rates else Power()
    for flow in source.get("flow_from") or []:
        if flow.get("stat_energy_from"):
            price = Price(flow.get("entity_energy_price"), _num(flow.get("number_energy_price")), flow.get("stat_cost"))
            page.imports.append(Meter("import", flow["stat_energy_from"], flow.get("name"), price, power,
                                      _period(flow.get("name"), flow["stat_energy_from"], flow.get("entity_energy_price"))))
    for flow in source.get("flow_to") or []:
        if flow.get("stat_energy_to"):
            price = Price(flow.get("entity_energy_price"), _num(flow.get("number_energy_price")), flow.get("stat_compensation"))
            page.exports.append(Meter("export", flow["stat_energy_to"], flow.get("name"), price, power))


def read_page(prefs: dict | None) -> EnergyPage:
    """The Energy page in one shape. An empty or missing page gives an empty one: the brick then says what to install."""
    prefs = prefs or {}
    sources = prefs.get("energy_sources") or []
    old = any("flow_from" in s or "flow_to" in s for s in sources if s.get("type") == "grid")
    page = EnergyPage(FORMAT_OLD if old else FORMAT_2026)
    for source in sources:
        kind = source.get("type")
        if kind == "grid":
            (_grid_old if old else _grid_2026)(page, source)
        elif kind == "solar" and source.get("stat_energy_from"):
            page.solar.append(Meter("solar", source["stat_energy_from"], source.get("name"), power=_power(source),
                                    forecasts=tuple(source.get("config_entry_solar_forecast") or ())))
        elif kind == "battery":
            power = _power(source)
            if source.get("stat_energy_from"):
                page.batteries_out.append(Meter("battery_out", source["stat_energy_from"], source.get("name"), power=power))
            if source.get("stat_energy_to"):
                page.batteries_in.append(Meter("battery_in", source["stat_energy_to"], source.get("name"), power=power))
        elif kind in ("gas", "water") and source.get("stat_energy_from"):
            price = Price(source.get("entity_energy_price"), _num(source.get("number_energy_price")), source.get("stat_cost"))
            meter = Meter(kind, source["stat_energy_from"], source.get("name"), price, _power(source))
            (page.gas if kind == "gas" else page.water).append(meter)
    for key, kind, target in (("device_consumption", "device", page.devices),
                              ("device_consumption_water", "water_device", page.water_devices)):
        for device in prefs.get(key) or []:
            if device.get("stat_consumption"):
                target.append(Meter(kind, device["stat_consumption"], device.get("name"),
                                    power=Power(rate=device.get("stat_rate")), included_in=device.get("included_in_stat")))
    _remarks(page)
    return page


def _remarks(page: EnergyPage) -> None:
    """What the page itself gets wrong, said once in the panel (PHRASES.md § 7), never corrected in Home Assistant (D9)."""
    for meter in page.gas:
        if _STOVE.search(_plain(f"{meter.name} {meter.stat}")):
            page.remarks.append(Remark("p_fausse_source", {"nom": meter.name or meter.stat, "stat": meter.stat}))


# --- What the home is equipped with (lot 1.5) -------------------------------------------------------------------

@dataclass(frozen=True)
class Level:
    """The equipment level (B4): the highest one reached, and each level's own yes or no."""
    level: int
    bill: bool        # 0: what was bought from the grid, at least by the day
    live: bool        # 1: a live grid power
    devices: bool     # 2: measured devices
    sun: bool         # 3: solar panels
    hourly: bool      # bought energy known hour by hour (night baseload, contract simulation, off-peak change)
    missing: tuple[str, ...] = ()


def equipment(page: EnergyPage, statistics: dict | list | None = None, live: set[str] | None = None) -> Level:
    """The level from the page and, when known, the statistics' metadata and the entities seen alive.

    `statistics`: `recorder/list_statistic_ids` (list, or dict by id): a meter without statistics does not count.
    `live`: entity ids with a fresh state; when None, a power declared in the page is enough for level 1.
    """
    meta = _by_id(statistics)
    exists = (lambda stat: stat in meta) if meta else (lambda stat: True)
    bill = any(exists(m.stat) for m in page.imports)
    rates = {e for m in [*page.imports, *page.exports] for e in m.power.entities}
    live_grid = bill and (bool(rates & live) if live is not None else bool(rates))
    devices = bill and any(exists(m.stat) for m in page.devices)
    sun = bill and any(exists(m.stat) for m in page.solar)
    # External statistics (HA Linky, MyElectricalData) may come by the day only: hourly is proven by the statistics later.
    hourly = bill and any(not m.external for m in page.imports)
    missing = tuple(k for k, ok in (("compteur", bill), ("direct", live_grid), ("appareils", devices), ("soleil", sun)) if not ok)
    level = 3 if sun else 2 if devices else 1 if live_grid else 0
    return Level(level, bill, live_grid, devices, sun, hourly, missing)


def _by_id(statistics) -> dict:
    if not statistics:
        return {}
    if isinstance(statistics, dict):
        return statistics
    return {s["statistic_id"]: s for s in statistics if "statistic_id" in s}


# --- The unit a gas meter counts in (Yann Le Gall, PR 23) ---------------------------------------------------------

GAS_ENERGY, GAS_VOLUME = "kWh", "m³"
_ENERGY_UNITS = {"wh", "kwh", "mwh", "gwh", "j", "kj", "mj", "gj", "cal", "kcal", "mcal", "gcal"}
_VOLUME_UNITS = {"m³", "m3", "l", "ml", "ft³", "ft3", "ccf", "mcf", "gal"}


def gas_unit(meta: dict | None) -> str | None:
    """« kWh » or « m³ »: what a gas meter of the page counts, from its statistics' metadata (their unit class, else
    their unit). The Energy page takes both, and its price is per unit of the meter. None when it is neither, or not
    known yet."""
    meta = meta or {}
    kind = meta.get("unit_class")
    unit = str(meta.get("statistics_unit_of_measurement") or meta.get("unit_of_measurement") or "").lower()
    if kind == "energy" or (kind is None and unit in _ENERGY_UNITS):
        return GAS_ENERGY
    if kind == "volume" or (kind is None and unit in _VOLUME_UNITS):
        return GAS_VOLUME
    return None


# --- The consumption source, the one thing the brick needs (D21) ------------------------------------------------

HA_LINKY, MYELECTRICALDATA, TIC, OTHER = "ha_linky", "myelectricaldata", "tic", "autre"
# The three official sources, the shortest paths shown when a home has none (D21). Links are the projects' own pages.
OFFICIAL = (
    {"type": HA_LINKY, "nom": "HA Linky", "materiel": False, "direct": False,
     "lien": "https://github.com/bokub/ha-linky"},
    {"type": MYELECTRICALDATA, "nom": "MyElectricalData", "materiel": False, "direct": False,
     "lien": "https://www.myelectricaldata.fr/"},
    {"type": TIC, "nom": "Module sur le Linky (LiXee / ZLinky, linkytic)", "materiel": True, "direct": True,
     "lien": "https://github.com/hekmon/linkytic"},
)
_TIC_DEVICE = re.compile(r"lixee|zlinky|linky|teleinfo|t[ée]l[ée]info|tic\b", re.I)


def source_of(stat: str, platform: str | None = None, device: str | None = None) -> str:
    """Which kind of source a consumption statistic comes from: its statistic id (« linky:… » imported by HA Linky,
    « myelectricaldata:… »), its integration, or its device's maker and model (a LiXee seen through ZHA or MQTT)."""
    head = stat.split(":", 1)[0].lower() if ":" in stat else ""
    platform = (platform or "").lower()
    if head == "linky" or platform == "linky":
        return HA_LINKY
    if "myelectricaldata" in head or "myelectricaldata" in platform:
        return MYELECTRICALDATA
    if platform in ("linkytic", "teleinfo", "lixee") or _TIC_DEVICE.search(device or "") or _TIC_DEVICE.search(stat):
        return TIC
    return OTHER
