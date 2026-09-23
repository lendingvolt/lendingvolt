# Lendingvolt — Style Guide & Build Brief

## Part 1 — Visual system

## Design direction

Copy Mercury's restraint and rhythm, not its darkness. [Mercury](https://mercury.com) runs a dark-first marketing site with a proprietary typeface, one accent colour, cinematic imagery and very few UI elements per screen. The restraint is the transferable part; the dark palette is a positioning choice that suits a US startup-banking brand and works against trust signals in Singapore consumer lending. Build light-first, with dark bands reserved for the hero and the closing CTA.

The patterns worth lifting, in the order they appear on Mercury's homepage:

1. **Full-bleed hero with a scroll-scrubbed moving graphic**, one display headline, one line of subhead, an inline input next to the primary CTA, and a quiet secondary link beside it.
2. **Section headers written as sentences, not labels.** Mercury uses lines like "Banking's been a headache. Now, it's a head start." — a full statement in display type, no eyebrow above it.
3. **Eyebrow + H2 pattern** for the more functional sections: a small kicker, a large H2, and a text link to the deeper page on the same row.
4. **Feature grids of 2 or 4**, each cell = one graphic, an H3 of 3–6 words, and one or two sentences. Never more.
5. **Testimonial blocks** — a category tag, the quote in display type, then name and role.
6. **A stats band of four figures** with the number large and the label small beneath.
7. **Press strip**: publication logo, headline as a link, nothing else.
8. **Footnote superscripts on every claim**, resolving to a disclaimers block at the very bottom of the page. This is the single most important pattern for us to copy — see the compliance section.
9. **A 6-column mega footer** that carries the full site map.

Rules for the AI coder to hold to throughout:

- **One accent colour.** No secondary accents, no gradients used as decoration, no drop shadows on anything except elevated cards.
- **Air over density.** Section padding of 120–160px on desktop is the default, not a special case. If a section feels cramped, add vertical space before adding anything else.
- **One idea per section.** If a section needs two headlines, it is two sections.
- **Motion tells a story, once.** Each graphic is a short scene that plays once on scroll-in and ends on a final pose; everything else moves only in answer to the user — a re-sort, a slider change. No fade-and-rise on every section; that is the commonest tell of a generated page. Respect `prefers-reduced-motion`.
- **Block-figure scenes and real product UI only.** No photography, no generated renders, no freehand illustration, no icon sets, no emoji, no mascot. The graphics system is specified below.

### Graphics and motion

Every graphic is a small scene: a cast of low-res block figures acting out exactly what the section says, carrying the product's real numbers on placards, receipts and bricks. The figures bring the human element; the numbers keep it grown-up. **Figures small, numbers big.**

**The test for every scene: cover the headline.** If someone cannot tell what the section is about from the scene alone, it is wrong.

**The figures.** An original cast built in code from a handful of chunky rectangles on a 4-unit grid, with two-tone flat shading and two dots for eyes — no other facial features, so emotion comes from pose. Realistic Singaporean skin tones, clothing from the palette only. The borrower always wears the accent colour; lenders wear ink and are told apart by what they carry. Because every figure is a few rectangles on a grid, code draws them exactly and consistently, which is why this works where freehand illustration would not.

**Not a mascot.** There is no single named character. The figures are an anonymous cast, like the people in a well-drawn instruction manual.

**Where they appear.** The hero, the four value-grid cells, the four use-case cards and the closing CTA. Not in the how-it-works steps, the comparison screen or the calculator — the product should look like the product.

**The one electrical metaphor.** A "current" pulse, only where something genuinely travels — an application going out to lenders.

**Banned in any scene:** speech bubbles, emotes, confetti, lightning bolts, glows, orbs, particles, gradients, 3D, background scenery, icon-library icons, and anything that imitates a toy brand's figure.

The per-scene specification lives in `ANIMATIONS.md`.

### A clean break from LendKaki

This is a new identity, not a reskin. Take the content model from LendKaki — loan types, the comparison flow, the FAQ structure — and nothing else. Nothing in the left column may appear anywhere on the site:

