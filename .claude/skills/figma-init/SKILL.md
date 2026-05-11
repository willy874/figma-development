---
name: figma-init
description: Pull the full variable values (valuesByMode) of every local Figma variable in the project's design file into `figma.config.json` under the `.variables` block. Reads the target file key from `figma.config.json` itself — no `/tmp/params.json` needed. If `figma.config.json` is missing, runs the `config-init.md` bootstrap first. Use when the user invokes `/figma-init`, or asks to refresh / snapshot variable values into the local config.
---

# figma-init

Pull-into-config workflow for the project's Figma variables.

Resolves the target file key from `figma.config.json`, dumps every local variable collection from that file via chunked `use_figma`, and merges the result into `figma.config.json` under the `.variables` block. This is the **single source of truth** for variable values in the repo — `design-token.md` and skill prose reference token names but **must not** restate hex / px values; readers resolve them via this config.

The model orchestrates the steps and reports a summary. It never inspects, parses, or interprets variable values mid-flight — `dump-variables.js` and `assemble-variables.sh` are the only places data is touched.

## Files in this skill

- `dump-variables.js` — Plugin-API payload (parameterised via `TYPE` / `OFFSET` / `LIMIT` constants the caller prepends) that returns one slice of variable collections or one slice of variable details as compact JSON. Designed to fit under the 20 KB `use_figma` tool-result limit.
- `assemble-variables.sh` — Reads every chunk in `/tmp/figma-init-variables/`, validates offset coverage, and splices the merged `collections[]` into `figma.config.json` under `.variables`.
- `config-init.md` — Identifier-index bootstrap that produces the rest of `figma.config.json` (file/page metadata, `index.componentSetsAndPrimitives`, `index.icons`, `index.componentSpecs`). Run automatically when this skill notices `figma.config.json` is missing.

## Resolving missing parameters

This skill is **config-driven**. There is no `/tmp/params.json`. Before anything else:

1. **Check `figma.config.json` at the repo root.** Read `figma.defaultFileKey` — this is the file to pull from.
2. **If `figma.config.json` is missing** (fresh clone, deleted, etc.): run the `config-init.md` pipeline first to bootstrap the identifier index, then retry step 1.
3. **If `figma.defaultFileKey` is empty** after init: the source `.md` is incomplete. Fix `.claude/skills/figma-design-guide/components.md` (the Source link in `design-token.md` should expose the file key), rerun `config-init.md`, then retry.

Do not hand-edit `figma.config.json`. The identifier sections come from `config-init.md`; the `.variables` section comes from this main flow.

## Procedure

Execute steps verbatim. Run all `use_figma` calls sequentially — never parallelise. Pass `skillNames: "figma-init,figma-use"` and `fileKey` = the resolved `defaultFileKey` on every call.

### Step 0 — Ensure config exists

```bash
test -f figma.config.json || echo "config-missing"
```

If "config-missing": load `config-init.md` and run that pipeline to completion before continuing. Re-check afterwards; if the bootstrap still cannot produce a `defaultFileKey`, surface the error verbatim and stop.

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

The script HTML-decodes every chunk, validates that offsets cover `[0, total)` exactly, maps each variable back to its parent collection by id, and writes the merged result into `figma.config.json`'s top-level `.variables` block. Every other top-level key (`figma`, `sources`, `index`, `version`) is preserved.

### Step 5 — Report

`assemble-variables.sh` prints one summary line, e.g.:

```
figma.config.json .variables: 1 collection, 78 variables
```

Surface that line in the run report.

## Constraints

- **Pull-only, file-scoped.** This skill reads from one Figma file (`defaultFileKey`) and writes to one local file (`figma.config.json`). It does **not** push back to Figma, does **not** mutate any other repo file, and does **not** create new variables on the Figma side.
- **No model interpretation of values.** `dump-variables.js` and `assemble-variables.sh` are the only places data is read. The model never parses, reformats, quotes, or substitutes values mid-flight.
- **Force-overwrite.** The `.variables` block is replaced wholesale every run. Local edits to `.variables` are lost — they belong in Figma, not in the config.
- **All other top-level keys are preserved.** `assemble-variables.sh` round-trips `figma`, `sources`, `index`, and any future top-level field.
- **Sequential `use_figma` calls only.** Never parallelise.
- **Verbatim chunk writes.** Each `use_figma` response must be written exactly as returned — do not parse, re-stringify, re-indent, or strip anything before saving. The assembler expects the literal bytes returned by the tool (it handles HTML-entity decoding internally).
- **Stop on first chunk error.** Do not run the assembler against an incomplete chunk set — it will refuse with `offset gap` / `count mismatch`, but failing fast is better than relying on that.
