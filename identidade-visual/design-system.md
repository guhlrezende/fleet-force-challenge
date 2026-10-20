# Fleet Force Design System

> Single source of truth. Logo observations are extracted from supplied assets; reference-site notes describe reusable visual principles only; all other values are explicit Fleet Force proposals.

## Brand Identity
Fleet Force is visually defined by forward motion, operational control and measurable efficiency. The supplied mark combines a heavy italic/forward-leaning wordmark with arrow-shaped F forms. **Observed:** electric blue `#0750ED`, graphite `#2E2D2D`, white. **Proposed:** a restrained neutral UI system and semantic status colors.

## Brand Personality
Decisive, fast, technical, operational, confident, pragmatic. Avoid luxury, playful, ornamental or retro styling.

## Visual Principles
1. **Forward by construction:** use directional geometry, diagonals and arrows to reinforce progress.
2. **Blue earns attention:** blue is the primary action/data emphasis, not a full-page flood color.
3. **Operational clarity:** one dominant message per view; metrics and decisions outrank decoration.
4. **Heavy + clean:** bold display typography paired with neutral, highly legible body typography.
5. **Structured rhythm:** generous section spacing, modular cards and consistent 8 px geometry.
6. **Evidence over ornament:** charts, comparisons and quantified outcomes should be visually privileged.

## Reference Site Principles
The Sem Parar site is used only as a structural reference. Its current public pages show product-plan cards, strong promotional hierarchy, repeated CTA patterns, modular benefit sections and dense but segmented product information. Reinterpret these principles with Fleet Force colors, typography and geometry; never reproduce Sem Parar brand assets, copy, illustrations or proprietary identity.

## Logo Rules
- Primary: supplied full logo on white/light neutral.
- Compact: supplied symbol only. Use for app icon, avatar, favicon and small brand signatures.
- Wordmark: supplied typography lockup when the symbol would be redundant.
- Dark-background proposal: use white/blue artwork only after a vector-approved inverse master is created. Do not recolor the raster master ad hoc.
- Clear space: minimum `0.25 × H` around the lockup, where H is logo artwork height. Symbol: `0.20 × H`.
- Minimum size: full lockup 160 px digital / 42 mm print; typography lockup 140 px / 38 mm; symbol 32 px / 10 mm.
- Prefer solid white, `neutral.50`, or near-black backgrounds with verified contrast. Avoid busy photography behind the mark.
- Never distort, rotate, skew, outline, shadow, rearrange, recolor arbitrarily, crop the arrowheads, or substitute the wordmark font.

## Color Tokens
### Extracted
- `brand.blue.500`: `#0750ED` / RGB (7, 80, 237) / HSL (221, 94, 48) — primary action, selected state, key data. Contrast: 6.21:1 on white.
- `brand.graphite.900`: `#2E2D2D` / RGB (46, 45, 45) / HSL (0, 1, 18) — primary text, dark brand mass. Contrast: 13.73:1 on white.
- `neutral.white`: `#FFFFFF` — primary canvas.

### Derived / proposed
Use blue scale: 50 `#EEF4FF`, 100 `#D9E6FF`, 200 `#B6CEFF`, 300 `#85ABFF`, 400 `#4F82FF`, 500 `#0750ED`, 600 `#0643C7`, 700 `#07379F`, 800 `#0A317F`, 900 `#0D2B68`, 950 `#07183D`.
Neutral scale: 50 `#F6F8FC`, 100 `#EEF1F6`, 200 `#D8DEE9`, 300 `#B8C0CC`, 400 `#98A2B3`, 500 `#667085`, 600 `#475467`, 700 `#344054`, 800 `#2E2D2D`, 900 `#1D1C1C`, 950 `#101010`.
Semantic: success `#168A53`, warning `#C97A00`, error `#C9362B`, info `#0750ED`. Use semantic colors for status meaning only.

CSS aliases: `--color-primary:#0750ED; --color-secondary:#2E2D2D; --color-background:#FFFFFF; --color-surface:#F6F8FC; --color-text-primary:#2E2D2D; --color-text-secondary:#667085; --color-border:#D8DEE9; --color-success:#168A53; --color-warning:#C97A00; --color-error:#C9362B;`

## Typography Tokens
The exact supplied logo typeface is **not identified** and must not be recreated with a guessed font. For product and documents, use **Inter** as the recommended system family; use **Inter Display ExtraBold/Bold** for headings. Fallback: `Arial, sans-serif`.

| Token | Size | Weight | Line height | Tracking | Use |
|---|---:|---:|---:|---:|---|
| Display | 56 px | 800 | 1.00 | -2% | Hero only |
| H1 | 44 | 800 | 1.08 | -1.5% | Page title |
| H2 | 32 | 750 | 1.15 | -1% | Section |
| H3 | 24 | 700 | 1.20 | -0.5% | Subsection |
| H4 | 20 | 700 | 1.25 | 0 | Card heading |
| Body Large | 18 | 450 | 1.55 | 0 | Intro |
| Body | 16 | 400 | 1.50 | 0 | Default |
| Body Small | 14 | 400 | 1.45 | 0 | Supporting |
| Caption | 12 | 500 | 1.35 | 1% | Metadata |
| Label | 13 | 650 | 1.20 | 1% | UI labels |
| Button | 14 | 700 | 1.00 | 0.5% | Actions |
| Data | 28 | 750 | 1.00 | -1% | KPIs |

## Spacing Tokens
8 px base with 4 px half-step: `space-1=4`, `2=8`, `3=12`, `4=16`, `5=24`, `6=32`, `7=40`, `8=48`, `9=64`, `10=80`, `11=96`, `12=128`. Major web sections: 80-128 px desktop, 56-80 px mobile.

