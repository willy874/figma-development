# figma-component-sync · 上傳 · Components

Sync component variant state from `src/figma/components/<Name>/*.json` (REST snapshot format) back into Figma.

Two phases:

- **Phase A — value-only patch** (implemented; design below). The component set and all variants must already exist on the Figma canvas. We walk each variant's child tree by-name and overwrite a fixed allow-list of "value" fields. **No topology changes.**
- **Phase B — topology rebuild** (design only; see § Phase B). Destruct-and-recreate, including VECTOR via the SVG-path → VectorNetwork parser.

## Required input — `/tmp/component-sync-upload-params.json`

```json
{
  "target": "components",
  "fileKey": "<target-file-key>",
  "componentName": "Button",
  "componentsRoot": "src/figma/components"
}
```

- `target` — must be `"components"`.
- `fileKey` — target Figma file key.
- `componentName` — name as it appears in `.claude/skills/figma-design-guide/components.md` (no angle brackets, no backticks). Drives the snapshot folder and the component-set lookup on the Figma side.
- `componentsRoot` (optional) — defaults to `src/figma/components`. The snapshot folder is `<componentsRoot>/<componentName>`.

One component per invocation. Batch uploads (loop `componentName` over every `SET (N)` row in `components.md`) are the **caller's** responsibility — same convention as the download side. Add a `sleep` between iterations if you fan out, to stay polite with any rate limits when Phase B later imports remote components.

`pack-component-values.sh` validates this file. Any missing field → `ERROR: <reason>` and non-zero exit.

## Phase A — Procedure

### Step 1 — pack

```bash
.claude/skills/figma-component-sync/pack-component-values.sh
```

Reads every `*.json` under `<componentsRoot>/<componentName>/`, parses each variant snapshot, and emits a single manifest line per pack file:

```
<componentName>\t<pack-path>\t<variant-count>
```

Each pack file holds a compact array of variant patches:

```jsonc
[
  [
    "<rawVariantName>",          // e.g. "Size=Medium, Color=Default, Variant=Text, State=Enabled"
    { "Size": "Medium", "Color": "Default", "Variant": "Text", "State": "Enabled" },
    [
      [ ["root"], { /* attrPatch */ } ],
      [ ["root", "Container"], { /* attrPatch */ } ],
      [ ["root", "Container", "Label"], { /* attrPatch */ } ],
      ...
    ]
  ],
  ...
]
```

The script auto-splits when bytes > `MAX_BYTES=45000`. A component with many variants (e.g. `Button` SET (90), `PaginationItem` SET (288)) will produce multiple `partN` packs; the JS template is variant-agnostic and processes whatever variants are in the pack.

#### `attrPatch` — writable field allow-list (Phase A)

`pack-component-values.sh` walks the snapshot's `children` recursively and emits an attrPatch only for nodes where at least one allow-listed field is present and non-default. The allow-list is **fixed in the script**, model never edits it:

| compact key | snapshot field             | applies to                                |
| ----------- | -------------------------- | ----------------------------------------- |
| `f`         | `fills`                    | FRAME / RECTANGLE / ELLIPSE / VECTOR / TEXT / LINE / GROUP children of these |
| `s`         | `strokes`                  | same                                      |
| `sw`        | `strokeWeight`             | same                                      |
| `cr`        | `cornerRadius`             | FRAME / RECTANGLE                         |
| `tlr/trr/blr/brr` | individual corner radii | FRAME / RECTANGLE (when asymmetric)     |
| `o`         | `opacity`                  | any                                       |
| `v`         | `visible`                  | any                                       |
| `e`         | `effects`                  | any                                       |
| `bv`        | `boundVariables`           | any (resolved by variable name)           |
| `ch`        | `characters`               | TEXT                                      |
| `lm`        | `layoutMode`               | FRAME                                     |
| `pl/pr/pt/pb` | `paddingLeft/Right/Top/Bottom` | FRAME                              |
| `is`        | `itemSpacing`              | FRAME                                     |
| `paai`      | `primaryAxisAlignItems`    | FRAME                                     |
| `caai`      | `counterAxisAlignItems`    | FRAME                                     |
| `lg`        | `layoutGrow`               | FRAME children                            |
| `la`        | `layoutAlign`              | FRAME children                            |
| `lsh/lsv`   | `layoutSizingHorizontal/Vertical` | FRAME                              |

