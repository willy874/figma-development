---
name: add-project
description: Register a referenced Figma application file (a downstream consumer of the library). Two effects per invocation — (1) appends/updates a single entry under `figma.config.json` → `.projects[]`, and (2) pulls a lightweight per-project index (variables / styles / components / pages) from that Figma file via `use_figma` and writes `.projects/{name}/{index,variables,styles,components}.json`. Accepts a Figma page URL paste and parses out the file key / file name / default page id; only asks for the short project label and the page name on top of the URL. Use when the user says "/add-project", "add another Figma project", "新增引用專案", "把這個 Figma 檔加進去", or pastes a `figma.com/design/...` URL with an intent to register it.
---

# add-project

Incremental add-one workflow for `figma.config.json`'s `.projects[]` array. Companion to `figma-init`'s `config-init.md` (which loops invocations of this skill to collect the **first** project during bootstrap) — this skill is also the direct entry point once `figma.config.json` already exists and the user wants to register **another** consumer file.

The skill has two effects on every successful invocation:

1. **`figma.config.json`** — appends (or updates) a single entry under `.projects[]`. `.library.*`, `.version`, and every other top-level key are preserved.
2. **`.projects/{name}/`** — pulls a per-project index from the project's Figma file via `use_figma` and writes `index.json`, `variables.json`, `styles.json`, `components.json`. This is a **lightweight inventory** (ids / names / keys / type / page parent / mode metadata) — it is NOT a token-value dump. For full token values, see `figma-init`'s main flow on the library file.

The skill does not refresh `.library.variables` and does not run any step against the library `fileKey`.

---

## Files in this skill

- `SKILL.md` — this document.
- `dump-project-index.js` — parameterised `use_figma` payload (`TYPE = "meta" | "vars" | "styles" | "components"` plus `OFFSET` / `LIMIT`) that returns one slice of project-side index data as compact JSON. Designed to fit under the 20 KB `use_figma` tool-result limit. Pages are embedded in the `meta` payload (no separate slice type).
- `assemble-project-index.sh` — reads every chunk in `/tmp/add-project-index-<name>/`, HTML-decodes them, validates offset coverage per category, and writes the merged result to `.projects/<name>/{index,variables,styles,components}.json`. Takes the project `name` as its single positional argument.

---

## Preconditions

1. `figma.config.json` exists at the repo root and has `.version == 2`.
   - If missing, **do not** create it from scratch here — load `figma-init/config-init.md` and run that bootstrap first, then return.
2. `.library.fileKey` is non-empty — sanity check that the bootstrap actually completed.
3. The user is registering a Figma **application / mockup** file (downstream consumer of the library), not another library file. If they hand over a URL that points at the library file itself (matches `.library.fileKey`), refuse and tell them this entry already lives under `.library`.

---

## Inputs

Collected interactively, in this order:

1. **Figma page URL** — pasted from the browser's address bar with a specific page open. Accept any of:
   - `https://www.figma.com/design/<fileKey>/<fileName>?node-id=<nodeId>`
   - `https://www.figma.com/design/<fileKey>/branch/<branchKey>/<fileName>?node-id=<nodeId>` — use `branchKey` as the effective `fileKey`.
   - `https://www.figma.com/file/<fileKey>/<fileName>?node-id=<nodeId>` — legacy alias; parse identically.

   Reject URLs that don't match — ask the user to re-paste rather than guessing.

2. **Project short label (`name`)** — kebab-case nickname used as the lookup key in downstream tooling (e.g. `console`, `admin`, `console-app`). Offer a default suggestion: kebab-case slug of the parsed `fileName`. If the user just confirms, use the default.

3. **`defaultPageName`** — the page's display name in Figma. Not encoded in the URL, so it must be asked separately. Allow empty string if the user doesn't know it offhand.

---

## URL parsing rules

Apply these exactly — do not ask the user to copy fields by hand:

| Field             | Source                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `fileKey`         | First path segment after `/design/` (or `/file/`); for `/branch/<branchKey>/` URLs, use `branchKey`.   |
| `fileName`        | Next path segment, URL-decoded (`%20` → space, etc.). Drop trailing path / query.                      |
| `defaultPageId`   | Value of the `node-id` query parameter with `-` replaced by `:`. Missing → empty string + warn user.   |
| `fileUrl`         | Canonicalized `https://www.figma.com/design/<fileKey>/<fileName>`. Drop `node-id` and other params.    |
| `defaultPageName` | Asked separately (not in URL).                                                                          |
| `name`            | Asked separately (not in URL).                                                                          |

