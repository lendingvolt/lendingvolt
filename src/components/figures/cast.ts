/**
 * Who a figure is: skin, hair and role. Pure data so scenes, the review
 * page and tests all agree on how a cast is assigned.
 */

/** Four realistic tones reflecting Singapore, lightest first. */
export const SKIN_TONES = ["#F1D3B5", "#D9A77F", "#A8734F", "#6E4A32"] as const;

/** Dark neutrals: near-black brown, warm brown, blue-black. */
export const HAIR_TONES = ["#2B2522", "#3D2F28", "#1F1E26"] as const;

export const HAIR_STYLES = ["short", "bob", "tied"] as const;

export const ROLES = ["borrower", "lender", "clerk", "worker", "shopkeeper"] as const;

export type SkinTone = (typeof SKIN_TONES)[number];
export type HairTone = (typeof HAIR_TONES)[number];
export type HairStyle = (typeof HAIR_STYLES)[number];
export type Role = (typeof ROLES)[number];

export type CastMember = {
  skin: SkinTone;
  hairStyle: HairStyle;
  hairTone: HairTone;
};

/**
 * Deterministic look for the figure at `index` in a scene's cast. Skin
 * cycles every four figures and hair every three, so any run of adjacent
 * figures is varied and the same scene always renders the same people.
 */
export function castMember(index: number): CastMember {
  const i = Number.isFinite(index) ? Math.abs(Math.trunc(index)) : 0;
  return {
    skin: SKIN_TONES[i % SKIN_TONES.length],
    hairStyle: HAIR_STYLES[i % HAIR_STYLES.length],
    hairTone: HAIR_TONES[Math.floor(i / HAIR_STYLES.length) % HAIR_TONES.length],
  };
}