| Out | In |
| --- | --- |
| A named mascot, spot illustration, icon sets, photography | Anonymous block-figure scenes carrying real numbers, and cropped fragments of the real interface |
| Bright green | The violet and off-white palette in the tokens section |
| Rounded, friendly geometric type | Instrument Sans at weight 480, tight negative tracking |
| Emoji, exclamation marks, bolt glyphs | Plain sentences and tabular figures |
| Scrolling keyword ticker, urgency badges | A quiet lender logo wall |
| Stock headshots with invented names | Two real, consented quotes set in display type, no portraits |
| Card-heavy, densely packed sections | Full-bleed bands with 120–160px of air |

The test to apply to any screen: if you swapped the logo for LendKaki's, would it look like the same company? If yes, it is not different enough yet.

The lightning bolt deserves its own warning. A bolt glyph is the obvious move for a brand called Lendingvolt and it is the wrong one — it is the most common visual in payday lending and short-term credit worldwide, and it would undo the positioning before anyone reads a word. Carry the Volt idea in the language and keep it out of the graphics entirely. The wordmark should be typographic.

## Typography

Use **Instrument Sans** from Google Fonts for everything. Mercury's typeface is Arcadia, a custom family commissioned for them — ArcadiaDisplay for headings, Arcadia for body — so there is no licensable match. Instrument Sans is the closest free equivalent: same low-contrast geometric-grotesque skeleton, slightly narrow proportions, tall x-height, and a variable weight axis. Second choice if Instrument Sans reads too tight at large sizes: **Schibsted Grotesk**. Do not use Inter — it is the default everyone reaches for and it will make the site look templated.

Mercury's signature typographic detail is a headline weight of 480 — not 400, not 500. Instrument Sans is a variable font, so reproduce this exactly with `font-variation-settings`. Body copy runs at a line-height of 1.625, also unusually loose. Keep both.

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');

:root {
  --font-display: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  --font-body:    'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono:    ui-monospace, 'SF Mono', Menlo, monospace;
}

