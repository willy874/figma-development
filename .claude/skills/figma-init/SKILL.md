---
name: figma-init
description: Force-overwrite every variable value in a target Figma file from a JSON snapshot. Reads parameters from /tmp/params.json. Procedural — the upload pipeline does not let the model inspect, interpret, or merge values; every key is overwritten as-is. Use when the user invokes /figma-init, or asks to upload / sync a variables.json snapshot into a Figma file with parameters already prepared in /tmp/params.json.
---

# figma-init

Bulk-overwrite Figma variables from a JSON snapshot. The model orchestrates only — parameter validation, packing, chunk-splitting, and JS rendering all happen inside fixed scripts. The model never reads or substitutes variable data.

## Files in this skill

- `pack.sh` — reads `/tmp/params.json` + the variables JSON, writes one or more pack files per collection, prints a manifest
- `render.sh` — given `<collection-name> <pack-path>`, prints the ready-to-execute use_figma JavaScript on stdout. The JS template is embedded in this file as a heredoc; edit the JS body there when changing upload semantics.

## Required input — `/tmp/params.json`

Must exist before invocation:

```json
{
  "fileKey": "stse2CgIzOugynEdDSexS4",
  "variablesPath": "src/variables.json"
}
```

- `fileKey` — target Figma file key (from `https://www.figma.com/design/<fileKey>/...`)
- `variablesPath` — path to the JSON snapshot (absolute or relative to repo root)

`pack.sh` validates this file. If it is missing, malformed, or any field is empty, `pack.sh` prints `ERROR: <reason>` to stdout and exits non-zero. Surface that error to the user verbatim and stop.

## Procedure

Execute steps verbatim. Do not open or read variable values from `variables.json`, any pack file, or any rendered JS. Your role: run the scripts, feed each manifest line through `use_figma`, aggregate results.

### Step 1 — pack

Run the packer (requires `jq` and `bash`):

```bash
.claude/skills/figma-init/pack.sh
```

`pack.sh` reads `/tmp/params.json`, packs each collection, and auto-splits any pack that would exceed the `use_figma` 50000-character code limit. Each line of stdout is a manifest entry (TAB-separated):

```
<collection-name>\t<pack-path>\t<entry-count>
```

A single collection may appear on multiple manifest lines if it was split (`<safe-name>-part0.json`, `<safe-name>-part1.json`, …).

If any stdout line begins with `ERROR:` or the script exits non-zero, abort and surface the message.

### Step 2 — render and upload each manifest entry

For every manifest line, in order:

1. Run the renderer:
   ```bash
   .claude/skills/figma-init/render.sh "<collection-name>" "<pack-path>"
   ```
   Capture stdout. This is the ready-to-execute JavaScript for that pack — the embedded template with the pack JSON content and the JSON-encoded collection name spliced in.
2. Call `use_figma` with:
   - `fileKey` from `/tmp/params.json`
   - `skillNames: "figma-init,figma-use"`
   - `code` = the captured stdout (verbatim, do not modify)

Run calls **sequentially**. Never parallelise.

If `render.sh` exits non-zero, abort and surface its stderr.

The `use_figma` script returns an object of shape:

```
{ collection: string, attempted: number, writtenCount: number, errorCount: number, errors: object[], mutatedNodeIds: string[] }
```

### Step 3 — report

Aggregate `attempted`, `writtenCount`, `errorCount` across every `use_figma` call. Multiple sub-pack calls for the same collection collapse into one row by summing the three counters. Print one row per collection plus a total, e.g.:

```
<collection-a>: <attempted> attempted, <written> written, <errors> errors
<collection-b>: <attempted> attempted, <written> written, <errors> errors
total:          <attempted> attempted, <written> written, <errors> errors
```

If any collection has errors, print up to the first 10 error entries from that collection.

## Constraints

- **Force-overwrite only.** Do not diff, merge, skip "matching" values, or ask whether to proceed. Every key in the JSON gets written.
- **No model interpretation of values.** `pack.sh` and `render.sh` are the only places data is read. Do not parse, reformat, quote, or substitute values from `variables.json`, any pack file, or any rendered JS in conversation.
- **Variables in JSON missing from Figma** are reported as errors. Do not create them.
- **Variables in Figma absent from JSON** are left untouched.
- **Only `valuesByMode` is written.** `scopes`, `codeSyntax`, `description`, and `name` are ignored.
- **Multi-mode is supported**: every mode present in the JSON for a variable is written to the matching mode (by name) in Figma.
- **Sequential `use_figma` calls only.** Never parallelise.
- **The upload template lives inside `render.sh`** (in a quoted heredoc). All edits to the use_figma JavaScript happen there; placeholder lines `__PACK_PLACEHOLDER__` and `__COLL_PLACEHOLDER__` must remain on their own line.