Anything **not** in this list (`absoluteBoundingBox`, geometry, child counts, computed renderBounds, etc.) is dropped at pack time and never travels to Figma.

`bv` is encoded with the same compact prefix scheme as `figma-init`:
- `["a", "<variableName>"]` — variable alias (most common case for design tokens)

`f` / `s` are arrays of paints. Each paint is encoded as:
- `["c", r, g, b, a]` — `SOLID` colour
- `["cv", "<variableName>", r, g, b, a]` — `SOLID` whose colour is bound to a variable (the rgba is a fallback if the variable lookup fails)
- `["g", "<GRADIENT_…>", stops, transform]` — gradient (Phase A handles them by replay, not interpolation)
- `["i", "<imageHash>", scaleMode]` — image fill (Phase A pass-through; assumes the image is already uploaded)

#### `pathByName`

The first element of each patch tuple is the path from the variant root, by **node name**, depth-first. The first segment is always `"root"` (a synthetic alias for the variant COMPONENT itself, since its real name carries the variant props and isn't a stable child name). Subsequent segments are `node.name` as read from the snapshot.

Ambiguous paths (siblings with the same name): the JS template picks the first match in document order and pushes a `name-collision` warning. This is rare in MUI-Library snapshots — the authoring convention names each layer uniquely — but the warning surfaces it when it happens.

### Step 2 — render and upload each manifest entry

```bash
.claude/skills/figma-component-sync/render-component-values.sh "<componentName>" "<pack-path>"
```

Captured stdout is the ready-to-execute `use_figma` JavaScript. Call `use_figma` with:
- `fileKey` from params
- `skillNames: "figma-component-sync,figma-use"`
- `code` = captured stdout verbatim

Sequential. The JS:

1. Finds the `ComponentSetNode` by name: `figma.root.findAll(n => n.type === "COMPONENT_SET" && n.name === COMPONENT_NAME)`. Must return exactly one — zero → `set-not-found`; many → `set-ambiguous`. **Phase A errors out; Phase B will offer to auto-create.**
2. Builds variant index: for each child `COMPONENT` of the set, parse `node.name` (`"Size=Medium, Color=Default, …"`) → variant-prop map, key by canonical `JSON.stringify(sortedEntries(props))`.
3. Loads `figma.variables.getLocalVariablesAsync()` and `figma.getLocalTextStylesAsync()` / `getLocalEffectStylesAsync()` once each → name lookup maps for `bv`.
4. For each variant entry in the pack:
   - Look up the ComponentNode by canonical variant key. Missing → `variant-not-found` error, skip patches for this variant.
   - For each `[pathByName, attrPatch]`:
     - Resolve the node by walking children by-name from the variant root.
     - Missing leaf → `node-not-found` error, continue.
     - Apply allow-listed fields in a fixed order: layout structure (`lm`, `pl/pr/pt/pb`, `is`, `paai`, `caai`, `lsh/lsv`) → fills/strokes → corner radii → effects → `characters` (after `loadFontAsync` from the TEXT node's current `fontName`) → `boundVariables` last.
     - Each setter wrapped in try/catch → push specific error code.
5. Return:
   ```ts
   {
     componentName: string,
     variantsAttempted: number,
     variantsPatched: number,
     nodesPatched: number,
     errorCount: number,
     errors: object[],      // first 50
     mutatedNodeIds: string[]
   }
   ```

### Step 3 — report

Aggregate counters across every pack call for this component. Print one summary line plus up to 10 first errors when `errorCount > 0`:

```
Button: 90 variants attempted, 90 patched, 540 nodes patched, 0 errors
```

## Phase A constraints

- **Component set must exist on the canvas.** Phase A errors out with `set-not-found`. To author a new component, use `figma-create-component`, then download a snapshot, then sync values via this path.
- **Variant axes must match.** Variants present in the snapshot but absent from Figma → `variant-not-found`. Variants in Figma but not in the snapshot → left untouched (no deletion).
- **Topology is not touched.** No `appendChild`, no `remove`, no `insertChild`. If a snapshot child has been renamed in Figma, you get `node-not-found` instead of a silent mis-write.
- **Fields outside the allow-list are dropped.** This is enforced in `pack-component-values.sh`, not in the JS — the model and the upload script cannot see those fields at all.
- **No image upload.** `i` paints assume the image hash is already known to the file. Phase B will integrate `upload_assets` if needed.
- **Order matters within an attrPatch.** The JS applies fields in a fixed order so that, e.g., setting `lm` (auto-layout) before `pl/pr/pt/pb` (which only make sense with auto-layout on) doesn't error.
- **Run after variables + styles uploads.** `bv` references resolve at apply time; `boundVariables` for text fields may reference text styles set in the styles step.

---

## Phase B — design only (not implemented)

### Goal

Destruct the existing component set and re-author it from scratch using only the snapshots. Required to propagate **topology** changes (new layer, removed layer, renamed layer, reordered children) instead of only values.

### Auto-create when set is missing

When the params point at a `componentName` whose set doesn't exist on the canvas, Phase B creates an empty stub via `figma.combineAsVariants(initialComponents, parent)`:

1. For each variant in the snapshot, `figma.createComponent()` and set `node.name` to the variant's raw name (preserves the `Axis=Value, …` syntax).
2. `figma.combineAsVariants(components, figma.currentPage)` → produces a `ComponentSetNode`.
3. Rename the set to `componentName`.
4. From here, fall through to the variant-rebuild loop below.

### Variant rebuild — node-type map

For each variant snapshot, recursively rebuild the child tree. Top-level node already exists (the variant COMPONENT created above); for each snapshot child, choose by `type`:

| snapshot type | Plugin API call                                | notes                                                                 |
| ------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| `FRAME`       | `figma.createFrame()`                          | apply auto-layout fields after fills                                  |
| `TEXT`        | `figma.createText()` + `loadFontAsync`         | `characters` last                                                     |
| `RECTANGLE`   | `figma.createRectangle()`                      |                                                                        |
| `ELLIPSE`     | `figma.createEllipse()`                        |                                                                        |
| `LINE`        | `figma.createLine()`                           | absolute endpoints → relative via parent origin                        |
| `GROUP`       | `figma.group([...children], parent)`           | children must be created first; group wraps them                       |
| `BOOLEAN`     | `figma.union/subtract/intersect/exclude(...)`  | operation per `booleanOperation` field; children created first         |
| `INSTANCE`    | `(await figma.importComponentByKeyAsync(key)).createInstance()` | `componentKey` is on the snapshot; remote imports may rate-limit |
| `VECTOR`      | `figma.createVector()` + `setVectorNetworkAsync(network)` | `network` produced by `svg-path-to-vector-network.sh` (below) |
| `INSTANCE_SWAP` / `SLOT` / `VARIANT` | component property metadata | applied via `componentSet.addComponentProperty(...)` on the parent set |

### SVG-path → VectorNetwork parser (`scripts/svg-path-to-vector-network.sh`)

Standalone subscript invoked by `pack-component-rebuild.sh` (Phase B's packer). Pure data transform — runs at pack time, no `use_figma`, no model interpretation.

#### Contract

```
svg-path-to-vector-network.sh <path-string>
```

Reads an SVG path `d` attribute on argv (or stdin), prints a VectorNetwork JSON to stdout. On failure: `ERROR: <reason>` to stderr, non-zero exit.

#### Coverage

In-scope SVG commands (covers ≥ 95 % of Figma-exported icon paths empirically; needs validation against the actual snapshot corpus before Phase B ships):

| command       | translation                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
| `M x y`       | start a new region — push current vertex                                             |
| `L x y`       | line segment to (x,y) — push vertex, push segment `{ start, end, tangentStart: {0,0}, tangentEnd: {0,0} }` |
| `H x` / `V y` | horizontal/vertical line — desugar to `L`                                            |
| `C x1 y1 x2 y2 x y` | cubic Bezier — segment with `tangentStart: {x1-startX, y1-startY}`, `tangentEnd: {x2-x, y2-y}` |
| `S x2 y2 x y` | smooth cubic — reflect previous cubic's `tangentEnd` to derive `tangentStart`        |
| `Q x1 y1 x y` | quadratic Bezier — convert to cubic via the 2/3 rule                                 |
| `T x y`       | smooth quadratic — analogous to `S`                                                  |
| `Z` / `z`     | close current region (link last vertex back to region start)                          |

Out-of-scope for v1 (icons rarely use them; surface as `unsupported-svg-command` error so the operator knows to fix the source):

- `A` (elliptical arc) — needs full arc-to-bezier expansion; implement in v2 if the snapshot corpus needs it
- Lowercase relative commands — pre-pass converts to absolute before parsing
- Multiple sub-paths within one `d` that share fill regions — emit separate VectorNetwork regions

#### Output shape

```jsonc
{
  "vertices": [
    { "x": 12, "y": 4, "strokeCap": "ROUND", "strokeJoin": "ROUND", "cornerRadius": 0, "handleMirroring": "NONE" },
    ...
  ],
  "segments": [
    { "start": 0, "end": 1, "tangentStart": { "x": 0, "y": 0 }, "tangentEnd": { "x": 0, "y": 0 } },
    ...
  ],
  "regions": [
    { "windingRule": "NONZERO", "loops": [[0, 1, 2, 3]] }
  ]
}
```

Field defaults match Figma's `VectorNetwork` interface. The script does **not** infer winding rule per-region — it always emits `NONZERO` for v1 (matches MUI-Library convention); future v2 may need to read `fill-rule` from snapshot metadata.

### Phase B failure modes (anticipated)

- **`INSTANCE` whose `componentKey` is from a different file.** `importComponentByKeyAsync` may fail if that library isn't accessible from the target file. Need a recoverable error path that lets the rest of the rebuild continue.
- **Variant axes drift.** If the snapshot has a different set of variant axes than the existing Figma set, Phase B has to either fail loudly or rebuild the whole set. **Default: fail.** Adding a new axis is a deliberate authoring change, not a sync.
- **`BOOLEAN` ordering.** Children must exist before the boolean op runs; the rebuild walks tree bottom-up for BOOLEAN/GROUP subtrees but top-down for everything else. Implement as a two-pass.

### Phase B is not in scope this turn

Phase B is a separate milestone. This document defines the contract so when we start implementing:
- `pack-component-rebuild.sh` knows what to encode
- `render-component-rebuild.sh` knows what API calls to emit
- `scripts/svg-path-to-vector-network.sh` knows what coverage to deliver

No files for Phase B are created in this iteration.

---

## Cross-cutting reminders

- Same `force-overwrite, no diff` and `no model interpretation of values` rules as the rest of `figma-component-sync`.
- Phase A and Phase B share `/tmp/component-sync-upload-params.json` shape; the only difference is the params consumer's choice of pack script. Phase B will introduce a `mode: "rebuild" | "values"` field defaulting to `"values"`.
- Never run Phase A as a "fix" for a Phase B that broke a component, or vice versa. Repair on the side that owns the bug.
