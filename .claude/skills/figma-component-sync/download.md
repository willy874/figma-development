# figma-component-sync · 下載 (Figma → repo)

Pulls the project's Figma library into the repo. Two mechanisms:

- **Component variants** — fetched via Figma REST API by `extract.sh`, written one JSON file per variant under `src/figma/components/<componentName>/`. Variant data never passes through the model context.
- **Styles & variables** — extracted via `use_figma` (Plugin API) in **chunks** small enough to clear the 20KB tool-result truncation, then assembled on disk by `assemble-tokens.sh`. The assembler also HTML-decodes any `&lt;`/`&gt;`/`&amp;` baked in by the tool plumbing and patches the canonical `fileKey`/`fileName` (the use_figma sandbox returns `figma.fileKey="headless"` and `figma.root.name="Document"` — both useless). The REST `/v1/files/<key>/variables/local` endpoint requires Enterprise `file_variables:read` scope, so chunked `use_figma` is the universally available path.

## Interactive entry

After the parent SKILL.md routed you here, call `AskUserQuestion` again with **three options, no multi-select**:

| label                              | description                                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `全部同步下載`                     | Refresh `src/figma/styles.json` + `src/figma/variables.json`, then iterate every `SET (N)` row in `.claude/skills/figma-design-guide/components.md` and download each component set. |
| `自填指定 Component Name`          | Operator provides a single `componentName`; download only that component. Tokens are NOT touched.                    |
| `只同步 Styles + Variables`        | Refresh `src/figma/styles.json` + `src/figma/variables.json` only. No component sync.                                |

Then branch on the answer.

### Branch A — `全部同步下載`

