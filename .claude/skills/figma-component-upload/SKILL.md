---
name: figma-component-upload
description: Bulk-extract every variant of a Figma component set into individual JSON files. Reads parameters from /tmp/component-upload-params.json and writes the run summary to /tmp/component-upload-return.json. Procedural — the model orchestrates use_figma calls but never inspects extracted data. Use when the user invokes /figma-component-upload, or asks to dump / snapshot every variant of a Figma component set into per-variant JSON files with parameters already prepared in /tmp/component-upload-params.json.
---

# figma-component-upload

Snapshot every variant of a Figma component set into per-variant JSON files. The model orchestrates only — parameter validation, batch slicing, JS rendering, and file writing happen inside fixed scripts. The model never reads or transforms variant data.

## Files in this skill

- `plan.sh` — validates `/tmp/component-upload-params.json`, creates `outputDir`, initialises `/tmp/component-upload-return.json`
- `render-batch.sh <batch-index>` — prints the ready-to-execute use_figma JavaScript for that batch (the JS template is embedded as a heredoc)
- `write-batch.sh` — reads `/tmp/component-upload-batch.json` (the use_figma response written by the model) and writes one file per variant, then updates `/tmp/component-upload-return.json`
- `finalize.sh` — prints the run summary

## Required input — `/tmp/component-upload-params.json`

Must exist before invocation:

```json
{
  "fileKey": "KQjP6W9Uw1PN0iipwQHyYn",
  "nodeId": "1:4109",
  "outputDir": "src/figma/components/Button",
  "filenameAxes": ["Color", "Variant", "State"],
  "batchSize": 5
}
```

- `fileKey` — Figma file key (from `https://www.figma.com/design/<fileKey>/...`)
- `nodeId` — node id of the component set (`X:Y` or `X-Y`)
- `outputDir` — where per-variant JSON files go (created if missing)
- `filenameAxes` — list of variant property axes to use as the filename (joined by `-`). Example: variant `Size=Medium, Color=Default, Variant=Text, State=Enabled` with `["Color","Variant","State"]` → `Default-Text-Enabled.json`. If omitted or empty, the raw variant name is sanitised to `[A-Za-z0-9_-]`.
- `batchSize` — number of variants per `use_figma` call. Default `5`; must stay small to fit the ~20KB tool-result truncation.

`plan.sh` validates this file. If it is missing, malformed, or any required field is empty, `plan.sh` prints `ERROR: <reason>` to stdout and exits non-zero. Surface that error to the user verbatim and stop.

## Generated output — `/tmp/component-upload-return.json`

Written incrementally by `plan.sh` and `write-batch.sh`. Final shape:

```json
{
  "fileKey": "...",
  "nodeId": "1:4109",
  "outputDir": "src/figma/components/Button",
  "totalVariants": 90,
  "batchesCompleted": 18,
  "filesWritten": ["Default-Text-Enabled.json", "..."],
  "errors": []
}
```

## Procedure

Execute steps verbatim. Do not open or read variant data from any batch payload, the `use_figma` response, or any written file. Your role: run the scripts, relay the `use_figma` response back through `write-batch.sh`, repeat.

### Step 1 — plan

Run the planner (requires `jq`, `bash`, and `node`):

```bash
.claude/skills/figma-component-upload/plan.sh
```

`plan.sh` validates `/tmp/component-upload-params.json`, creates `outputDir`, and seeds `/tmp/component-upload-return.json`. On stdout it prints:

```
fileKey=<value>
nodeId=<value>
outputDir=<value>
batchSize=<value>
```

If any stdout line begins with `ERROR:` or the script exits non-zero, abort and surface the message.

### Step 2 — extract each batch

For `BATCH_INDEX = 0, 1, 2, …`:

1. Render the script for this batch:
   ```bash
   .claude/skills/figma-component-upload/render-batch.sh <BATCH_INDEX>
   ```
   Capture stdout. This is the ready-to-execute JavaScript.

2. Call `use_figma` with:
   - `fileKey` from `/tmp/component-upload-params.json`
   - `skillNames: "figma-component-upload,figma-use"`
   - `code` = the captured stdout (verbatim, do not modify)

   The script returns an object of shape:
   ```
   { batchIndex: number, total: number, count: number, done: boolean, files: { "<filename>": <node>, ... } }
   ```

3. Persist the response without inspecting it. Write the entire returned JSON object to `/tmp/component-upload-batch.json` via a quoted heredoc:
   ```bash
   cat > /tmp/component-upload-batch.json << 'COMPONENT_UPLOAD_EOF'
   { …the use_figma response, verbatim, on a single line… }
   COMPONENT_UPLOAD_EOF
   ```
   Use that exact heredoc marker — it is reserved for this skill and will not appear inside the response.

4. Run the writer:
   ```bash
   .claude/skills/figma-component-upload/write-batch.sh
   ```
   It reads `/tmp/component-upload-batch.json`, writes one JSON file per entry into `outputDir`, and updates `/tmp/component-upload-return.json`.

5. If `done == true` in the response, stop. Otherwise increment `BATCH_INDEX` and repeat.

Run `use_figma` calls **sequentially**. Never parallelise.

### Step 3 — finalize

```bash
.claude/skills/figma-component-upload/finalize.sh
```

Prints the run summary from `/tmp/component-upload-return.json`. Surface its output to the user.

## Constraints

- **Force-overwrite.** Existing files in `outputDir` are overwritten without prompting.
- **No model interpretation of values.** `render-batch.sh` and `write-batch.sh` are the only places extracted data is read. Do not parse, reformat, quote, or substitute any variant property in conversation.
- **Heredoc relay.** The `use_figma` response is relayed to `write-batch.sh` via `/tmp/component-upload-batch.json` written from a quoted heredoc. The model neither summarises nor transforms it.
- **Sequential `use_figma` calls only.** Never parallelise.
- **The extraction template lives inside `render-batch.sh`** (in a quoted heredoc). All edits to the `use_figma` JavaScript happen there; the placeholder lines `__NODE_ID_PLACEHOLDER__`, `__BATCH_INDEX_PLACEHOLDER__`, `__BATCH_SIZE_PLACEHOLDER__`, and `__FILENAME_AXES_PLACEHOLDER__` must remain on their own line.
- **`batchSize` upper bound.** A single `use_figma` result truncates near 20KB. The default `5` fits Button-shaped components; deeply nested designs may need a lower value.