## Radius Tokens
`sm=8px`, `md=12px`, `lg=16px`, `xl=24px`, `pill=999px`. Brand geometry should feel aerodynamic; use rounded rectangles, not bubbly shapes.

## Shadow Tokens
`sm: 0 1px 2px rgba(16,24,40,.06)`; `md: 0 8px 24px rgba(16,24,40,.10)`; `lg: 0 20px 48px rgba(16,24,40,.14)`. Prefer borders over shadows in data-heavy interfaces.

## Grid
Desktop: 12 columns, max width 1200 px, 24 px gutters, 32 px outer margins. Tablet: 8 columns, 20 px gutters. Mobile: 4 columns, 16 px gutters/margins. Cards align to grid; avoid arbitrary offsets.

## Graphic Language
Use forward-pointing wedges, 8-16° diagonals, cropped arrow motifs and controlled blue rails. Maximum one large directional motif per composition. Keep 70-85% of content-heavy surfaces neutral. Gradients are optional and rare: only blue-to-deeper-blue backgrounds for hero/cover moments; never rainbow gradients. Icons: 2 px rounded stroke, simple geometry, consistent optical size. Photography: fleet, roads, logistics and operators in authentic operational contexts; cool-neutral grade, clear subject, space for copy; avoid generic handshake imagery.

## Components
- **Primary button:** blue fill, white text, 44-48 px height, radius 12, horizontal padding 20-24; hover darkens to blue.600; focus 3 px blue.200 ring; disabled neutral.200/neutral.500.
- **Secondary button:** white/transparent, graphite text, 1 px neutral.300 border; hover neutral.50.
- **Inputs/selects:** 44-48 px, radius 12, 1 px neutral.300; focus blue.500 + 3 px blue.100 ring; errors use error border plus text, never color alone.
- **Cards:** white surface, 1 px neutral.200, radius 16, 24 px padding; shadow sm only when elevation is meaningful.
- **Metric cards:** label -> value -> delta -> context; blue for focal KPI, green/red only for semantic movement.
- **Tables:** 48 px rows minimum, subtle dividers, left-align text, right-align numbers, sticky header when useful.
- **Badges:** 24-28 px height, pill or 8 px radius; tinted background + dark readable text.
- **Alerts:** icon + title + body + optional action; semantic tint at <=10% visual intensity.
- **Navigation:** neutral surface; active state blue indicator/text; do not fill every nav item.
- **Modal:** max 560 px common / 800 px complex; 24-32 px padding; one primary action.
- **Tooltip:** graphite background, white 12-13 px text, 8 px radius.

## Charts
Series order: `#0750ED`, `#16B8F3`, `#7657FF`, `#36B37E`, `#FF9F43`, `#2E2D2D`. Highlight one series with blue and mute comparisons to neutral. Positive `#168A53`, negative `#C9362B`, neutral `#667085`. Benchmark: graphite dashed line. Projection: blue dashed line or 20% opacity area. Gridlines `#E7EAF0`; labels `#667085`. Avoid 3D charts. Donut only for <=5 parts; default to bars for comparisons.

## Documents
A4: 18-20 mm margins, white canvas, graphite body, blue section markers. Cover: logo + one directional motif + short title; no dense body copy. Header optional; footer uses document name, confidentiality/status when needed, and page number. Tables use neutral headers and blue only for emphasis.

## Presentations
16:9. One message per slide. Title 28-36 pt; body 18-22 pt; key metric 36-56 pt. Keep <=2 emphasis colors per slide (blue + one semantic color). Use large evidence blocks, diagrams and charts; avoid paragraph walls. Architecture slides use neutral containers and blue flow arrows.

## Image Direction
Use real fleet/logistics scenes, vehicles in motion, dashboards in context, roads/infrastructure and operational teams. Compose with forward direction toward open space. Apply blue overlays only when needed for copy contrast; keep faces/vehicles natural.

## Iconography
Use one icon family per artifact. 24 px base grid, 2 px stroke, rounded joins, minimal internal detail. Directional icons may echo the logo arrow angle but must not imitate the logo itself.

## Accessibility
Normal text targets WCAG AA 4.5:1; large text 3:1. Blue `#0750ED` on white is 6.21:1 and passes AA for normal text. White on blue is the same ratio. Never communicate status by color alone. Focus indicators must remain visible. Minimum touch target 44×44 px.

## Do
- Use whitespace and strong hierarchy.
- Use blue for actions, key metrics and directional emphasis.
- Keep most surfaces white/neutral.
- Align components to the grid and 8 px rhythm.
- Prefer measurable evidence, charts and comparisons.

## Don't
- Do not flood every surface with blue.
- Do not invent new brand colors without approval.
- Do not use decorative arrows everywhere.
- Do not use multiple icon styles, arbitrary shadows or inconsistent radii.
- Do not stretch/retype/rebuild the supplied logo.
- Do not copy Sem Parar brand assets, text, illustrations or proprietary compositions.

## AI Generation Rules
When generating interfaces: use white/neutral surfaces as the default canvas; reserve `#0750ED` for primary actions, active states and focal data; use 80-128 px major desktop section spacing; use 16 px radius cards with 1 px neutral borders; keep one dominant CTA per region; never add unapproved colors or decorative gradients.

When generating presentations: use 16:9; one dominant message; maximum two emphasis colors per slide; use blue for the decisive metric or flow; supporting content stays graphite/neutral; use arrows/diagonals only when they communicate progression.

When generating documents: use A4 with 18-20 mm margins; consistent heading hierarchy; white content pages; blue for section markers, metrics and callouts; keep tables neutral and readable.

When generating social assets: preserve generous clear space; use one short headline, one focal metric/visual and one directional motif; symbol may act as a signature, never as a background texture repeated excessively.