1. Run [Token sync](#token-sync) to refresh `src/figma/styles.json` and `src/figma/variables.json`.
2. Parse `.claude/skills/figma-design-guide/components.md` for every row whose Notes column contains `SET (` — these are the component sets with variants.
3. For each row, extract the bare component name (drop angle brackets and backticks from the first cell).
4. For each name, write `{ "componentName": "<name>" }` to `/tmp/component-sync-params.json` and run `extract.sh`. `filenameAxes` is intentionally omitted for batch mode — the script falls back to sanitised variant names.
5. Aggregate per-component summaries and surface a single rolled-up report (one line for token sync; then one line per component: name, totalVariants, outputDir). If any step fails, continue with the rest and list failures at the end.

> **Rate limit.** The Figma REST API rate-limits PATs aggressively. The current cap kicks in around the 19th–20th sequential call to `/v1/files/<key>/nodes` and returns HTTP 429. When looping all 28 component sets, **insert a `sleep 10` between iterations** to stay under it. If a 429 still slips through, isolate the failures, wait ≥60 s, and retry that subset with the same spacing.

### Branch B — `自填指定 Component Name`

1. The operator's `componentName` arrives either as the option's free-text follow-up or via the auto-provided `Other` field. If neither contains a name, ask a follow-up `AskUserQuestion` with a single free-text-style question (two placeholder options plus the implicit `Other`) until you have a non-empty name.
2. Optionally ask for `filenameAxes` if the spec is known to need them; otherwise omit and let sanitisation handle it.
3. Write `{ "componentName": "<name>", ...optional filenameAxes }` to `/tmp/component-sync-params.json` and run `extract.sh` once.

Token sync is **not** performed in this branch.

### Branch C — `只同步 Styles + Variables`

Run [Token sync](#token-sync) only. No component work.

If the operator already prepared `/tmp/component-sync-params.json` themselves (non-interactive entry from the parent router), skip this `AskUserQuestion` too, run `extract.sh` directly for the component, and skip token sync unless the operator explicitly asked for it.

## Component sync — `extract.sh`

### Required input — `/tmp/component-sync-params.json`

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

### Required env — `FIGMA_TOKEN`

Personal access token. Generate one at <https://www.figma.com/developers/api#access-tokens>. The script reads it from any of these (first match wins):

1. `FIGMA_TOKEN` env var in the running shell
2. `.env` in CWD (one line: `FIGMA_TOKEN=<your-token>`)
3. `.env` at project root (resolved relative to this skill)

`.env` MUST be gitignored — verify with `git check-ignore .env`. The script fails fast with a clear message if no token can be resolved.

### Generated output — `/tmp/component-sync-return.json`

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

### How to run

```bash
.claude/skills/figma-component-sync/extract.sh
```

If `extract.sh` exits non-zero in single-shot mode, surface the `ERROR: ...` message verbatim and stop. In batch mode, record the failure, continue with the remaining components, and include a failure list in the rolled-up report.

## Token sync

This step refreshes the two snapshot files that pin the project's design tokens:

- `src/figma/styles.json` — text + effect + paint + grid styles
- `src/figma/variables.json` — variable collections + variables

> **Why chunked?** A single `use_figma` tool result is hard-truncated at 20KB. The pretty-printed `styles.json` and `variables.json` are well over that. Each chunk uses **compact JSON (no indent)** to leave headroom — empirically all 28 text styles, all 24 effect styles, and the first 40/last 38 variables each fit in a single chunk. The model also receives the result HTML-entity-encoded (`<` → `&lt;`), so chunks are decoded by `assemble-tokens.sh` before being merged.

> **Prerequisite.** `use_figma` requires the `figma-use` skill to be loaded first. Load it before the first call.

### Resolving `fileKey`

Default to the file key parsed from the source link in `.claude/skills/figma-design-guide/components.md` (currently `KQjP6W9Uw1PN0iipwQHyYn`, the MUI Library). Override only when the operator explicitly targets a different file. The `extract.sh` and `assemble-tokens.sh` shell logic for parsing this key is the canonical reference.

### Procedure — Styles

1. **Clear the chunk staging dir** (idempotent — clobber any leftovers):
   ```bash
   rm -rf /tmp/figma-token-sync/styles && mkdir -p /tmp/figma-token-sync/styles
   ```
2. **Get counts.** Read `dump-styles.js` and call `use_figma` with `code` =
   ```js
   const TYPE = "counts"; const OFFSET = 0; const LIMIT = 0;
   <body of dump-styles.js>
   ```
   Use the Write tool to save the raw response string to `/tmp/figma-token-sync/styles/counts.json`. The response is a compact JSON string like `{"paint":0,"text":28,"effect":24,"grid":0}` — write it **verbatim**, do not re-format.
3. **Plan chunks.** Empirically:
   - `text`: a single `LIMIT = 28` slice fits (~14 KB compact).
   - `effect`: a single `LIMIT = 24` slice fits (~17 KB compact).
   - `paint` / `grid`: skip entirely when count is `0`.
   Start with one big slice per type; if a future run reports truncation, halve the `LIMIT` and split.
4. **Pull each chunk.** For each `(TYPE, OFFSET, LIMIT)` triple, call `use_figma` with the prepended constants + the body of `dump-styles.js`. Save each response **verbatim** to `/tmp/figma-token-sync/styles/<type>-<offset>.json` (e.g. `text-0.json`, `effect-0.json`). The chunk filename is what the assembler uses to order slices.
5. **Assemble.** Run:
   ```bash
   .claude/skills/figma-component-sync/assemble-tokens.sh styles
   ```
   The script HTML-decodes every chunk, validates that offsets cover `[0, total)` exactly, fetches the canonical `fileName` via REST, and writes `src/figma/styles.json`.

### Procedure — Variables

1. **Clear the staging dir:**
   ```bash
   rm -rf /tmp/figma-token-sync/variables && mkdir -p /tmp/figma-token-sync/variables
   ```
2. **Get meta.** Call `use_figma` with `code` =
   ```js
   const TYPE = "meta"; const OFFSET = 0; const LIMIT = 0;
   <body of dump-variables.js>
   ```
   Write the response to `/tmp/figma-token-sync/variables/meta.json`. The payload lists every collection with its `variableIds` array — sum `totalVariables` across collections to get the global variable count.
3. **Pull each chunk.** Use `LIMIT = 40` for the first slice and a follow-up slice covering the remainder (empirically the merak collection's 78 vars split cleanly into 40 + 38). Call `use_figma` with `TYPE = "vars"` and stepping `OFFSET` from `0` until you've covered the global total. Save each response to `/tmp/figma-token-sync/variables/vars-<offset>.json`.
4. **Assemble.**
   ```bash
   .claude/skills/figma-component-sync/assemble-tokens.sh variables
   ```
   The assembler maps each variable back to its parent collection by id and writes `src/figma/variables.json`.

### Constraints on `use_figma` calls

- Pass `skillNames: "figma-component-sync,figma-use"` and `fileKey` (the resolved key) on every call.
- Run calls **sequentially**. Never parallelise.
- Each chunk response must be written **verbatim** — do not parse, re-stringify, re-indent, or strip anything before saving. The assembler expects the literal bytes returned by the tool.
- If any `use_figma` call fails, surface the error and stop the token sync. Do **not** run the assembler against an incomplete chunk set — it will refuse with a `chunk … offset gap` or count-mismatch error, but failing fast is better than relying on that.

### Reporting

`assemble-tokens.sh` prints one summary line per snapshot, e.g.:

```
src/figma/styles.json:    28 text styles, 24 effect styles, 0 paint, 0 grid
src/figma/variables.json: 1 collection, 78 variables
```

Surface that line in the run report.

## Direction-specific constraints

- **Lookup is best-effort.** When `nodeId` is omitted, the script greps `.claude/skills/figma-design-guide/components.md` for a row whose first cell equals `<componentName>`. If the component is not in the index, the script fails with a clear message and the operator must pass `nodeId` explicitly (or add the component to the index).
- **Schema is REST format for components, Plugin API format for tokens.** Field names differ between the two; do not transform either side here. If you need cross-format output, transform downstream — this skill writes raw payloads.
- **Read-only against Figma.** Download never writes back to Figma — only fetches. Anything that needs to mutate the Figma file belongs in `upload.md`.
