# figma-init · Config index bootstrap

Build the **identifier skeleton** of `figma.config.json` — `.library.*` (file metadata + inventory) plus at least one referenced-project entry under `.projects[]`. This is the **prerequisite** for `figma-init`'s main pull-into-config workflow — without a target file key, the main flow has no library to read from.

This pipeline is file-only (no `use_figma` calls). It does **not** touch the `.library.variables` section (the main flow owns that). It **does** interactively prompt the user via URL paste when `.library.fileKey` is empty, and **delegates** every `.projects[]` append to [`add-project/SKILL.md`](../add-project/SKILL.md) — this file does not re-implement the URL paste / label / page-name / dedup loop.

## Goal

- Centralize Figma identifiers in `figma.config.json` under `.library.*`: file / page metadata, component-set node ids, icon node ids, per-spec `figma_*` frontmatter.
- Record one or more referenced Figma application files under `.projects[]` — each entry is pure file metadata (no inventory) used by downstream tooling.
- Keep `figma.config.example.json` as the tracked schema/template.
- Keep real Figma identifiers out of skill-document hardcoding — figma.config.json is the single source of truth.

## When to run

- First-time bootstrap of `figma.config.json` (no file exists yet, or `figma-init`'s main flow surfaced "config missing" / "projects missing").
- Any change to:
  - `.claude/skills/figma-create-component/library-components.md` (inventory tables)
  - `.claude/skills/figma-create-component/library-tokens.md`
  - `.claude/skills/figma-components/*/figma.spec.md` frontmatter (`figma_*` fields)
- The user wants to add another referenced project under `.projects[]` (for incremental adds, `add-project/SKILL.md` is the lighter-weight alternative).
- The user wants to **switch the library to a different Figma file** — wipe the existing `.library.{fileKey, fileUrl, fileName, defaultPageId, defaultPageName}` block and re-run; the URL paste prompt fires again.

## Inputs

- `.claude/skills/figma-create-component/library-components.md` (inventory tables — Component sets & primitives, Icon library)
- `.claude/skills/figma-create-component/library-tokens.md`
- `.claude/skills/figma-components/*/figma.spec.md`
- **Library Figma page URL** (asked interactively when `.library.fileKey` is empty).
- **One or more referenced-project Figma page URLs** (asked interactively when `.projects` is empty), plus per-entry `name` label and `defaultPageName`.

## Outputs

- `figma.config.json` with the following top-level shape (preserving `.library.variables` if it already exists):

  ```json
  {
    "version": 2,
    "library": {
      "fileKey": "…",
      "fileUrl": "…",
      "fileName": "…",
      "defaultPageId": "…",
      "defaultPageName": "…",
      "sources": { "libraryComponents": "…", "libraryTokens": "…", "componentSpecsGlob": "…" },
      "index": { "componentSetsAndPrimitives": {…}, "icons": {…}, "componentSpecs": {…} }
    },
    "projects": [ { "name": "…", "fileKey": "…", "fileUrl": "…", "fileName": "…", "defaultPageId": "…", "defaultPageName": "…" } ]
  }
  ```

- `figma.config.example.json` (tracked template with placeholders only — already at v2 shape).
- `.gitignore` contains `figma.config.json`.

## URL parsing rules (library bootstrap only)

Used by **step 1** (library URL paste). Project URLs are parsed by [`add-project/SKILL.md`](../add-project/SKILL.md) — the rules there are identical and must stay in sync with the table below; do **not** duplicate the project-parsing logic in this file.

Apply these exactly — do not ask the user to copy fields by hand once the URL has been pasted.

Accepted URL forms (paste from the browser's address bar with a specific page open):

- `https://www.figma.com/design/<fileKey>/<fileName>?node-id=<nodeId>`
- `https://www.figma.com/design/<fileKey>/branch/<branchKey>/<fileName>?node-id=<nodeId>` — use `branchKey` as the effective `fileKey`.
- `https://www.figma.com/file/<fileKey>/<fileName>?node-id=<nodeId>` — legacy alias; parse identically.

Reject any URL that doesn't match — ask the user to re-paste rather than guessing.

| Field             | Source                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `fileKey`         | First path segment after `/design/` (or `/file/`); for `/branch/<branchKey>/` URLs, use `branchKey`.                |
| `fileName`        | Next path segment, URL-decoded (`%20` → space, etc.). Strip any trailing path / query.                              |
| `defaultPageId`   | Value of the `node-id` query parameter with `-` replaced by `:`. If `node-id` is absent, leave empty + warn user.   |
| `fileUrl`         | Canonicalized `https://www.figma.com/design/<fileKey>/<fileName>`. Drop `node-id` and other params.                 |
| `defaultPageName` | **Asked separately** — not encoded in the URL. Allow empty string.                                                  |
| `name`            | **Asked separately** — short label for the entry (projects only; library does not carry a `name` field).            |

## Pipeline

### Step 1 — Resolve library file/page metadata

- If `.library.fileKey` already exists in `figma.config.json` and is non-empty, **preserve the entire `.library.{fileKey, fileUrl, fileName, defaultPageId, defaultPageName}` block untouched** and skip to step 2. This is the steady-state case (re-running for inventory refresh).
- Otherwise prompt the user to **paste the library's Figma page URL** (the page containing the published component sets and variable collections). Parse per § URL parsing rules:
  - `.library.fileKey` ← parsed.
  - `.library.fileUrl` ← parsed.
  - `.library.fileName` ← parsed.
  - `.library.defaultPageId` ← parsed (must be non-empty — if `node-id` is absent in the URL, re-prompt the user to paste a URL that has a page open).
  - `.library.defaultPageName` ← asked separately (allow empty).

### Step 2 — Write `.library.sources`

Hard-coded paths to the inventory / spec source documents:

```json
{
  "libraryComponents": ".claude/skills/figma-create-component/library-components.md",
  "libraryTokens": ".claude/skills/figma-create-component/library-tokens.md",
  "componentSpecsGlob": ".claude/skills/figma-components/*/figma.spec.md"
}
```

### Step 3 — Parse `Component sets & primitives` table

From `library-components.md` into `.library.index.componentSetsAndPrimitives`:

- key = component name
- value = `nodeId`, optional `variantCount`, optional `notes`

### Step 4 — Parse `Icon library` table

From `library-components.md` into `.library.index.icons`:

- key = icon name
- value = `nodeId`, `glyphSource`

### Step 5 — Parse `figma.spec.md` frontmatter

From every `.claude/skills/figma-components/*/figma.spec.md` into `.library.index.componentSpecs`:

- key = component folder name
- value = all `figma_*` keys + `specPath`

### Step 6 — Splice `.library.*` into `figma.config.json`

Merge the resolved library metadata (step 1), sources (step 2), and index sections (steps 3–5) into `figma.config.json` with stable key ordering. **Preserve** any existing `.library.variables` block (owned by `figma-init`'s main flow) and any existing `.projects` array (owned by step 7 / `add-project`). All other top-level keys round-trip untouched.

Write atomically: emit to `figma.config.json.tmp`, then `mv` into place. After write, `jq . figma.config.json >/dev/null` must succeed.

This must happen **before** step 7, because `add-project`'s preconditions require `.library.fileKey` to already be present on disk (its Step 1 validates `version == 2` and `.library.fileKey != ""`).

### Step 7 — Collect `.projects[]` via `add-project`

- If the existing `.projects` array is non-empty, **preserve it untouched** and skip the loop below. This is the steady-state case (re-running for inventory refresh).
- Otherwise loop:
  1. Load [`.claude/skills/add-project/SKILL.md`](../add-project/SKILL.md) and run it end-to-end — it owns the URL paste prompt, `name` / `defaultPageName` asks, dedup check against existing `.projects[]` and against `.library.fileKey`, and the atomic splice into `.projects[]`. Do **not** duplicate any of that logic here, and do **not** hand-edit `.projects[]` from this pipeline.
  2. After `add-project` returns success, ask the user whether to add another. Loop until they say no.
- **Refuse to finish** if `.projects` is still empty after the loop — surface the error verbatim and stop. (Each `add-project` invocation already refuses to append an entry with an empty `fileKey`, so per-entry validation is handled there.)

### Step 8 — Ensure example + gitignore

- Ensure `figma.config.example.json` exists at the v2 shape with placeholders (including a placeholder `.library.variables` and at least one placeholder `.projects[]` entry).
- Ensure `.gitignore` contains `figma.config.json`.

## Validation checklist

- `figma.config.json` is valid JSON.
- `figma.config.example.json` is valid JSON.
- `.version` is `2`.
- `.library.fileKey` is non-empty.
- `.library.defaultPageId` is non-empty (we need a real page to target).
- `.projects` is an array with **≥ 1 entry**, and every entry carries a non-empty `name` and `fileKey`.
- No entry in `.projects[]` has the same `fileKey` as `.library.fileKey` — the library is not a project.
- `.library.index.componentSpecs` count equals the number of `figma.spec.md` files.
- Every `.library.index.componentSpecs.*.figma_file_key` equals `.library.fileKey` (unless explicitly intended otherwise).
- `.library.index.componentSetsAndPrimitives` / `.library.index.icons` entries align with `library-components.md` current tables.

## Maintenance rules

- The library's `fileKey` / `fileUrl` / `fileName` / `defaultPageId` / `defaultPageName` are owned by `figma.config.json`, not by `library-components.md`. The Source link at the top of `library-components.md` is documentary only — do not parse it.
- To switch the library to a different Figma file, **wipe** `.library.{fileKey, fileUrl, fileName, defaultPageId, defaultPageName}` and re-run; the URL paste prompt fires again. Inventory tables (`.library.index.*`) are re-derived from `library-components.md` on every run, so they will be re-populated automatically.
- New library Figma IDs (new component sets, new icons, new specs) should be added by editing `library-components.md` / `library-tokens.md` / `figma.spec.md` and re-running this pipeline, **not** by hand-editing `figma.config.json`.
- Adding / removing / renaming a `.projects[]` entry can be done via this pipeline interactively, or via the lighter-weight `add-project/SKILL.md` for single-entry appends. There is no source `.md` for projects.
- `figma-init`'s main flow (pull variables) is run separately after this bootstrap and writes only `.library.variables`.
- Keep `figma.config.example.json` free of real identifiers and free of real variable values.
