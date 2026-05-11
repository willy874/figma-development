# figma-component-sync · 上傳 · Styles

Upsert local text / effect / paint / grid styles from `src/figma/styles.json` into a target Figma file. Same orchestration shape as `figma-init`: `pack-styles.sh` → manifest → `render-styles.sh` → `use_figma`.

**Upsert semantics.** Styles in the JSON but missing from Figma are **created** by name; styles present in both are overwritten; styles in Figma but absent from the JSON are left untouched. No diffing, no deletion.

## Required input — `/tmp/component-sync-upload-params.json`

```json
{
  "target": "styles",
  "fileKey": "<target-file-key>",
  "stylesPath": "src/figma/styles.json",
  "types": ["text", "effect"]
}
```

- `target` — must be `"styles"`. The router uses this to dispatch here.
- `fileKey` — target Figma file key.
- `stylesPath` — path to the snapshot, absolute or relative to repo root.
- `types` (optional) — subset of `["text", "effect", "paint", "grid"]`. Omit to default to every type whose count > 0 in the snapshot's `counts` object.

`pack-styles.sh` validates this file. Any missing or empty field → `ERROR: <reason>` and non-zero exit. Surface verbatim and stop.

## Procedure

### Step 1 — pack

```bash
.claude/skills/figma-component-sync/pack-styles.sh
```

Reads the params, packs each requested type, auto-splits any pack > `MAX_BYTES=45000` into `partN`. Manifest on stdout, TAB-separated:

```
<type>\t<pack-path>\t<entry-count>
```

`<type>` is one of `text` / `effect` / `paint` / `grid`. A single type may produce multiple manifest lines if it was split.

### Step 2 — render and upload each manifest entry

For every manifest line, in order:

1. Run the renderer:
   ```bash
   .claude/skills/figma-component-sync/render-styles.sh "<type>" "<pack-path>"
   ```
   Capture stdout. This is the ready-to-execute JavaScript for that pack.
2. Call `use_figma` with:
   - `fileKey` from params
   - `skillNames: "figma-component-sync,figma-use"`
   - `code` = the captured stdout (verbatim)

Sequential only. `use_figma` returns:

```ts
{
  type: "text" | "effect" | "paint" | "grid",
  attempted: number,
  createdCount: number,
  updatedCount: number,
  errorCount: number,
  errors: object[],
  mutatedNodeIds: string[],
}
```

### Step 3 — report

Aggregate counters across every call. Collapse multiple sub-pack rows for the same type by summing. Print one row per type plus a total:

```
text:    28 attempted, 0 created, 28 updated, 0 errors
effect:  24 attempted, 0 created, 24 updated, 0 errors
total:   52 attempted, 0 created, 52 updated, 0 errors
```

Print up to the first 10 error entries per type when `errorCount > 0`.

## Pack encoding — `pack-styles.sh`

Each style type packs into compact two-element tuples that the JS template knows how to consume. The model never reads inside.

### `text` — one entry per text style

```jsonc
[
  "<style.name>",
  {
    "fs":  <fontSize>,
    "ff":  "<fontName.family>",
    "fst": "<fontName.style>",
    "ls":  { "unit": "...", "value": ... },
    "lh":  { "unit": "...", "value": ... },
    "pi":  <paragraphIndent>,
    "ps":  <paragraphSpacing>,
    "tc":  "<textCase>",
    "td":  "<textDecoration>",
    "bv":  { "fontSize": "<varName>", ... }   // optional; only present when boundVariables non-empty
  }
]
```

`bv` keys are the Figma style-bindable field names (`fontFamily`, `fontStyle`, `fontSize`, `letterSpacing`, `lineHeight`, `paragraphIndent`, `paragraphSpacing`); each value is the **variable name** (resolved against the live `getLocalVariablesAsync()` map at apply time, not the snapshot id).

### `effect` — one entry per effect style; value is the effect array

