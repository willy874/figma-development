---
name: figma-component-spec-guide
description: Authoring guide for Figma component specifications under `.claude/skills/figma-components/`. Load when writing a new spec, updating an existing spec because the source component / Figma component set / variable collection changed, or reviewing a PR that touches `src/stories/*.stories.tsx` or `.claude/skills/figma-components/`.
parent_skill: figma-components
---

# Figma Component Spec — Authoring Guide

This submodule teaches operators how to author a Figma component specification under `.claude/skills/figma-components/`. A spec is the **contract** between a Storybook story (`src/stories/<Name>.stories.tsx`) and its Figma twin: it freezes the variant surface, token bindings, layout metrics, and sync obligations so neither side can drift silently.

Load this skill whenever you are:

- Writing a **new** spec for a component being mirrored into Figma.
- **Updating** an existing spec because the source, the Figma component set, or a variable collection changed.
- Reviewing a PR that touches `src/stories/` **or** `.claude/skills/figma-components/` — per the sync rule in every spec, both must move together.

Component archetypes you'll encounter, named by shape:

- **Atomic primitive** — single component set with a dense Color × Variant × State matrix. Canonical fit for the **Render Binding Matrix** skeleton (§2 — Skeleton B), shipping as a directory alongside `design-token.md` and `storybook.render.md`.
- **Wrapper + atom** — two component sets, where the wrapper pre-wires child instances of the atom.
- **Slot-based composition** — a shell plus several sibling slot components (title / content / actions / description). Every slot exposes its inner content as a native Figma `SLOT` property.
- **Compound primitive with synthetic axes** — a single set whose Figma surface intentionally outpaces the runtime (e.g. Color / Size / State axes the source doesn't expose yet); the gap is tracked in §8.
- **Nested-instance wrapper** — outer set that mirrors every axis onto a nested instance of an inner primitive automatically; designers never override the nested instance.
- **Slot-property primitive** — single set that exposes swappable single-instance children as `INSTANCE_SWAP` slot properties on the host set, paired with `Show …` boolean toggles.

---

## 0. When a spec is (and isn't) required

**Write a spec when:**

- The component is published in the Figma library as a `COMPONENT_SET` (or a `COMPONENT` with meaningful runtime states).
- The component has a Storybook story under `src/stories/`.
- Designers will drop instances into screens and need to know which variant maps to which source prop.

**Skip a spec when:**

- The node is an icon glyph inside the shared `<Icon>` set — track it via [`figma-design-guide`](../figma-design-guide/SKILL.md) instead.
- The component is a one-off screen composition rather than a reusable primitive.
- The Figma node is a wireframe / placeholder.

If you're unsure, check the component inventory in [`figma-design-guide`](../figma-design-guide/SKILL.md) for the node ID — if it's listed with a variant count, it deserves a spec.

---

## 1. File location & frontmatter

A component spec lives in one of two layouts under `.claude/skills/figma-components/`:

- **Flat** — `<ComponentName>.md`. Default when a single document is enough.
- **Directory** — `<ComponentName>/` containing:
  - `figma.spec.md` — the contract (this is the file the spec guide governs).
  - `design-token.md` — component-scoped tokens that don't fit the shared `seed/*` or `alias/*` namespaces.
  - `storybook.render.md` — computed-style snapshot probed against `src/stories/<Name>.stories.tsx` via Chrome DevTools MCP. Documents the runtime numbers a Figma authoring pass should reproduce, plus the drift-check protocol for divergences.

Reach for the directory layout when the component has either (a) component-scoped tokens worth their own document, or (b) a runtime/Figma drift surface worth probing in detail.

Use PascalCase matching the Figma component name (without the `<>`).

Required frontmatter on the spec file:

```yaml
---
name: figma-component-<kebab-case-name>          # or `figma-component-<name>-spec` for directory layouts
description: Figma component specification for `<Name>` — the design counterpart of <source-path>. Documents <variant axes>, component properties, design tokens, state behavior, and source-to-Figma mapping rules.
parent_skill: figma-components
figma_file_key: <file-key>
figma_node_id: '<frame-node-id>'                  # optional — include when stable
figma_component_set_id: '<component-set-id>'      # optional — include when stable
---
```

- `name` is kebab style, prefixed `figma-component-`. For directory specs, suffix `-spec` so the name stays unique alongside sibling docs (`figma-component-button-spec`, `figma-component-button-design-token`, `figma-component-button-storybook-render`).
- `description` leads with "Figma component specification for `<X>`" and names the source file(s). For slot-based specs, list the slot components too.
- `figma_node_id` / `figma_component_set_id` are optional — include them when IDs are stable. Component property ids (the `#1234:5` suffix) are **not** stable across re-publishes; never reference them anywhere else in the spec.
- For composite components, additional keys help downstream tooling:
  - **Wrapper + atom**: add `figma_item_component_set_id` for the child atom.
  - **Slot-based**: add one key per slot — `figma_<slot>_component_set_id` (use explicit, self-describing key names).
- Leave IDs as empty strings or omit them when the Figma side has not been published yet; note the gap in the spec body.

---

## 2. Section skeletons

Two skeletons are in active use. Pick whichever matches the component's shape.

### Skeleton A — Long-form (default)

The spec self-contains every aspect (sizing, color, state rules, icons, layout, sync, glossary).

1. **Overview** — prose intro + aspect table
2. **Source-to-Figma Property Mapping** — per-prop mapping table + (optional) `§2.X.1` color value mapping
3. **Variant Property Matrix** — variant count math + options tables + non-variant properties (per-set when there are several)
4. **Design Tokens** — `§4.1 Sizing`, `§4.2 Color token bindings`, `§4.3 State rules` (or slot-composition rules for slot-based specs)
5. **Icons** — icon slot inventory; omit only if the component has none and the omission is documented in §1
6. **Layout** — component set grid + surrounding documentation frame
7. **Usage Guidelines** — picking a variant, action / tri-state semantics, Don'ts
8. **Source Sync Rule** — the mandatory "move together" contract
9. **Quick Reference** — TS surface + Figma summary blocks
10. **Token Glossary** — complete list of tokens consumed (seed, alias, component-scoped, shape, typography)

Wrappers may collapse the icon / layout sections when the inner primitive owns them; renumber consecutively. Do not introduce a new top-level section that isn't in the skeleton — downstream tooling looks for stable anchors.

### Skeleton B — Render Binding Matrix (atomic primitives)

Cell-by-cell paint / stroke / effect bindings live in a single **Render Binding Matrix** that subsumes Skeleton A's §4–§6. Companion files (`design-token.md`, `storybook.render.md`) carry the component-scoped tokens, runtime measurements, and drift triggers.

1. **Overview**
2. **Source-to-Figma Property Mapping** — includes `§2.1` color value mapping
3. **Variant Property Matrix**
4. **Usage Guidelines**
5. **Token Glossary** — pointers to `design-token.md` for component-scoped detail
6. **Render Binding Matrix** — `§6.1 Constants` + one subsection per `State` (`§6.2 Enabled` … `§6.6 Disabled`). Each row pins Fill, Stroke, Foreground, and Effect to a token name.

Default to **Skeleton A**. Reach for **Skeleton B** when (a) the component has a dense Color × Variant × State matrix where every cell needs unambiguous paint bindings, and (b) you can also produce the runtime measurements for `storybook.render.md`.

---

## 3. Section-by-section authoring rules

### §1 Overview

- Open with one sentence naming the source file (path + symbol) and stating the component is "the Figma counterpart of …".
- Call out **what the source does** (e.g. "thin wrapper around MUI `<Button>`", "compound component re-exporting `Checkbox.Root` / `Checkbox.Label` / …", "package re-exports MUI Button directly — there is no wrapper"). Readers should learn the source intent before the variant count.
- Disclose terminology mismatches between Figma and source (e.g. Figma's `Color=Error` corresponds to the source's `danger` family).
- For generational rewrites, summarize deltas vs. the previous generation as a bulleted list — dropped axes, added properties, rebinding changes.
- For slot-based specs, follow with a small **node table** (Figma node · Kind · Role) covering the page frame, shell component set, and each slot.
- End with an **aspect table**: Source file · Figma file · Figma frame · Component Set · Total variants · Underlying runtime · Typography headline.

### §2 Source-to-Figma Property Mapping

- Single-component specs: one primary table.
- Slot-based specs: split §2 into `§2.1 <Shell>`, `§2.2 <Slot1>`, … Each subsection names the source file in its heading and carries its own mapping table. Shell value-mapping tables (size, color) go under `§2.1.1`.
- Primary table columns: `Source prop` | `Figma property` | `Type` | `Notes`.
- `Type` is one of `VARIANT`, `BOOLEAN`, `TEXT`, `INSTANCE_SWAP`, or `SLOT`. Match Figma's Plugin API vocabulary exactly.
  - Use **`SLOT`** for native Figma Slots that accept arbitrary content.
  - Use **`INSTANCE_SWAP`** for swappable single-instance children with a fixed default target. Document the **shared-default caveat**: `INSTANCE_SWAP` defaults are shared across every variant of the host set — choose a benign placeholder.
- Behavior-only props (`onClick`, `onChange`, `onAfterClose`, `meta`) get listed with em-dashes and "Behavior-only, no design representation" — never omit them, or readers assume the audit missed them.
- Synthetic Figma axes that the source doesn't expose today get parenthesized notation: `_(not exposed by wrapper today)_ color` or `_(future `size` prop)_`. Flag them as requiring a source change (see §8).

**§2.X.1 Color value mapping** (required whenever the component has a `Color` axis or pre-models one): table rows keyed by source key. Columns: source key · MUI palette name · Figma token family · Figma `Color` value.

> **Naming convention** — when the Figma Color axis pre-models an MUI palette, prefer the **MUI palette name** in Figma (`Color=Error`, not `Color=Danger`, when targeting `palette.error.*`). Add a footnote when the source's color name and the Figma `Color` value differ.

### §3 Variant Property Matrix

- Lead with a fenced block showing the math. Single product for dense matrices (`6 × 3 × 5 = 90 variants`) or a **theoretical vs published** split for sparse matrices:

  ```
  Axes      : Checked × Indeterminate × Size × Color × State
  Full grid : 2 × 2 × 3 × 7 × 2   =   168 variants (theoretical)
  Published :                                  69 variants (sparse — see exclusions)
  ```

  Follow with a bullet list of intentional exclusions, each justified inline.
- Axis table columns: `Property` | `Default value` | `Options`. Default must match the Figma component set's default.
- **§3.X.1 Component (non-variant) properties**: separate table with `Property key` | `Type` | `Default` | `Purpose`. Include every non-variant property — labels, visibility booleans, instance-swaps, slots. For `INSTANCE_SWAP`, include the default target component. Do not record Figma property id suffixes (`#1234:5`).
- Wrapper + atom components need matrices for **both** sets plus a note explaining whether the wrapper pre-wires child instances.
- Slot-based components need a **separate §3.N subsection per component set** (shell, then each slot in render order). Slots without variants point at the non-variant properties table.
- Nested-instance wrappers call out the **mirroring contract**: each outer variant pre-sets the nested instance to the matching axes; designers do not override the nested instance manually. Show the arithmetic accounting for mirroring (e.g. `cells-per-outer-axis × outer-axis-size = total published`).

### §4 Design Tokens (Skeleton A)

- List the source-of-truth files any token claim must reconcile against — story file, project theme overrides, MUI defaults consumed verbatim.
- Reiterate: "every paint **must** be bound to a Variable; hex values are never pasted." Hex values may appear inline only as **reference resolutions of the light theme** — bind the actual Figma paint to the token.
- **§4.1 Sizing**: mirror MUI defaults if the source doesn't override — say so explicitly. One row per size. Include Padding, Item spacing, Font size, Icon slot, Corner radius, and any state-specific metric (Focused ring thickness, Outlined stroke, asymmetric Filled corner radius `4 4 0 0`, etc.).
- **§4.2 Color token bindings**: one row per Figma `Color` value (or paint role for color-axis-less components). Columns for each role (`main`, `hover`, `hover-bg`, `outlineBorder`, `focusVisible`, `on`). **Bold** the token path. Use Figma variable paths — never CSS custom-property names. Add trailing notes for family-specific oddities (e.g. some families use `outline-hover` in place of `hover-bg`; `Default` may have no seed family of its own and route through aliases).
- **§4.3 State rules**: one row per state, columns per `Variant` (or per role). Call out cross-cutting alias tokens (`bg-disabled`, `text-disabled`) that apply regardless of `Color`. Document when two states render identically (e.g. "Pressed = Hovered in v2") and why. **Slot-based specs** reuse §4.3 as **slot-composition rules** — shell↔slot relationships, divider coupling, action-count coupling, padding handoffs between adjacent slots.

### §5 Icons (Skeleton A)

- One row per icon slot: `Slot` · `Visibility prop` · `Swap prop` · `Default visibility` · `Frame dims` · `Node name`.
- Record the glyph source as an **instance** of the shared `<Icon>` set — do not inline Vectors.
- Document the size mapping (`Small → sm`, etc.) and any transform (rotation, mirroring) with pivot info.
- Specify how the fill is overridden — usually bound to the same token as the foreground text.
- For `INSTANCE_SWAP` slot properties on the host set, reiterate the **shared-default caveat**.
- If a slot is **not** exposed as `INSTANCE_SWAP` despite swappability, explain the limitation (per-variant baseline icons can't share a single default) and point designers at right-click → Swap Instance.
- For inline-SVG glyphs in source mirrored as Figma vectors, explain the divergence so canvas vs runtime differences don't read as bugs.

### §6 Layout (Skeleton A)

- Describe the component set as a **grid**: rows × columns, axis assignment, cell size.
- Describe the surrounding documentation frame separately: Header, Showcase / Use Case panels, sibling component sets housed in the same frame.
- For composite components, define the wrapper's **static composition** (item order, gap, padding) and disclaim dynamic behavior the wrapper cannot encode.
- For slot-based specs, add a "Composing a `<Component>` on a screen" subsection — which slot instance goes where, default sizes, how to hide an unused slot. Document the `UseCase` documentation frame separately, listing the curated examples (Sizes, Common usage, edge cases).

### §6 Render Binding Matrix (Skeleton B)

Replaces Skeleton A's §4–§6 with a single denormalized table. Use when the Color × Variant × State matrix benefits from cell-by-cell paint bindings.

- **§6.1 Constants** — one table covering values that hold across every cell: min width, outer height, corner radius, padding (per Variant when it differs), icon slot dims, gap, edge offsets, typography. Anchor numeric specifics here so §6.2–§6.6 stay color-only.
- **§6.2–§6.6** — one subsection per `State`. Columns: `Variant` | `Color` | `Fill` | `Stroke` | `Foreground` | `Effect`. Use `<C>` as a placeholder for the seed family and add a separate row for `Color=Default` whenever bindings diverge. Define each column once at the top of §6 (Fill = node fill, Stroke = node stroke including focus ring as an additional border, Foreground = label TEXT fill + icon fill, Effect = drop-shadow).
- Disabled (§6.6) typically collapses themed colors to greyscale alias tokens — say so explicitly and explain why the Color axis is preserved (so an `Enabled ↔ Disabled` toggle keeps the `Color` slot stable).

### §7 Usage Guidelines

- **§7.1 Picking a variant / configuration**: numbered list walking a designer from "I know the source prop values" to "I have the right Figma variant." Include slot toggles and adornment swaps when applicable.
- **§7.2 Action / tri-state / wrapper semantics** (when applicable): recommended pairings (Primary CTA, destructive, fully-checked, mixed selection, wrapper recipes, etc.).
- **§7.3 When NOT to use** (slot / dialog / pagination components only).
- **§7.4 Don'ts**: `❌` bullets for the most common misuses — detaching to recolor, hand-drawing glyphs, stacking extra focus rings, overriding nested-instance axes manually, hiding both `Value` and `Placeholder` simultaneously, etc.

### §8 Source Sync Rule (Skeleton A)

- Copy the canonical preamble: "This document and the source must move together."
- Numbered list of **every** file whose change forces a spec update — source `.tsx` / `.stories.tsx`, the Figma component set(s), project theme files, the underlying runtime primitive when it isn't direct MUI, plus any component-specific dependency (e.g. the shared `<Icon>` set).
- Follow with a bulleted "Specifically:" list of concrete triggers → spec edits.
- Highlight the **token-value vs. token-name** distinction: a value change in the theme needs **no** spec edit (variables resolve by name); a rename or removal requires updating every reference in §2.1, §4.2, §4.3, §10.

Skeleton B specs carry the equivalent obligations in `design-token.md` and `storybook.render.md`.

### §9 Quick Reference (Skeleton A)

- First fenced block: the TypeScript prop surface of the source, with `// → Figma <property>` comments. Copy from the actual source; don't paraphrase.
- Second fenced block: summary of the Figma component set(s) — variant axes, properties, default, total variant count, composition notes. For wrapper + atom or slot-based, list every set / component.

### §10 Token Glossary (Skeleton A) / §5 Token Glossary (Skeleton B)

- **Seed tokens** (`seed/*`): list the suffixes consumed with roles. Enumerate the families used (`primary`, `danger`, `warning`, `info`, `success`, `secondary`, `tertiary`, `neutral`) — do **not** expand every full name in a giant matrix.
- **Alias tokens** (`alias/colors/*`, `alias/layout/*`): one row per consumed alias token. **Preserve any known typos in the variable collection as-is** — annotate with `_(sic)_` rather than silently normalizing them. Renaming would break bindings.
- **Component-scoped tokens** (`_components/<comp>/*` legacy convention, `component/<comp>/*` directory-layout convention): list each token, what it resolves to, and what it's used by. Cross-reference the directory's `design-token.md` when one exists.
- **Effect / shape & elevation**: pin shadow tokens to their published effect styles (`material-design/shadows/shadows-{2,4,6,8}` for MUI elevation). Note `theme.shape.borderRadius`.
- **Typography**: font family, weight, size/line-height, `text-transform`, letter-spacing. Mark them as MUI-default-resolved until typography tokens exist. When a published Figma text style covers the variant (`material-design/typography/h6`, `material-design/typography/body2`, `button/medium`, `input/label`, `input/value`), bind via `textStyleId` rather than ad-hoc.

---

## 4. Token binding conventions (non-negotiable)

1. **Figma variable path, not CSS variable, not hex.** Write `seed/primary/main`, not the project's CSS variable name, not `#1976d2`.
2. **Bind to semantic tokens (`seed/*`, `alias/*`) first; reach into raw palette tokens only when no semantic token fits.** Cite this rule whenever an unusual binding choice (e.g. a component-scoped token resolving to a raw palette value directly) needs justification.
3. **Preserve known typos.** Match the variable collection as-published; annotate with `_(sic)_`. Renaming silently breaks bindings.
4. **Component-scoped tokens carry alpha.** `_components/*` and `component/*` tokens already bake their alpha into the resolved value. Never pair them with a paint `opacity < 1` — Figma flattens to `opacity = 1` on instance creation.
5. **Stacked fills for theme-color 8 % tints.** A paint with `opacity < 1` plus a bound variable gets flattened on instance creation. Bind to a variable whose resolved value already carries alpha, then stack twice when you need ~8 % from a 4 % token (`1 − (1 − 0.04)² ≈ 0.078`). Document the math in the spec.
6. **Never paste raw hex, even in documentation tables.** If you must show a resolved value, mark it "reference resolution of the light theme" and bind the actual Figma paint to the token.

---

## 5. Variant-matrix arithmetic

- Always show the math in a fenced block. `6 × 3 × 5 = 90` is reviewable; "90 variants" is not.
- For sparse matrices, use a **theoretical vs published** split followed by exclusion bullets, each with a one-sentence justification.
- Visual duplicates across a `Color` axis are normal — Figma requires uniform axes across a component set. Call them out so readers don't file them as bugs.
- When a state collapses (`Pressed` = `Hovered`), keep the variant entry separate so behavior can diverge later without a variant explosion. Say this in §4.3.
- Omitted states must be justified inline ("omitted to keep the matrix at 288 variants; adding `Focused` would cost 72 more").
- Nested-instance wrappers account for mirroring in the math: `cells per outer-axis × outer-axis size = total published`.

---

## 6. Workflow — writing or updating a spec

1. **Open the source.** Read the story file end-to-end. List every prop, every default, every hard-coded MUI option. For re-exports of MUI primitives, open the MUI source to confirm the prop surface.
2. **Open the Figma component set.** Use `mcp__plugin_figma_figma__get_metadata` to enumerate variants and component properties. For Skeleton B specs, also pull `mcp__plugin_figma_figma__get_screenshot` to verify per-cell appearance.
3. **Check the project component inventory** in [`figma-design-guide`](../figma-design-guide/SKILL.md). Confirm the node IDs and variant count you're about to record match what's published.
4. **Resolve the tokens.** For every paint role, locate the exact Figma variable path. Hex values appear in the spec only as reference resolutions.
5. **For Skeleton B (directory layout)**: probe the runtime with Chrome DevTools MCP against the Storybook story to populate `storybook.render.md`. Cover the full Color × Variant × State surface (`ColorMatrix`, `StateMatrix`, `WithStartIcon`, etc.).
6. **Draft the spec** following the chosen skeleton. Use the nearest exemplar as a structural template — copy section headings verbatim.
7. **Cross-check the sync rule.** Walk §8 of your draft and verify each referenced file still exists at that path.
8. **Verify variant math.** The product in the fenced block must equal the total in the aspect table; per-exclusion accounting must add up to the published count.
9. **Diff against a sibling exemplar.** Any missing subsection needs either content or an explicit "n/a — reason" note.

When updating, re-run steps 1–4 before editing. For Skeleton B, re-probe the Storybook runtime when MUI / theme upgrades are involved (per `storybook.render.md` §7).

---

## 7. Common mistakes to avoid

- ❌ Recording CSS variable names instead of Figma variable paths.
- ❌ Omitting behavior-only props from §2.
- ❌ Claiming a variant count without showing the multiplication, or omitting the theoretical-vs-published split for sparse matrices.
- ❌ Writing "transparent" as a literal instead of binding to `alias/colors/bg-default`.
- ❌ Using MUI palette names in the `Figma Color value` column without footnoting the source ↔ Figma name mismatch.
- ❌ Silently normalizing typos in variable names.
- ❌ Leaving the §8 sync rule generic. Every trigger → edit must be component-specific.
- ❌ Introducing a §N.N that isn't in the chosen skeleton.
- ❌ Documenting hypothetical future state as if it ships today. Mark it `_(future <prop>)_` or "add per §8 when introduced."
- ❌ Recording Figma component property ids (`#1234:5`) outside the optional frontmatter.
- ❌ Skipping the shared-default caveat when documenting an `INSTANCE_SWAP` slot property.
- ❌ For nested-instance wrappers: documenting only the outer axes without the mirroring contract.
- ❌ For Skeleton B: leaving `design-token.md` as a stub — component-scoped tokens belong in that file with their resolution chain.
- ❌ For directory-layout specs: skipping the `storybook.render.md` drift check after a MUI upgrade.

---

## 8. Cross-references

- [`figma-design-guide`](../figma-design-guide/SKILL.md) — project-specific design system inventory (variable collections, text styles, elevation, published component IDs). Spec frontmatter IDs and every token path in §4 / §10 must reconcile against this skill's submodules.
- Sibling skills:
  - `figma-component-upload` — bulk-extract every variant of a component set into per-variant JSON.
  - `figma-init` — force-overwrite variable values from a JSON snapshot.
  - `figma:figma-use` — required before any `use_figma` write.
