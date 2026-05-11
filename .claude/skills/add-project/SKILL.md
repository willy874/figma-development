---
name: add-project
description: Append a referenced Figma application file (a downstream consumer of the library) to `figma.config.json` under `.projects[]`. Accepts a Figma page URL paste and parses out the file key / file name / default page id; only asks for the short project label and the page name on top of the URL. Use when the user says "/add-project", "add another Figma project", "新增引用專案", "把這個 Figma 檔加進去", or pastes a `figma.com/design/...` URL with an intent to register it.
---

# add-project

Incremental add-one workflow for `figma.config.json`'s `.projects[]` array. Companion to `figma-init`'s `config-init.md` (which collects the **first** project during bootstrap) — this skill is the right entry point once `figma.config.json` already exists and the user wants to register **another** consumer file.

This skill is **append-only on `.projects[]`**. It does not touch `.library.*`, does not call `use_figma`, does not pull variables, and does not move on to `figma-init`'s main variable-pull flow.

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

### Step 5 — Report

Print one summary line, e.g.:

```
figma.config.json .projects: added "console" (fileKey=ABC123…, defaultPageId=12:34)
```

Then list every project currently registered (`name` + `fileKey`) so the user can confirm.

---

## Constraints

- **Append-only / update-in-place on `.projects[]`.** Never touch `.library.*`, `.version`, or any other top-level key.
- **No `use_figma`.** This skill is metadata-only — it does not call the Figma plugin API. Use `figma-init` (main flow) afterwards if the user wants library variable values refreshed.
- **No silent duplicates.** Same `fileKey` already present → ask before overwriting; never append twice.
- **`fileKey` is the identity.** `name` is a human label that can be edited later; the registry is keyed on `fileKey`.
- **Atomic write.** Write through `figma.config.json.tmp` + `mv`, never overwrite in place — partial writes corrupt the config.
- **Validate after write.** `jq . figma.config.json >/dev/null` must succeed before reporting success.

---

## When NOT to use this skill

- `figma.config.json` doesn't exist yet — use `figma-init/config-init.md` instead (it bootstraps `.library.*` and collects the **first** project).
- The user wants to refresh `.library.variables` (the variable values) — that's `/figma-init` (main flow).
- The user wants to register or update the library file itself — edit `.claude/skills/figma-create-component/library-components.md`'s Source link and rerun `config-init.md`. The library is not a `.projects[]` entry.
- The user wants to remove a project — use `jq 'del(.projects[] | select(.fileKey == "..."))'` directly; this skill is add/update only.

---

## Cross-references

- [`../figma-init/config-init.md`](../figma-init/config-init.md) — the first-time bootstrap that produces `.library.*` and `.projects[0]`. Shares the URL parsing rules in §6; both must stay in sync.
- [`../figma-init/SKILL.md`](../figma-init/SKILL.md) — the variable-pull main flow. Does not depend on `.projects[]`, but checks that ≥ 1 entry exists before proceeding.
- `../../../figma.config.json` — the file this skill mutates.
- `../../../figma.config.example.json` — the tracked v2 schema template.
