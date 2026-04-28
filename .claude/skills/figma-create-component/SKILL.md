---
name: figma-create-component
description: End-to-end workflow for adding a new component to the project's Figma library. Drives the full pipeline — Storybook story → runtime measurement → spec → token planning → Figma authoring → subagent review. Load when the user asks to "create a Figma component", "add `<X>` to the library", "build `<X>` in Figma from MUI/library Y", or invokes `/figma-create-component`. Required inputs: `library` and `component name`. Optional inputs: an existing JSX implementation, an editable Figma node to update in place, a reference-only Figma node to mirror, and/or an existing editable `figma.spec.md` to update in place.
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
| Editable Figma spec    | no | Path to an existing `figma.spec.md` (and optionally its companion `storybook.render.md` / `design-token.md`) — typically under `.claude/skills/figma-components/<Name>/`. When present, treat it as the **authoring contract**: reuse its variant axes, property surface, defaults, and token bindings; in step 3, update sections in place rather than drafting from scratch. Only diverge from it when step 1/2 produced evidence that the existing values are wrong, and record any divergence in §8. If the spec's frontmatter already names a `figma_node_id`, that node behaves as an *Editable Figma node* — do not duplicate. |

If either kind of Figma node is provided, **always** run `mcp__plugin_figma_figma__get_metadata` and `get_screenshot` against it before drafting anything else — it is the strongest source of truth for axis names, variant counts, and visual reference. When both are provided, the editable node defines the authoring target (node id, page, frame), and the reference-only node defines the visual / structural ideal that the editable node should be brought in line with.

