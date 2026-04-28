---
name: figma-spec-guide
description: Authoring guide for Figma component specifications under `.claude/skills/figma-components/<Component>.md`. Load when writing a new spec, updating an existing spec because the source component / Figma component set / variable collection changed, or reviewing a PR that touches `apps/console/src/components/` or `.claude/skills/figma-components/`.
parent_skill: figma-components
---

# Figma Component Spec — Authoring Guide

This submodule teaches operators how to author a Figma component specification under `.claude/skills/figma-components/<Component>.md`. A spec is the **contract** between a Merak source component (`apps/console/src/components/<Name>/<Name>.tsx`) and its Figma twin: it freezes the variant surface, token bindings, layout metrics, and sync obligations so neither side can drift silently.

Load this skill whenever you are:

- Writing a **new** spec for a foundation / business component being mirrored into Figma.
- **Updating** an existing spec because the source component, the Figma component set, or the Merak variable collection changed.
- Reviewing a PR that touches `apps/console/src/components/` **or** `.claude/skills/figma-components/` — per the sync rule in §8 of every spec, both must move together.

Reference exemplars — pick the one closest to the component shape you are documenting:

- [`Button.md`](../figma-components/Button.md) — **single component set** with a rich variant matrix (Color × Variant × State). Canonical template for atomic primitives.
- [`Pagination.md`](../figma-components/Pagination.md) — **wrapper + atom** (two component sets: the wrapper pre-wires child `PaginationItem` instances). Use when a component decomposes into a parent that statically composes a child primitive.
- [`Dialog.md`](../figma-components/Dialog.md) — **slot-based composition** (shell + multiple sibling slot components: `DialogTitle`, `DialogContent`, `DialogActions`, `DialogDescription`). Use when a single conceptual component ships as several sibling React components that designers assemble inside a shell.

When in doubt, match the shape of the nearest exemplar.

---

## 0. When a spec is (and isn't) required

**Write a spec when:**

- The component is published in the Figma library as a `COMPONENT_SET` (or a `COMPONENT` with meaningful runtime states).
- The component has a React counterpart in `apps/console/src/components/`.
- Designers will drop instances into screens and need to know which variant maps to which source prop.

**Skip a spec when:**

- The node is an icon glyph inside the shared `<Icon>` set — track it in [`components.md`](components.md) instead.
- The component is a one-off screen composition rather than a reusable primitive.
- The Figma node is a wireframe / placeholder on `--- WIP ---` or `Wireframe`.

If you're unsure, grep `components.md` for the node ID — if it's listed with a variant count, it deserves a spec.

---

## 1. File location & frontmatter

Place the file at `.claude/skills/figma-components/<ComponentName>.md`. Use PascalCase matching the Figma component name (without the `<>`).

Required frontmatter:

```yaml
---
name: figma-component-<kebab-case-name>
description: Figma component specification for `<Name>` — the design counterpart of `apps/console/src/components/<Name>/<Name>.tsx`. Documents <variant axes>, component properties, design tokens, state behavior, and source-to-Figma mapping rules.
parent_skill: figma-components
figma_file_key: stse2CgIzOugynEdDSexS4
figma_node_id: '<frame-node-id>'
figma_component_set_id: '<component-set-id>'
---
```

- `name` is snake/kebab style, prefixed `figma-component-`. Use the **conceptual** name (Dialog ships as `figma-component-modal` because Figma calls the node "Modal") — match whatever the Figma component is actually named, not necessarily the file name.
- `description` is a single sentence used for skill discovery — lead with "Figma component specification for `<X>`" and name the source file(s). For slot-based specs, list the slot components too (see Dialog).
- `figma_file_key` is the 天璇 file (`stse2CgIzOugynEdDSexS4`) unless explicitly otherwise.
- `figma_node_id` is the containing **frame** (the one hosting the component set + documentation); `figma_component_set_id` is the `COMPONENT_SET` itself. Include additional keys when the component decomposes:
  - **Wrapper + atom** (Pagination): add `figma_item_component_set_id` for the child atom.
  - **Slot-based** (Dialog): add one key per slot component set — `figma_title_component_set_id`, `figma_content_component_set_id`, `figma_actions_component_set_id`, etc. Use explicit, self-describing key names.
- Leave the IDs as empty strings only when the Figma side has not been published yet; note the gap in §1 of the body.

---

## 2. Required section skeleton

Every spec MUST have these 10 sections, in order:

