# Design System: Naiya Dhruv

**Positioning:** A hire-me experience for a graphic designer who also builds with AI on the web — intentional, atmospheric, and unforgettable.

**Purpose of this file:** Single source of truth for every future screen, component, motion, and copy pass on this portfolio. If a choice conflicts with this guide, change the choice — not the guide — unless the brand direction is explicitly revised.

**Lived references:** Current site (`portfolio_naiya`), Godly.design craft notes (Gitnimble / Cloaked / Superpower / Paradigm patterns).

---

## 1. Visual Theme & Atmosphere

**World name:** *Cloud Studio* — a high-key, airy fashion-tech space where a 3D avatar stands in soft sky, and the rest of the site continues that weather.

| Axis | Score | Direction |
|------|-------|-----------|
| Density | 3 | Art-gallery airy — generous whitespace, one job per section |
| Variance | 6 | Asymmetric hero (copy left, figure right); not chaotic |
| Motion | 7 | Scroll choreography + soft perpetual cloud drift; never laggy |

**Emotional promise:**  
“Wow — she’s stunning, precise, and future-facing. I should hire her.”

**Atmosphere rules:**
- Light, luminous, soft-focus sky — never muddy, never neon
- Character is the brand product; clouds are the shared atmosphere across **the entire film** (not only Hero → About)
- Soft white film washes land chapters into each other — **no hard section color blocks**
- Liquid glass used for chrome (nav, pills, panels) — tactile, not gimmicky
- Typography is part of the weather: one tracking/leading system (`--tracking-*`, `--leading-*`) across hero, bridges, sections, contact
- Every micro-element (divider, kicker, hint, button radius) must feel like the same studio

**Banned atmospheres:** Purple-on-white AI kitsch · cream + terracotta AI-default · dark-mode-by-default · broadsheet newspaper density · glow stacks · emoji decoration

---

## 2. Brand Positioning & Voice

### Who she is (site thesis)
Graphic designer + AI-fluent web maker. Visual systems with intention — brand, editorial, digital identity — presented through a living, scrollable experience rather than a static PDF portfolio.

### Voice
- Confident, calm, specific
- Short sentences. No hype adjectives pile-up
- Prefer craft words: *intention, system, story, polish* over *elevate, seamless, unleash, next-gen*

### Hire-me conversion arc
0. **Entrance** — Logo loader (brand ritual)
1. **Wonder** — Hero avatar + clouds (identity as spectacle)
2. **Proof** — Selected Work spiral (craft as interaction)
3. **Trust** — About + skills (human + toolkit)
4. **Taste** — Craft themes wall (range / shareability)
5. **Desire** — Contact (clear ask + reach)

Every section must advance this arc. Decorative sections with no role are banned.

---

## 2b. Storytelling Bible (Cloud Studio)

**Thesis:** Naiya Dhruv builds visual systems inside a living Cloud Studio — visitors meet her craft the way weather moves: wonder first, proof next, then the ask.

**Emotional promise:** “She’s precise, atmospheric, and future-facing — hire her before someone else does.”

**Fingerprint (do not dilute):** ND monogram crest · scroll-scrub avatar · liquid glass chrome · spiral of *real* client work · Cloud Studio theme boards · atmosphere stills (`toolkit-wave`, `bridge-mist`, `og-share`) · **StoryGuide** (chapter companion with next cue) · scroll-parallax cloud layers.

### Chapter → surface

| Beat | Section | Signature moment |
|------|---------|------------------|
| Entrance | Loader | Circular `/logo.png` + name |
| Wonder | Hero Space | Avatar in sky; name hero-level; quiet `SCROLL` |
| Proof | Spiral Work | Real covers; gallery with role + blurb |
| Trust | About + Toolkit | “intention.” + toolkit wave ribbon |
| Taste | Craft themes | Six theme boards (shareable middle) |
| Desire | Contact | Brief input over shared sky; mailto primary |

### Guiding element
- Fixed **StoryGuide** (bottom-right): current beat · cue · progress · next chapter link
- Contact **brief fields** — real input that builds the mailto body
- Spiral / theme boards remain primary interactive proof surfaces

### Canon copy (voice locks)

| Surface | Line |
|---------|------|
| Hero kicker | Graphic designer · AI web |
| Hero lede | Brand systems, editorial direction, and AI-built web experiences — intentional, atmospheric, unforgettable. |
| Spiral | Selected work |
| About | Design with *intention.* |
| Toolkit | One studio *language.* |
| Themes | Range you can *feel.* |
| Contact | Tell me the *weird* part. |
| Status | Open for collaborations |

### Reach system