.display, h1, h2, h3 {
  font-family: var(--font-display);
  font-variation-settings: 'wght' 480;
  font-weight: 480;
}
```

### Type scale

Sizes in px. Line-height in px. Tracking in em. Mobile column applies below 768px; interpolate with `clamp()` between 768px and 1280px.

| Token | Use | Desktop size / LH / tracking | Mobile size / LH / tracking | Weight |
| --- | --- | --- | --- | --- |
| `display-xl` | Homepage hero H1 | 76 / 80 / -0.03 | 40 / 44 / -0.02 | 480 |
| `display-lg` | Section statement lines | 56 / 62 / -0.025 | 32 / 38 / -0.015 | 480 |
| `display-md` | H2, page titles | 45 / 50 / -0.02 | 28 / 34 / -0.01 | 480 |
| `heading-lg` | H3, feature titles | 28 / 36 / -0.01 | 22 / 29 / -0.005 | 500 |
| `heading-sm` | H4, card titles | 20 / 28 / 0 | 18 / 26 / 0 | 500 |
| `body-lg` | Hero subhead, section lead | 20 / 32.5 / 0 | 17 / 27 / 0 | 400 |
| `body-md` | Default body copy | 17 / 27.6 / 0 | 16 / 26 / 0 | 400 |
| `body-sm` | Card body, form help | 15 / 24 / 0 | 15 / 24 / 0 | 400 |
| `label` | Eyebrows, badges, nav | 12 / 16 / 0.08 uppercase | 12 / 16 / 0.08 uppercase | 500 |
| `caption` | Footnotes, disclaimers | 13 / 20 / 0 | 12 / 19 / 0 | 400 |
| `stat` | Big numbers in the stats band | 56 / 60 / -0.03 | 36 / 40 / -0.02 | 500 |
| `numeric` | Rates, amounts, tables | 28 / 34 / -0.02 tabular | 22 / 28 / -0.015 tabular | 500 |

### Rules

- **Every money figure, interest rate, tenure and EIR uses `font-variant-numeric: tabular-nums`.** Non-negotiable on a comparison site — columns of offers must align.
- **Negative tracking scales with size.** Anything above 40px gets at least -0.02em. Anything at or below 17px gets 0. Only the `label` token gets positive tracking.
- **Max line length 68 characters** for body copy. Set `max-width: 60ch` on prose blocks.
- **Two type sizes per section, three at most.** A headline, a body size, and optionally a label.
- Never bold body copy for emphasis — use the display weight on a separate line instead.

## Design tokens

Light-first with two dark bands. Mercury is dark throughout because dark signals premium in US startup fintech. In Singapore consumer lending, dark reads as either a crypto app or a scam site, and it hurts form completion. So: off-white page, violet-black ink, and full-width violet-black bands for the hero and the closing CTA only. That keeps the cinematic feel where it sells and the clarity where it converts.

```css
:root {
  /* ---- Dark surfaces (hero band, closing CTA, footer) ---- */
  --ink-900:        #171721;  /* darkest violet — dark band background */
  --dark-surface-1: #1E1E2A;  /* cards on a dark band */
  --dark-control:   #323649;  /* unselected / secondary control on dark */
  --on-dark-900:    #EDEDF4;  /* text on dark */
  --on-dark-500:    #9A9AAB;  /* derived — secondary text on dark */
  --border-dark:    rgba(237, 237, 244, 0.09);
  --border-dark-strong: rgba(237, 237, 244, 0.18);

  /* ---- Light surfaces ---- */
  --surface-0:  #FBFCFD;  /* whitest — default page background */
  --surface-1:  #F6F5F2;  /* off-white beige — alternating sections */
  --surface-2:  #EEEDE9;  /* derived — card fill / input fill on beige */
  --ink-800:    #272735;  /* headings and strong text on light */
  --ink-600:    #535461;  /* paragraph text on light */
  --ink-400:    #8A8B96;  /* derived — labels, captions */
  --ink-300:    #B4B5BE;  /* derived — placeholder, disabled */
  --border:        rgba(39, 39, 53, 0.09);
  --border-strong: rgba(39, 39, 53, 0.18);

  /* ---- Accent: one hue, two contexts ---- */
  --accent:             #5266EB;  /* CTA on dark */
  --accent-hover:       #4054D6;  /* derived */
  --accent-on-light:    #3441A6;  /* CTA, links and active states on light */
  --accent-on-light-hover: #2A3488; /* derived */
  --accent-soft:  rgba(52, 65, 166, 0.07);  /* tint fill on light */
  --accent-soft-dark: rgba(82, 102, 235, 0.16); /* tint fill on dark */

  /* ---- Semantic: offer states and rates only ---- */
  --positive: #1B8F62;  --positive-on-dark: #3FCB94;
  --warning:  #B5761A;  --warning-on-dark:  #E0A84A;
  --negative: #BE4038;  --negative-on-dark: #F2766D;

  /* ---- Elevation ---- */
  --shadow-card: 0 1px 2px rgba(23,23,33,.05), 0 8px 24px rgba(23,23,33,.07);
  --shadow-pop:  0 4px 12px rgba(23,23,33,.09), 0 16px 48px rgba(23,23,33,.12);
  /* On dark bands, never use shadow for elevation — use --dark-surface-1
     plus a 1px --border-dark instead. */

  /* ---- Radii ---- */
  --r-sm: 6px; --r-md: 10px; --r-lg: 16px; --r-xl: 24px; --r-pill: 999px;
}
```

Values marked *derived* were interpolated to complete the scale — swap them if the brand has its own. Two renames to apply throughout the components and homepage sections below: where they say `--ink-900` as a **text** colour, read `--ink-800` (`--ink-900` is now the dark band background only); and where they say `--accent` on a light section, read `--accent-on-light`. `--accent` itself is reserved for CTAs sitting on dark.

**Contrast checks, since a lending site should hold WCAG AA:**

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `#EDEDF4` text on `#171721` | 15.5:1 | Excellent |
| `#272735` text on `#F6F5F2` | 13.5:1 | Excellent |
| `#535461` paragraph on `#FBFCFD` | 7.3:1 | Passes AA and AAA |
| `#3441A6` on `#FBFCFD` | 8.3:1 | Passes, good for links |
| White label on `#5266EB` button | 4.7:1 | Passes AA for body size — do not set the label below 16px, and never use `--ink-900` text on this fill |
| `#1E1E2A` card on `#171721` | 1.10:1 | Nearly invisible — cards on dark **must** carry a 1px `--border-dark`, not rely on the fill alone |
| `#323649` control on `#171721` | 1.52:1 | Below the 3:1 floor for UI boundaries — give these buttons a 1px `--border-dark-strong` so the edge is perceivable |

