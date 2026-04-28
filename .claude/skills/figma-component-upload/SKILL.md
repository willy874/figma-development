---
name: figma-component-upload
description: Bulk-extract every variant of a Figma component set into individual JSON files. Reads parameters from /tmp/component-upload-params.json and writes the run summary to /tmp/component-upload-return.json. Procedural — the model orchestrates use_figma calls but never inspects extracted data. Use when the user invokes /figma-component-upload, or asks to dump / snapshot every variant of a Figma component set into per-variant JSON files with parameters already prepared in /tmp/component-upload-params.json.
---

# figma-component-upload

Snapshot every variant of a Figma component set into per-variant JSON files. The model orchestrates only — parameter validation, JS staging, and file writing happen inside fixed scripts. The model never reads or transforms variant data.

## Files in this skill

- `extract.js` — the use_figma extraction template; `plan.sh` bakes `NODE_ID`, `BATCH_SIZE`, `FILENAME_AXES` into a copy at `/tmp/component-upload-extract.js`. The model reads this staged file once and edits only the `BATCH_INDEX` literal between batches.
- `plan.sh` — validates `/tmp/component-upload-params.json`, creates `outputDir`, initialises `/tmp/component-upload-return.json`, and stages `/tmp/component-upload-extract.js`.
- `write-batch.sh` — writes one JSON file per variant from a use_figma batch response, then updates `/tmp/component-upload-return.json`. Reads from `/tmp/component-upload-batch.json` by default, or stdin when called as `write-batch.sh -`.
- `finalize.sh` — prints the run summary.

## Required input — `/tmp/component-upload-params.json`

Must exist before invocation:

```json
{
  "fileKey": "KQjP6W9Uw1PN0iipwQHyYn",
  "nodeId": "1:4109",
  "outputDir": "src/figma/components/Button",
  "filenameAxes": ["Color", "Variant", "State"],
  "batchSize": 10
}
```

- `fileKey` — Figma file key (from `https://www.figma.com/design/<fileKey>/...`).
- `nodeId` — node id of the component set (`X:Y` or `X-Y`).
- `outputDir` — where per-variant JSON files go (created if missing).
- `filenameAxes` — variant property axes joined by `-` to form filenames. Example: `Size=Medium, Color=Default, Variant=Text, State=Enabled` with `["Color","Variant","State"]` → `Default-Text-Enabled.json`. If omitted/empty, the raw variant name is sanitised to `[A-Za-z0-9_-]`.
- `batchSize` — variants per `use_figma` call. **Default `10`**. Each `use_figma` result truncates near 20KB, so deeply nested designs may need a lower value (try `5`); flat designs can sometimes go higher (`12-15`).

`plan.sh` validates this file. If it is missing, malformed, or any required field is empty, `plan.sh` prints `ERROR: <reason>` to stdout and exits non-zero. Surface that error to the user verbatim and stop.

## Generated output — `/tmp/component-upload-return.json`

Written incrementally by `plan.sh` and `write-batch.sh`. Final shape:

```json
{
  "fileKey": "...",
  "nodeId": "1:4109",
  "outputDir": "src/figma/components/Button",
  "totalVariants": 90,
  "batchesCompleted": 9,
  "filesWritten": ["Default-Text-Enabled.json", "..."],
  "errors": []
}
```

## Procedure

Execute steps verbatim. Do not open or read variant data from any batch payload, the `use_figma` response, or any written file. Your role: stage the script, dispatch each batch, repeat.

### Step 1 — plan

```bash
.claude/skills/figma-component-upload/plan.sh
```

`plan.sh` validates params, creates `outputDir`, seeds the return file, and stages `/tmp/component-upload-extract.js`. Stdout:

```
fileKey=<value>
nodeId=<value>
outputDir=<value>
batchSize=<value>
extractPath=/tmp/component-upload-extract.js
```

If any line begins with `ERROR:` or the script exits non-zero, abort and surface the message.

### Step 2 — load the extract script ONCE

```
Read /tmp/component-upload-extract.js
```

Keep this file in conversation context for the loop. The first line is `const BATCH_INDEX = 0;` — that literal is the only thing that changes between batches. Everything else (NODE_ID, BATCH_SIZE, FILENAME_AXES, helpers, extraction logic) is already baked in.

### Step 3 — extract each batch

For `BATCH_INDEX = 0, 1, 2, …`:

1. Call `use_figma` with:
   - `fileKey` from `/tmp/component-upload-params.json`
   - `skillNames: "figma-component-upload,figma-use"`
   - `code` = the staged script with the first line changed to `const BATCH_INDEX = <N>;` (everything else verbatim)

   The script returns:
   ```
   { batchIndex: number, total: number, count: number, done: boolean, files: { "<filename>": <node>, ... } }
   ```

2. Persist the response without inspecting it. Pipe directly via stdin (no intermediate file):
   ```bash
   printf '%s' '{ …the use_figma response, single-line JSON, verbatim… }' \
     | .claude/skills/figma-component-upload/write-batch.sh -
   ```
   Single-quoted printf protects every byte; the response is single-line JSON so no escaping is needed unless it contains a literal `'` (Figma node payloads do not).

   If you prefer the heredoc-to-file form (e.g. when shell quoting is fragile), it still works:
   ```bash
   cat > /tmp/component-upload-batch.json << 'COMPONENT_UPLOAD_EOF'
   { …the use_figma response, verbatim, on a single line… }
   COMPONENT_UPLOAD_EOF
   .claude/skills/figma-component-upload/write-batch.sh
   ```
   The marker `COMPONENT_UPLOAD_EOF` is reserved for this skill and will not appear inside the response.

3. If `done == true` in the response, stop. Otherwise increment `BATCH_INDEX` and repeat.

Run `use_figma` calls **sequentially**. Never parallelise.

### Step 4 — finalize

```bash
.claude/skills/figma-component-upload/finalize.sh
```

Prints the run summary. Surface its output to the user.

## Constraints

- **Force-overwrite.** Existing files in `outputDir` are overwritten without prompting.
- **No model interpretation of values.** `extract.js` and `write-batch.sh` are the only places extracted data is read. Do not parse, reformat, quote, or substitute any variant property in conversation.
- **Sequential `use_figma` calls only.** Never parallelise.
- **Tune `batchSize` to fit the ~20KB tool-result truncation.** Default `10` works for Button-shaped components (~3KB/variant). Drop to `5` for deeply nested designs; raise cautiously when variants are flat.
- **Per-batch payload is fixed by data size.** The dominant cost is relaying each variant's JSON through the model; reducing `batchSize` does not change total bytes, only round-trip count.
