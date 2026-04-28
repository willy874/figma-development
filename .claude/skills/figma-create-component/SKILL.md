---
name: figma-create-component
description: End-to-end workflow for adding a new component to the project's Figma library. Drives the full pipeline — Storybook story → runtime measurement → spec → token planning → Figma authoring → subagent review. Load when the user asks to "create a Figma component", "add `<X>` to the library", "build `<X>` in Figma from MUI/library Y", or invokes `/figma-create-component`. Required inputs: `library` and `component name`. Optional inputs: an existing JSX implementation, an editable Figma node to update in place, and/or a reference-only Figma node to mirror.
---

# figma-create-component

End-to-end pipeline for adding a new component to the project's Figma library. Each step has its own authoring skill — this skill is the **router and orchestrator** that sequences them, enforces hand-offs between artifacts, and finishes with an independent subagent review.

The deliverables produced by a successful run:

1. `src/stories/<ComponentName>.stories.tsx` — variant-matrix Storybook story.
2. `.claude/skills/figma-components/<ComponentName>/storybook.render.md` — Chrome DevTools MCP computed-style snapshot.
3. `.claude/skills/figma-components/<ComponentName>/figma.spec.md` — the Figma ↔ source contract.
4. `.claude/skills/figma-components/<ComponentName>/design-token.md` — only when component-scoped tokens are needed.
5. The published Figma `COMPONENT_SET` (or `COMPONENT`) on the agreed page, with every variant authored against the spec.
6. A subagent review report covering spec, render, and operator-guide compliance.

---

## Inputs

Collected at invocation. If the user omits them, ask before starting — do not guess.

| Parameter         | Required | Notes                                                                                                              |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `library`         | yes      | The component library the new component is sourced from (e.g. `@mui/material`, `@radix-ui/react-checkbox`, custom in-repo). Determines which props/defaults the spec must reconcile against. |
| `component name`  | yes      | PascalCase. Used verbatim for `src/stories/<Name>.stories.tsx`, the spec directory, and the published Figma `COMPONENT_SET` name. |
| Existing JSX      | no       | Path or inline source. When present, skip the "research the library API" leg of step 1 and adapt the existing JSX into the stories file. |
| Editable Figma node    | no | `fileKey` + `nodeId` (or full URL) of a node in **this project's** library file that we are allowed to modify in place. When present, treat it as the authoring target: keep its node id, mirror its existing variant axes / property surface / naming, and update it via `use_figma` instead of creating a new component set. Step 5 must edit this node, not duplicate it. |
| Reference-only Figma node | no | `fileKey` + `nodeId` (or full URL) of a node we may **read but not modify** (e.g. an upstream MUI library file, a vendor design kit, a competitor screenshot frame). When present, mirror its variant axes, property surface, naming, and visual treatment verbatim, but author a brand-new component set in our own file — never write back to this node. |

If either kind of Figma node is provided, **always** run `mcp__plugin_figma_figma__get_metadata` and `get_screenshot` against it before drafting anything else — it is the strongest source of truth for axis names, variant counts, and visual reference. When both are provided, the editable node defines the authoring target (node id, page, frame), and the reference-only node defines the visual / structural ideal that the editable node should be brought in line with.

---

## Pipeline

Execute the steps in order. Do not skip ahead — each step's output is an input for the next. Use `TaskCreate` to track progress and mark each task complete as soon as it finishes (don't batch).

### Step 1 — Author `src/stories/<ComponentName>.stories.tsx`

**Goal:** every "common" variant of the component is statically rendered in Storybook so step 2 can measure it.

- Read the library source (or the supplied JSX) to enumerate the prop surface: every variant axis, every default, every state-affecting prop.
- If an editable or reference-only Figma node was supplied, mirror its variant axes (color × variant × state, etc.) and use the same axis names. When both are supplied, the editable node wins on axis identity (we have to keep its existing variants intact); the reference-only node fills in any axes the editable one is missing.
- Pattern after `src/stories/Button.stories.tsx`:
  - One `Story` per primary axis value (e.g. `Contained`, `Outlined`, `Text`).
  - One or more **matrix** stories (`ColorMatrix`, `StateMatrix`, …) that lay out the full Cartesian grid using `Stack`. Matrix stories disable controls (`parameters: { controls: { disable: true } }`) and use `cellLabel` columns.
  - Cover focus / disabled states statically (e.g. `className: 'Mui-focusVisible'`, `disabled: true`). Pseudo-class states (`:hover`, `:active`) cannot render statically — note the limitation in the meta `description` so step 2 doesn't waste effort probing them.
  - Cover icon slots when the component has them.
