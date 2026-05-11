---
name: figma-init
description: Pull the full variable values (valuesByMode) of every local Figma variable in the project's design file into `figma.config.json` under the `.library.variables` block. Reads the target file key from `figma.config.json` itself (`.library.fileKey`) — no `/tmp/params.json` needed. If `figma.config.json` is missing or the `.projects` array is empty, runs the `config-init.md` bootstrap first. Use when the user invokes `/figma-init`, or asks to refresh / snapshot variable values into the local config.
---

# figma-init

Pull-into-config workflow for the project's Figma library variables.

Resolves the target file key from `figma.config.json` (`.library.fileKey`), dumps every local variable collection from that file via chunked `use_figma`, and merges the result into `figma.config.json` under the `.library.variables` block. This is the **single source of truth** for library variable values in the repo — `library-tokens.md` and skill prose reference token names but **must not** restate hex / px values; readers resolve them via this config.

The model orchestrates the steps and reports a summary. It never inspects, parses, or interprets variable values mid-flight — `dump-variables.js` and `assemble-variables.sh` are the only places data is touched.

## Files in this skill

- `dump-variables.js` — Plugin-API payload (parameterised via `TYPE` / `OFFSET` / `LIMIT` constants the caller prepends) that returns one slice of variable collections or one slice of variable details as compact JSON. Designed to fit under the 20 KB `use_figma` tool-result limit.
- `assemble-variables.sh` — Reads every chunk in `/tmp/figma-init-variables/`, validates offset coverage, and splices the merged `collections[]` into `figma.config.json` under `.library.variables`. Top-level `.projects` and every other key are preserved.
- `config-init.md` — Identifier-index bootstrap that produces the rest of `figma.config.json` (`.library.{fileKey, fileUrl, fileName, defaultPageId, defaultPageName, sources, index}` + at least one `.projects[]` entry). Run automatically when this skill notices `figma.config.json` is missing or has no `.projects` entries.

## Resolving missing parameters

This skill is **config-driven**. There is no `/tmp/params.json`. Before anything else:

1. **Check `figma.config.json` at the repo root.** Read `.library.fileKey` — this is the file to pull from.
2. **If `figma.config.json` is missing** (fresh clone, deleted, etc.) **or `.projects` is empty / absent**: run the `config-init.md` pipeline first to bootstrap the identifier index and collect at least one referenced project, then retry step 1.
3. **If `.library.fileKey` is empty** after init: the source `.md` is incomplete. Fix `.claude/skills/figma-create-component/library-components.md` (the Source link in `library-tokens.md` should expose the file key), rerun `config-init.md`, then retry.

Do not hand-edit `figma.config.json`. The identifier sections and projects come from `config-init.md`; the `.library.variables` section comes from this main flow.

## Procedure

Execute steps verbatim. Run all `use_figma` calls sequentially — never parallelise. Pass `skillNames: "figma-init,figma-use"` and `fileKey` = the resolved `.library.fileKey` on every call.

### Step 0 — Ensure config exists and has at least one project

```bash
test -f figma.config.json || echo "config-missing"
jq -e '(.projects // []) | length >= 1' figma.config.json >/dev/null || echo "projects-missing"
```

If "config-missing" or "projects-missing": load `config-init.md` and run that pipeline to completion before continuing. Re-check afterwards; if the bootstrap still cannot produce a `.library.fileKey` and ≥1 `.projects[]` entry, surface the error verbatim and stop.

### Step 1 — Clear chunk staging

```bash
rm -rf /tmp/figma-init-variables && mkdir -p /tmp/figma-init-variables
```

### Step 2 — Get meta

Read `dump-variables.js`. Call `use_figma` with `code` =

```js
const TYPE = "meta"; const OFFSET = 0; const LIMIT = 0;
<body of dump-variables.js>
```

Use the Write tool to save the raw response string to `/tmp/figma-init-variables/meta.json` **verbatim**. The payload lists every collection with its `variableIds` array — sum `totalVariables` across collections to get the global variable count.

### Step 3 — Pull each chunk

Use `LIMIT = 40` for the first slice and follow-up slices covering the remainder. For each `(OFFSET, LIMIT)` pair call `use_figma` with `code` =

```js
const TYPE = "vars"; const OFFSET = <n>; const LIMIT = 40;
<body of dump-variables.js>
```

Save each response **verbatim** to `/tmp/figma-init-variables/vars-<offset>.json` (e.g. `vars-0.json`, `vars-40.json`). Continue until cumulative chunk lengths cover the global total.

### Step 4 — Assemble into config

```bash
.claude/skills/figma-init/assemble-variables.sh
```

The script HTML-decodes every chunk, validates that offsets cover `[0, total)` exactly, maps each variable back to its parent collection by id, and writes the merged result into `figma.config.json`'s `.library.variables` block. Every other top-level / `.library.*` key (`version`, `library.fileKey`, `library.index`, `library.sources`, `projects`, …) is preserved.

### Step 5 — Report

`assemble-variables.sh` prints one summary line, e.g.:

```
figma.config.json .library.variables: 1 collection, 78 variables
```

Surface that line in the run report.

## Constraints

- **Pull-only, library-file-scoped.** This skill reads from one Figma file (`.library.fileKey`) and writes to one local file (`figma.config.json`). It does **not** push back to Figma, does **not** mutate any other repo file, and does **not** create new variables on the Figma side. The `.projects[]` Figma files are recorded for downstream tooling — this skill never reads from them.
- **No model interpretation of values.** `dump-variables.js` and `assemble-variables.sh` are the only places data is read. The model never parses, reformats, quotes, or substitutes values mid-flight.
- **Force-overwrite.** The `.library.variables` block is replaced wholesale every run. Local edits to `.library.variables` are lost — they belong in Figma, not in the config.
- **All other keys are preserved.** `assemble-variables.sh` round-trips `version`, every other field under `.library`, and `.projects`.
- **Sequential `use_figma` calls only.** Never parallelise.
- **Verbatim chunk writes.** Each `use_figma` response must be written exactly as returned — do not parse, re-stringify, re-indent, or strip anything before saving. The assembler expects the literal bytes returned by the tool (it handles HTML-entity decoding internally).
- **Stop on first chunk error.** Do not run the assembler against an incomplete chunk set — it will refuse with `offset gap` / `count mismatch`, but failing fast is better than relying on that.
