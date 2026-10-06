# Cloud Studio — Design Skills Library

Reusable skill pack for designing and redesigning the Naiya Dhruv portfolio.

## How agents use this

Cursor rule `.cursor/rules/cloud-studio-design-library.mdc` is **always on**.  
Master skill: `.cursor/skills/cloud-studio-library/SKILL.md`  
Brand bible: `DESIGN.md`

On every design/redesign task the agent should: read `DESIGN.md` → read `cloud-studio-library` → read routed skills → implement.

## Installed this session

```bash
npx skills@latest add emilkowalski/skills
```

Emil skills are mirrored under `.cursor/skills/` (and partially `.agents/skills/`):

| Skill | Purpose |
|-------|---------|
| `animate` | Web animation craft |
| `animate-expo` | Expo / RN motion (optional) |
| `animation-vocabulary` | Shared motion language |
| `apple-design` | Apple-style fluid UI / motion |
| `ask-sonner` | Toast / feedback patterns |
| `emil-design-eng` | Design engineering philosophy + polish |
| `find-animation-opportunities` | Where to add motion |
| `improve-animations` | Upgrade existing motion |
| `mobile-native` | Native mobile (optional) |
| `pick-ui-library` | UI kit selection |
| `prototype` | Fast prototypes |
| `review-animations` | Motion QA |
| `write-swift` | Swift UI (optional) |

## Project design skills (already in repo)

| Skill | Purpose |
|-------|---------|
| `taste-skill` | Anti-slop portfolio / landing bar |
| `redesign-skill` | Upgrade existing UI |
| `soft-skill` | Agency-grade type / space / shadow |
| `image-to-code-skill` | Visual-first build |
| `imagegen-frontend-web` | Web image direction |
| `brandkit` | Brand boards |
| `stitch-skill` | DESIGN.md generation |
| `web-interface-guidelines` | Vercel WIG compliance |
| `apple-design-md` | Photography-first gallery system |
| `output-skill` | Complete UI, no placeholders |
| `minimalist-skill` / `brutalist-skill` | Optional aesthetics |

## Human reuse

1. Keep this file + `DESIGN.md` + `.cursor/skills/cloud-studio-library/`
2. Re-add Emil pack anytime: `npx skills@latest add emilkowalski/skills`
3. Point new agents at: “Use the Cloud Studio design library”

## Sync note

If `npx skills` hits Windows `EPERM` on `.agents/skills`, copy from GitHub into `.cursor/skills/` (already done for this repo). Cursor reads `.cursor/skills/` for this project.
