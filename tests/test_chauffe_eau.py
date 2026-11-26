"""The water heater driven by Hestia Energy (engine/water_heater.py), on an invented home: a 200 L tank of 2,4 kW,
off-peak hours from 22 h to 6 h, 6 kVA, showers at 7 h and 20 h. No reading of any real house."""
from datetime import date, datetime, timedelta
import math
from pathlib import Path
import sys
import time
import unittest
from zoneinfo import ZoneInfo

# At the end of the path: the brick's own select.py must never hide the standard library's select.
sys.path.append(str(Path(__file__).resolve().parents[1] / "custom_components" / "hestia_energy"))

from engine import water_heater as w  # noqa: E402

PARIS = ZoneInfo("Europe/Paris")
HP, HC, RESALE = 0.27, 0.2068, 0.04
TIMES = [7 * 60, 20 * 60]
LEARNED = w.Learned(2.4, 7.0, 7.0, 28, tuple([0.4] * 24), ())


def at(day: int, hour: int, minute: int = 0) -> datetime:
    return datetime(2026, 11, day, hour, minute, tzinfo=PARIS)


def offpeak(moment: datetime) -> bool:
    hour = moment.astimezone(PARIS).hour
    return hour >= 22 or hour < 6


def bell(peak: float):
    """The panels' production by a fine (peak 3,4 kW) or grey day, 8 h 30 to 17 h."""
    def sun(moment: datetime) -> float:
        local = moment.astimezone(PARIS)
        t = local.hour + local.minute / 60
        return 0.0 if t < 8.5 or t > 17 else peak * math.sin(math.pi * (t - 8.5) / 8.5) ** 1.6
    return sun


def plan(now, sun=None, start=6.0, live=None, ratio=None, price=None, settings=None, keep_on=False):
    price = price or (lambda m: HC if offpeak(m) else HP)
    slots = w.build_slots(now, PARIS, price, offpeak, sun or (lambda m: None), LEARNED, lambda d: 7.0, TIMES, live, ratio)
    s = settings or w.Settings(capacity=10, power_kw=2.4, min_kwh=3.0, export_price=RESALE, limit_kw=5.4)
    return w.make_plan(slots, start, s, keep_on), slots, s


def hours_of(p: w.Plan, source: str) -> float:
    return sum(1 for on, src in zip(p.on, p.source) if on and src == source) / 4


class TheNightBeforeEvening(unittest.TestCase):
    """Frank's first examples (26 Nov. 2026): the evening before, the forecast decides the night."""

    def test_a_fine_day_tomorrow_heats_just_enough_at_night_and_the_rest_in_the_sun(self):
        p, _, _ = plan(at(26, 18), bell(3.4))
        night = sum(e for e, src in zip(p.energy, p.source) if src == "heures_creuses")
        sun = sum(e for e, src in zip(p.energy, p.source) if src == "soleil")
        self.assertGreater(sun, 3.0)
        self.assertLess(night, 5.0)
        self.assertEqual(hours_of(p, "heures_pleines"), 0)
        self.assertIsNone(p.short_at)
        self.assertTrue(w.say(p, at(26, 18), PARIS, False, True).startswith("Du soleil est prévu : d'abord juste assez"))

    def test_a_grey_day_tomorrow_fills_the_tank_at_night(self):
        p, _, _ = plan(at(26, 18), bell(0.7))
        tomorrow_day = [i for i, x in enumerate(p.slots) if x.start.astimezone(PARIS).date() == date(2026, 11, 27)
                        and 6 <= x.start.astimezone(PARIS).hour < 22]
        self.assertFalse(any(p.on[i] for i in tomorrow_day))
        self.assertGreater(sum(e for e, src in zip(p.energy, p.source) if src == "heures_creuses"), 6.0)
        self.assertIsNone(p.short_at)

    def test_the_fine_day_costs_less_than_the_grey_one(self):
        fine, _, _ = plan(at(26, 18), bell(3.4))
        grey, _, _ = plan(at(26, 18), bell(0.7))
        self.assertLess(fine.euros, grey.euros)

    def test_without_panels_everything_goes_to_the_off_peak_hours(self):
        p, _, _ = plan(at(26, 18))
        self.assertEqual(hours_of(p, "heures_pleines"), 0)
        self.assertEqual(hours_of(p, "soleil"), 0)
        self.assertGreater(hours_of(p, "heures_creuses"), 1)

    def test_the_off_peak_night_is_one_run(self):
        p, _, _ = plan(at(26, 18), bell(0.7))
        first_night = [r for r in p.runs() if r["debut"] < at(27, 12).isoformat()]
        self.assertEqual(len(first_night), 1)