```jsonc
[
  "<style.name>",
  [
    {
      "t":    "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR",
      "v":    <visible>,
      "r":    <radius>,
      "c":    { "r": ..., "g": ..., "b": ..., "a": ... },   // shadows only
      "o":    { "x": ..., "y": ... },                       // shadows only
      "s":    <spread>,                                     // shadows only
      "bm":   "<blendMode>",                                // shadows only
      "ssbn": <showShadowBehindNode>                        // shadows only
    },
    ...
  ]
]
```

Per-effect `boundVariables` are deferred (Phase A skips them; the JS template tracks them as `unsupported-effect-bound-variable` errors so we know the gap exists).

### `paint` / `grid`

Currently zero in this project (`counts.paint == 0`, `counts.grid == 0`). Scripts emit a manifest line **only** when the snapshot has entries for that type. The render template carries a stub branch that throws `not-implemented` if invoked — placeholder until real data shows up.

### Auto-split

Same approach as `figma-init/pack.sh`: serialise the per-type array compactly, measure bytes, and if `> MAX_BYTES`, slice by entry count into `partN` files. Each part stays valid `[[name, value], ...]`.

## Render template — `render-styles.sh`

Heredoc-embedded JS with two placeholders:
- `__PACK_PLACEHOLDER__` — replaced verbatim with the pack file's JSON content
- `__TYPE_PLACEHOLDER__` — replaced with the type as a JSON string literal

The template:

1. Loads the local style collection for the type:
   - `text`   → `figma.getLocalTextStylesAsync()`
   - `effect` → `figma.getLocalEffectStylesAsync()`
   - `paint`  → `figma.getLocalPaintStylesAsync()` (stub)
   - `grid`   → `figma.getLocalGridStylesAsync()` (stub)
2. Builds a `byName: Map<string, StyleNode>`.
3. Loads `figma.variables.getLocalVariablesAsync()` once and indexes by name → for resolving `bv` references.
4. For each `[name, fields]` entry:
   - If `byName` has it → update; else `figma.createTextStyle()` / `createEffectStyle()` and assign `name`, increment `createdCount` / `updatedCount` accordingly.
   - **text path**: `await figma.loadFontAsync({ family: fields.ff, style: fields.fst })` (try/catch → push `font-load-failed` and continue), then set `fontName`, `fontSize`, `letterSpacing`, `lineHeight`, `paragraphIndent`, `paragraphSpacing`, `textCase`, `textDecoration`. For each `bv` entry: look up the variable, call `style.setBoundVariable(field, v)`. Missing variable → `bound-var-not-found` error.
   - **effect path**: assign `style.effects = fields.map(expandFromCompact)`. Compact-to-Figma expansion is hardcoded in the template (matches the encoding above).
5. Collect created style ids in `mutatedNodeIds`.
6. Return `{ type, attempted, createdCount, updatedCount, errorCount, errors: errors.slice(0, 30), mutatedNodeIds }`.

Edits to upload semantics live **inside the heredoc** in `render-styles.sh`; the placeholder lines must remain on their own line. Never edit the JS from a different file.

## Constraints

- **Upsert only.** Never delete a style that exists in Figma but is missing from the snapshot. Operators who want to prune do it by hand or by extending the script later.
- **Names are the matching key.** Renaming a style in `styles.json` without renaming it in Figma will create a new style with the new name and leave the old one orphaned. That is by design — match-by-id would require a stable id, which the snapshot doesn't guarantee across re-downloads.
- **`boundVariables` resolve at apply time.** The snapshot stores variable refs by name (`bv.fontSize = "merak/typography/body"`). The template resolves these via the **live** `getLocalVariablesAsync()` map, so unresolved refs after a `figma-init` run will report `bound-var-not-found` — fix by rerunning variables upload first.
- **Run after `figma-init`.** Styles' `boundVariables` need their referenced variables to already exist with the right names. See router-level "Run order".
- **No font fallback.** If `loadFontAsync` fails (font not installed in the Figma file), the template skips that style and reports `font-load-failed` — it never substitutes a different font.
- **No partial effect updates.** Effect styles are replaced wholesale (assign `style.effects = ...`) — there's no per-effect merge.
