---
name: update-project
description: Re-sync the lightweight per-project index for an already-registered Figma application file. Treats the online Figma file as the source of truth — re-pulls variables / styles / components / pages via `use_figma` and overwrites `.projects/{name}/{index,variables,styles,components}.json`. Also reconciles drift in the matching `figma.config.json` → `.projects[]` entry (`fileName`, `defaultPageName`) from the freshly-pulled meta. Accepts three selector forms: a registered `name`, the literal `all`, or a pasted `figma.com/design/...` URL (parses the `fileKey` and looks up the matching `.projects[]` entry). Use when the user says "/update-project", "refresh project", "sync project index", "重新拉取索引", "更新引用專案", or pastes a Figma URL with an intent to refresh that file's index.
---

# update-project

Refresh-in-place workflow for an existing `.projects[]` entry. Companion to `add-project` — same chunked `use_figma` pull, but the target `fileKey` already lives in `figma.config.json`, so no URL parsing happens and no new row is appended.

The skill has two effects on every successful invocation, for each selected project:

1. **`.projects/{name}/`** — fully overwrites `index.json`, `variables.json`, `styles.json`, `components.json` with a fresh pull from Figma. The output dir is created (with parents) if missing.
2. **`figma.config.json` → `.projects[]` entry** — patches the matching entry in place: `fileName` is synced from `meta.file.name`, and `defaultPageName` is re-resolved from `meta.pages[]` if `defaultPageId` is still present in the file. `fileKey`, `fileUrl`, `defaultPageId`, and `name` are never rewritten.

The skill does not refresh `.library.variables` and does not run any step against the library `fileKey`.

---

## Files in this skill

- `SKILL.md` — this document.
- *(no helper scripts of its own)* — this skill **reuses** `add-project/dump-project-index.js` and `add-project/assemble-project-index.sh` verbatim. The chunk staging directory is `/tmp/add-project-index-<name>/` so the assembler can find chunks unchanged. Keep both skills in lockstep when revising the dump/assemble pair.

---

## Preconditions

1. `figma.config.json` exists at the repo root and has `.version == 2`.
   - If missing, **do not** create it from scratch here — load `figma-init/config-init.md` and run that bootstrap first, then return.
2. `.library.fileKey` is non-empty — sanity check that the bootstrap actually completed.
3. `.projects[]` exists and has at least one entry.
   - If empty, **do not** prompt for a URL here — direct the user to `/add-project` (or to `figma-init/config-init.md`, which loops it for the first project) instead.
4. The user is refreshing a Figma **application / mockup** file (downstream consumer of the library), not the library itself. The library file is owned by `figma-init`'s main flow; this skill only touches `.projects[]`.

---

## Inputs

Collected interactively unless already supplied inline (see §Inline invocation below):

1. **Target selector** — which registered project to refresh. Four forms accepted:
   - A single project `name` (exact match against `.projects[].name`).
   - The literal string `all` — refresh every entry in `.projects[]`, sequentially.
   - A Figma URL (`figma.com/design/...`) — parse `fileKey` and reverse-lookup the matching `.projects[]` entry. See §URL-based lookup below.
   - Empty / no input — drive the picker via `AskUserQuestion` (see §Procedure step 2).
2. **The skill never registers a new project.** If the URL's `fileKey` doesn't match any existing `.projects[]` entry (or matches `.library.fileKey`), refuse and route the user to `/add-project` — never silently append. Identity stays owned by `add-project`.

### URL-based lookup

When the selector is a URL, parse it with the **same rules as `add-project`** — only `fileKey` is actually used for lookup, but apply the full table so behaviour stays consistent:

| Field             | Source                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `fileKey`         | First path segment after `/design/` (or `/file/`); for `/branch/<branchKey>/` URLs, use `branchKey`.   |
| `fileName`        | Next path segment, URL-decoded. **Ignored** for lookup (info-only — the on-disk `fileName` is whatever step 6 wrote last).                          |
| `defaultPageId`   | Value of the `node-id` query parameter with `-` replaced by `:`. **Ignored** for lookup — this skill never rewrites `defaultPageId`. |
| `fileUrl`         | Canonicalized `https://www.figma.com/design/<fileKey>/<fileName>`. **Ignored** for lookup.             |

Reject URLs that don't match the `figma.com/design/...` or `figma.com/file/...` shape — ask the user to re-paste rather than guessing. After parsing:

- `fileKey` matches `.library.fileKey` → refuse (`that's the library file — refresh via /figma-init, not /update-project`).
- `fileKey` matches exactly one `.projects[].fileKey` → that entry is the target. Proceed.
- `fileKey` matches no entry → refuse (`fileKey <X> is not registered; run /add-project to add it`). Show the list of currently registered `{name, fileKey}` pairs so the user can spot a typo.
- (Duplicate `fileKey` is impossible — `add-project` blocks it at registration time.)

### Inline invocation

If the user invokes the skill with an argument (`/update-project console`, `/update-project all`, `/update-project https://www.figma.com/design/...`), treat that token as the selector and skip the picker. Resolution order:

1. If the argument starts with `http://` or `https://` (or contains `figma.com/`) → URL form, apply §URL-based lookup.
2. Else if the argument is exactly `all` → `all` form.
3. Else → treat as a `name`. Exact match against `.projects[].name`; unknown name is a hard error (list the registered names and stop).

Anything that fails resolution is a hard error — never fall through to an interactive picker on inline calls, because that hides a wrong-paste from the user.

---

## Procedure

### Step 1 — Validate config

```bash
test -f figma.config.json || echo "config-missing"
jq -e '.version == 2 and (.library.fileKey // "") != ""' figma.config.json >/dev/null || echo "config-incomplete"
jq -e '(.projects // []) | length > 0' figma.config.json >/dev/null || echo "projects-empty"
```

- `config-missing` / `config-incomplete` → surface the error and load `figma-init/config-init.md`. Do not proceed.
- `projects-empty` → surface the error and route the user to `/add-project`. Do not proceed.

### Step 2 — Select target(s)

If the user supplied an inline arg, resolve it per §Inline invocation and skip the interactive picker. The three inline branches:

- **URL form** — parse per §URL-based lookup, then reverse-lookup the `.projects[]` entry:

  ```bash
  PARSED_KEY="<fileKey-from-url>"
  jq -e --arg fk "$PARSED_KEY" \
     '.library.fileKey != $fk and ((.projects // []) | map(select(.fileKey == $fk)) | length == 1)' \
     figma.config.json >/dev/null
  TARGET_NAME="$(jq -r --arg fk "$PARSED_KEY" \
     '.projects[] | select(.fileKey == $fk) | .name' figma.config.json)"
  ```

  If the `jq -e` test fails: refuse with the appropriate message from §URL-based lookup (library hit, or no match — list registered `{name, fileKey}` pairs) and stop.

- **`all`** — proceed to step 3 with every entry in `.projects[]`.

- **`name`** — proceed to step 3 with that single entry. Unknown name → list the registered names and stop.

If no inline arg was supplied, drive the picker:

1. Read the list of names:

   ```bash
   jq -r '.projects[] | [.name, .fileKey] | @tsv' figma.config.json
   ```

2. Choose the picker shape by entry count:

   | Project count | Picker                                                                                                                                                         |
   | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 1             | Skip the picker — refresh that single entry after confirming with the user.                                                                                    |
   | 2 – 3         | `AskUserQuestion` with one option per project (`label = name`, `description = fileKey + fileName`) plus an `all` option. Total options: 3–4.                   |
   | 4+            | `AskUserQuestion` with the 3 most recently added entries plus an `all` option (4 total); rely on the auto-provided **Other** choice for the user to type a specific `name` **or paste a URL** (re-run §URL-based lookup on the typed value). Validate the result against `.projects[].name` afterwards. |

3. Validate the selection. Unknown `name` → list the registered names back to the user and ask again (do not silently fall through).

### Step 3 — Resolve the work list

Build an ordered list of `{ name, fileKey, defaultPageId }` triples to process:

- Single name → one entry.
- `all` → every entry in `.projects[]`, in the order they appear in the file.

For each triple, run steps 4–6 sequentially. **Never parallelise across projects.** If any project fails, stop the loop and report progress so far (do not skip ahead).

### Step 4 — Pull project index into chunk staging

For the current `(name, fileKey)`:

**Pass `fileKey` = the project's `fileKey`** on every `use_figma` call — NEVER `.library.fileKey`. Pass `skillNames: "update-project,figma-use"`. Run calls sequentially — never parallelise.

#### 4a — Clear chunk staging