class DuringTheDay(unittest.TestCase):
    def test_the_clouds_come_the_sun_heating_stops_and_waits_for_cheaper(self):
        """A sun heating planned at noon, then the sun measured at 15 % of the forecast, the tank well filled."""
        p, slots, _ = plan(at(27, 12, 30), bell(3.4), start=8.0, live=0.2, ratio=0.15)
        self.assertFalse(p.on[0])
        self.assertLess(slots[1].sun_kw, 1.0)
        self.assertIn("Les nuages sont arrivés", w.say(p, at(27, 12, 30), PARIS, False, True, clouds=True))

    def test_sun_to_spare_now_is_taken(self):
        p, _, _ = plan(at(27, 12), bell(3.4), start=6.0, live=2.6)
        self.assertTrue(p.on[0])
        self.assertEqual(p.source[0], "soleil")

    def test_hot_water_first_heats_now_at_the_peak_price(self):
        """19 h 30, the tank nearly empty, showers at 20 h: nothing cheaper is left before them."""
        p, _, _ = plan(at(26, 19, 30), start=3.2)
        self.assertTrue(p.on[0])
        self.assertTrue(p.urgent)
        self.assertTrue(w.say(p, at(26, 19, 30), PARIS, False, False).startswith("Chauffe maintenant en heures pleines"))

    def test_a_full_tank_waits(self):
        p, _, _ = plan(at(26, 23), start=10.0)
        self.assertFalse(p.on[0])


class Guards(unittest.TestCase):
    def test_never_above_the_breaker(self):
        """The dishwasher at 22 h: the house at 4 kW, the breaker at 5,4 kW with the margin."""
        learned = w.Learned(2.4, 7.0, 7.0, 28, tuple(4.0 if h == 22 else 0.4 for h in range(24)), ())
        slots = w.build_slots(at(26, 18), PARIS, lambda m: HC if offpeak(m) else HP, offpeak, lambda m: None, learned,
                              lambda d: 7.0, TIMES)
        p = w.make_plan(slots, 6.0, w.Settings(10, 2.4, 3.0, RESALE, 5.4))
        at_22 = [i for i, x in enumerate(slots) if x.start.astimezone(PARIS).hour == 22]
        self.assertFalse(any(p.on[i] for i in at_22))

    def test_a_red_tempo_day_waits_for_the_night(self):
        red = lambda m: 0.1568 if offpeak(m) else 0.7562  # noqa: E731
        p, _, _ = plan(at(27, 8), price=red, start=8.0)
        self.assertEqual(hours_of(p, "heures_pleines"), 0)

    def test_hygiene_fills_the_tank_once(self):
        s = w.Settings(10, 2.4, 3.0, RESALE, 5.4, hygiene_due=True)
        p, _, _ = plan(at(26, 18), start=6.0, settings=s)
        self.assertTrue(p.hygiene)
        self.assertGreaterEqual(max(p.reserve), 9.9)

    def test_few_starts_a_day_and_runs_of_half_an_hour(self):
        s = w.Settings(10, 2.4, 3.0, RESALE, 5.4, max_starts=2)
        p, _, _ = plan(at(26, 18), bell(1.8), settings=s)
        for run in p.runs():
            span = datetime.fromisoformat(run["fin"]) - datetime.fromisoformat(run["debut"])
            self.assertGreaterEqual(span, timedelta(minutes=30))
        starts: dict = {}
        for i, on in enumerate(p.on):
            if on and (i == 0 or not p.on[i - 1]):
                d = p.slots[i].start.date()
                starts[d] = starts.get(d, 0) + 1
        self.assertTrue(all(v <= 2 for v in starts.values()), starts)

    def test_quick_enough_for_a_small_box(self):
        """Made every 5 minutes on Home Assistant's loop: well under 0,1 s (HA Green, 3 times slower than here)."""
        began = time.perf_counter()
        for _ in range(10):
            plan(at(26, 18), bell(1.8), start=2.0)
        self.assertLess((time.perf_counter() - began) / 10, 0.02)


