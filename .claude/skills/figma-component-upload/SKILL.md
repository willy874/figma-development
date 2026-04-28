---
name: figma-component-upload
description: Bulk-extract every variant of a Figma component set into individual JSON files via the Figma REST API. Reads parameters from /tmp/component-upload-params.json and writes the run summary to /tmp/component-upload-return.json. Single-shot — does NOT use MCP / use_figma; needs FIGMA_TOKEN. Use when the user invokes /figma-component-upload, or asks to dump / snapshot every variant of a Figma component set into per-variant JSON files with parameters already prepared in /tmp/component-upload-params.json.
---

# figma-component-upload

Snapshot every variant of a Figma component set into per-variant JSON files. **Uses the Figma REST API directly** — does not call `use_figma` or any MCP tool. The model orchestrates one shell script; data never passes through the model context.

## Files in this skill

- `extract.sh` — fetches the component set via REST, writes one JSON file per variant into `outputDir`, and updates the run summary. Requires `jq`, `curl`, `node`.

## Required input — `/tmp/component-upload-params.json`

Must exist before invocation:

```json
{
  "fileKey": "KQjP6W9Uw1PN0iipwQHyYn",
  "nodeId": "1:4109",
  "outputDir": "src/figma/components/Button",
  "filenameAxes": ["Color", "Variant", "State"]
}
```

- `fileKey` — Figma file key (from `https://www.figma.com/design/<fileKey>/...`).
- `nodeId` — node id of the component set (`X:Y` or `X-Y`; normalised to `X:Y`).
- `outputDir` — where per-variant JSON files go (created if missing).
- `filenameAxes` — variant property axes joined by `-` to form filenames. Example: `Size=Medium, Color=Default, Variant=Text, State=Enabled` with `["Color","Variant","State"]` → `Default-Text-Enabled.json`. If omitted/empty, the raw variant name is sanitised to `[A-Za-z0-9_-]`.

> `batchSize` is no longer needed — the REST API returns the entire component set in one response.

## Required env — `FIGMA_TOKEN`

Personal access token. Generate one at <https://www.figma.com/developers/api#access-tokens>. The script reads it from any of these (first match wins):

1. `FIGMA_TOKEN` env var in the running shell
2. `.env` in CWD (one line: `FIGMA_TOKEN=<your-token>`)
3. `.env` at project root (resolved relative to this skill)

`.env` MUST be gitignored — verify with `git check-ignore .env`. The script fails fast with a clear message if no token can be resolved.

## Generated output — `/tmp/component-upload-return.json`

Final shape:

```json
{
  "fileKey": "...",
  "nodeId": "1:4109",
  "outputDir": "src/figma/components/Button",
  "totalVariants": 90,
  "filesWritten": ["Default-Text-Enabled.json", "..."],
  "errors": []
}
```

## Procedure

Single step:

```bash
.claude/skills/figma-component-upload/extract.sh
```

Surface the printed summary to the user. If the script exits non-zero, surface the `ERROR: ...` message verbatim and stop.

## Constraints

- **Force-overwrite.** Existing files in `outputDir` are overwritten without prompting.
- **No model interpretation of values.** Variant data flows REST → script → filesystem. The model never reads variant payloads.
- **Schema is Figma REST format**, not Plugin API format. Field names differ (`absoluteBoundingBox` instead of `x/y/width/height`, `rectangleCornerRadii` array instead of `topLeftRadius`/etc., `style` object instead of flat `fontSize/fontName/...`, `componentId` on instances instead of `mainComponentId`). If you need Plugin-API-shaped output, transform downstream — this skill writes raw REST node JSON.
- **Read-only.** This skill never writes back to Figma. It only fetches.
