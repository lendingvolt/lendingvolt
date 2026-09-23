import { castMember, HAIR_STYLES, HAIR_TONES, SKIN_TONES } from "./cast";
import { blockPaths, rectPath } from "./paths";

describe("castMember", () => {
  it("is deterministic", () => {
    expect(castMember(5)).toEqual(castMember(5));
  });

  it("uses every skin tone across any four adjacent figures", () => {
    for (let start = 0; start < 8; start++) {
      const tones = new Set([0, 1, 2, 3].map((offset) => castMember(start + offset).skin));
      expect(tones.size).toBe(SKIN_TONES.length);
    }
  });

  it("never gives neighbours the same skin tone", () => {
    for (let i = 0; i < 12; i++) {
      expect(castMember(i).skin).not.toBe(castMember(i + 1).skin);
    }
  });

  it("covers every hair style and tone within nine figures", () => {
    const cast = Array.from({ length: 9 }, (_, i) => castMember(i));
    expect(new Set(cast.map((m) => m.hairStyle)).size).toBe(HAIR_STYLES.length);
    expect(new Set(cast.map((m) => m.hairTone)).size).toBe(HAIR_TONES.length);
  });

  it("treats bad indices as figure zero or their absolute value", () => {
    expect(castMember(Number.NaN)).toEqual(castMember(0));
    expect(castMember(-3)).toEqual(castMember(3));
    expect(castMember(2.7)).toEqual(castMember(2));
  });
});

describe("rectPath", () => {
  it("draws square corners without arcs", () => {
    expect(rectPath(0, 0, 4, 2)).toBe("M0 0H4V2H0V0Z");
  });

  it("rounds only the corners asked for", () => {
    expect(rectPath(0, 0, 4, 4, [0, 1, 1, 0])).toBe("M0 0H3A1 1 0 0 1 4 1V3A1 1 0 0 1 3 4H0V0Z");
  });
});

describe("blockPaths", () => {
  it("puts the shaded strip on the right-hand edge", () => {
    expect(blockPaths(4, 18, 16, 16, 0, 4).side).toBe("M16 18H20V34H16V18Z");
  });

  it("never rounds the strip more than its own width", () => {
    expect(blockPaths(0, 0, 4, 14, 2, 1).side).toContain("A1 1");
  });
});
