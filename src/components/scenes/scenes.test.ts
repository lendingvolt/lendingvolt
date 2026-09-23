import { quoteFlatRate } from "@/lib/loan-math";
import { mockLenders } from "@/content/offers";
import { heroScript } from "./scripts/hero";
import { noChargeScript, oneApplicationScript, softCheckScript, trueCostScript } from "./scripts/value";
import { cashFlowScript, consolidateScript, lifeEventScript, renovateScript } from "./scripts/use-cases";
import { closingScript } from "./scripts/closing";
import { byTotal, interestBricks, sceneOffers } from "./numbers";
import { createTimeline, TimelineError } from "./timeline";
import type { CompiledTimeline } from "./timeline";

const scenes: [string, () => { timeline: CompiledTimeline }, number, number][] = [
  ["hero desktop", () => heroScript("desktop"), 2000, 4500],
  ["hero mobile", () => heroScript("mobile"), 2000, 4500],
  ["one application", oneApplicationScript, 2000, 4000],
  ["soft check", softCheckScript, 2000, 4000],
  ["true cost", trueCostScript, 2000, 4000],
  ["no charge", noChargeScript, 2000, 4000],
  ["consolidate", consolidateScript, 2000, 4100],
  ["renovate", renovateScript, 2000, 4000],
  ["cash flow", cashFlowScript, 2000, 4000],
  ["life event", lifeEventScript, 2000, 4000],
  ["closing coda", closingScript, 1400, 1600],
];

describe.each(scenes)("%s", (_, build, min, max) => {
  const { timeline } = build();

  it(`plays once in ${min}–${max}ms`, () => {
    expect(timeline.duration).toBeGreaterThanOrEqual(min);
    expect(timeline.duration).toBeLessThanOrEqual(max);
  });

  it("animates transform and opacity only, with ordered keyframes that span the story", () => {
    for (const channel of timeline.channels) {
      const offsets = channel.keyframes.map((frame) => frame.offset as number);
      expect(offsets[0]).toBe(0);
      expect(offsets[offsets.length - 1]).toBe(1);
      offsets.forEach((offset, i) => i > 0 && expect(offset).toBeGreaterThanOrEqual(offsets[i - 1]));
      for (const frame of channel.keyframes) {
        const properties = Object.keys(frame).filter((key) => key !== "offset" && key !== "easing");
        expect(properties.every((key) => key === "transform" || key === "opacity")).toBe(true);
      }
    }
  });
});

describe("scene numbers", () => {
  it("match the calculator for S$20,000 over 3 years", () => {
    for (const lender of mockLenders) {
      const quote = quoteFlatRate(20_000, 36, lender.flatRate, lender.feeRate);
      expect(sceneOffers[lender.id as "a"].totalPayable).toBe(quote.totalPayable);
    }
    expect(sceneOffers.a.total).toBe("S$22,088");
    expect(sceneOffers.b.total).toBe("S$22,328");
    expect(sceneOffers.c.total).toBe("S$22,970");
    expect(sceneOffers.d.total).toBe("S$24,680");
    expect(sceneOffers.e.total).toBe("S$23,360");
    expect(sceneOffers.f.total).toBe("S$25,100");
  });

  it("stack one brick per S$250 of interest: about 8, 9 and 12", () => {
    expect([interestBricks("a"), interestBricks("b"), interestBricks("c")]).toEqual([8, 9, 12]);
  });
});

describe("hero", () => {
  it("ends with the queue sorted cheapest first and only the front flagged", () => {
    const { final } = heroScript("desktop");
    const queue = [...final.lenders].sort((a, b) => a.state.x - b.state.x).map((lender) => lender.id);
    expect(queue).toEqual(byTotal(["a", "b", "c", "d", "e", "f"]));
    expect(final.lenders.filter((lender) => lender.isFront).map((lender) => lender.id)).toEqual(["a"]);
    expect(final.lenders.every((lender) => lender.state.facing === "left" && lender.state.y === 96)).toBe(true);
  });

  it("removes the wire once the pulse has run", () => {
    expect(heroScript("desktop").final.wire.opacity).toBe(0);
  });

  it("uses four lenders on mobile", () => {
    expect(heroScript("mobile").final.lenders).toHaveLength(4);
  });
});

describe("figure size", () => {
  /** The use-case scene box at 1440px: a 282px card less 32px padding each side. */
  const USE_CASE_BOX = 218;
  /** The narrowest value-grid cell the narrow variant shows in: a 390px phone less 20px gutters. */
  const PHONE_CELL = 350;

  it.each([
    ["consolidate", consolidateScript],
    ["renovate", renovateScript],
    ["cash flow", cashFlowScript],
    ["life event", lifeEventScript],
  ])("%s renders figures at 48px or more in its card at 1440px", (_, build) => {
    expect(build().width).toBeLessThanOrEqual(USE_CASE_BOX);
  });

  it("one application has four lenders when narrow, at 48px or more on a phone", () => {
    const narrow = oneApplicationScript("narrow");
    expect(narrow.final.lenders).toHaveLength(4);
    expect(narrow.width).toBeLessThanOrEqual(PHONE_CELL);
    expect(oneApplicationScript("wide").final.lenders).toHaveLength(6);
  });
});

describe("value grid", () => {
  it("one application: every lender ends clear of every desk, and the wire is gone", () => {
    const { final } = oneApplicationScript();
    const half = final.layout.lenderDeskWidth / 2;
    for (const lender of final.lenders) {
      for (const desk of final.desks) {
        const overlaps = lender.state.x + 12 > desk - half && lender.state.x - 12 < desk + half;
        expect(overlaps).toBe(false);
      }
    }
    expect(final.wire.opacity).toBe(0);
  });

  it("soft check: the drawer closes with the folder tab above the cabinet", () => {
    const { final, ground } = softCheckScript();
    expect(final.drawerOpen).toBe(false);
    expect(final.drawerFolder.x).toBe(final.layout.cabinetX);
    const folderTop = final.drawerFolder.y - 11;
    expect(folderTop).toBeLessThan(ground - 40);
  });
});

describe("timeline", () => {
  it("refuses a channel that moves before it has a start value", () => {
    const tl = createTimeline();
    expect(() => tl.to("x", "opacity", "1", 0, 100)).toThrow(TimelineError);
  });

  it("refuses overlapping moves on one channel", () => {
    const tl = createTimeline();
    tl.start("x", "opacity", "0");
    tl.to("x", "opacity", "1", 0, 300);
    expect(() => tl.to("x", "opacity", "0", 200, 100)).toThrow(TimelineError);
  });

  it("holds between moves and ends on the last value", () => {
    const tl = createTimeline();
    tl.start("x", "opacity", "0");
    tl.to("x", "opacity", "1", 500, 500);
    const [channel] = tl.compile().channels;
    expect(channel.keyframes.map((frame) => [frame.offset, frame.opacity])).toEqual([
      [0, "0"],
      [0.5, "0"],
      [1, "1"],
      [1, "1"],
    ]);
  });
});
