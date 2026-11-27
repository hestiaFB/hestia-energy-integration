"""Advice « à froid » (Frank, 9 Nov. 2026): what to change in the home's habits or contract, from the days alone. The banner
keeps the gestures of the moment (it needs live power); these hold for weeks and are said with the euros at stake, so
they work from palier 0 (a Linky read by HA Linky):

- the unusual day: the latest whole day far above the usual one (for its cold, with Hestia Météo);
- the contract: off-peak hours that do not pay, from the days known hour by hour (HA Linky keeps the last seven);
- the baseload: what the home draws when everything sleeps, from those same nights;
- the month: dearer than the same month a year before.

No heating advice: the heating is Hestia Heating's (1.0.1b8).

Plain Python. Each advice: {id, titre, pourquoi, euros_an, unite, rubrique} (PHRASES.md « Pistes »), most useful first;
some also say {maintenant, mieux, gain, sous}: what is done today, what would be better, the euros shown (maquette D).
"""
from __future__ import annotations

from datetime import date, datetime, timedelta

from . import anomaly, baseline, heating, phrases, report, stats, tariff

MIN_HOURLY_DAYS = 7        # days known hour by hour before the contract or the baseload is said
MIN_NIGHTS = 7
CONTRACT_GAIN = 15.0       # € a year below which a change of option is not worth a word
BASELOAD_W = 120           # a baseload below this is an ordinary home's
BASELOAD_STEP_W = 50       # the gain of the baseload advice: what 50 W less would save
MONTH_SHARE, MONTH_EUR = 0.15, 10.0


def _advice(ident: str, values: dict, euros_year: float | None, rubric: str | None) -> dict:
    title, why, unit = phrases.PISTES[ident]
    return {"id": ident, "titre": phrases.fill(title, values), "pourquoi": phrases.fill(why, values),
            "euros_an": None if euros_year is None else round(euros_year), "unite": unit if euros_year is not None else None,
            "rubrique": rubric}


def _hourly_days(home) -> dict[date, dict[int, float]]:
    """The days the bought energy is known hour by hour (HA Linky: its last days), {day: {hour: kWh}}."""
    out: dict[date, dict[int, float]] = {}
    for hour in home.bought.hours if home.bought else []:
        if hour.hours == 1 and hour.kwh is not None:
            local = hour.start.astimezone(home.tz)
            out.setdefault(local.date(), {})[local.hour] = hour.kwh
    return {d: h for d, h in out.items() if len(h) >= 23}


def unusual_day(home, contract, table, now: datetime, cold: dict, learned) -> dict | None:
    """« Regardez ce qui a tourné jeudi » for the latest whole day, while it is news (two days at most)."""
    last = report.last_whole_day(home, contract, table, now, back=2)
    if last is None:
        return None
    day = date.fromisoformat(last["jour"])
    found = anomaly.check(day, home.used_days(), learned, cold)
    if found is None or not found.more:
        return None
    gap = found.used_kwh - found.usual_kwh
    per_kwh = last["euros_energie"] / last["kwh_achetes"] if last.get("euros_energie") is not None and last["kwh_achetes"] else None
    k = (now.astimezone(home.tz).date() - day).days
    values = {"jour": "hier" if k == 1 else phrases.WEEKDAYS[day.weekday()], "kwh": phrases.number(found.used_kwh),
              "habitude": phrases.number(found.usual_kwh), "euros": None if per_kwh is None else phrases.euros(gap * per_kwh)}
    if found.with_cold:
        values["avec"] = (" pour ce froid",)
    return _advice("jour_inhabituel", values, None, None)


def contract_option(home, contract, table, now: datetime) -> dict | None:
    """« Passez en option Base » when the off-peak hours do not pay: the share of the purchases in them, from the days
    known hour by hour, against the share from which they pay ((HP − Base) ÷ (HP − HC)), subscriptions included."""
    if contract.option != tariff.HPHC or contract.offpeak is None:
        return None
    days = _hourly_days(home)
    if len(days) < MIN_HOURLY_DAYS:
        return None
    off = total = 0.0
    for day, hours in days.items():
        for h, kwh in hours.items():
            at = datetime(day.year, day.month, day.day, h, 30, tzinfo=home.tz)
            total += kwh
            off += kwh if contract.offpeak.contains(at, home.tz) else 0.0
    if total <= 0:
        return None
    today = now.astimezone(home.tz).date()
    hp = tariff.price_at(contract, table, now, home.tz, tariff.HP)
    hc = tariff.price_at(contract, table, now, home.tz, tariff.HC)
    base = tariff.regulated_price(table, today, tariff.BASE, contract.kva)
    sub_hphc = contract.subscription_year or tariff.regulated_subscription(table, today, tariff.HPHC, contract.kva)
    sub_base = tariff.regulated_subscription(table, today, tariff.BASE, contract.kva)
    if None in (hp, hc, base, sub_hphc, sub_base) or hp <= hc:
        return None
    year = stats.total(home.bought, now - timedelta(days=365), now).kwh
    share = off / total
    gain = year * (share * hc + (1 - share) * hp - base) + sub_hphc - sub_base
    if gain < CONTRACT_GAIN:
        return None
    return _advice("contrat_base", {"part": round(share * 100), "seuil": round((hp - base) / (hp - hc) * 100),
                                    "euros": phrases.euros(gain), "jours": len(days)}, gain, "contrat")


def baseload(home, price: float | None) -> dict | None:
    """« Cherchez ce qui tourne la nuit » from the nights known hour by hour (seven are enough to say it)."""
    found = baseline.baseload(home.bought, home.tz, min_nights=MIN_NIGHTS) if home.bought else None
    euros = baseline.yearly_euros(found.watts, price) if found else None
    if found is None or euros is None or found.watts < BASELOAD_W:
        return None
    out = _advice("veille_haute", {"w": phrases.number(found.watts), "euros": phrases.euros(euros)}, euros, "veille")
    # Today, better, the gain (maquette D): the whole baseload is never all cut, so the gain is said for 50 W.
    step = BASELOAD_STEP_W
    out.update({"nom": "La veille", "maintenant": phrases.fill(phrases.BETTER["veille_haute"][0], {"w": phrases.number(found.watts),
                                                                                "euros": phrases.euros(euros)}),
                "mieux": phrases.BETTER["veille_haute"][1], "gain": round(euros * step / found.watts),
                "sous": f"par an pour {step} W coupés"})
    return out


def month_budget(last_year, projection: float | None, now: datetime) -> dict | None:
    """« Ce mois coûte plus que d'habitude » against the same month a year before, whole."""
    if projection is None or last_year is None or last_year.eur is None or now.day < 7:
        return None
    gap = projection - last_year.eur
    if gap < MONTH_EUR or gap < MONTH_SHARE * last_year.eur:
        return None
    return _advice("budget_mois", {"euros": phrases.euros(projection), "ecart": phrases.euros(gap),
                                   "mois": phrases.month_name(now.month)}, None, None)


def advices(home, contract, table, now: datetime, cold: dict, weather: bool, price: float | None, last_year,
            projection: float | None) -> list[dict]:
    """Every advice that holds today: the unusual day first (it is news), then the most euros a year."""
    learned = heating.learn(home.used_days(), cold) if weather else None
    found = [unusual_day(home, contract, table, now, cold, learned), contract_option(home, contract, table, now),
             baseload(home, price), month_budget(last_year, projection, now)]
    news = [a for a in found[:1] if a]
    rest = sorted((a for a in found[1:] if a), key=lambda a: -(a["euros_an"] or 0))
    return news + rest
