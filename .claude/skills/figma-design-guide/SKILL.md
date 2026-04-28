---
name: figma-design-guide
description: Project-specific design system inventory — the actual tokens (variables, text styles, elevation) and components published in this project's Figma files. Load whenever you need to bind a token, apply a text style, or insert/reuse a published component, so you reference real names instead of guessing.
---

# Figma Design Guide — Project Inventory

This skill is the **source of truth for what already exists** in this project's Figma files. Before binding a token, applying a text style, or creating a new component, check here first — if a token or component already exists, reuse it; never recreate.

Load alongside `figma-operator-guide` (for Figma authoring rules) and `figma:figma-use` (for the Plugin API).

---

## Submodule index

- **[design-token.md](design-token.md)** — Variable collections (`material-design`, `merak`), text styles, elevation/effect styles. Use whenever you need a real token name (color, spacing, typography, shadow). Always bind to `merak/*` semantic tokens; reach into `material-design/palette/*` only when no semantic token fits.
- **[components.md](components.md)** — The published component inventory (names, node IDs, variant counts) in the MUI Library file. Grep this list before creating any new component — if it exists, import via `importComponentByKeyAsync` / `importComponentSetByKeyAsync` and reuse.

---

## When to load

- About to call `setBoundVariableForPaint` / `setBoundVariableForTextProperty` / similar → load `design-token.md`.
- About to create a button / input / dialog / chip / icon / any UI primitive → load `components.md` first to check for an existing match.
- Reviewing design output for token/component coverage → load both.

---

## Related skills

- `figma-operator-guide` — authoring rules (discovery, layout, hygiene, accessibility).
- `figma-component-spec-guide` — authoring component specifications under `.claude/skills/figma-components/`.
- `figma:figma-use` — required before any `use_figma` call.
