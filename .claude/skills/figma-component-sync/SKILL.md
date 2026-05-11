---
name: figma-component-sync
description: Two-way snapshot bridge between the project's Figma library and the repo. Acts as a router — on entry it asks 下載 (Figma → repo) or 上傳 (repo → Figma), then loads the matching submodule. Download covers component variants (via REST shell script) plus `src/figma/styles.json` + `src/figma/variables.json` (via chunked `use_figma` + `assemble-tokens.sh`). Upload routes three ways: variables (delegates to `figma-init`), styles (upsert via `upload-styles.md`), and components (Phase A value-only sync via `upload-components.md`; Phase B topology rebuild is design-only). Use when the user invokes `/figma-component-sync`, asks to dump / snapshot Figma library data into local files, or asks to push a local snapshot back to Figma.
---

# figma-component-sync

Snapshot-and-sync the project's Figma library. Two directions:

- **下載** (Figma → repo) — implemented. See [download.md](download.md).
- **上傳** (repo → Figma) — router with three downstream paths (variables / styles / components). See [upload.md](upload.md).

The model **must** ask the operator which direction is intended before doing anything else, then read the matching submodule and follow its procedure verbatim.

## Files in this skill

- `SKILL.md` — this router. Asks 下載/上傳 and loads the matching submodule.
- `download.md` — Figma → repo. Components via REST shell script, styles/variables via chunked `use_figma` + assembler.
- `upload.md` — repo → Figma. Three-way router across variables / styles / components.
  - `upload-styles.md` — upsert local styles from `src/figma/styles.json`.
  - `upload-components.md` — Phase A value patch from `src/figma/components/<Name>/*.json`; Phase B (topology rebuild + SVG-path parser) is design-only.
- `extract.sh`, `dump-styles.js`, `dump-variables.js`, `assemble-tokens.sh` — download-side scripts. See `download.md` for usage.
- `pack-styles.sh`, `render-styles.sh` — styles-upload scripts. See `upload-styles.md`. *(Not yet implemented — documents define their contracts.)*
- `pack-component-values.sh`, `render-component-values.sh` — components-upload Phase A scripts. See `upload-components.md`. *(Not yet implemented — documents define their contracts.)*

## Entry point

When this skill is invoked (via `/figma-component-sync` or otherwise without a fresh `/tmp/component-sync-params.json`), call `AskUserQuestion` with **two options, no multi-select**:

| label  | description                                                                                  |
| ------ | -------------------------------------------------------------------------------------------- |
| `下載` | Pull Figma library state into the repo (component variants, styles, variables). See `download.md`. |
| `上傳` | Push local snapshots back to Figma. See `upload.md` — currently mostly a stub.                |

Then `Read` the corresponding submodule and follow its procedure verbatim.

**Non-interactive shortcut.** If the operator has already prepared `/tmp/component-sync-params.json` (the download-side input contract), assume `下載`, skip the question, and jump into `download.md`.

## Cross-cutting constraints

These apply to **both** directions; direction-specific rules live in each submodule.

- **Force-overwrite.** Neither side prompts before clobbering existing data — `download.md` overwrites local files, `upload.md` overwrites Figma values (styles upsert by name, components patch in place; both never delete Figma-only data).
- **No model interpretation of values.** Data flows through fixed scripts. The model orchestrates the steps and reports the rolled-up summary; it never edits, reformats, or substitutes values mid-flight.
- **Don't mix directions in one run.** Never run upload as a "fix" for a failed download (or vice versa). If a sync goes wrong, fix it on the side that owns the bug — re-run the same direction with the corrected inputs.
- **`fileKey` resolution is shared.** Both submodules default to the file key parsed from the source link in `.claude/skills/figma-design-guide/components.md` (currently the MUI Library, `KQjP6W9Uw1PN0iipwQHyYn`); `extract.sh` and `assemble-tokens.sh` are the canonical reference for that lookup.