```bash
NAME="<the project's name>"
rm -rf "/tmp/add-project-index-$NAME" && mkdir -p "/tmp/add-project-index-$NAME"
```

The path keeps the `add-project-index-` prefix on purpose — `assemble-project-index.sh` hard-codes it. Do not invent a different directory.

#### 4b — Pull `meta`

Read `../add-project/dump-project-index.js`. Call `use_figma` with `code` =

```js
const TYPE = "meta"; const OFFSET = 0; const LIMIT = 0;
<body of dump-project-index.js>
```

Save the raw response **verbatim** to `/tmp/add-project-index-$NAME/meta.json`. The payload returns `file.name`, `pages[]`, `collections[]`, and `counts` (variables / styles / components / pages).

#### 4c — Pull category slices

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

### Step 5 — Assemble index files

```bash
.claude/skills/add-project/assemble-project-index.sh "$NAME"
```

The script HTML-decodes chunks, validates per-category offset coverage, and force-writes `.projects/$NAME/{index,variables,styles,components}.json` atomically. The output dir is created (with parents) if missing. Local edits to these files are lost on every run — they belong in Figma, not on disk.

Capture the script's stdout line for the report in step 7.

### Step 6 — Reconcile `.projects[]` entry from meta

After the assembler succeeds, read the **freshly-written** `.projects/$NAME/index.json` and patch the matching `.projects[]` entry in `figma.config.json`. Identity (`fileKey`, `fileUrl`, `name`) and the saved `defaultPageId` are preserved; only display-name fields are pulled forward from online truth.

```bash
NEW_FILE_NAME="$(jq -r '.file.name // ""' .projects/$NAME/index.json)"
DEFAULT_PAGE_ID="$(jq -r --arg n "$NAME" '.projects[] | select(.name == $n) | .defaultPageId' figma.config.json)"
NEW_PAGE_NAME="$(jq -r --arg pid "$DEFAULT_PAGE_ID" \
   '.pages[] | select(.id == $pid) | .name' .projects/$NAME/index.json)"

jq --arg name "$NAME" \
   --arg fileName "$NEW_FILE_NAME" \
   --arg pageName "$NEW_PAGE_NAME" \
   '.projects = (.projects | map(
       if .name == $name then
         . + ({ fileName: $fileName }
              + (if ($pageName // "") != "" then { defaultPageName: $pageName } else {} end))
       else . end
    ))' figma.config.json > figma.config.json.tmp && mv figma.config.json.tmp figma.config.json

jq . figma.config.json >/dev/null
```

Behavioural rules:

- **`fileKey` / `fileUrl` are never rewritten.** They are the entry's identity. If the user has actually moved to a different Figma file, that is a `/add-project` operation (register the new key, then optionally delete the old entry by hand), not an update.
- **`defaultPageId` is preserved as-is.** Page renames (= same id, new label) flow through `defaultPageName`. Page deletions (= id no longer in `meta.pages[]`) are a *warning*, not an auto-mutation: surface `defaultPageId <X> no longer exists in <name>` in the step 7 report and leave both `defaultPageId` and `defaultPageName` untouched. The user resolves it manually.
- **Empty `defaultPageId`.** If the existing entry has no `defaultPageId` (empty string), skip the `defaultPageName` reconciliation. `fileName` is still synced.
- **No new keys.** Only `fileName` and `defaultPageName` may be patched on the entry — never invent new fields here.

### Step 7 — Report

After processing the whole work list, print a per-project block plus a registry summary. Example for a single-project run:

```
.projects/console: refreshed — 1 collection / 78 variables, 24 styles, 12 components, 3 pages
figma.config.json .projects[console]: fileName "Console" → "Console v3", defaultPageName unchanged
```

The first line is `assemble-project-index.sh`'s stdout verbatim with a `refreshed — ` prefix. The second line summarises the step 6 diff: report each field as `unchanged`, `<old> → <new>`, or `warning: <msg>` (e.g. `warning: defaultPageId 12:34 no longer exists`).

For `all` runs, print one pair of lines per project in processing order, then a final line listing every project (`name` + `fileKey`) currently registered.

---

## Constraints

