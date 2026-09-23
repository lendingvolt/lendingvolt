/**
 * Visit booking helpers. Dates are Singapore calendar days as "YYYY-MM-DD"
 * and times are "HH:MM", so everything here is pure and timezone-safe.
 */

/** Singapore public holidays still to come in this build's window. Confirm against MOM each year. */
export const publicHolidays = ["2026-11-09", "2026-12-25", "2027-01-01"] as const;

const DAY_MS = 24 * 60 * 60 * 1000;
const SUNDAY = 0;

/** The Singapore calendar date for an instant, e.g. "2026-09-23". */
export function singaporeDate(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(instant);
}

const toUtc = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);

/** The next `count` days the outlet is open, starting the day after `fromIso`. */
export function bookingDates(
  fromIso: string,
  count = 6,
  closed: readonly string[] = publicHolidays,
): string[] {
  const dates: string[] = [];
  let cursor = toUtc(fromIso).getTime();
  while (dates.length < count) {
    cursor += DAY_MS;
    const day = new Date(cursor);
    const iso = toIso(day);
    if (day.getUTCDay() !== SUNDAY && !closed.includes(iso)) dates.push(iso);
  }
  return dates;
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const fromMinutes = (total: number) =>
  `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;

/** Start times from `open`, every `step` minutes, for visits that end by `close`. */
export function timeSlots(open: string, close: string, step = 30): string[] {
  const slots: string[] = [];
  for (let start = toMinutes(open); start + step <= toMinutes(close); start += step) {
    slots.push(fromMinutes(start));
  }
  return slots;
}

// Fixed names rather than Intl, whose short month ("Sep" or "Sept") differs between runtimes.
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "Thu 24 Sep" */
export function formatDayShort(iso: string): string {
  const date = toUtc(iso);
  return `${weekdays[date.getUTCDay()].slice(0, 3)} ${date.getUTCDate()} ${months[date.getUTCMonth()].slice(0, 3)}`;
}

/** "Thursday 24 September 2026" */
export function formatDayLong(iso: string): string {
  const date = toUtc(iso);
  return `${weekdays[date.getUTCDay()]} ${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "10:30" → "10:30am", "13:00" → "1:00pm" */
export function formatTime(time: string): string {
  const total = toMinutes(time);
  const hours = Math.floor(total / 60);
  const minutes = String(total % 60).padStart(2, "0");
  const suffix = hours >= 12 ? "pm" : "am";
  return `${((hours + 11) % 12) + 1}:${minutes}${suffix}`;
}
