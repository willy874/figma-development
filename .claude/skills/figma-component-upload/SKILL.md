---
name: figma-component-upload
description: Bulk-extract every variant of a Figma component set into individual JSON files via the Figma REST API. Reads parameters from /tmp/component-upload-params.json and writes the run summary to /tmp/component-upload-return.json. Single-shot — does NOT use MCP / use_figma; needs FIGMA_TOKEN. Use when the user invokes /figma-component-upload, or asks to dump / snapshot every variant of a Figma component set into per-variant JSON files with parameters already prepared in /tmp/component-upload-params.json.
---

# figma-component-upload

Snapshot every variant of a Figma component set into per-variant JSON files. **Uses the Figma REST API directly** — does not call `use_figma` or any MCP tool. The model orchestrates one shell script; data never passes through the model context.

## Files in this skill

- `extract.sh` — fetches the component set via REST, writes one JSON file per variant into `outputDir`, and updates the run summary. Requires `jq`, `curl`, `node`.

## Interactive entry — when invoked via `/figma-component-upload`

When the operator invokes this skill via the slash command (or otherwise without a fresh `/tmp/component-upload-params.json`), **do not run `extract.sh` immediately**. First call `AskUserQuestion` with a single question, **two options, no multi-select**:

| label                          | description                                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `全部同步下載`                 | Iterate every `SET (N)` row in `.claude/skills/figma-design-guide/components.md` and download each.  |
| `自填指定 Component Name`      | Operator provides a single `componentName`; download only that component.                            |

Then branch on the answer:

### Branch A — `全部同步下載`

1. Parse `.claude/skills/figma-design-guide/components.md` for every row whose Notes column contains `SET (` — these are the component sets with variants.
2. For each row, extract the bare component name (drop angle brackets and backticks from the first cell).
3. For each name, write `{ "componentName": "<name>" }` to `/tmp/component-upload-params.json` and run `extract.sh`. `filenameAxes` is intentionally omitted for batch mode — the script falls back to sanitised variant names.
4. Aggregate per-component summaries and surface a single rolled-up report (one line per component: name, totalVariants, outputDir). If any component fails, continue with the rest and list failures at the end.

### Branch B — `自填指定 Component Name`

1. The operator's `componentName` arrives either as the option's free-text follow-up or via the auto-provided `Other` field. If neither contains a name, ask a follow-up `AskUserQuestion` with a single free-text-style question (two placeholder options plus the implicit `Other`) until you have a non-empty name.
2. Optionally ask for `filenameAxes` if the spec is known to need them; otherwise omit and let sanitisation handle it.
3. Write `{ "componentName": "<name>", ...optional filenameAxes }` to `/tmp/component-upload-params.json` and run `extract.sh` once.

If the operator already prepared `/tmp/component-upload-params.json` themselves (non-interactive entry), skip `AskUserQuestion` and run `extract.sh` directly.

## Required input — `/tmp/component-upload-params.json`

Must exist before each `extract.sh` invocation. Only `componentName` is required; everything else is derived.

```json
{
  "componentName": "Chip",
  "filenameAxes": ["Color", "Variant", "State"]
}
```

- `componentName` (**required**) — name as it appears in `.claude/skills/figma-design-guide/components.md`, without angle brackets. Drives `outputDir`, `nodeId`, and (when omitted) `fileKey` defaults.
- `fileKey` (optional) — Figma file key. Defaults to the file key parsed from the source link in `components.md` (currently the project's MUI Library, `KQjP6W9Uw1PN0iipwQHyYn`). Override only when extracting from a different file.
- `nodeId` (optional) — node id of the component set (`X:Y` or `X-Y`; normalised to `X:Y`). Defaults to the Node ID looked up by `componentName` in the `components.md` table. Override when the component is not yet in the index, or when you want to target a different node.
- `outputDir` (optional) — where per-variant JSON files go (created if missing). Defaults to `src/figma/components/<componentName>`.
- `filenameAxes` (optional) — variant property axes joined by `-` to form filenames. Example: `Size=Medium, Color=Default, Variant=Text, State=Enabled` with `["Color","Variant","State"]` → `Default-Text-Enabled.json`. If omitted/empty, the raw variant name is sanitised to `[A-Za-z0-9_-]`.

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
  "componentName": "Chip",
  "fileKey": "KQjP6W9Uw1PN0iipwQHyYn",
  "nodeId": "1:4109",
  "outputDir": "src/figma/components/Chip",
  "totalVariants": 90,
  "filesWritten": ["Default-Text-Enabled.json", "..."],
  "errors": []
}
```

## Procedure

- **Interactive entry (slash command).** Follow the [Interactive entry](#interactive-entry--when-invoked-via-figma-component-upload) section: call `AskUserQuestion`, branch on the answer, and run `extract.sh` once per chosen component (looping in batch mode).
- **Direct entry.** When `/tmp/component-upload-params.json` is already prepared by the operator, skip the question and run `extract.sh` once:

```bash
.claude/skills/figma-component-upload/extract.sh
```

In every case, surface the printed summary to the user. If `extract.sh` exits non-zero in single-shot mode, surface the `ERROR: ...` message verbatim and stop. In batch mode, record the failure, continue with the remaining components, and include a failure list in the rolled-up report.

## Constraints

- **Force-overwrite.** Existing files in `outputDir` are overwritten without prompting.
- **No model interpretation of values.** Variant data flows REST → script → filesystem. The model never reads variant payloads.
- **Lookup is best-effort.** When `nodeId` is omitted, the script greps `.claude/skills/figma-design-guide/components.md` for a row whose first cell equals `<componentName>`. If the component is not in the index, the script fails with a clear message and the operator must pass `nodeId` explicitly (or add the component to the index).
- **Schema is Figma REST format**, not Plugin API format. Field names differ (`absoluteBoundingBox` instead of `x/y/width/height`, `rectangleCornerRadii` array instead of `topLeftRadius`/etc., `style` object instead of flat `fontSize/fontName/...`, `componentId` on instances instead of `mainComponentId`). If you need Plugin-API-shaped output, transform downstream — this skill writes raw REST node JSON.
- **Read-only.** This skill never writes back to Figma. It only fetches.