1. **Overview** — prose intro + aspect table
2. **Source-to-Figma Property Mapping** — per-prop mapping table + color value mapping
3. **Variant Property Matrix** — variant count math + options tables + non-variant properties
4. **Design Tokens** — sizing, color bindings, state rules
5. **Icons** — icon slot inventory (omit entire section only if component has none)
6. **Layout** — component set grid + surrounding documentation frame
7. **Usage Guidelines** — picking a variant, action semantics, Don'ts
8. **Source Sync Rule** — the mandatory "move together" contract
9. **Quick Reference** — TS surface + Figma summary blocks
10. **Token Glossary** — complete list of tokens consumed

Do not renumber, merge, or reorder sections. Downstream tooling and reviewers rely on the stable layout.

---

## 3. Section-by-section authoring rules

### §1 Overview

- Open with one sentence naming the source file and stating the component is "the Figma counterpart of ..."
- Call out **what the source wrapper does** (e.g. "thin wrapper around MUI `<Button>` that maps `MerakColorTheme` onto MUI palette colors"). Readers should learn the source intent before the variant count.
- If this is a generational rewrite (v2, v3), summarize the deltas vs. the previous generation as a bulleted list — dropped axes, added properties, rebinding changes.
- End with an **aspect table** covering: Source file · Figma file (linked) · Figma frame · Component Set · Total variants · MUI version · Typography headline.

### §2 Source-to-Figma Property Mapping

- For single-component specs: one primary table.
- For **slot-based specs** (Dialog-style): split §2 into `§2.1 <Shell>`, `§2.2 <Slot1>`, `§2.3 <Slot2>`, … Each subsection names the source file in its heading (e.g. `### 2.2 <DialogTitle> — apps/console/src/components/Dialog/DialogTitle.tsx`) and carries its own mapping table. If the shell has a value-mapping table (size, color), place it as `§2.1.1` — keep slot-specific mappings under their own slot subsection.
- Primary table columns: `Source prop` | `Figma property` | `Type` | `Notes`.
- `Type` is one of `VARIANT`, `BOOLEAN`, `TEXT`, or `INSTANCE_SWAP`. Match Figma's Plugin API vocabulary exactly.
- If a prop is behavior-only (`onClick`, `onChange`), list it with em-dashes and mark "Behavior-only, no design representation" — never omit it, or readers will assume it was overlooked.
- Parenthesize synthetic Figma axes that the source doesn't expose today, e.g. `_(not exposed by wrapper today)_ color`. Flag them in the notes as requiring a source change (see §8).

**§2.1 Color value mapping** (required whenever the component has a `Color` axis): table rows keyed by `MerakColorTheme` value. Columns: source key · MUI palette name · Figma token family · Figma `Color` value. Point engineers at §2.1 when pulling instances to avoid confusing Merak names with MUI palette names.

### §3 Variant Property Matrix

- Lead with a fenced block showing the variant math: `Color × Variant × State (Size=Medium) = 6 × 3 × 5 = 90 variants`.
- Axis table columns: `Property` | `Default value` | `Options`. Default must match the Figma component set's default variant.
- **§3.1 Component (non-variant) properties**: separate table with `Property key` | `Type` | `Default` | `Purpose`. Include every non-variant property (`Label`, `Start Icon`, instance-swaps). Do not reference Figma property id suffixes (`#1234:5`) — they are not stable; warn readers about this explicitly.
- Wrapper + atom components (Pagination-style) need matrices for **both** sets plus a note explaining whether the wrapper pre-wires child instances.
- Slot-based components (Dialog-style) need a **separate §3.N subsection per component set** (shell, then each slot). Give each its own variant math and axis table; only slots with variants need a matrix — slots that have no variants can be documented by pointing at the non-variant properties table. Keep §3.N ordering consistent with §2's subsections (shell first, then slots in render order).

### §4 Design Tokens

- Open by listing the five theme sources that any token claim must reconcile against:
  - `apps/console/src/themes/seed.css`
  - `apps/console/src/themes/alias.css`
  - `apps/console/src/themes/light.ts` / `dark.ts`
  - `apps/console/src/themes/constants.tsx`
  - `apps/console/src/themes/mui-theme.ts`
