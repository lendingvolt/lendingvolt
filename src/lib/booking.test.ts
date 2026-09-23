import { bookingDates, formatDayLong, formatDayShort, formatTime, singaporeDate, timeSlots } from "./booking";

describe("bookingDates", () => {
  it("starts the day after and skips Sundays", () => {
    // Wednesday 23 September 2026; Sunday 27 September is skipped.
    expect(bookingDates("2026-09-23")).toEqual([
      "2026-09-24",
      "2026-09-25",
      "2026-09-26",
      "2026-09-28",
      "2026-09-29",
      "2026-09-30",
    ]);
  });

  it("skips public holidays", () => {
    expect(bookingDates("2026-12-23", 3)).toEqual(["2026-12-24", "2026-12-26", "2026-12-28"]);
    expect(bookingDates("2026-11-06", 2, ["2026-11-09"])).toEqual(["2026-11-07", "2026-11-10"]);
  });
});

describe("timeSlots", () => {
  it("runs from opening to the last half hour before closing", () => {
    const slots = timeSlots("10:30", "19:30", 30);
    expect(slots[0]).toBe("10:30");
    expect(slots.at(-1)).toBe("19:00");
    expect(slots).toHaveLength(18);
  });
});

describe("formatting", () => {
  it("formats days and times for the booking screens", () => {
    expect(formatDayShort("2026-09-24")).toBe("Thu 24 Sep");
    expect(formatDayLong("2026-09-24")).toBe("Thursday 24 September 2026");
    expect(formatTime("10:30")).toBe("10:30am");
    expect(formatTime("12:00")).toBe("12:00pm");
    expect(formatTime("19:00")).toBe("7:00pm");
  });

  it("reads the Singapore date, not the machine's", () => {
    // 23:30 UTC on the 23rd is 07:30 on the 24th in Singapore.
    expect(singaporeDate(new Date("2026-09-23T23:30:00Z"))).toBe("2026-09-24");
  });
});