class Reserve(unittest.TestCase):
    def test_it_draws_at_the_hot_water_times(self):
        tank = w.Tank(8.0, at(26, 19, 59))
        tank.follow(at(26, 20, 59), PARIS, 0.0, 7.0, TIMES, 10)
        self.assertAlmostEqual(8.0 - tank.kwh, 7.0 * 0.75 / 2 + 7.0 * 0.25 / 24, places=2)

    def test_heating_fills_it_up_to_full(self):
        tank = w.Tank(9.0, at(26, 12))
        tank.follow(at(26, 13), PARIS, 2.4, 7.0, TIMES, 10)
        self.assertEqual(tank.kwh, 10)
        self.assertEqual(tank.full_at, at(26, 13))

    def test_seen_full_by_the_heater_stopping(self):
        tank = w.Tank(5.0, at(26, 12))
        tank.follow(at(26, 12, 1), PARIS, 0.0, 7.0, TIMES, 10, seen_full=True)
        self.assertEqual(tank.kwh, 10)

    def test_kept_and_read_back(self):
        tank = w.Tank(4.2, at(26, 12), at(25, 13))
        self.assertEqual(w.Tank.from_dict(tank.as_dict()).as_dict(), tank.as_dict())
        self.assertIsNone(w.Tank.from_dict({"kwh": "x"}).kwh)

    def test_from_its_probe(self):
        self.assertAlmostEqual(w.reserve_from_temperature(37.5, 60, 10), 5.0)
        self.assertEqual(w.reserve_from_temperature(80, 60, 10), 10)

    def test_capacity_from_its_litres(self):
        self.assertAlmostEqual(w.capacity_kwh(200, 60, None), 10.46, places=2)


class Learning(unittest.TestCase):
    def test_power_need_and_the_rest_of_the_home(self):
        now = at(26, 12)
        heater, home, sun = [], [], []
        start = datetime(2026, 10, 20, 0, tzinfo=PARIS)
        hour = start
        while hour < now:
            local = hour.astimezone(PARIS)
            k = 2.4 if local.hour in (2, 3) else 1.6 if local.hour == 4 else 0.0     # 6,4 kWh a night
            heater.append((hour, k))
            home.append((hour, k + 0.5))
            sun.append((hour, 2.0 if 11 <= local.hour <= 14 else 0.0))
            hour += timedelta(hours=1)
        learned = w.learn(heater, home, sun, PARIS, now)
        self.assertAlmostEqual(learned.power_kw, 2.4)
        self.assertAlmostEqual(learned.need_week_kwh, 6.4)
        self.assertAlmostEqual(learned.need(date(2026, 11, 28)), 6.4)
        self.assertEqual(learned.base_kw, tuple([0.5] * 24))
        self.assertEqual(learned.clear_kw[12], 2.0)

    def test_too_few_days_learn_no_need(self):
        now = at(26, 12)
        heater = [(now - timedelta(hours=h), 1.0) for h in range(1, 72)]
        self.assertIsNone(w.learn(heater, [], [], PARIS, now).need_week_kwh)

    def test_the_sun_from_the_clouds(self):
        clear = tuple(3.0 if h == 12 else 0.0 for h in range(24))
        self.assertAlmostEqual(w.sun_from_clouds(clear, 0, None, 12), 3.0)
        self.assertLess(w.sun_from_clouds(clear, 100, None, 12), 1.0)
        self.assertLess(w.sun_from_clouds(clear, None, "rainy", 12), 1.2)
        self.assertIsNone(w.sun_from_clouds((), 0, None, 12))

    def test_hot_water_times(self):
        self.assertEqual(w.parse_hours(["20:00", "7h", "x", "07:00"]), [420, 1200])

    def test_hot_water_ranges(self):
        """Ranges since 1.0.1b3 (Frank: when the household draws is never exact); a time alone stays an hour."""
        self.assertEqual(w.parse_ranges(["19:00-23:00", "06:00-09:00", "07:30", "x", "8:00-8:00", "22:00-01:00"]),
                         [(360, 180), (450, 60), (1140, 240), (1320, 180)])
        self.assertEqual(w.parse_hours(["06:00-09:00", "19:00-23:00"]), [360, 1140])

    def test_a_range_draws_evenly_across_it(self):
        ranges = w.parse_ranges(["06:00-09:00", "19:00-23:00"])
        losses = 7.0 * 0.25 / 24
        self.assertAlmostEqual(w.draw_kw(at(26, 7), 7.0, ranges) - losses, 7.0 * 0.75 / 2 / 3)
        self.assertAlmostEqual(w.draw_kw(at(26, 22, 59), 7.0, ranges) - losses, 7.0 * 0.75 / 2 / 4)
        self.assertAlmostEqual(w.draw_kw(at(26, 12), 7.0, ranges), losses)
        day = sum(w.draw_kw(at(26, 0) + timedelta(minutes=m), 7.0, ranges) for m in range(1440)) / 60
        self.assertAlmostEqual(day, 7.0, places=2)

    def test_the_tank_is_ready_before_the_evening_range(self):
        ranges = w.parse_ranges(["06:00-09:00", "19:00-23:00"])
        slots = w.build_slots(at(26, 18), PARIS, lambda m: HC if offpeak(m) else HP, offpeak, lambda m: None, LEARNED,
                              lambda d: 7.0, ranges)
        p = w.make_plan(slots, 4.0, w.Settings(10, 2.4, 3.0, RESALE, 5.4))
        self.assertIsNone(p.short_at)