If an *editable Figma spec* is provided, **always** read it (and any companion `storybook.render.md` / `design-token.md`) before step 1 — its variant axes and property names should drive the stories file, and its frontmatter may already pin the authoring target for step 5. When both an editable spec and an editable Figma node are supplied, they must point at the same component set; if they don't, stop and ask the user which one wins.

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
- If an *editable Figma spec* was supplied, **do not draft from scratch** — open the existing file and update sections in place. Keep its skeleton choice, frontmatter ids, variant axes, property names, and defaults unless step 1/2 produced explicit evidence they are wrong; record any divergence in §8 with the trigger that justified it. Treat the existing spec's token bindings as the starting point for step 4.
- Fill every section the chosen skeleton mandates. If a section is intentionally empty, write `n/a — <reason>`; do not silently omit it.
- Write the §8 sync rule with concrete trigger → spec edits, naming the actual files (the new stories file, the library source, this project's theme files, etc.).
- Show the variant-count math explicitly. For sparse matrices use the "theoretical vs published" split.
- If an editable Figma node was supplied (or the editable spec's frontmatter already pins one), set `figma_file_key`, `figma_node_id`, and `figma_component_set_id` in the frontmatter to that node — it is the published artefact this spec governs. A reference-only node does **not** populate these fields; instead, mention it in §1 as the source we mirrored from. If neither is supplied, leave the fields blank and note the gap in §1.

### Step 4 — Plan design tokens

**Goal:** every paint, stroke, effect, and typography rule in the spec is bound to a **local** variable in this file's own collection — sourced from the catalogue in `figma-design-guide/design-token.md`. The component must be self-contained; no consumed-library dependency is allowed. Anything the catalogue doesn't cover gets minted locally and documented in a component-scoped `design-token.md`.

- Load `figma-design-guide` (tokens) and reconcile every numeric / hex value from `storybook.render.md` against the catalogue (`merak/*`, `material-design/*`, text styles, shadows).
- **Local-only is the project default.** Every binding the component emits must resolve to a variable in this file's own collection — never a `VariableID:<sharedKey>/<id>` from a consumed library. The rule applies to every component built through this pipeline; the design system file is not guaranteed to be loaded next to the consumer, so library files must be self-contained.
- Default to semantic tokens: `merak/seed/*`, `merak/alias/*`. Drop into `material-design/palette/*` only when no semantic token fits — and justify it inline.
- Preserve known typos (`alias/colors/border-defalt` _(sic)_).
- Apply `material-design/typography/*` text styles by name; do not hand-set fontName / size / line-height.
- Apply `material-design/shadows/shadows-N` for elevation; do not hand-author drop shadows.
- If a token from the catalogue is missing locally, mint it in the local collection with the same name and resolved hex from `figma-design-guide/design-token.md` before authoring. This is mechanical, not a design decision — no `design-token.md` entry needed.
- If the component needs values the catalogue does **not** cover (e.g. a chip-fill alpha, a per-component pre-alpha'd Selected bg, a state overlay the seed family doesn't ship), mint them as **component-scoped** locals (`component/<name>/*`) and write a `design-token.md` next to the spec recording: the new token's name, type, value, the resolution chain (`alpha = 0.12`, `seed/<C>/main × 12 %`, etc.), and why the catalogue couldn't supply it. Never bind to raw hex in lieu of a token.
- **`design-token.md` is authoritative.** Every entry it lists must exist as a real variable in the file's local collection. Before step 5 authoring, diff the document against the live collection (`figma.variables.getLocalVariableCollections()`); for any token in `design-token.md` that has no matching local variable, write it via `use_figma` with the documented name, type, scopes, and resolved value. The reverse direction (variables that exist but aren't documented) is fine — only the document → variables direction is enforced.
- Update §4 (Skeleton A) or §5 + §6.1 Constants (Skeleton B) of `figma.spec.md` so every paint/stroke/effect references a token path. **Never** leave a hex value in the spec except as a "reference resolution of the light theme."
- Record the local-only rule in `figma.spec.md` §1 so future readers know the component is built to be self-contained.

#### Verifying local vs. consumed-library bindings

A Figma file can hold both a **local** variable collection and consume **published** library copies of the same names. The two are distinct objects: rebinding from one to the other does not change the rendered hex but changes which file owns the source-of-truth. Local-only is the default — the steps below are how you confirm the component actually meets it.

- Before drafting §5 of the spec, query a sample cell's `boundVariables` — the variable's `id` will start with `VariableID:<localId>` (local) or `VariableID:<sharedKey>/<id>` (consumed library). The local-vs-library distinction is invisible in `get_design_context` output (CSS var names are identical), so always check `boundVariables` directly.
- Any cell that resolves to a `VariableID:<sharedKey>/...` is a violation of the local-only rule and must be rebound. Re-binding ~300 cells is mechanical but slow; budget one `use_figma` call per component set.
- For MUI runtime values the shared seed family doesn't ship (e.g. `12 %`-α themed Selected bg vs. the family's `4 %`-α `hover-bg`), mint per-component pre-alpha'd locals in `component/<name>/*` and document them in `design-token.md`. The pre-alpha'd-binding rule (don't pair `paint.opacity < 1` with a bound variable — Figma flattens it on instance creation) makes this the only honest way to hit 12 % per family without inflating the seed namespace.

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
- **Sync component-scoped tokens before authoring any cell.** Read `.claude/skills/figma-components/<Name>/design-token.md` (if it exists) and the `merak/*` / `material-design/*` paths cited in `figma.spec.md` §4 / §6.1. For each token, check whether a variable with that exact name already exists in the file's local collection. Mint the missing ones via `use_figma` (correct `resolvedType`, `scopes`, value or alias to another local variable) **before** writing any cell. Authoring against a not-yet-minted token silently falls back to a raw paint and breaks the local-only rule.
- Build the component set following the spec's §3 variant matrix and §4 / §6 token bindings exactly. Use Auto Layout, bind every paint to a variable, apply text styles by id.
- After authoring, return the resulting page name + node id (or URL) to the user so they can inspect.

#### Pre-flight inspection (when editing in place)

Before writing any `use_figma` script that mutates dozens of cells, sample 4–6 cells across the axis matrix and read their actual paint / stroke / text-fill bindings (not just `get_design_context` — query `node.fills[0].boundVariables.color.id` directly and resolve the variable name). Three patterns are easy to miss without sampling:

- **Selective theming.** A "themed" axis often only paints differently for a subset of (Type × State) combinations — e.g. Pagination themes only `Page/Hovered` and `Page/Selected`; every other Hovered cell uses the neutral overlay regardless of Color. Drafting the Render Binding Matrix from MUI source alone misses this.
- **Stacked-fill compositing.** Themed Selected often appears as **two stacked fills** of the same 4 %-α token (composite ~7.84 %) to dodge Figma's `paint.opacity` flattening. If you see two identical fills, that's the pattern — not duplication.
- **Source-of-truth drift.** The Figma cell may bind to library variables whose hex no longer matches the published catalogue (token renamed / removed upstream). Before assuming "Figma is correct," cross-check against `figma-design-guide/design-token.md`.

#### Phase the writes by op-type

For component sets with hundreds of variants, batch `use_figma` calls by the kind of operation, not by axis slice:

1. **Phase A — paint rebinds + numeric tweaks.** Rebind fills / strokes / text-fills, set `paddingLeft / paddingRight`, set `fontSize`, set `letterSpacing`. No structural change. One call can comfortably handle 200–300 cells.
2. **Phase B — structural replacements.** Removing a TEXT child and inserting an INSTANCE (e.g. swapping a unicode glyph for an icon component) is structural. Keep it in its own call so you can validate the geometry independently. One call per direction (Previous, Next, etc.).
3. **Phase C — wrapper-level changes.** `itemSpacing`, `padding`, nested-instance overrides on the wrapper component set. Wrappers are usually <50 variants; one call.

After each phase: take a `screenshot()` of 5–10 representative cells (`scale: 4`) to validate before moving on.

#### Don't extend pre-existing icon sets when their axis structure is incompatible

If you need icon variants that don't fit an existing icon set's axis (e.g. the existing `<Icon>` set has `Size=xs..xxl` for a single glyph, but you need `Direction × Size` for chevron-left vs. chevron-right), **mint dedicated component sets** rather than bolting on a `Glyph` axis. Adding axes to a published set:

- Risks renaming every existing variant (breaking inbound instances).
- Forces every consumer to specify the new axis, even when they don't care.
- Requires a 2D variant explosion when the existing set was 1D.

Place the new dedicated sets adjacent to the existing icon set (same page, sibling frame) so they're discoverable, and reference them by id from the consuming component set.

### Step 6 — Subagent review

**Goal:** an independent pair of eyes confirms the deliverables match the four governing documents.

Spawn a single subagent (use `general-purpose` unless a more specialized agent fits) with full paths to every artifact and a checklist of what to verify. The subagent should report a punch list of pass / fail items — not just a vibe check.

The review must cover:

- **Spec ↔ render alignment** — every numeric value in `figma.spec.md` matches `storybook.render.md` (or the divergence is justified).
- **Spec ↔ Figma alignment** — the published component set's variant axes, property names, defaults, and total variant count match `figma.spec.md` §3. Spot-check at least one cell per state for paint / stroke / effect bindings.
- **Spec ↔ `figma-component-spec-guide`** — frontmatter fields present, chosen skeleton followed, §8 sync rule is component-specific, variant-count math is shown, no raw hex outside reference resolutions, no Figma property id suffixes (`#1234:5`) outside frontmatter.
- **Figma ↔ `figma-operator-guide`** — every paint bound to a variable, text styles applied by id, Auto Layout used (no absolute positioning except where layout.md allows), no detached instances, hygienic layer names, accessibility minimums met.
- **Local-only bindings** — sample 4–6 cells across the matrix and confirm every `boundVariables` id starts with `VariableID:<localId>` (no `VariableID:<sharedKey>/...` consumed-library references). Any component-scoped tokens that aren't in `figma-design-guide/design-token.md` must be documented in `.claude/skills/figma-components/<Name>/design-token.md` with a resolution chain.
- **`design-token.md` ↔ local variables** — for every entry in the component's `design-token.md`, confirm a local variable with the same name exists in the file (matching `resolvedType` and resolved value). Missing entries mean step 5's pre-flight was skipped — flag as fail.
- **Internal spec consistency** — the same constant cited in two sections must agree (e.g. §6.1 Constants table vs. §6.7 Glyph table both quoting font sizes; §3 variant count vs. §1 aspect-table total). These cross-section mismatches are common when sections are rewritten in isolation.
- **Stale runtime claims** — `Underlying MUI version` in §1 reflects the current `package.json` / `pnpm-lock.yaml` resolution (not a guess). Reviewer should `grep package.json` to confirm.
- **Token semantic mismatches** — when a token's name suggests one role but the spec binds it to another (e.g. `bg-disabled` used as a stroke), the spec must explain the convention inline, ideally citing the sibling spec that established it (Button / IconButton).

Phrase the subagent prompt so it can pick up cold (paths, what to compare, the form of the expected report). Keep the report under 400 words — surface the failures, not the successes.

### Step 7 — Resolve review findings

**Goal:** every fail item from step 6 is either fixed or explicitly accepted (with justification recorded in the relevant document).

- For each finding, decide: fix immediately, file a TODO in §8 of the spec, or accept with a one-line rationale appended to the spec / render / design-token doc.
- Re-run the relevant step (3, 4, or 5) after edits.
- Re-spawn the subagent only when changes are non-trivial. For a single-line fix, a self-check is enough.

---

## Runtime-truth pass (optional follow-up)

The default pipeline treats the Figma cells as the deployed source of truth — divergences from MUI runtime (`storybook.render.md`) are recorded in `figma.spec.md` §7 as documented design decisions. A second mode exists when the user explicitly directs the project to **align Figma to runtime**, item by item ("issue 1 → runtime", "issue 2 → MUI native", etc.). This is heavier than the initial pipeline and has its own checklist.

### When to run

- The user enumerates `figma.spec.md` §7 issues and assigns each one a resolution (runtime / MUI / accept-as-is).
- A new directive is added (e.g. "全部使用該圖內部的變數" — local-only variable bindings).
- A subagent review surfaced fail items that require structural cell rewrites, not just spec wording fixes.

### What changes vs. the initial pipeline

1. **Mint local-only equivalents for every consumed library variable.** Inspect each Pagination cell's `boundVariables` first to discover what's local vs. published. For each missing local alias, create it in the local collection with the same name and resolved hex.
2. **Mint per-component pre-alpha'd tokens** for runtime values the shared seed family doesn't ship (e.g. `12 %`-α themed Selected bg). Document them in the new `design-token.md`.
3. **Rewrite cells in phased `use_figma` calls** per the "Phase the writes by op-type" guidance under Step 5. Common phases:
   - Phase A: paint / stroke / text-fill rebinds + numeric tweaks (padding, font-size, letter-spacing).
   - Phase B: structural replacements (TEXT → INSTANCE for icon swaps).
   - Phase C: wrapper-level updates (per-Size `itemSpacing`, nested-instance overrides).
4. **Create dedicated icon component sets** when runtime uses SVG icons but the Figma cells used unicode glyphs (or vice versa). Don't extend an incompatible-axis icon set; mint a new one per direction.
5. **Mark §7 issues resolved with date** (`Resolved YYYY-MM-DD`) and move them to a "Resolved" subsection. Keep them visible for traceability — don't delete.
6. **Update `storybook.render.md` drift checks** to reflect closed divergences. Open drift checks should remain; resolved ones get a `~~strikethrough + "Resolved YYYY-MM-DD"~~` line.
7. **Update `design-token.md`** if new component-scoped tokens were minted, with the resolution chain (`alpha = 0.12`, `seed/<C>/main × 12 %`, etc.) and the rationale for keeping them out of the shared seed family.
8. **Re-spawn the subagent review** for cross-check — the structural rewrites are a fresh review surface.

### What does NOT change

- The variant matrix (axes, total counts) stays stable. Runtime alignment is about *paint values*, not *variant geometry*.
- The Storybook story (`<Component>.stories.tsx`) stays stable — it already mirrors runtime.
- Frontmatter `figma_node_id` stays stable. Editing in place preserves inbound instance references.

### Capture the run in §1 of the spec

After a runtime-truth pass, add a sentence to `figma.spec.md` §1 noting the date and what was reconciled — readers should know the current state is "runtime-aligned as of YYYY-MM-DD" rather than "matches the original Figma authoring intent."

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