- Screenshot magnet = first viewport (logo + name + avatar)
- OG still = `/og-share.jpg`
- Shareable middle = craft themes wall
- CTA gravity = one email; no fake socials

### Story quality gate

Before shipping: brand test (strip nav — still hers), hire-arc clarity ≥ 9/10, one job per section, desire CTA unambiguous.

---

## 3. Color Palette & Roles

### Core tokens (match CSS `:root`)

| Name | Value | Role |
|------|-------|------|
| **Studio White** | `#FFFFFF` | Primary canvas, bottom fades, cards |
| **Warm Soft** | `#F6F5F2` | Soft panels, secondary surfaces |
| **Sky Mist** | `#F4F7FB` | Cool atmosphere underlay (hero sticky / sky) |
| **Ink** | `#0A0A0A` | Primary text, logos, strong CTAs |
| **Ink Muted** | `rgba(10,10,10,0.58)` | Body, secondary labels |
| **Ink Faint** | `rgba(10,10,10,0.38)` | Kickers, hints, metadata |
| **Line** | `rgba(10,10,10,0.08)` | Hairline rules, glass borders |
| **Glass** | `rgba(255,255,255,0.62)` | Liquid glass fills |
| **Glass Strong** | `rgba(255,255,255,0.82)` | Panels, raised glass |

### Accent policy
- **Logo gold** (`--gold` / `--gold-deep`) is the primary UI accent — kickers, serif italics, StoryGuide, active nav, pins, CTA chips
- Cool sky (`--sky-cool` / sky mist) is atmosphere only — never the main chrome accent
- Primary display ink is charcoal (`--ink-soft`)
- Max **one** accent family in the entire system (gold)

### Gradients (approved)
- Bottom white fade on hero: solid white → transparent over lower ~25–30%
- About overlay: soft white wash over continuous cloud photo
- Left scrim for legibility over media (gentle, not a black curtain)

### Banned colors
- Pure pure-marketing purple / indigo gradients
- Terracotta + cream “AI taste default”
- Pure `#000000` full-bleed backgrounds
- Outer neon glows

---

## 4. Typography Rules

### Families
- **Display / UI / Body:** `Outfit` (300–700) — geometric, modern, hire-me sans
- **Editorial emphasis:** `Instrument Serif` italic — only for selective emphasis (*intention.*) inside section titles
- **Never:** Inter, Roboto, Arial as brand voice; never generic Georgia for display

### Hierarchy

| Hierarchy | Spec | Notes |
|------|------|-------|
| Hero name | `clamp(3rem, 9vw, 5.5rem)` / weight 500 / `--tracking-display` / `--leading-display` | Brand-first; charcoal `--ink-soft` |
| Section title | `clamp(2rem, 4.5vw, 3.25rem)` / weight 500 / `--tracking-title` / `--leading-title` | Clear scale jump from body |
| Kicker | `0.7–0.78rem` / weight 500 / `--tracking-kicker` / uppercase | **Steel** (`--steel-deep`) — not faint ink |
| Body | `~1–1.1rem` / `--leading-body` / max ~32–65ch | Muted ink |
| Serif italic | Instrument Serif | Accent-colored (`--steel-deep`), readable on sky |
| Meta / facts | Small caps or tracked labels + clear values | Hairline separators OK |

### Theme tokens (must stay in sync with `src/index.css`)
- `--tracking-display` / `--tracking-title` / `--tracking-kicker`
- `--leading-display` / `--leading-title` / `--leading-body`
- Typography is weather — never invent one-off tracking per section

### Rules
- Brand name in hero is a **hero-level signal**, not nav chrome
- Kickers use steel accent (type drama law) — never all-ink-on-mist
- No overlapping text on the character’s face
- No filler “Scroll to explore” copy wars — a quiet `SCROLL` hint is enough

---

## 5. Imagery & Atmosphere System

### Hero figure
- Source: `avatar_hero_white.mp4` (scroll-scrubbed)
- Placement: right half of viewport; clear of left rail + intro column
- Object-position tuned so she sits in the right third
- **Never** mask/clip the video in ways that glitch edges — character integrity &gt; clever blends

### Brand mark
- Asset: `/logo.png` (ND monogram — gold / liquid-glass on ink)
- Used as: side-nav home control, loader crest, favicon / apple-touch icon
- Present as a circular crop on `#0A0A0A` — never flatten into purple kitsch treatments