The last two matter. The violet steps are close together, which is what makes the dark band feel expensive, but it means every surface boundary on dark has to be drawn with a border rather than left to the fill.

**Which sections are dark:** hero, closing CTA, footer. Everything between them is light, alternating `--surface-0` and `--surface-1`. The beige is the workhorse — use it for the How It Works, Use Cases and FAQ sections so the page has rhythm without a second accent.

### Spacing and layout

4px base unit. Use only these steps: **4, 8, 12, 16, 24, 32, 48, 64, 80, 120, 160**.

| Token | Desktop | Mobile |
| --- | --- | --- |
| Section padding (vertical) | 120px, 160px for hero-adjacent | 64px, 80px |
| Container max-width | 1200px | 100% |
| Container side gutter | 32px | 20px |
| Grid | 12 columns, 24px gutter | 4 columns, 16px gutter |
| Card padding | 32px | 24px |
| Gap between headline and subhead | 16px | 12px |
| Gap between subhead and CTA | 32px | 24px |
| Gap between grid cells | 24px | 16px |

Breakpoints: `sm 480` · `md 768` · `lg 1024` · `xl 1280`. Design at 1440px and 390px; everything between is interpolation.

A narrow prose container of **720px** is used for legal pages, blog articles and FAQ answers. Never let body copy run the full 1200px.

## Components

| Component | Spec |
| --- | --- |
| Button — primary | Height 52px desktop / 48px mobile, padding 0 28px, `--r-md`, `--accent` fill, white label at `body-md` weight 500. Hover: `--accent-hover`, no lift. Active: scale 0.99. |
| Button — secondary | Same box, transparent fill, 1px `--border-strong`, ink-900 label. On dark bands: 1px `--border-dark`, `--on-dark-900` label. |
| Button — text link | Ink-900 label, `--accent` on hover, trailing `→` that translates 4px right on hover. |
| Nav | 72px tall, sticky, `--surface-0` at 92% with `backdrop-filter: blur(12px)`, 1px bottom border that appears only after 40px of scroll. Logo left, 3 dropdown groups centre, Login + Apply right. |
| Nav dropdown | Panel with `--shadow-pop`, `--r-lg`, 24px padding, each item = title at `heading-sm` + one line of `body-sm` in `--ink-500`. Mercury's exact pattern; LendKaki already does this. |
| Card — feature | `--surface-0` on `--surface-1` sections, 1px `--border`, `--r-lg`, no shadow at rest, `--shadow-card` on hover with a 2px rise over 200ms. |
| Card — offer/rate | The most important component on the site. Lender logo, product name, headline rate in `numeric`, then a 2-column key-value strip (monthly repayment, tenure, total payable, EIR), then a full-width CTA. Highlight the best-value card with a 1px `--accent` border and a pill badge, never a fill. |
| Input | Height 52px, 1px `--border-strong`, `--r-md`, 16px padding, `body-md`. Label above at `body-sm` weight 500. Focus: 2px `--accent` ring, no glow. Error: `--negative` border + message at `caption`. Font-size must be ≥16px on mobile to stop iOS zoom. |
| Select / segmented | Prefer segmented pills over dropdowns for ≤4 options (loan purpose, residency, employment). 44px tall, `--r-pill`. |
| Slider | Loan amount and tenure. 4px track, 24px thumb, `--accent`. Live-updating numeric readout above it in `numeric` tabular. |
| Table — comparison | Sticky header, 56px rows, `--surface-1` header, row hover `--accent-soft`. Right-align every numeric column. Below 768px, collapse each row into a stacked card. |
| Badge / pill | 28px tall, `--r-pill`, `label` token, `--accent-soft` fill with `--accent` text, or `--surface-2` with `--ink-500`. |
| Stats band | 4 across desktop, 2×2 mobile. Figure in `stat`, label beneath in `body-sm` `--ink-500`, 1px vertical dividers between on desktop only. |
| Footnote marker | Superscript numeral at 0.7em in `--ink-500`, links to the disclaimers block. Never a tooltip only. |
| Footer | `--ink-900` background, 6 columns desktop / accordion below 768px, `label` column headings, `body-sm` links in `--on-dark-500`. Entity name, UEN, licence statement and disclaimers block sit beneath a divider. |

