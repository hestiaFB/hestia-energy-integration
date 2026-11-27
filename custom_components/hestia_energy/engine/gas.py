"""The gas of the Energy page, counted like the electricity: each day, this month, the twelve last months, the bill.

Hestia Energy says what the home burns and what it costs, never what the gas is used for: the heating, the cooking
and the hot water are counted together. The heating's share is Hestia Heating's work, which reads each day's gas
through the interface (api.days). Frank, 27 Nov. 2026: « l'énergie c'est le gaz… si cela concerne le chauffage, cela
doit aller à la brique chauffage ». The bill's lines and the units come from Yann Le Gall's proposal (PR 23).

A meter counts in kWh or in cubic metres (sources.gas_unit; volumes are read in litres). The Energy page's price is a
price per unit of the meter; the household may type its bill's own lines in Réglages (three, taxes included): the
price of a kWh, the subscription of a month (CTA included), the kWh in a cubic metre.

Pure Python.
"""
from __future__ import annotations

from calendar import monthrange
from dataclasses import dataclass
from datetime import date, datetime, timedelta, tzinfo

from . import stats
from .sources import GAS_ENERGY, GAS_VOLUME

# What a cubic metre of gas gives in France, about (the bill gives the month's own coefficient).
KWH_PER_M3 = 11.2
# No « à ce rythme » before three days of the month: one cold morning is not a month (report.projection's own rule).
MIN_DAYS = 3


@dataclass(frozen=True)
class Contract:
    """The gas contract as typed in Réglages, taxes included; every line may be left empty."""
    price_kwh: float | None = None       # the bill's price of a kWh: replaces the Energy page's
    subscription: float | None = None    # euros a month, the CTA included
    kwh_per_m3: float | None = None      # the bill's conversion, for a meter that counts cubic metres

    def kwh_in(self, unit: str | None) -> float:
        """The kWh in one unit of the meter."""
        return (self.kwh_per_m3 or KWH_PER_M3) if unit == GAS_VOLUME else 1.0

    def unit_price(self, unit: str | None, page: float | None) -> float | None:
        """What one unit of the meter (a kWh or a m³) costs. None when no price is known: the gas is then shown
        without euros, never as free."""
        if self.price_kwh is not None:
            return self.price_kwh * self.kwh_in(unit)
        return page


@dataclass(frozen=True)
class Day:
    quantity: float     # in the meter's unit (kWh or m³)
    kwh: float          # the energy, a volume converted with the bill's coefficient
    complete: bool      # every meter counted every hour of the day


def unit_of(stats_ids: list[str], units: dict[str, str | None]) -> str | None:
    """The one unit the meters (their statistics) count in; None without a meter whose unit is known, or when they mix
    kWh and m³ (never added up)."""
    found = {units.get(sid) for sid in stats_ids}
    found.discard(None)
    return found.pop() if len(found) == 1 else None


def days(readings: list, units: dict[str, str | None], tz: tzinfo, contract: Contract) -> dict[date, Day]:
    """Each day's gas, all the meters together (the stove's gas meter left out by the caller)."""
    unit = unit_of([r.meter.stat for r in readings], units)
    if unit is None:
        return {}
    scale = 0.001 if unit == GAS_VOLUME else 1.0     # litres to cubic metres
    out: dict[date, list] = {}
    for reading in readings:
        if units.get(reading.meter.stat) != unit:
            continue
        for day, t in stats.days(reading.series, tz).items():
            q, complete = out.get(day, (0.0, True))
            out[day] = [q + t.kwh * scale, complete and t.complete]
    kwh = contract.kwh_in(unit)
    return {d: Day(q, q * kwh, c) for d, (q, c) in out.items()}


def _sum(found: dict[date, Day], first: date, last: date) -> float:
    return sum(d.quantity for day, d in found.items() if first <= day <= last)


def summary(found: dict[date, Day], unit: str | None, price: float | None, contract: Contract, now: datetime) -> dict | None:
    """The card's and the panel's figures: this month day by day, the bill, the twelve whole months before. None when
    no gas was ever counted. `price`: one unit of the meter, taxes included, or None (quantities without euros)."""
    if not found or unit is None:
        return None
    today = now.date()
    first = today.replace(day=1)
    fixed = contract.subscription
    euros = (lambda q: None if price is None else round(q * price, 2))  # noqa: E731

    month_q = _sum(found, first, today)
    elapsed = (now - datetime.combine(first, datetime.min.time(), now.tzinfo)).total_seconds() / 86400
    length = monthrange(today.year, today.month)[1]
    burnt = euros(month_q)
    fixed_so_far = None if fixed is None else round(fixed * min(1.0, elapsed / length), 2)
    end = None
    if burnt is not None and elapsed >= MIN_DAYS:
        end = round(burnt * length / elapsed + (fixed or 0.0), 2)

    each, day = [], first
    while day <= today:
        d = found.get(day)
        each.append({"jour": day.isoformat(), "q": None if d is None else round(d.quantity, 2)})
        day += timedelta(days=1)
    known = [d for d in each if d["q"] is not None and d["jour"] != today.isoformat()]
    biggest = max(known, key=lambda d: d["q"], default=None)

    months = []
    start = first
    for _ in range(12):
        start = (start - timedelta(days=1)).replace(day=1)
        last = start.replace(day=monthrange(start.year, start.month)[1])
        if not any(start <= d <= last for d in found):
            continue
        q = _sum(found, start, last)
        e = euros(q)
        months.append({"mois": start.isoformat(), "q": round(q, 1),
                       "euros": None if e is None else round(e + (fixed or 0.0), 2)})
    whole = [m["euros"] for m in months]
    return {
        "unite": unit, "prix": None if price is None else round(price, 4), "abonnement": fixed,
        "kwh_par_m3": contract.kwh_in(unit) if unit == GAS_VOLUME else None,
        "mois": {"q": round(month_q, 1), "kwh": round(month_q * contract.kwh_in(unit), 1), "gaz_euros": burnt,
                 "abonnement_euros": fixed_so_far,
                 "euros": None if burnt is None else round(burnt + (fixed_so_far or 0.0), 2),
                 "fin_de_mois": end},
        "jours": each,
        "plus_gros": None if biggest is None else {**biggest, "euros": euros(biggest["q"])},
        "q_par_jour": round(sum(d["q"] for d in known) / len(known), 2) if known else None,
        "douze_mois": months,
        "douze_mois_euros": None if not months or any(e is None for e in whole) else round(sum(whole), 2),
    }


def unit_word(unit: str | None) -> str:
    return "m³" if unit == GAS_VOLUME else "kWh" if unit == GAS_ENERGY else ""