### Sky / clouds
- Assets (required): `/sky/sky-base.jpg` + `/sky/clouds-far.png` + `/sky/clouds-near.png` (alpha)
- Behavior: **fixed continuous sky** (`SkyAtmosphere`) under the whole film — readable cloud form with GSAP scroll + pointer parallax
- **Visibility gate:** clouds must be identifiable in an About/Toolkit screenshot; mid-tone crop must not read as solid `#f5f5f5`
- Sections stay **transparent** so the same sky reads end-to-end; legibility comes from glass panels on copy — **never** solid section color blocks or white washes that erase clouds
- Hero bottom scrim dissolves into the shared sky — never a white floor that starts a “new page”
- Chapter bridges are titles in that sky (no mist slab backgrounds)
- Motion: GSAP ScrollTrigger scrub + `quickTo` pointer; respect `prefers-reduced-motion`

### Studio atmosphere stills
- `/toolkit-wave.jpg` — soft layer or toolkit mood only — **never** a full chapter wall
- `/bridge-mist.jpg` — optional soft parallax ribbon — **never** a section background slab
- `/og-share.jpg` — Contact climax atmosphere + Open Graph share image only

### Interaction map (per beat)
| Beat | Interaction |
|------|-------------|
| Wonder | Pointer moves near cloud layer; magnetic CTAs |
| Proof | Magnetic spiral cards + gallery open/close |
| Trust | Read under shared sky (glass panels) |
| Taste | Theme tiles hover depth + open |
| Desire | Live brief fields → mailto; StoryGuide advances chapters |

### Anti-wash ban
Raising white opacity until seams disappear is a **ship blocker**. Fix assets or masks instead.
- Real project photography/graphics only — no placeholders
- Spiral cards: **original client covers** + glass surfaces; galleries = full proof sets
- Explorations wall: Cloud Studio **theme boards** (`/work/cloud-studio/*`) for craft range
- Gallery opens as focused lightbox, not a new noisy page

### Photography rules
- High-key, editorial, soft light
- Prefer product / craft proof over abstract 3D blobs
- Atmosphere supports the figure; never competes with her

---

## 6. Layout Principles

### Composition
- **First viewport = one composition:** brand, one headline block, one short lede, one CTA group, one dominant figure
- Intro column left (`~min(20rem, 30vw)`), figure right
- Side rail nav fixed left (`~4.25rem`) — never over the character’s face
- Page wrap max ~1120px; horizontal padding `clamp(1.25rem, 4vw, 4.5rem)`

### Section law: one job
| Section | Job |
|---------|-----|
| Hero / Space | Identity wonder + invitation |
| Selected Work (spiral) | Interactive proof |
| About | Trust + human story |
| Skills / Toolkit banner | Toolkit credibility (flowy ribbon) |
| Explorations | Taste / side paths |
| Contact / Footer | Clear ask |

### Spacing
- Section padding: `clamp(5rem, 12vw, 9rem)` vertical
- Prefer whitespace over cards; cards only when interaction needs a container (spiral items, skills panel)

### Responsive
- &lt;900px: side rail → burger; figure framing retunes
- &lt;640px: intro docks bottom-left; spiral cards shrink; stage height may shorten
- No horizontal scroll; touch targets ≥ 44px

---

## 7. Components

### Liquid glass
- Blur ~18–28px, saturate slightly
- Border: whisper ink line, not white-on-white invisibility
- Shadow: soft, tinted to light atmosphere (`rgba(10,10,10,0.06–0.1)`)
- Used for: ND mark, side rail, CTAs, skills panel, spiral cards

### Buttons
- **Primary glass:** white frosted pill + optional ink icon disc (`About ↗`)
- **Ghost:** ink text, thin ink border, soft hover wash
- Active: slight scale `0.98`
- No neon outer glow

### Side navigation
- Desktop: vertical glass rail with section labels (Space, Work, About, Contact)
- Mobile: ND + burger → full glass menu overlay
- Always clear of the character

### Spiral work cards
- Glass tile, rounded ~1.1rem, soft elevation
- Appear one-by-one on scroll; fade out before About
- Imperative DOM updates for performance (no React re-render storm)

### Toolkit banner
- Full-bleed flowy marquee of craft + AI web tools under About
- Glass chips, soft wave atmosphere — never an orbit gimmick
- Calm perpetual drift; honor `prefers-reduced-motion`

### Forms / contact
- When added: label above, generous hit area, glass or soft-surface field
- Same Outfit + ink system; one clear submit CTA

---

## 8. Motion Philosophy

### Principles
- Scroll tells the story; decoration supports
- Stages: **enter → hold → exit**
- Animate only `transform` + `opacity` (+ filter blur for text rise)
- **Stack:** GSAP + ScrollTrigger + Lenis (`src/lib/gsap.ts`). Do not run competing Framer scroll systems.
- Prefer GSAP ticker / ScrollTrigger for continuous scrub; Lenis for page feel