**Accessibility floor:** 4.5:1 contrast on all body text, visible focus rings on every interactive element, 44×44px minimum touch targets, and every form field with a real `<label>`. A financial services site in Singapore should hold to WCAG 2.1 AA.

## Part 2 — Site brief

## Product overview

A Singapore loan comparison marketplace. One application, matched offers from MAS- and MinLaw-regulated lenders, free to the borrower, soft credit checks only. The platform is not a lender. The current build is [LendKaki](https://www.lendkaki.com); this brief is for the upmarket rebuild.

**Audience.** Middle-class working Singaporeans and PRs, 28–50, salaried or self-employed, household income roughly S$4k–15k/month. They are not in distress. They are consolidating a credit card balance, renovating, funding a wedding, covering school fees, or bridging a business cash-flow gap. They have options and they are price-shopping.

**The positioning shift.** The current site sells speed and urgency — same-day funds, instant loans, a cartoon mascot. That reads as payday lending. The rebuild sells *informed choice*: you are the kind of person who compares before committing, and this is the tool that lets you. Speed becomes a supporting fact, not the headline.

| | Move away from | Move toward |
| --- | --- | --- |
| Promise | "Same-day cash, fast approval" | "See every offer before you commit" |
| Proof | Urgency badges, scrolling ticker | Named lenders, real rates, transparent maths |
| Imagery | Mascot illustrations | Block-figure scenes acting out the product, with real numbers |
| Voice | Excitable, emoji, exclamation marks | Calm, precise, numerate |
| Colour | Bright green | One restrained accent, mostly white and ink |

**Tone of voice.** Plain English, Singapore-literate but not Singlish. Short sentences. Concrete numbers over adjectives — "compare 12 lenders in one application" beats "lightning-fast comparison". Never exclamation marks. Never emoji. Never pressure language ("limited time", "act now", "don't miss out"). Say what something costs before you say how fast it arrives.

**What we are not.** Not a lender, not an advisor, not a credit repair service. Every page must make the marketplace role unmistakable.

### The Volt lexicon

Lendingvolt gives us an electrical vocabulary where several words carry a second, finance-native meaning. Those double meanings are the good puns. Words that only sound electrical are the bad ones.

| Word | Why it works |
| --- | --- |
| **Current** | Electrical current and *current rates*. The strongest word we have — it is a pun that reads as a plain statement. |
| **Charge** | A charge is both electrical and a fee. Lets us say we are free without saying "free". |
| **Switch** | An electrical switch and switching lenders. Already the verb the category uses. |
| **Resistance** | Electrical resistance and friction. "Without resistance" sounds premium, not gimmicky. |
| **Power** | Powering something and having power over a decision. |
| **Light / illuminate** | Speed *and* clarity, which is our whole positioning. |
| **Plug in / connect** | We connect borrowers to a network of lenders. Literal and figurative at once. |
| **Circuit / grid** | The lender network as infrastructure. Good for the lender wall and the how-it-works section. |

Avoid: **watt** ("know watt you're paying" is a groan, not a pun), **shock**, **zap**, **electrifying**, **supercharged**, **high-voltage**, and anything with a lightning-bolt emoji. These are the words that pull the brand back toward payday lending, which is exactly what the rebrand is moving away from.

**Three rules so the puns stay smart:**

1. **One pun per section, in the headline only.** The subhead underneath is always literal and numerate. The pun earns attention; the sentence under it earns trust.
2. **Never two puns in a row.** If the hero is punning, the section below it is plain. Alternate down the page.
3. **No pun may carry a claim.** "Power through your loan search" is fine. "Lightning-fast approval" is a speed promise we cannot make for a lender, and "supercharged rates" is a rate claim. If removing the pun would leave a sentence compliance objects to, the pun is not the problem — the claim is.

**Approved copy bank**

| Use | Line |
| --- | --- |
| Hero H1 — recommended | Switch on a better rate. |
| Hero H1 — alternates | Power through your loan search. · Borrowing without resistance. · Find your best current rate. |
| Lender wall | Plugged into Singapore's licensed lenders. |
| Value grid statement | Borrowing well is a decision, not an emergency. |
| Free / revenue model | No charge. Either kind. |
| Credit score | A soft check. No trace left behind. |
| How it works | Three steps. One circuit. |
| Comparison screen | Every offer, illuminated. |
| Calculator | Run the current numbers. |
| Use cases | What people power with us. |
| Closing CTA | Ready when you are. |

"No charge. Either kind." is the best line in this set — it makes the revenue-model disclosure memorable, and that section is the one doing the most work for credibility.

One to check with compliance: "Switch on a better rate" can be read as promising a better rate. If that is a problem, "See every rate before you switch" keeps the pun and drops the implied promise.

## Sitemap

Page names and routes only — no content for these yet. Build the homepage first, then take these one at a time.

**Phase 1 — launch set**

| Page | Route | Nav group |
| --- | --- | --- |
| Home | `/` | — |
| Personal Loans | `/loans/personal` | Loans |
| Debt Consolidation | `/loans/debt-consolidation` | Loans |
| Renovation Loans | `/loans/renovation` | Loans |
| Business Loans | `/loans/business` | Loans |
| Compare Offers (results) | `/compare` | — |
| Apply | `/apply` | Header CTA |
| How It Works | `/how-it-works` | Company |
| Our Lenders | `/lenders` | Company |
| About | `/about` | Company |
| Loan Calculator | `/tools/loan-calculator` | Tools |
| Affordability Check | `/tools/affordability` | Tools |
| FAQ | `/faq` | Resources |
| Contact | `/contact` | Footer |

**Phase 1 — legal and account**

| Page | Route |
| --- | --- |
| Terms of Use | `/legal/terms` |
| Privacy Policy | `/legal/privacy` |
| PDPA Notice | `/legal/pdpa` |
| Cookie Policy | `/legal/cookies` |
| Disclaimers | `/legal/disclaimers` |
| Login | `/account/login` |
| My Applications | `/account/applications` |
| 404 | `/404` |

**Phase 2 — content and SEO**

| Page | Route |
| --- | --- |
| Guides index | `/guides` |
| Guide article | `/guides/[slug]` |
| Lender profile | `/lenders/[slug]` |
| Rates page | `/rates` |
| Careers | `/careers` |

Navigation groups in the header: **Loans** · **Tools** · **Company** · **Resources**, then Login and a primary Apply button. Keep it to four groups — Mercury runs four and it is the ceiling before a mega-menu becomes a decision the user has to make.

## Homepage brief

Thirteen sections in this order. Copy below is ready to use — treat it as final draft, not placeholder. Bracketed items are numbers to confirm before launch.

### 1. Header (sticky)

Logo left. Groups: Loans, Tools, Company, Resources. Right: `Log in` text link, `Compare rates` primary button. Mobile: logo, hamburger, and the primary button stays visible.

### 2. Hero — dark band

Full-bleed `--ink-900` band, 88vh desktop / auto mobile. Right half on desktop, beneath the form on mobile: the "offers line up" scene — the borrower holds up one application, six lender figures walk in carrying placards with their total cost, then the queue re-sorts so the cheapest lender steps to the front. It previews the product literally. Full spec in ANIMATIONS.md. Text left-aligned, not centred.

- **H1** (`display-xl`): Switch on a better rate.
- **Subhead** (`body-lg`, `--on-dark-500`): One application. Offers from [N] licensed lenders in Singapore. A soft check that leaves your credit file untouched.
- **Inline form**: a single loan-amount field with an S$ prefix and a segmented purpose control (Personal · Consolidate · Renovate · Business), then the primary button `See my offers`.
- **Secondary link**: `How it works →`
- **Trust strip beneath, small**: Singpass-secured · MAS & MinLaw regulated lenders · Free for borrowers · Singapore Fintech Association member
- **Footnote marker** on "leaves your credit file untouched" → disclaimers block, explaining that a lender may run a full bureau search once you proceed with them.

The H1 puns; the subhead does not. That is the pattern for the whole page — see the Volt lexicon above.

Drop the scrolling keyword ticker entirely. It is the single most downmarket element on the current site.

### 3. Lender logo wall

One quiet line above the logos: `Plugged into Singapore's licensed lenders.` Then a row of lender wordmarks in `--ink-300`, greyscale, no cards, no borders. On mobile, a slow auto-scrolling marquee at 40s duration. This is the single strongest trust signal on the page and should sit immediately under the hero.

### 4. Statement + value grid

Mercury's "Everything you do with money. All in one place." pattern.

- **Statement** (`display-lg`, centred, max 16 words): Borrowing well is a decision, not an emergency.
- **Four cells**, each a scene at 3:2, an H3, and one sentence:

| Title | Body |
| --- | --- |
| One application, every lender | Fill in one form. We send it to every lender in our network and bring the offers back to you. |
| Your credit score stays intact | We use soft searches to match you. Nothing appears on your credit file until you choose a lender. |
| The real cost, shown plainly | Every offer displays the monthly repayment, total payable and effective interest rate side by side. |
| No charge. Either kind. | You pay nothing. Lenders pay us a fee when a loan completes, and it never changes the rates you see. |

That last cell is the upmarket move. Nobody in this category discloses their revenue model on the homepage, and it is the cheapest credibility available.

### 5. How it works — three steps

Eyebrow `HOW IT WORKS`, H2 `Three steps. One circuit.`

1. **Tell us what you need** — Loan amount, purpose, and a few details about your income. Around two minutes, no documents yet.
2. **Compare your matched offers** — Rates, monthly repayments and total cost from every lender that will lend to you, on one screen.
3. **Choose and complete** — Pick your offer and finish the application with that lender directly. Funds can arrive the same day.

Use a numbered-step layout with a cropped fragment of the real comparison screen alongside — the offer list for step 2, the sort control for step 1. No icons, no step illustrations.

### 6. The comparison screen — product showcase

The most important section and the one the current site is missing. Show the actual offer-comparison interface: three or four offer cards with real-looking figures, the best-value one flagged, the sort control visible.

- **H2**: Every offer, illuminated.
- **Body**: Sort by monthly repayment, total interest, or how fast funds arrive. No hidden fees, no offers buried below the fold because a lender paid more.
- Make it interactive if the coder can manage it: a live slider for amount and tenure that updates the mock offer cards. If not, a static high-fidelity screenshot at 3:2.

### 7. Calculator strip

A slim, working loan calculator embedded inline. Amount slider, tenure slider, indicative rate, and a live readout of monthly repayment and total payable in `numeric` tabular figures. CTA: `See offers at this amount →`. Add the footnote marker — indicative only, actual rates depend on the lender's assessment.

### 8. Use cases

H2 `What people power with us.` Four cards linking to the loan-type pages: Debt consolidation, Home renovation, Business cash flow, Life events. Each with one line and a `See rates →` link. This section carries most of the internal SEO linking.

### 9. Testimonials

Two or three only, not a carousel of nine. Typographic only, since we are not using photography: quote in `display-md` on an `--ink-900` band, category tag above it in `label`, name and role beneath in `body-sm`. No portrait, no avatar, no initial in a circle. Real customers with real consent, or nothing at all — invented names are a liability in this category.

- Quotes should be about *clarity*, not speed. e.g. "I had three offers in front of me with the total cost of each. I picked the cheapest one and it wasn't my own bank."

### 10. Stats band

Four figures, `--surface-1` background: `[N] licensed lenders` · `S$[X]M matched` · `[N] applications` · `[X] minutes average application`. Every figure needs a footnote and a source we can defend. Drop any statistic we cannot evidence — "75% approved within 24 hours" needs a methodology note or it should go.

### 11. FAQ

Six questions in an accordion, first one open. Is this free? Will it affect my credit score? Who are your lenders? How fast can I get funds? Am I eligible? What happens to my data? Then a link to the full FAQ page.

### 12. Closing CTA — dark band

Mirrors the hero. `--ink-900`, H2 in `display-lg`: `See what you'd actually pay.` One line beneath, the same amount field and primary button, and a secondary `Talk to us on WhatsApp` link.

### 13. Footer

`--ink-900` background. Six columns on desktop, accordion below 768px: **Loans · Tools · Company · Resources · Contact · Follow**. The Contact column carries the support email, phone number and registered address.

Beneath a 1px `--border-dark` divider, the legal block at `caption` size in `--on-dark-500`:

> © 2026 Lendingvolt. All rights reserved.
>
> Lendingvolt is run and managed by Lendkaki Pay Pte. Ltd. (UEN: 202607335C). Lendingvolt is a loan comparison platform. We are not a lender. All loan products are offered by licensed banks and financial institutions regulated by the Monetary Authority of Singapore (MAS) and/or licensed by the Ministry of Law (MinLaw). Rates shown are indicative and subject to change.

Then a single row of legal links — Terms of Use · Privacy Policy · PDPA Notice · Cookie Policy — followed by the numbered disclaimers block that every footnote marker on the page resolves to.

One thing to settle before launch: "sister companies" and "run and managed by" describe different arrangements, and this line is a regulated disclosure. Confirm the exact wording and UEN with whoever handles the corporate structure, and mirror it verbatim on every page.

## Copy and compliance guardrails

These apply to every page, and the AI coder should be told them up front so they are baked into the components rather than patched afterwards.

- **Never state or imply we are a lender.** The phrase "comparison platform, not a lender" appears in the footer of every page.
- **No unqualified rate claims.** Not "from 1% interest". If a rate appears anywhere, it carries the basis (flat or effective), the tenure it assumes, and a footnote marker. Prefer showing a worked example: amount, tenure, monthly repayment, total payable, EIR.
- **Every numeric claim gets a footnote.** Build the footnote marker and the disclaimers block as real components on day one. This is the pattern Mercury uses for exactly this reason, and it lets marketing move fast without legal risk.
- **No urgency or pressure language.** No countdowns, no "limited time", no "only X spots left", no red badges.
- **Soft-search claims must be precise.** "A soft search does not affect your credit score. A lender may run a full credit bureau search once you proceed with them, and they will tell you before they do."
- **PDPA consent at the form, not buried.** The application form carries an explicit, unticked consent checkbox naming what data is collected, who it is shared with (matched lenders), and the purpose. Link the PDPA notice beside it.
- **Collect the minimum.** The homepage hero form asks for loan amount and purpose only. No NRIC, no date of birth, no income figure until the application step, and never in a URL or query string.
- **No dark patterns.** No pre-ticked marketing consent, no fake scarcity, no interstitial that blocks reading a rate.
- **Testimonials need consent on file.** Named quotes require written permission. Use initials otherwise.
- **Accessibility is part of compliance here.** WCAG 2.1 AA, as noted in the components section.

Run the final copy past whoever handles compliance before launch — particularly the rate examples and anything touching moneylending advertising rules.

## Handing this to the AI coder

Save this document in the repo (for example docs/brief.md), reference it in every coding session, then send this instruction:

> Build only the homepage. First set up the design tokens, the type scale and the base components exactly as specified — do not improvise sizes, colours or spacing values. Then build the thirteen homepage sections in order using the copy as written. Draw every graphic in code as specified in ANIMATIONS.md. Do not build any other page; leave the nav and footer links pointing to the routes in the sitemap as dead links for now. When you are done, list every value you had to invent because it was not specified.

That last instruction matters — it surfaces the gaps rather than letting the coder quietly fill them with defaults.

**Build order:** tokens and fonts → header and footer shells → hero → the remaining sections top to bottom → responsive pass at 390px → accessibility pass.

**Graphics are drawn, not generated.** Every scene is built in inline SVG from a shared figure kit, written by the coder against `ANIMATIONS.md`. Higgsfield is not used for anything on the page; it can stay in the toolkit for social and ad creative, where photography and video still belong.

**Before you start, decide:** the final accent colour, the brand name and wordmark, and the four numbers for the stats band. Everything else in here can be built against placeholders.

**Next sessions, one page each:** `/compare` (highest value, it is the product), then `/apply`, then the loan-type pages, then the legal set. Come back here and I will write each brief in the same format.
