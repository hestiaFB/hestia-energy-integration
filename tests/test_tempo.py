"""Tempo's red days in the banner (PHRASES.md § 2), on an invented home: no real reading of any house."""
from datetime import datetime, timedelta
from pathlib import Path
import sys
from types import SimpleNamespace
import unittest
from zoneinfo import ZoneInfo

# At the end of the path: the brick's own select.py must never hide the standard library's select.
sys.path.append(str(Path(__file__).resolve().parents[1] / "custom_components" / "hestia_energy"))

from engine import advice, phrases, tariff  # noqa: E402
from engine.sources import EnergyPage, Meter  # noqa: E402

PARIS = ZoneInfo("Europe/Paris")


def at(hour: int, minute: int = 0) -> datetime:
    return datetime(2026, 1, 14, hour, minute, tzinfo=PARIS)


def situation(hour: int, **kw) -> advice.Situation:
    """An invented winter evening: 1,2 kW bought, no sun, the off-peak hours at 22 h."""
    now = at(hour)
    period = "hc" if hour >= 22 or hour < 6 else "hp"
    change = (at(22), "hc") if period == "hp" else (at(6) + timedelta(days=1 if hour >= 22 else 0), "hp")
    base = dict(now=now, tz=PARIS, period=period, next_change=change, offpeak_end=change[0] if period == "hc" else None,
                bought_w=1200, sent_w=0, sun_w=0, subscribed_w=9000)
    base.update(kw)
    return advice.Situation(**base)


class RedDay(unittest.TestCase):
    def test_a_red_day_says_so_until_22_h(self):
        b = advice.choose(situation(15, colour_now="rouge", colour_next="bleu", red_factor=0.7562 / 0.1568))
        self.assertEqual(b["id"], "jour_rouge")
        self.assertEqual(b["titre"], "Jour rouge jusqu'à 22 h : l'électricité coûte 4,8 fois plus.")
        self.assertEqual(b["pourquoi"], "Les machines attendront ce soir.")
        self.assertEqual((b["couleur"], b["pastille"]), (phrases.GESTE, "Jour rouge"))

    def test_without_its_prices_it_says_no_figure(self):
        b = advice.choose(situation(9, colour_now="rouge"))
        self.assertEqual(b["titre"], "Jour rouge jusqu'à 22 h.")

    def test_a_round_factor_has_no_decimal(self):
        self.assertIn("coûte 5 fois plus", advice.choose(situation(9, colour_now="rouge", red_factor=5.0))["titre"])

    def test_the_red_night_is_off_peak_nothing_red_is_said(self):
        b = advice.choose(situation(23, colour_now="rouge", colour_next="blanc", red_factor=4.8))
        self.assertEqual(b["id"], "rien_hc")

    def test_without_the_meter_period_the_hours_of_tempo_are_used(self):
        self.assertEqual(advice.choose(situation(7, period=None, colour_now="rouge"))["id"], "jour_rouge")
        self.assertNotEqual(advice.choose(situation(5, period=None, colour_now="rouge"))["id"], "jour_rouge")

    def test_a_sun_in_excess_keeps_its_benefit(self):
        b = advice.choose(situation(13, colour_now="rouge", sun_w=3000, sent_w=1500, bought_w=0))
        self.assertEqual(b["id"], "soleil_en_trop")

    def test_a_leak_stays_first(self):
        b = advice.choose(situation(15, colour_now="rouge", water_leak_min=60, water_litres_per_day=900))
        self.assertEqual(b["id"], "fuite_eau")


class RedTomorrow(unittest.TestCase):
    def test_the_eve_names_what_can_wait(self):
        b = advice.choose(situation(18, colour_now="bleu", colour_next="rouge",
                                    shiftable=["Lave-linge", "Lave-vaisselle", "Chauffe-eau"]))
        self.assertEqual(b["id"], "jour_rouge_demain")
        self.assertEqual(b["titre"], "Demain jour rouge : préparez ce soir.")
        self.assertEqual(b["pourquoi"], "Lave-linge, lave-vaisselle et chauffe-eau cette nuit, en heures creuses.")
        self.assertEqual(b["pastille"], "Demain rouge")

    def test_without_devices_it_speaks_of_the_machines(self):
        b = advice.choose(situation(18, colour_next="rouge"))
        self.assertEqual(b["pourquoi"], "Les machines cette nuit, en heures creuses.")

    def test_it_holds_through_the_night_before(self):
        self.assertEqual(advice.choose(situation(23, colour_now="blanc", colour_next="rouge"))["id"], "jour_rouge_demain")

    def test_two_red_days_in_a_row_the_one_under_way_first(self):
        self.assertEqual(advice.choose(situation(15, colour_now="rouge", colour_next="rouge"))["id"], "jour_rouge")
        self.assertEqual(advice.choose(situation(22, colour_now="rouge", colour_next="rouge"))["id"], "jour_rouge_demain")

    def test_a_blue_or_white_tomorrow_says_nothing(self):
        for colour in ("bleu", "blanc", None):
            self.assertFalse(advice.choose(situation(18, colour_now="bleu", colour_next=colour))["id"].startswith("jour_rouge"))

    def test_without_tempo_nothing_changes(self):
        self.assertEqual(advice.choose(situation(18))["id"], "rien_hc_bientot")


class Coordinator(unittest.TestCase):
    """What the coordinator gives the banner, in an invented home with RTE Tempo and three plugs."""

    def setUp(self):
        try:
            sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
            from custom_components.hestia_energy import coordinator
        except ImportError:
            self.skipTest("Home Assistant is not installed")
        states = {"sensor.rte_tempo_couleur_actuelle": SimpleNamespace(state="Bleu"),
                  "sensor.rte_tempo_prochaine_couleur": SimpleNamespace(state="Rouge")}
        c = coordinator.EnergyCoordinator.__new__(coordinator.EnergyCoordinator)
        c.hass = SimpleNamespace(states=SimpleNamespace(get=states.get))
        c.extras = {"tempo_today": "sensor.rte_tempo_couleur_actuelle", "tempo_tomorrow": "sensor.rte_tempo_prochaine_couleur"}
        c.page = EnergyPage("2026", devices=[Meter("device", "sensor.prise_lave_linge_energy", "Lave-linge"),
                                             Meter("device", "sensor.prise_tele_energy", "Télévision"),
                                             Meter("device", "sensor.ballon_energy")])
        c.device_names = {"sensor.ballon_energy": "Chauffe-eau"}
        c.contract = tariff.Contract(tariff.TEMPO, 9, None, {"rouge_hp": 0.7562, "rouge_hc": 0.1568})
        c.table, c.tz = {}, PARIS
        self.c = c

    def test_the_colours_and_what_can_wait(self):
        t = self.c._tempo(at(18))
        self.assertEqual((t["couleur"], t["couleur_demain"]), ("bleu", "rouge"))
        self.assertEqual(t["advice"]["shiftable"], ["Lave-linge", "Chauffe-eau"])
        self.assertAlmostEqual(t["advice"]["red_factor"], 4.82, places=2)
        b = advice.choose(situation(18, **t["advice"]))
        self.assertEqual(b["pourquoi"], "Lave-linge et chauffe-eau cette nuit, en heures creuses.")

    def test_another_contract_hears_no_red_day(self):
        self.c.contract = tariff.Contract(tariff.HPHC, 9)
        t = self.c._tempo(at(18))
        self.assertEqual((t["couleur_demain"], t["advice"]), ("rouge", {}))
        self.assertEqual(advice.choose(situation(18, **t["advice"]))["id"], "rien_hc_bientot")


if __name__ == "__main__":
    unittest.main()