- Reiterate: "every paint **must** be bound to a Variable; hex values are never pasted."
- **§4.1 Sizing**: mirror MUI defaults if the source doesn't override — say so explicitly. One row per size. Include Padding, Item spacing, Font size, Icon slot, Corner radius, and any state-specific metric (e.g. Focused ring thickness, Outlined stroke).
- **§4.2 Color token bindings**: one row per Figma `Color` value, columns for each role (`main`, `hover`, `hover-bg`, `outlineBorder`, `focusVisible`, `on`). **Bold** the token path. Use Figma variable paths (`seed/primary/main`, `alias/colors/text-default`) — **never** the CSS custom-property names (`--merak-seed-primary-main`). Add trailing notes for oddities (Danger/Warning use `outline-hover` instead of `hover-bg`, Default maps to tertiary for contained, etc.).
- **§4.3 State rules**: one row per state. Columns per `Variant` (Text / Outlined / Contained, or whatever the axis is). Call out cross-cutting alias tokens (`bg-disabled`, `text-disabled`) that apply regardless of `Color`. Document when two states render identically (e.g. "Pressed = Hovered in v2") and why. **Slot-based specs** reuse §4.3 as **slot-composition rules** instead — document shell↔slot relationships (which slots render inside the shell, whether `Show Divider` on one slot is coupled to `Has Divider` on another, action-count coupling, etc.) rather than interactive states.

### §5 Icons

- One row per icon slot: `Slot` · `Property` · `Default visibility` · `Frame dims` · `Node name`.
- Record the glyph source as an **instance** of `<Icon>` (`798:7408`) — do not inline Vectors.
- Document the size mapping explicitly (`Small → sm`, etc.) and any transform (rotation, mirroring) with pivot info.
- Specify how the fill is overridden (usually bound to the same token as the foreground text).
- If the slot is not exposed as an `INSTANCE_SWAP` property, explain the limitation (INSTANCE_SWAP defaults are shared across every variant — incompatible with per-type glyphs). Point designers at right-click → Swap Instance as the escape hatch.

### §6 Layout

- Describe the component set as a **grid**: rows × columns, axis assignment, cell size. Readers use this to navigate the canvas.
- Describe the surrounding documentation frame separately: Header, Showcase / Use Case panels, sibling component sets housed in the same frame.
- For composite components, define the wrapper's **static composition** (item order, gap, padding) and disclaim dynamic behavior the wrapper cannot encode.
- For slot-based specs, add a "Composing a `<Component>` on a screen" subsection that walks through how a designer assembles the shell + slots as an instance tree on the canvas — which slot instance goes where, default sizes, and how to hide an unused slot. Also document the `UseCase` / documentation frame separately from the component set frames.

### §7 Usage Guidelines

- **§7.1 Picking a variant**: numbered list walking a designer from "I know the source prop values" to "I have the right Figma variant."
- **§7.2 Action semantics** (when applicable): `Action intent` | `Color` | `Variant` — recommended pairings (Primary CTA, destructive, secondary, etc.).
- **§7.3 Don'ts**: `❌` bullets for the most common misuses — detaching to recolor, hand-drawing glyphs, stacking extra focus rings, relying on placeholder content, overriding hard-coded MUI options.

### §8 Source Sync Rule

- Copy the canonical preamble: "This document and the source must move together (per the project's **Features Sync Rule** spirit, applied here to design-system components)."
- Numbered list of **every** file whose change forces a spec update. Always include: source `.tsx`, the Figma component set(s), `constants.tsx`, `seed.css`/`alias.css`/`component.css`, `light.ts`/`dark.ts`, `mui-theme.ts`, plus any component-specific dependency (e.g. shared `<Icon>` set for Button).
- Follow with a bulleted "Specifically:" list of concrete triggers → spec edits (new color value → update §2.1 + variant in Figma + token row in §4.2, etc.).
- Pay special attention to the **token-value vs. token-name** distinction: a value change in `light.ts`/`dark.ts` needs **no** spec edit (variables resolve by name); a rename or removal in `seed.css`/`alias.css` requires updating every reference in §2.1, §4.2, §4.3, §10.

### §9 Quick Reference

- First fenced block: the TypeScript prop surface of the source component, with `// → Figma <property>` comments on each line. Copy from the actual source; don't paraphrase.
- Second fenced block: summary of the Figma component set(s) — variant axes, properties, default, total variant count, composition notes. For wrapper + atom, include both.

### §10 Token Glossary

- **§10.1 Seed tokens** (`seed/*`): list the token suffixes the component consumes with roles. Enumerate the color families the tokens resolve across (`primary`, `danger`, `warning`, `info`, `success`, `tertiary`, `neutral`) — do **not** expand every full name in a giant matrix; call out only the families used.
- **§10.2 Alias tokens** (`alias/colors/*`): one row per alias token consumed. Preserve the typo `border-defalt` as `border-defalt _(sic)_` — it matches the `merak` variable collection and renaming it would break bindings.
- **§10.3 Shape & elevation**: note `theme.shape.borderRadius = 4`, whether elevation is used, and the current hard-coded values that are awaiting dedicated tokens.
- **§10.4 Typography**: font family, weight, size/line-height, `text-transform`, letter-spacing. Mark them as MUI-default-resolved until typography tokens exist.

---