---

## Procedure

### Step 1 — Validate config

```bash
test -f figma.config.json || echo "config-missing"
jq -e '.version == 2 and (.library.fileKey // "") != ""' figma.config.json >/dev/null || echo "config-incomplete"
```

If "config-missing" or "config-incomplete": surface the error and load `figma-init/config-init.md` instead. Do not proceed.

### Step 2 — Collect inputs

Use `AskUserQuestion` (or accept the URL inline if the user already pasted it). Run the three asks in order:

1. URL (paste).
2. Project short label (`name`) — with a kebab-case default derived from the parsed `fileName`.
3. `defaultPageName` — allow empty.

Parse the URL **before** asking question 2 so the default suggestion for `name` is meaningful.

### Step 3 — De-duplicate

```bash
jq --arg fk "<parsedFileKey>" '.projects // [] | map(select(.fileKey == $fk)) | length' figma.config.json
```

If the result is `> 0`: the same `fileKey` is already registered. Tell the user, show the existing entry, and ask whether to **update** it (overwrite) or **abort**. Never silently append a duplicate.

Also refuse if `<parsedFileKey>` equals `.library.fileKey` — that's the library itself, not a referenced project.

### Step 4 — Splice into `.projects[]`

Use `jq` so we never hand-edit JSON. Example, with the four collected/parsed values bound as jq args:

```bash
jq --arg name "$NAME" \
   --arg fileKey "$FILE_KEY" \
   --arg fileUrl "$FILE_URL" \
   --arg fileName "$FILE_NAME" \
   --arg defaultPageId "$PAGE_ID" \
   --arg defaultPageName "$PAGE_NAME" \
   '.projects = ((.projects // []) + [{
      name: $name,
      fileKey: $fileKey,
      fileUrl: $fileUrl,
      fileName: $fileName,
      defaultPageId: $defaultPageId,
      defaultPageName: $defaultPageName
    }])' figma.config.json > figma.config.json.tmp && mv figma.config.json.tmp figma.config.json
```

For an **update** of an existing same-`fileKey` entry, replace `.projects` with a map that swaps the matching element in place instead of appending.

### Step 5 — Pull project index into `.projects/{name}/`

Once metadata has been spliced (step 4), pull a fresh index from the **project's** Figma file. This step **always runs** after a successful splice — for new entries and for "update" overwrites alike. On the "abort" branch of step 3, the pipeline ended before step 4, so step 5 also does not run.

**Pass `fileKey` = the project's `fileKey` (the one just spliced)** on every `use_figma` call — NEVER `.library.fileKey`. Pass `skillNames: "add-project,figma-use"`. Run calls sequentially — never parallelise.

#### 5a — Clear chunk staging

```bash
NAME="<the project's name>"
rm -rf "/tmp/add-project-index-$NAME" && mkdir -p "/tmp/add-project-index-$NAME"
```

#### 5b — Pull `meta`

Read `dump-project-index.js`. Call `use_figma` with `code` =

```js
const TYPE = "meta"; const OFFSET = 0; const LIMIT = 0;
<body of dump-project-index.js>
```

Save the raw response **verbatim** to `/tmp/add-project-index-$NAME/meta.json`. The payload returns `counts` (variables / styles / components / pages), `pages[]` (inline — no separate slice), and the variable collection metadata needed by the assembler to map each variable back to its parent collection.

#### 5c — Pull category slices

For each category whose `counts.<category>` is `> 0`, loop `(OFFSET, LIMIT)` with `LIMIT = 40` until cumulative chunk lengths cover the count:

| Category   | `TYPE`         | Chunk filename pattern       |
| ---------- | -------------- | ---------------------------- |
| variables  | `"vars"`       | `vars-<offset>.json`         |
| styles     | `"styles"`     | `styles-<offset>.json`       |
| components | `"components"` | `components-<offset>.json`   |

Each call has the form:

```js
const TYPE = "<category-type>"; const OFFSET = <n>; const LIMIT = 40;
<body of dump-project-index.js>
```

Save each response **verbatim** to the filename above. If a category's count is `0`, skip its loop entirely (no chunks for it). Pages are not chunked — they were already returned inline in `meta`.

#### 5d — Assemble

```bash
.claude/skills/add-project/assemble-project-index.sh "$NAME"
```

The script HTML-decodes chunks, validates offset coverage per category, and writes `.projects/$NAME/{index,variables,styles,components}.json`. The output dir is created (with parents) if missing.

