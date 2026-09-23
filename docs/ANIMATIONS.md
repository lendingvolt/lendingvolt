# Lendingvolt — graphics and animation spec (v2: block figures)

Read `docs/brief.md` first for tokens, type scale and copy. This file replaces the previous version of ANIMATIONS.md and supersedes anything in the brief about imagery.

## The idea

Every graphic is a small scene: a cast of low-res block figures acting out exactly what the section says, carrying the product's real numbers on placards, receipts and bricks. The figures bring the human element; the numbers keep it grown-up.

**Figures small, numbers big.** That one rule is what stops this tipping into childish.

**The test, applied to every scene before you move on: cover the headline. Can someone tell what the section is about from the scene alone?** If not, redo it.

## Step 0 — audit and remove

Search the codebase and output a table of every existing graphic, animation, video, canvas, Lottie, three.js scene, shader, particle system and decorative SVG: file path, section, what it draws, technology. Delete all of them, including generated image or video files in `/public` used as section graphics, and any dependency that was only there to drive them.

## Step 1 — build the figure kit, then stop for review

Build `components/figures/` and a review page at `/dev/figures` (`noindex`, not linked anywhere) showing every role, pose, prop and skin tone, plus the walk cycle playing. **Stop after this step and ask me to review `/dev/figures` before building any scene.** Every scene must use this kit — no one-off hand-drawn figures anywhere.

### Figure construction

- **One `<Figure>` SVG component** built from 7–9 flat shapes on a 4-unit grid: head, torso, two arms, two legs, hair, and one optional role prop. Base canvas 24 × 48 units. Render at 48–64px tall on desktop, 36–44px on mobile.
- **Proportions:** head 12 × 12 with a 2-unit corner radius; torso 16 × 16; arms 4 × 14; legs 6 × 14 with a 2-unit gap between them. Chunky and low-res — every edge sits on the 4-unit grid, no curves beyond small corner radii.
- **Face:** two 2 × 2 eyes and nothing else. No mouth, no eyebrows, no expressions. Emotion comes from pose, never from the face.
- **Shading:** two tones per shape — the base colour and a 12% darker side facing away from a top-left light. No outlines, no gradients, no highlights.
- **Skin tones:** four realistic tones reflecting Singapore — `#F1D3B5`, `#D9A77F`, `#A8734F`, `#6E4A32` — assigned deterministically by figure index so every cast is varied.
- **Hair:** one block shape, three styles (short, bob, tied back), in dark neutral tones.
- **Clothing from tokens only.** The **borrower** always wears `--accent-on-light` on light sections and `--accent` on dark — the borrower is the highlighted element in every scene. **Lenders** wear `--ink-800` (or `--dark-control` on dark) tops with `--surface-2` trousers. Lenders are told apart by what they carry, never by colour.
- **Original design.** These are Lendingvolt's own figures. Do not imitate any toy brand's figure.

### Roles

| Role | Look |
| --- | --- |
| Borrower | Accent-coloured top. Often holding an application card. |
| Lender | Neutral suit, a thin tie in `--ink-400`. Carries a placard showing terms. |
| Clerk | Apron in `--surface-2`. Stands by a filing cabinet or counter. |
| Worker | Hard hat in `--warning`. |
| Shopkeeper | Apron, stands behind a counter. |

### Props

Application card (small card, three ruled lines) · placard (40 × 24-unit board on a short pole, showing total payable and rate in tabular type) · envelope · brick · receipt · magnifier · plank · box · filing cabinet · desk · counter. Furniture is simple blocks in `--surface-2` (light) or `--dark-surface-1` with a 1px `--border-dark` (dark), shaded the same two-tone way.

### Poses

Poses are transform sets on the limb groups, not separate drawings: **stand**, **walk** (animated cycle), **hold-up** (one arm raised with a prop), **hand-over** (arm extended forward), **look** (head tilted 6° toward something), **point**.

**Walk cycle:** legs rotate ±20° about the hip, arms ±15° in opposite phase, body bobs 2 units, 480ms per full cycle, linear. Figures move across a scene at 60–80px per second. When they stop, they stop — no settle bounce.

## Scene rules

- **Every scene sits on a single ground line**: 1px `--border-strong` on light, `--border-dark` on dark. No backgrounds, no scenery — only the furniture and props the story needs.
- **Numbers on placards, receipts and tags** use Instrument Sans with `tabular-nums` at the `caption` or `label` token, and must match the calculator's maths for S$20,000 over 3 years. Reuse the comparison section's mock offers.
- **At most nine figures per scene.** Exactly one highlighted element — the thing the headline is about.
- **Every scene sits in a fixed aspect-ratio box** so nothing shifts layout while it plays.
- **The one electrical metaphor:** a "current" — a short bright segment (24px, highlight colour) travelling along a thin line. Only where something genuinely travels: an application going out to lenders.

**Banned in every scene:** speech bubbles, exclamation or emote marks above heads, emoji, confetti, lightning bolts, glows, orbs, particles, gradients, 3D, background scenery (skylines, clouds, sun), icon-library icons, and anything that imitates a toy brand's figure.

## Motion rules

- **Each scene is a short story that plays once** when 35% of it enters the viewport: 2–4 seconds, hero up to 4.5. It never replays on scroll-back.
- **The final pose is the real design.** It must tell the story on its own as a still. It is also what renders server-side and under `prefers-reduced-motion`.
- **No loops, no idle fidgeting.** When the story ends, everyone stands still.
- **Remove fade-and-rise reveals from every section.** Sections simply appear.
- **Easing:** linear while walking; `cubic-bezier(0.2, 0, 0, 1)` for gestures and prop hand-offs. No spring, no bounce.
- **Tech:** animate `transform` and `opacity` only. Walk cycle as CSS keyframes on limb groups with `transform-origin` at hips and shoulders. Scene timelines with Framer Motion if already installed, otherwise the Web Animations API. Pause when the tab is hidden. Do not add GSAP or anything else.
- **Performance:** at most ~250 SVG nodes per scene; lazy-mount scenes below the fold.