## 4. Token binding conventions (non-negotiable)

These rules apply to every color claim in every spec:

1. **Figma variable path, not CSS variable, not hex.** Write `seed/primary/main`, not `--merak-seed-primary-main`, not `#1976d2`. The `merak` collection is the source of truth — see [`design-token.md`](design-token.md).
2. **Preserve known typos.** `alias/colors/border-defalt` is misspelled in the collection; the spec must match or bindings fail. Annotate with `_(sic)_`.
3. **Family-specific exceptions** (memorize these):
   - Danger & Warning use `outline-hover` in place of `hover-bg` for their 4 % tint.
   - Default's focus ring uses `seed/neutral/focusVisible` (no family of its own).
   - Default's contained variant maps to `seed/tertiary/*` (MUI `inherit` semantic).
4. **Stacked fills for theme-color 8 % tints.** A paint with `opacity < 1` plus a bound variable gets flattened on instance creation; bind to a variable whose resolved value already carries alpha, then stack twice when you need ~8 % from a 4 % token. Document the math in the spec.
5. **Never paste raw hex, even in documentation tables.** If you must show a resolved value for readability, mark it "reference resolution of the light theme" and bind the actual Figma paint to the token.

---

## 5. Variant-matrix arithmetic

- Always show the math. `6 × 3 × 5 = 90` is reviewable; "90 variants" is not.
- Visual duplicates across a `Color` axis are normal — Figma requires uniform axes across a component set. Call them out so readers don't file them as bugs.
- When a visual state collapses (`Pressed` = `Hovered`), keep the variant entry separate so behavior can diverge later without a variant explosion. Say this in §4.3.
- Omitted states (`Focused`, `Pressed`) must be justified inline ("omitted to keep the matrix at 288 variants; adding would cost 72 more").

---

## 6. Workflow — writing or updating a spec

1. **Open the source.** Read `apps/console/src/components/<Name>/<Name>.tsx` end-to-end. List every prop, every default, every hard-coded MUI option.
2. **Open the Figma component set.** Use `get_metadata` to enumerate variants and component properties. Confirm axis names, options, defaults.
3. **Open `components.md`.** Confirm the node IDs and variant count you're about to record match what's published.
4. **Open the theme files** listed in §4. For every paint role the component uses, locate the exact token in the `merak` variable collection (not the CSS vars). Refer to [`design-token.md`](design-token.md) for the path conventions.
5. **Draft the spec** following the skeleton in §2 of this guide. Use Button.md or Pagination.md as a structural template — copy section headings verbatim.
6. **Cross-check the sync rule.** Walk the list in §8 of your draft and verify each file referenced still exists at that path; update if anything has moved.
7. **Verify variant math.** The product in the fenced block must equal the total in the aspect table.
8. **Review with the sibling exemplar.** Diff your new spec against Button.md section-by-section; any missing subsection needs either content or an explicit "n/a — reason" note.

When updating, re-run steps 1–4 before editing — a token rename you didn't notice will otherwise poison every downstream binding.

---

## 7. Common mistakes to avoid

- ❌ Recording CSS variable names (`--merak-seed-*`) instead of Figma variable paths (`seed/*`).
- ❌ Omitting behavior-only props (`onClick`, `onChange`) from §2 — readers assume the audit missed them.
- ❌ Claiming a variant count without showing the multiplication.
- ❌ Writing "transparent" as a literal instead of binding to `alias/colors/bg-default`.
- ❌ Using MUI palette names (`primary`, `error`) in §2.1's `Figma Color value` column — Figma uses Merak names (`Primary`, `Danger`).
- ❌ Silently normalizing `border-defalt` to `border-default` — bindings break.
- ❌ Leaving the §8 sync rule generic. Every trigger → edit must be component-specific.
- ❌ Introducing a §N.N that isn't in the skeleton — tooling looks for stable anchors.
- ❌ Documenting hypothetical future state (`size="small"` support, elevation, circular shape) as if it ships today. Mark it explicitly as "add per §8 when introduced."

---

## 8. Cross-references

- [`components.md`](components.md) — the component inventory; spec frontmatter IDs must match.
- [`design-token.md`](design-token.md) — Figma variable path conventions and the `merak` collection layout.
- [`component-rules.md`](references/component-rules.md) — rules for instantiating a specced component on a screen.
- [`tokens.md`](references/tokens.md) — the `setBoundVariableForPaint` helper pattern.
- Exemplars: [`Button.md`](../figma-components/Button.md) (single set), [`Pagination.md`](../figma-components/Pagination.md) (wrapper + atom), [`Dialog.md`](../figma-components/Dialog.md) (shell + slots).