### Approved motions
1. Cloud drift (GSAP scroll scrub + pointer `quickTo`)
2. Hero text rise (staggered on `is-ready`)
3. Video scrub tied to hero pin progress
4. Spiral cards stagger in / out + magnetic hover
5. Section enters via ScrollTrigger (not Framer whileInView)
6. Gallery open/close GSAP timeline

### Timing
- Ease: `cubic-bezier(0.32, 0.72, 0, 1)` (`--ease-out`) / GSAP power equivalents
- Text rise: ~0.95s with 50–150ms stagger steps
- Spiral appear windows: short smoothsteps along scroll progress
- Lenis duration ~0.85s — responsive, not syrupy
- Lenis `scroll` → `ScrollTrigger.update`

### Performance law
- Never `setState` every frame for scroll effects
- Never animate layout properties for continuous effects
- Honor `prefers-reduced-motion: reduce` — kill ScrollTriggers, leave static readable sky

### Banned motion
- Parallax junk that fights Lenis
- Bounce scroll hints
- Mask/blend hacks that shimmer the avatar
- Autoplaying noisy UI loops on every card
- White washes used to hide bad seams

---

## 9. Copy System

### Kickers
Uppercase, tracked, faint — `Graphic designer`, `About`, `Selected work`, `Craft themes`, `Contact`

### Headlines
Name-led or intention-led. Serif italic only for one emotional word when earned (`intention.`, `language.`, `feel.`, `weird`).

### Body
One short paragraph per section. Specific craft, not buzzwords.

### CTAs
Primary: **Selected work** / **Contact** / mailto — proof then desire  
Secondary path: About via rail  
Avoid: Learn more, Click here, Explore now

### Hire-me microcopy north star
Visitor should leave thinking: *She has taste, she can execute, she’s modern — book her.*
Reach should leave thinking: *I know who she is from one screenshot.*

---

## 10. Experience Map (build order for future work)

Use this as the checklist when expanding the project:

0. **Entrance** — loader crest, brand ritual  
1. **Space (Hero)** — figure, clouds, text choreography, CTAs  
2. **Work** — spiral + gallery depth (real covers)  
3. **About** — story + facts under shared sky  
4. **Skills / Toolkit** — flowy banner instrument  
5. **Craft themes** — Cloud Studio boards wall  
6. **Contact** — frictionless giant ask + OG atmosphere  
7. **Chrome** — rail, bridges, footer, SEO/OG consistent with Cloud Studio

Between major sections, use quiet **bridges** (mist atmosphere + kicker + one line) so the hire-me arc never feels like a hard cut.

Every new element must answer: *Does this deepen entrance, wonder, proof, trust, taste, or desire?*

---

## 11. Anti-Patterns (NEVER)

- Inter / Roboto / Arial as brand voice  
- Purple / neon / terracotta-cream AI cliché themes  
- Cards in the hero; badge stickers on the avatar  
- 3 equal feature cards as a default section  
- Overlapping text on the character  
- Glitchy video masks / heavy mix-blend on the figure  
- Laggy scroll from React re-renders  
- Emoji, fake stats (`99.9%`), “Elevate your brand” sludge  
- Dark mode as default for this brand world  
- Broadsheet dense columns  

---

## 12. Implementation Anchors (code)

| Concern | Location |
|---------|----------|
| Tokens | `src/index.css` `:root` |
| Fonts | Google fonts: Outfit + Instrument Serif |
| Sky | `SkyAtmosphere` + `/sky/sky-base.jpg` + cloud PNGs |
| Hero scrub / spiral | `Hero.tsx`, `BackgroundVideo.tsx` |
| Smooth scroll | `SmoothScroll.tsx` (Lenis) + `src/lib/gsap.ts` |
| Section enters | GSAP ScrollTrigger wrappers |
| Liquid glass | `.liquid-glass`, `.liquid-glass-panel`, `.btn-glass` |

When adding tokens, update **this file and `:root` together**.

---

## 13. Quality Bar (ship checklist)

Before any section is “done”:

- [ ] Feels like the same Cloud Studio weather  
- [ ] Clouds identifiable at About mid-scroll (visibility gate)  
- [ ] Advances wonder → proof → trust → desire  
- [ ] One interactive act per Proof / Desire beat  
- [ ] Typography hierarchy is Outfit-led; steel kickers; charcoal display  
- [ ] Glass chrome is consistent  
- [ ] Motion is GSAP + Lenis; smooth on mid hardware  
- [ ] Mobile first viewport still reads as one composition  
- [ ] Reduced motion still usable  
- [ ] No white wash used to hide seams  
- [ ] Nothing looks like default AI landing-page sludge  

---

*Brand world: Cloud Studio · Owner: Naiya Dhruv portfolio · Guide version: 1.0*