if __name__ == "__main__":
    unittest.main()


class ReadyForEachRange(unittest.TestCase):
    """Frank on 26 Nov. 2026, at 15 h 26: a 300 L tank at 45 %, ranges 6 h 30 – 8 h 30 and 19 h – 23 h, off-peak hours
    from midnight to 8 h 30, a little sun tomorrow. The 1.0.1b4 plan heated twice at night, the second time during the
    morning range, and left the sun aside. Invented figures, close to his screenshot."""

    RANGES = [(6 * 60 + 30, 120), (19 * 60, 240)]

    @staticmethod
    def offpeak(moment: datetime) -> bool:
        local = moment.astimezone(PARIS)
        return local.hour * 60 + local.minute < 8 * 60 + 30

    @staticmethod
    def sun(moment: datetime) -> float:
        """A little sun from 7 h: a few watts to spare at 8 h already, which drew the 1.0.1b4 plan into the range."""
        local = moment.astimezone(PARIS)
        t = local.hour + local.minute / 60
        return 0.0 if t < 7 or t > 17.5 else 2.4 * math.sin(math.pi * (t - 7) / 10.5) ** 1.6

    def make(self):
        price = lambda m: 0.17 if self.offpeak(m) else 0.25  # noqa: E731
        learned = w.Learned(3.0, 6.0, 6.0, 28, tuple([0.15] * 24), ())
        slots = w.build_slots(at(26, 15, 30), PARIS, price, self.offpeak, self.sun, learned, lambda d: 6.0, self.RANGES)
        s = w.Settings(capacity=15.7, power_kw=3.0, min_kwh=15.7 * 0.3, export_price=0.0, limit_kw=None)
        return w.make_plan(slots, 7.6, s), slots, s

    def test_the_night_is_one_heating_done_before_the_morning_range(self):
        p, slots, _ = self.make()
        night = [r for r in p.runs() if datetime.fromisoformat(r["debut"]).astimezone(PARIS).day == 27
                 and datetime.fromisoformat(r["debut"]).astimezone(PARIS).hour < 9]
        self.assertEqual(len(night), 1, p.runs())
        self.assertLessEqual(datetime.fromisoformat(night[0]["fin"]).astimezone(PARIS), at(27, 6, 30))

    def test_the_tank_is_ready_at_the_start_of_each_range(self):
        p, slots, s = self.make()
        for i, slot in enumerate(slots):
            if slot.ready_kwh:
                self.assertGreaterEqual(p.reserve[i], s.min_kwh + slot.ready_kwh - 0.01, slot.start)

    def test_the_evening_is_heated_in_the_sun_cheaper_than_the_night(self):
        p, _, _ = self.make()
        self.assertGreater(sum(e for e, src in zip(p.energy, p.source) if src in ("soleil", "soleil_partiel")), 0.5, p.runs())
        self.assertEqual(hours_of(p, "heures_pleines"), 0)
        self.assertIsNone(p.short_at)


class ABusyDay(unittest.TestCase):
    """The need learned is a busy day, not the median one: a median day left the tank empty one evening in two."""

    def test_eight_days_in_ten_draw_no_more(self):
        self.assertEqual(w.busy_day([3, 4, 4, 5, 5, 5, 6, 6, 7, 9]), 6)
        self.assertEqual(w.busy_day([4.0, 5.0, 6.0]), 6.0)


class KeptOnIsNotHotWaterFirst(unittest.TestCase):
    """Frank, 26 Nov. 2026: after « Chauffer maintenant » the tank was full, and the page said « Chauffe maintenant en
    heures pleines… sinon l'eau chaude manquerait » for a quarter hour of 0 kWh: the plug only kept on a few minutes."""

    def test_a_quarter_hour_kept_on_at_peak_price_is_not_urgent(self):
        p, _, _ = plan(at(26, 21, 15), start=9.0, keep_on=True)
        self.assertTrue(p.on[0])
        self.assertEqual(p.source[0], "heures_pleines")
        self.assertFalse(p.urgent)
        self.assertNotIn("manquerait", w.say(p, at(26, 21, 15), PARIS, False, False, mode=w.AUTO))

    def test_a_real_shortage_at_peak_price_is_still_urgent(self):
        p, _, _ = plan(at(26, 17), start=0.5)
        self.assertTrue(p.on[0])
        self.assertTrue(p.urgent)
