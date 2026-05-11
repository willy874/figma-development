# figma-init · Config index bootstrap

Build the **identifier skeleton** of `figma.config.json` from the project's design-guide and component-spec sources. This is the **prerequisite** for `figma-init`'s main pull-into-config workflow — without an identifier index, the main flow has no `defaultFileKey` to target.

This pipeline is file-only. It does **not** call `use_figma` and does **not** touch the `.variables` section of `figma.config.json` (the main flow owns that).

## Goal

- Centralize Figma identifiers in `figma.config.json`: project / file / page metadata, component-set node ids, icon node ids, per-spec `figma_*` frontmatter.
- Keep `figma.config.example.json` as the tracked schema/template.
- Keep real IDs out of skill-document hardcoding.

## When to run

- First-time bootstrap of `figma.config.json` (no file exists yet, or `figma-init`'s main flow surfaced "config missing").
- Any change to:
  - `.claude/skills/figma-design-guide/components.md`
  - `.claude/skills/figma-design-guide/design-token.md`
  - `.claude/skills/figma-components/*/figma.spec.md` frontmatter (`figma_*` fields)

## Inputs

- `.claude/skills/figma-design-guide/components.md`
- `.claude/skills/figma-design-guide/design-token.md`
- `.claude/skills/figma-components/*/figma.spec.md`

## Outputs

- `figma.config.json` (identifier index — `figma`, `sources`, `index`). If a `.variables` block already exists, **preserve it** untouched; the main `figma-init` flow refreshes it separately.
- `figma.config.example.json` (tracked template with placeholders only)
- `.gitignore` contains `figma.config.json`

## Pipeline

1. Resolve default file/page metadata from `components.md`:
   - `figma.defaultFileKey`
   - `figma.defaultFileUrl`
   - `figma.defaultFileName`
   - `figma.defaultPageId`
   - `figma.defaultPageName`
2. Parse the `Component sets & primitives` table in `components.md` into `index.componentSetsAndPrimitives`:
   - key = component name
   - value = `nodeId`, optional `variantCount`, optional `notes`
3. Parse the `Icon library` table in `components.md` into `index.icons`:
   - key = icon name
   - value = `nodeId`, `glyphSource`
4. Parse all `figma.spec.md` frontmatter (`figma_*`) into `index.componentSpecs`:
   - key = component folder name
   - value = all `figma_*` keys + `specPath`
5. Merge into `figma.config.json` with stable key ordering. If the file already exists with a `.variables` block, splice the new identifier sections in **without** removing `.variables`.
6. Ensure `figma.config.example.json` exists and matches the same schema with placeholders (including a placeholder `.variables` shape — see § Example schema).
7. Ensure `.gitignore` contains `figma.config.json`.

## Validation checklist

- `figma.config.json` is valid JSON.
- `figma.config.example.json` is valid JSON.
- `index.componentSpecs` count equals the number of `figma.spec.md` files.
- Every `componentSpecs.*.figma_file_key` equals `figma.defaultFileKey` (unless explicitly intended otherwise).
- `componentSetsAndPrimitives` / `icons` entries align with `components.md` current tables.

## Maintenance rules

- New Figma IDs should be added by editing the source `.md` and re-running this pipeline, **not** by hand-editing `figma.config.json`.
- `figma-init`'s main flow (pull variables) is run separately after this bootstrap.
- Keep `figma.config.example.json` free of real identifiers and free of real variable values.