- Confirm Storybook compiles before moving on. Run the dev server and open the new stories in a browser; abort the pipeline if any story crashes.

### Step 2 — Measure runtime → `storybook.render.md`

**Goal:** capture the runtime computed-style numbers a Figma authoring pass must reproduce.

- Load `figma-component-spec-guide` and follow its rules for the `storybook.render.md` companion document.
- Use Chrome DevTools MCP (`mcp__chrome-devtools__navigate_page`, `take_snapshot`, `evaluate_script`) against the Storybook story file from step 1.
- Probe the full Color × Variant × State surface plus icon variants and any size axis. Sample one representative cell per axis-combination, not every cell — call out where the matrix is regular vs. where it diverges.
- Record: box metrics (min-width, height, padding, border, radius), paints (background, color, border-color), effects (shadow), typography (`font-family`, weight, size, line-height, letter-spacing, `text-transform`), state-specific deltas, and any custom CSS properties the library exposes.
- Use `.claude/skills/figma-components/Button/storybook.render.md` as the structural exemplar.

### Step 3 — Draft `figma.spec.md`

**Goal:** the contract between source and Figma — variant surface, property API, layout, sync rules.

- Load `figma-component-spec-guide` and pick a skeleton:
  - **Skeleton A (long-form)** — default for slot-based, wrapper, and most components.
  - **Skeleton B (Render Binding Matrix)** — only when the Color × Variant × State surface is dense enough to warrant cell-by-cell paint bindings, **and** step 2 produced runtime measurements that can back the Constants table.
