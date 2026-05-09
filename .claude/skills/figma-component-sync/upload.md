# figma-component-sync · 上傳 (repo → Figma)

> **Status: stub.** This submodule is a placeholder. The only upload path that exists today is the standalone `figma-init` skill, and it covers variables only. Styles and component variants do **not** have an upload pipeline yet — adding one is intentional future work.
>
> When the operator routes here, do not improvise an upload. Either delegate to `figma-init` (when scope matches) or surface the gap and ask how they want to proceed.

## What exists today

### Variables — delegate to `figma-init`

`src/figma/variables.json` already has a force-overwrite uploader: the standalone **`figma-init`** skill. It packs the JSON into chunks under the `use_figma` 50 000-character limit, renders a fixed JS template per chunk, and feeds each through `use_figma` sequentially. The model never reads variable values.

To use it:

1. Make sure `src/figma/variables.json` reflects the desired target state (run `download.md` → `只同步 Styles + Variables` first if you need a fresh baseline, then edit).
2. Write `/tmp/params.json`:
   ```json
   {
     "fileKey": "<target-file-key>",
     "variablesPath": "src/figma/variables.json"
   }
   ```
3. Hand off to the `figma-init` skill — `Skill(skill: "figma-init")` or instruct the operator to run `/figma-init`. Do **not** reimplement its pack/render pipeline here.

`figma-init` only writes `valuesByMode`. `scopes`, `codeSyntax`, `description`, and `name` on existing variables are left alone; variables present in the JSON but missing from Figma are reported as errors, not created. Variables in Figma but missing from the JSON are untouched. Read its SKILL.md for the full contract before driving it.

## What is **not** implemented

Surface this list when the operator picks `上傳` and asks what's possible:

- **Style upload** (`src/figma/styles.json` → Figma local text/effect/paint/grid styles). No script, no `use_figma` template, no variant-aware diffing. Adding it is the obvious next step but has not started.
- **Component-variant upload** (`src/figma/components/<name>/*.json` → component sets in Figma). The download side dumps Figma REST format; recreating those variants on the canvas requires a Plugin API authoring pipeline that doesn't exist. Today, components are authored by hand or via `figma-create-component`, then downloaded as a snapshot — never uploaded from snapshot.
- **Variable creation / deletion / rename / scope edits.** `figma-init` only force-writes `valuesByMode` on already-existing variables. Anything beyond that — adding a new variable, removing one, changing its scopes / description / name — has no automated path here.

## Procedure

1. Confirm the operator's target with one `AskUserQuestion`:

   | label                      | description                                                                                  |
   | -------------------------- | -------------------------------------------------------------------------------------------- |
   | `Variables (figma-init)`   | Force-overwrite variable values from `src/figma/variables.json`. Delegates to `figma-init`. |
   | `Styles / Components / 其他` | Not yet implemented. Surface the gap and stop.                                              |

2. If they pick **Variables**: confirm the target `fileKey`, prepare `/tmp/params.json` as above, then hand off to `figma-init`. Surface `figma-init`'s rolled-up report verbatim.

3. If they pick **Styles / Components / 其他**: explain that the upload path doesn't exist yet, point at the "What is not implemented" list above, and ask whether they want to scope out the missing piece as a follow-up. Do **not** stub something together with `use_figma` on the spot — the download side already shows that one-off chunk plumbing is brittle, and upload mistakes mutate the source of truth.

## Cross-cutting reminders

- **Force-overwrite, no diff.** Same as the download side — once an upload starts, every key in scope is written. Don't try to merge or skip "matching" values.
- **`figma-init` runs `use_figma` calls strictly sequentially.** Never parallelise, never amend its templates from this skill.
- **Don't run upload as a "fix" for a failed download.** If `download.md` produced bad local files, fix them locally (or rerun the download); pushing them to Figma will just propagate the error.