### Step 6 — Report

Print two summary lines, e.g.:

```
figma.config.json .projects: added "console" (fileKey=ABC123…, defaultPageId=12:34)
.projects/console: 1 collection / 78 variables, 24 styles, 12 components, 3 pages
```

The first line is your own summary of the metadata splice; the second line comes verbatim from `assemble-project-index.sh`'s stdout. Then list every project currently registered (`name` + `fileKey`) so the user can confirm.

---

## Constraints

- **Append-only / update-in-place on `.projects[]`.** Never touch `.library.*`, `.version`, or any other top-level key of `figma.config.json`.
- **Project-scoped `use_figma`.** All `use_figma` calls in step 5 pass `fileKey` = the **project's** `fileKey` (the one just parsed), never the library's. Pass `skillNames: "add-project,figma-use"` on every call. Sequential calls only — never parallelise.
- **Lightweight index, not a value dump.** `.projects/{name}/*.json` records ids, names, keys, types, page parents, and mode metadata only — no `valuesByMode`, no full paint / text / effect / grid style props. Full token values stay in `figma.config.json` → `.library.variables` (owned by `figma-init`'s main flow, against the library file).
- **Force-overwrite the index dir.** Every successful invocation rewrites `.projects/{name}/{index,variables,styles,components}.json` from scratch. Local edits to those files are lost — they belong in Figma, not on disk.
- **`{name}` is the path key.** If the user renames a project on the "update" path (changes `.projects[].name` between runs), the new index lands in `.projects/{new-name}/`; the old `.projects/{old-name}/` directory is left untouched. Clean it up manually if needed.
- **No silent duplicates.** Same `fileKey` already present → ask before overwriting; never append twice.
- **`fileKey` is the identity.** `name` is a human label that can be edited later; the `.projects[]` registry is keyed on `fileKey`.
- **Atomic writes.** `figma.config.json` is rewritten through `figma.config.json.tmp` + `mv`. Each per-category index file is written atomically by `assemble-project-index.sh` (`.tmp` + `rename`).
- **Validate after write.** `jq . figma.config.json >/dev/null` and `jq . .projects/{name}/index.json >/dev/null` (et al.) must succeed before reporting success.
- **Verbatim chunk writes.** Each `use_figma` response in step 5 is written exactly as returned — do not parse, re-stringify, re-indent, or strip anything before saving. The assembler decodes HTML entities internally.
- **Stop on first chunk error.** Do not run the assembler against an incomplete chunk set. It will refuse with `offset gap` / `count mismatch`, but failing fast is better than relying on that.

---

## When NOT to use this skill

- `figma.config.json` doesn't exist yet — use `figma-init/config-init.md` instead (it bootstraps `.library.*` and loops invocations of this skill to collect the **first** project).
- The user wants to refresh `.library.variables` (full token values on the library file) — that's `/figma-init` (main flow). This skill only refreshes the **project-side** lightweight index in `.projects/{name}/`.
- The user wants to register or update the library file itself — wipe `.library.{fileKey, fileUrl, fileName, defaultPageId, defaultPageName}` in `figma.config.json` and rerun `config-init.md`; its Step 1 will URL-paste prompt the user. The library is not a `.projects[]` entry.
- The user wants to remove a project — use `jq 'del(.projects[] | select(.fileKey == "..."))'` on `figma.config.json`, then `rm -rf .projects/<name>/` for the index dir. This skill is add/update only.

---

## Cross-references

- [`../figma-init/config-init.md`](../figma-init/config-init.md) — first-time bootstrap that produces `.library.*` and loops this skill to collect `.projects[]`. URL parsing rules must stay in sync with §URL parsing rules here.
- [`../figma-init/SKILL.md`](../figma-init/SKILL.md) — the variable-pull main flow for the **library** file. Does not depend on `.projects[]`, but checks that ≥ 1 entry exists before proceeding.
- [`../figma-init/dump-variables.js`](../figma-init/dump-variables.js) / [`../figma-init/assemble-variables.sh`](../figma-init/assemble-variables.sh) — library-side counterparts to `dump-project-index.js` / `assemble-project-index.sh`. They share the chunked-pull / HTML-decode pattern; keep both pairs in lockstep when revising it.
- `../../../figma.config.json` — the file this skill mutates (one entry under `.projects[]`).
- `../../../figma.config.example.json` — the tracked v2 schema template.
- `../../../.projects/{name}/` — per-project index output dir. Already covered by `.gitignore` (project root rules `.projects/`).
