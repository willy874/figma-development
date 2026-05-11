# figma-component-sync · 上傳 (repo → Figma)

Router for the three repo-→-Figma upload paths. None of them mix; the model **must** ask which target the operator means, then read the matching submodule and follow its procedure verbatim.

| target              | scope                                                                                              | implementation                                |
| ------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Variables**       | Force-overwrite `valuesByMode` on existing variables from `src/figma/variables.json`.              | Delegates to standalone skill **`figma-init`**. |
| **Styles**          | Upsert local text / effect / paint / grid styles from `src/figma/styles.json`.                     | [`upload-styles.md`](upload-styles.md) (Phase A). |
| **Components**      | Sync component variants from `src/figma/components/<Name>/*.json`. Phase A only.                   | [`upload-components.md`](upload-components.md). |

## Entry — interactive

When the parent SKILL.md routes here, ask **one** `AskUserQuestion` with three options, no multi-select:

| label                          | description                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| `Variables (figma-init)`       | Variable values from `variables.json`. Delegates to `figma-init`.                            |
| `Styles (upload-styles.md)`    | Upsert text / effect / paint / grid styles from `styles.json`. Creates missing styles by name. |
| `Components (upload-components.md)` | Sync one component's variants from `components/<Name>/`. Phase A = values only.          |

Then `Read` the matching submodule and follow it verbatim.

## Run order (when doing more than one)

Per-target snapshots reference each other. The only safe sequence is:

```
variables  →  styles  →  components
```

- Styles use `setBoundVariable` against variables that must already exist with the right names.
- Component patches use `boundVariables` against both variables and (for text styles) the styles set above.

Never reverse the order in a single sweep. If an earlier step partially fails, fix it on its own side and rerun before moving on.

## Entry — non-interactive

If `/tmp/component-sync-upload-params.json` is already present, skip the question. The file's top-level `target` field decides routing:

```json
{ "target": "variables" | "styles" | "components", "fileKey": "...", ... }
```

Each submodule documents its remaining fields. If `target` is missing or unrecognised, ask the same `AskUserQuestion`.

## Cross-cutting constraints

These apply to **all three** upload paths; target-specific rules live in each submodule.

- **Force-overwrite, no diff.** Once an upload starts, every key in scope is written. Don't try to merge or skip "matching" values.
- **No model interpretation of values.** Data flows through fixed `pack-*.sh` / `render-*.sh` scripts. The model orchestrates the steps and reports the rolled-up summary; it never edits, reformats, or substitutes values mid-flight.
- **Sequential `use_figma` calls only.** Never parallelise across manifest entries.
- **Don't run upload as a "fix" for a failed download.** If the snapshot is wrong, fix it locally (or rerun download with corrected inputs) before pushing.
- **`fileKey` resolution is shared.** Defaults to the file key parsed from the source link in `.claude/skills/figma-design-guide/components.md`. Override only when the operator explicitly targets a different file.
- **`figma-use` prerequisite.** Every `use_figma` call requires the `figma-use` skill loaded first. Pass `skillNames: "figma-component-sync,figma-use"` on every call.

## What is **not** implemented

Surface this list whenever the operator asks for scope that exceeds Phase A:

- **Phase B: component topology rebuild.** Destruct-and-create round-trip from REST snapshots. Blocked on the SVG-path → VectorNetwork parser (needed for the 2 000+ inline `VECTOR` nodes the library contains). Design lives in `upload-components.md` § Phase B; no scripts yet.
- **Variable creation / deletion / rename / scope edits.** `figma-init` only force-writes `valuesByMode` on already-existing variables. Adding, removing, or renaming variables has no automated path.
- **Style deletion.** Snapshot-only deletion semantics — styles present in Figma but absent from `styles.json` are left untouched.
- **Cross-file component imports.** Component variants that contain `INSTANCE` nodes referencing components published in other Figma files are out of scope for Phase A (Phase A doesn't touch instance children; Phase B will require `importComponentByKeyAsync`).