## Scenes

### Hero — "the offers line up" (dark band)

Right half on desktop; beneath the form on mobile. Replaces the circle entirely.

1. **0–0.6s** — The borrower stands left and raises an application card (`S$20,000 · 3 years`). A current pulse runs from the card along a thin line to the right edge of the scene.
2. **0.6–2.4s** — Six lender figures walk in from the right, staggered 200ms, each carrying a placard with their total payable, and stop in a queue facing the borrower.
3. **2.6–3.8s** — The queue re-sorts by total payable. Figures who need to move step out and walk to their new place (walk cycle during the move).
4. **3.8–4.5s** — The front lender's placard takes a 1px highlight border and a `Lowest total cost` pill. The borrower lowers the card and turns to look at the front lender.

Placards: Lender A S$22,088 · Lender B S$22,328 · Lender C S$22,970 · Lender D S$24,680 (from the comparison section), plus Lender E at 5.60% flat → S$23,360 and Lender F at 8.50% flat → S$25,100. They walk in unsorted.

Mobile: four lenders, same sequence.

### Lender logo wall

Keep the marquee: 40s linear loop, pauses on hover, static under reduced motion. No figures.

### Value grid — four scenes, 3:2

1. **One application, every lender.** The borrower drops one application card into a tray on a small desk. A current pulse runs from the tray out to six lender figures waiting at small desks on the right. Each lender picks up a placard, walks over and stops facing the borrower, holding up their terms. Final pose: one borrower, one card on the desk, six lenders facing him with offers. Highlight: the single application card.
2. **Your credit score stays intact.** A clerk stands beside a filing cabinet. A lender walks up; the clerk pulls out a folder; the lender looks at it through a magnifier. A stamp sits on the desk and is never picked up. The clerk slides the folder back and the drawer closes. A small tag appears: `Soft check · no record`. Highlight: the folder, unmarked.
3. **The real cost, shown plainly.** Three lenders stand behind three stacks. Each stack is a base block labelled `S$20,000` (principal, ink), topped with interest bricks in the highlight colour — one brick per S$250 of interest, so roughly 8 for Lender A, 9 for B and 12 for C. Lenders place their bricks one by one; a total tag appears at the foot of each stack. The borrower walks along the three and stops at the shortest. Highlight: the interest bricks.
4. **No charge. Either kind.** A clerk behind a counter prints a receipt and hands it to the borrower, who holds it up to read. Line items — Application, Comparison, Matching, Support — each `S$0.00`, total `S$0.00`. Highlight: the total.

### How it works — three steps

No figures. These are real UI fragments built from the site's own components at reduced scale; the product should look like the product.

1. The amount field types `20,000` digit by digit; the `Consolidate` pill selects.
2. Offer rows slide in one at a time.
3. The top offer is selected: a checkmark draws and `Continue with Lender A` moves to its pressed state.

Each plays once when its step enters view.

### Comparison section

No figures, no decorative graphic. When the user changes the sort, rows reorder with FLIP over 300ms.

### Calculator

No figures. Beneath the readout, one thin vertical bar per month of the tenure, all the same height, each split into principal and interest. Changing the tenure changes the bar count; changing amount or rate tweens the split over 200ms. Moves only when the user moves a slider.

### Use cases — four scenes, 1:1

- **Debt consolidation.** The borrower walks in carrying four small boxes stacked unevenly, each tagged with a different due date (3rd, 12th, 19th, 28th). A lender holds out one larger box. The four drop into it, and the borrower walks on carrying one box tagged `One monthly repayment`. Highlight: the single box.
- **Home renovation.** Two workers in hard hats lay bricks, building a wall section course by course while the borrower stands aside holding a rolled plan. Final pose: wall complete, borrower looking at it. Highlight: the finished wall.
- **Business cash flow.** Two platforms with a gap between them: `Payroll · Friday` on the left, `Invoice paid · 30 days` on the right. A shopkeeper stands at the edge of the gap. A lender walks in, lays a plank across, and the shopkeeper walks over. Highlight: the plank.
- **Life events.** A couple stands beside one large block labelled `S$15,000`. The block splits into 24 small blocks, and the two of them carry them one at a time into a row of 24 month slots — the first three placed at normal speed, the rest filling quickly. Highlight: one monthly block.

### Testimonials

No figures, no motion. Typography only, per the brief.

### Stats band

Numbers count up from zero over 1.2s, once, when the band enters view. No figures.

### Closing CTA (dark band)

A short coda, 1.5s: the borrower walks off to the right holding a single highlighted placard — `Lender A · S$22,088`. Plays once.

## Acceptance checklist

Before you report done, confirm each of these:

- [ ] The Step 0 audit table is in your reply, with every old graphic marked as removed.
- [ ] `/dev/figures` was reviewed and approved before any scene was built.
- [ ] Every figure on the site comes from the shared `<Figure>` component.
- [ ] Every scene passes the cover-the-headline test. For each, write one sentence saying what it shows.
- [ ] Every number in a scene matches the calculator's maths for S$20,000 over 3 years.
- [ ] Under `prefers-reduced-motion`, every scene shows its final pose and nothing moves.
- [ ] No layout shift while scenes play; Lighthouse performance no worse than before.
- [ ] No figure resembles any toy brand's figure.
- [ ] A list of every value you had to invent because this file did not specify it.