- Fill every section the chosen skeleton mandates. If a section is intentionally empty, write `n/a — <reason>`; do not silently omit it.
- Write the §8 sync rule with concrete trigger → spec edits, naming the actual files (the new stories file, the library source, this project's theme files, etc.).
- Show the variant-count math explicitly. For sparse matrices use the "theoretical vs published" split.
- If an editable Figma node was supplied, set `figma_file_key`, `figma_node_id`, and `figma_component_set_id` in the frontmatter to that node — it is the published artefact this spec governs. A reference-only node does **not** populate these fields; instead, mention it in §1 as the source we mirrored from. If neither is supplied, leave the fields blank and note the gap in §1.

### Step 4 — Plan design tokens

**Goal:** every paint, stroke, effect, and typography rule in the spec is bound to a real token from `figma-design-guide/design-token.md`. Component-scoped exceptions get their own `design-token.md`.

- Load `figma-design-guide` (tokens) and reconcile every numeric / hex value from `storybook.render.md` against the published variable collection.
- Default to semantic tokens: `merak/seed/*`, `merak/alias/*`. Drop into `material-design/palette/*` only when no semantic token fits — and justify it inline.
- Preserve known typos (`alias/colors/border-defalt` _(sic)_).
- Apply `material-design/typography/*` text styles by name; do not hand-set fontName / size / line-height.
- Apply `material-design/shadows/shadows-N` for elevation; do not hand-author drop shadows.
- If the component needs values that no published token covers (e.g. a chip-fill alpha that lives only in `component/chip/*`), document them in a new `design-token.md` alongside the spec, with the resolution chain and the rule that designers must bind to the new tokens — never to raw hex.
- Update §4 (Skeleton A) or §5 + §6.1 Constants (Skeleton B) of `figma.spec.md` so every paint/stroke/effect references a token path. **Never** leave a hex value in the spec except as a "reference resolution of the light theme."

### Step 5 — Author the Figma component

**Goal:** publish the `COMPONENT_SET` (or `COMPONENT`) on the agreed page, every variant matching the spec.

- Load `figma-operator-guide` (the router) and pull in its situational submodules:
  - `discovery.md` first (`get_libraries` → `search_design_system` → `get_variable_defs`).
  - `layout.md`, `tokens.md`, `component-rules.md`, `content.md` while building.
  - `states.md`, `accessibility.md`, `hygiene.md`, `handoff.md` before declaring done.
- Also load `figma:figma-use` before any `use_figma` call (mandatory per its skill description).
- **Decide the authoring target** before writing:
  - If an **editable Figma node** was supplied, that node *is* the target. Do not duplicate or re-create it. Update its variants, properties, layout, and bindings in place via `use_figma` so its node id (and any inbound instance references) stay stable. If the editable node lives in a frame / page that no longer fits, ask the user before moving it.
  - Otherwise **ask the user where to author it**. Acceptable answers:
    - "create a new page named `<ComponentName>`" → create the page, then place the component set on it.
    - "add it to existing page `<X>`" → place it on that page.
    - A Figma URL pointing at an existing frame → place the component set inside that frame.
    Do not guess. Re-confirm if the answer is ambiguous.
  - A reference-only node is **never** the authoring target — never write to its file, even if the user pastes its URL by mistake.
- Build the component set following the spec's §3 variant matrix and §4 / §6 token bindings exactly. Use Auto Layout, bind every paint to a variable, apply text styles by id.
- After authoring, return the resulting page name + node id (or URL) to the user so they can inspect.

### Step 6 — Subagent review

**Goal:** an independent pair of eyes confirms the deliverables match the four governing documents.

Spawn a single subagent (use `general-purpose` unless a more specialized agent fits) with full paths to every artifact and a checklist of what to verify. The subagent should report a punch list of pass / fail items — not just a vibe check.

The review must cover:

- **Spec ↔ render alignment** — every numeric value in `figma.spec.md` matches `storybook.render.md` (or the divergence is justified).
- **Spec ↔ Figma alignment** — the published component set's variant axes, property names, defaults, and total variant count match `figma.spec.md` §3. Spot-check at least one cell per state for paint / stroke / effect bindings.
- **Spec ↔ `figma-component-spec-guide`** — frontmatter fields present, chosen skeleton followed, §8 sync rule is component-specific, variant-count math is shown, no raw hex outside reference resolutions, no Figma property id suffixes (`#1234:5`) outside frontmatter.
- **Figma ↔ `figma-operator-guide`** — every paint bound to a variable, text styles applied by id, Auto Layout used (no absolute positioning except where layout.md allows), no detached instances, hygienic layer names, accessibility minimums met.

Phrase the subagent prompt so it can pick up cold (paths, what to compare, the form of the expected report). Keep the report under 400 words — surface the failures, not the successes.

### Step 7 — Resolve review findings

**Goal:** every fail item from step 6 is either fixed or explicitly accepted (with justification recorded in the relevant document).

- For each finding, decide: fix immediately, file a TODO in §8 of the spec, or accept with a one-line rationale appended to the spec / render / design-token doc.
- Re-run the relevant step (3, 4, or 5) after edits.
- Re-spawn the subagent only when changes are non-trivial. For a single-line fix, a self-check is enough.

---

## When NOT to use this skill

- The component already has a spec under `.claude/skills/figma-components/<Name>/` — load `figma-component-spec-guide` directly and update what changed. This skill is for **new** components.
- The user only wants to update the Storybook story without touching Figma — use the story file directly.
- The user only wants to push an arbitrary screen / page composition into Figma — use `figma:figma-generate-design` instead.
- The component is an icon glyph — track it via `figma-design-guide` instead.

---

## Cross-references

- `figma-component-spec-guide` — authoring rules for `figma.spec.md`, `storybook.render.md`, and `design-token.md`. Loaded in steps 2 and 3.
- `figma-design-guide` — published variable collection, text styles, elevation, components inventory. Loaded in step 4 (and consulted throughout).
- `figma-operator-guide` — situational submodules for any `use_figma` write. Loaded in step 5.
- `figma:figma-use` — mandatory before any `use_figma` call.
- `figma-component-upload` — sibling skill for snapshotting an authored component back out to per-variant JSON (useful as a post-step verification artefact, not part of this pipeline).
