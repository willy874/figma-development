---
name: figma-component-sync
description: Two-way snapshot bridge between the project's Figma library and the repo. Acts as a router — on entry it asks 下載 (Figma → repo) or 上傳 (repo → Figma), then loads the matching submodule. Download covers component variants (via REST shell script) plus `src/figma/styles.json` + `src/figma/variables.json` (via chunked `use_figma` + `assemble-tokens.sh`). Upload is a forward-looking stub; variable upload already lives in the standalone `figma-init` skill. Use when the user invokes `/figma-component-sync`, asks to dump / snapshot Figma library data into local files, or asks to push a local snapshot back to Figma.
---

# figma-component-sync

Snapshot-and-sync the project's Figma library. Two directions:

- **下載** (Figma → repo) — implemented. See [download.md](download.md).
- **上傳** (repo → Figma) — forward-looking stub. See [upload.md](upload.md).

The model **must** ask the operator which direction is intended before doing anything else, then read the matching submodule and follow its procedure verbatim.

## Files in this skill

- `SKILL.md` — this router. Asks 下載/上傳 and loads the matching submodule.
- `download.md` — Figma → repo. Components via REST shell script, styles/variables via chunked `use_figma` + assembler.
- `upload.md` — repo → Figma. Currently a stub; points at `figma-init` for variable upload and lists what is not yet implemented.
- `extract.sh`, `dump-styles.js`, `dump-variables.js`, `assemble-tokens.sh` — download-side scripts. See `download.md` for usage.

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

- **Force-overwrite.** Neither side prompts before clobbering existing data — `download.md` overwrites local files, `upload.md` (when implemented) overwrites Figma values.
- **No model interpretation of values.** Data flows through fixed scripts. The model orchestrates the steps and reports the rolled-up summary; it never edits, reformats, or substitutes values mid-flight.
- **Don't mix directions in one run.** Never run upload as a "fix" for a failed download (or vice versa). If a sync goes wrong, fix it on the side that owns the bug — re-run the same direction with the corrected inputs.
- **`fileKey` resolution is shared.** Both submodules default to the file key parsed from the source link in `.claude/skills/figma-design-guide/components.md` (currently the MUI Library, `KQjP6W9Uw1PN0iipwQHyYn`); `extract.sh` and `assemble-tokens.sh` are the canonical reference for that lookup.