- **Refresh-only on identity.** `fileKey`, `fileUrl`, `name`, and `defaultPageId` are never rewritten by this skill. Only `fileName` and `defaultPageName` may be patched, and only from the freshly-pulled meta.
- **Project-scoped `use_figma`.** All `use_figma` calls in step 4 pass `fileKey` = the **project's** `fileKey` (from the existing entry), never the library's. Pass `skillNames: "update-project,figma-use"` on every call. Sequential calls only — never parallelise, neither within a project nor across projects in `all` mode.
- **Lightweight index, not a value dump.** `.projects/{name}/*.json` records ids, names, keys, types, page parents, and mode metadata only — no `valuesByMode`, no full paint / text / effect / grid style props. Full token values stay in `figma.config.json` → `.library.variables` (owned by `figma-init`'s main flow, against the library file).
- **Force-overwrite the index dir.** Every successful invocation rewrites `.projects/{name}/{index,variables,styles,components}.json` from scratch. Local edits to those files are lost — they belong in Figma, not on disk.
- **Single source of truth = online.** When the local `.projects/{name}/*.json` files and the live Figma file disagree, the live file wins on every run. No three-way merge, no "local wins" mode.
- **Identity-stable reconcile only.** Page deletions / id drift trigger a warning, not an auto-clear. The user fixes those by hand (or by rerunning `/add-project` against a new URL).
- **Atomic writes.** `figma.config.json` is rewritten through `figma.config.json.tmp` + `mv`. Each per-category index file is written atomically by `assemble-project-index.sh` (`.tmp` + `rename`).
- **Validate after write.** `jq . figma.config.json >/dev/null` and `jq . .projects/{name}/index.json >/dev/null` (et al.) must succeed before reporting success.
- **Verbatim chunk writes.** Each `use_figma` response in step 4 is written exactly as returned — do not parse, re-stringify, re-indent, or strip anything before saving. The assembler decodes HTML entities internally.
- **Stop on first chunk error.** Do not run the assembler against an incomplete chunk set. It will refuse with `offset gap` / `count mismatch`, but failing fast is better than relying on that.
- **Stop on first project failure in `all` mode.** Do not silently skip a failing project and proceed to the next. Report what succeeded and what failed; the user decides whether to retry.
- **Shared staging path.** Chunks for this skill live under `/tmp/add-project-index-<name>/` so the unmodified `add-project/assemble-project-index.sh` can read them. If you ever fork the assembler, fork the staging path too.

---

## When NOT to use this skill

- `.projects[]` is empty — use `/add-project` (or `figma-init/config-init.md` for the first-ever entry). This skill refuses to bootstrap.
- The user wants to register a **new** Figma file (i.e. a new `fileKey`) — that's `/add-project`. This skill cannot change `fileKey`.
- The user wants to refresh `.library.variables` (full token values on the library file) — that's `/figma-init` (main flow). This skill only refreshes the **project-side** lightweight index in `.projects/{name}/`.
- The user wants to register or update the library file itself — wipe `.library.{fileKey, fileUrl, fileName, defaultPageId, defaultPageName}` in `figma.config.json` and rerun `config-init.md`. The library is not a `.projects[]` entry.
- The user wants to remove a project — use `jq 'del(.projects[] | select(.fileKey == "..."))'` on `figma.config.json`, then `rm -rf .projects/<name>/` for the index dir. This skill is refresh-only.

---

## Cross-references

- [`../add-project/SKILL.md`](../add-project/SKILL.md) — sibling workflow that **adds** a new `.projects[]` entry. Reuses the same dump/assemble pair. URL parsing rules live there and are intentionally absent here — `update-project` never asks for a URL.
- [`../add-project/dump-project-index.js`](../add-project/dump-project-index.js) — parameterised `use_figma` payload (`TYPE = "meta" | "vars" | "styles" | "components"`). Reused verbatim by step 4.
- [`../add-project/assemble-project-index.sh`](../add-project/assemble-project-index.sh) — chunk merger / writer. Reused verbatim by step 5; the chunk staging path `/tmp/add-project-index-<name>/` is hard-coded there.
- [`../figma-init/config-init.md`](../figma-init/config-init.md) — first-time bootstrap that produces `.library.*` and loops `add-project` for the first entry. The redirect target when `.projects[]` is empty.
- [`../figma-init/SKILL.md`](../figma-init/SKILL.md) — the variable-pull main flow for the **library** file. Independent of `.projects[]`.
- `../../../figma.config.json` — the file this skill patches in §step 6.
- `../../../.projects/{name}/` — per-project index output dir. Already covered by `.gitignore` (project root rules `.projects/`).
