# figma-init · Config index bootstrap

Build the **identifier skeleton** of `figma.config.json` from the project's library-inventory docs and component-spec sources, **plus** at least one referenced-project entry. This is the **prerequisite** for `figma-init`'s main pull-into-config workflow — without an identifier index and a target file key, the main flow has no `.library.fileKey` to read from.

This pipeline is file-only on the library side (no `use_figma` for `.library.*`). It does **not** touch the `.library.variables` section (the main flow owns that). It **does** interactively collect `.projects[]` from the user when the array is empty.

## Goal

- Centralize Figma identifiers in `figma.config.json` under `.library.*`: file / page metadata, component-set node ids, icon node ids, per-spec `figma_*` frontmatter.
- Record one or more referenced Figma application files under `.projects[]` — each entry is pure file metadata (no inventory) used by downstream tooling.
- Keep `figma.config.example.json` as the tracked schema/template.
- Keep real IDs out of skill-document hardcoding.

## When to run

- First-time bootstrap of `figma.config.json` (no file exists yet, or `figma-init`'s main flow surfaced "config missing" / "projects missing").
- Any change to:
  - `.claude/skills/figma-create-component/library-components.md`
  - `.claude/skills/figma-create-component/library-tokens.md`
  - `.claude/skills/figma-components/*/figma.spec.md` frontmatter (`figma_*` fields)
- The user wants to add another referenced project under `.projects[]`.

## Inputs

- `.claude/skills/figma-create-component/library-components.md`
- `.claude/skills/figma-create-component/library-tokens.md`
- `.claude/skills/figma-components/*/figma.spec.md`
- For each referenced project (collected interactively): `name`, `fileKey`, `fileUrl`, `fileName`, `defaultPageId`, `defaultPageName`.

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

## Pipeline

1. Resolve library file/page metadata from `library-components.md`:
   - `.library.fileKey`
   - `.library.fileUrl`
   - `.library.fileName`
   - `.library.defaultPageId`
   - `.library.defaultPageName`
2. Write `.library.sources` with the three hard-coded paths above.
3. Parse the `Component sets & primitives` table in `library-components.md` into `.library.index.componentSetsAndPrimitives`:
   - key = component name
   - value = `nodeId`, optional `variantCount`, optional `notes`
4. Parse the `Icon library` table in `library-components.md` into `.library.index.icons`:
   - key = icon name
   - value = `nodeId`, `glyphSource`
5. Parse all `figma.spec.md` frontmatter (`figma_*`) into `.library.index.componentSpecs`:
   - key = component folder name
   - value = all `figma_*` keys + `specPath`
6. Collect `.projects[]`:
   - If the existing `.projects` array is non-empty, **preserve it untouched** (and skip the prompts below).
   - Otherwise prompt the user for at least one referenced project. For each entry:
     1. Ask the user to **paste the Figma page URL** (the one shown in the browser's address bar while a specific page is open). Accept any of:
        - `https://www.figma.com/design/<fileKey>/<fileName>?node-id=<nodeId>`
        - `https://www.figma.com/design/<fileKey>/branch/<branchKey>/<fileName>?node-id=<nodeId>` — use `branchKey` as `fileKey`.
        - `https://www.figma.com/file/<fileKey>/<fileName>?node-id=<nodeId>` — legacy alias; same parsing.
     2. **Parse** the URL programmatically — do not ask the user to copy fields by hand:
        - `fileKey` ← path segment after `/design/` (or `/file/`, or `/branch/<branchKey>/`).
        - `fileName` ← next path segment, URL-decoded (`%20` → space, etc.). Strip any trailing path segment.
        - `defaultPageId` ← value of the `node-id` query parameter with `-` replaced by `:`. If `node-id` is absent, leave it as an empty string and ask the user to fill it in manually before continuing.
        - `fileUrl` ← canonicalized `https://www.figma.com/design/<fileKey>/<fileName>` (drop `node-id` and any other query params).
     3. Ask the user for a short `name` label for this project (e.g. `console`, `admin`) — used as the lookup key in tooling. Default suggestion: a kebab-case slug of `fileName`. Accept the suggestion if the user just confirms.
     4. Ask the user for `defaultPageName` (the page's display name in Figma). This is **not** encoded in the URL, so it must be asked separately. Allow empty string when the user doesn't know it offhand.
   - After the first entry, ask whether to add another; loop until the user says no.
   - **Refuse to finish** if `.projects` ends up empty, or if any entry has an empty `fileKey` — surface the error verbatim and stop.
7. Merge into `figma.config.json` with stable key ordering. If the file already exists with a `.library.variables` block, splice the new identifier sections in **without** removing `.library.variables`.
8. Ensure `figma.config.example.json` exists at the v2 shape with placeholders (including a placeholder `.library.variables` and at least one placeholder `.projects[]` entry).
9. Ensure `.gitignore` contains `figma.config.json`.

## Validation checklist

- `figma.config.json` is valid JSON.
- `figma.config.example.json` is valid JSON.
- `.version` is `2`.
- `.library.fileKey` is non-empty.
- `.projects` is an array with **≥ 1 entry**, and every entry carries a non-empty `name` and `fileKey`.
- `.library.index.componentSpecs` count equals the number of `figma.spec.md` files.
- Every `.library.index.componentSpecs.*.figma_file_key` equals `.library.fileKey` (unless explicitly intended otherwise).
- `.library.index.componentSetsAndPrimitives` / `.library.index.icons` entries align with `library-components.md` current tables.

## Maintenance rules

- New library Figma IDs should be added by editing `library-components.md` / `library-tokens.md` and re-running this pipeline, **not** by hand-editing `figma.config.json`.
- Adding / removing / renaming a `.projects[]` entry is the **only** mutation that should go via this pipeline interactively — there is no source `.md` for projects.
- `figma-init`'s main flow (pull variables) is run separately after this bootstrap and writes only `.library.variables`.
- Keep `figma.config.example.json` free of real identifiers and free of real variable values.
