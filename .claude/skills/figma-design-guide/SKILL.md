---
name: figma-design-guide
description: Project-specific design system inventory — the actual tokens (variables, text styles, elevation) and components published in this project's Figma files. Load whenever you need to bind a token, apply a text style, or insert/reuse a published component, so you reference real names instead of guessing.
---

# Figma Design Guide — Project Inventory

This skill is the **source of truth for what already exists** in this project's Figma files. Before binding a token, applying a text style, or creating a new component, check here first — if a token or component already exists, reuse it; never recreate.

Load alongside `figma-operator-guide` (for Figma authoring rules) and `figma:figma-use` (for the Plugin API).

---

## Submodule index

- **[design-token.md](design-token.md)** — The single `merak` variable collection (78 vars: `alias/colors/*`, `seed/*`, `component/*`, plus a few top-level), 28 text styles (`material-design/typography/*` + `component/typography/*`, each with a `-bold` sibling), and 24 `material-design/shadows/shadows-{1..24}` effect styles. Use whenever you need a real token name (color, typography, shadow). Bind to existing tokens by name — there is no raw palette layer to fall back on.
- **[components.md](components.md)** — The published component inventory (names, variant counts) in the MUI Library file. Grep this list before creating any new component — if it exists, import via `importComponentByKeyAsync` / `importComponentSetByKeyAsync` and reuse. **Node IDs are not in this file** — look them up in [`figma.config.json`](../../../figma.config.json) under `index.componentSetsAndPrimitives.<Name>.nodeId`, `index.icons.<Name>.nodeId`, or `index.componentSpecs.<Name>.*` (the single source of truth).

---

## When to load

- About to call `setBoundVariableForPaint` / `setBoundVariableForTextProperty` / similar → load `design-token.md`.
- About to create a button / input / dialog / chip / icon / any UI primitive → load `components.md` first to check for an existing match.
- Need a node ID for an existing component (to import, find children, attach instance, etc.) → read it from `figma.config.json`, not `components.md`.
- Reviewing design output for token/component coverage → load both.

---

## Related skills

- `figma-operator-guide` — authoring rules (discovery, layout, hygiene, accessibility).
- [`figma-create-component/component-spec-guide.md`](../figma-create-component/component-spec-guide.md) — submodule covering authoring of component specifications under `.claude/skills/figma-components/`.
- `figma:figma-use` — required before any `use_figma` call.
