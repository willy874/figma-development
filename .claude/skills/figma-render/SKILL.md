---
name: figma-render
description: End-to-end pipeline for rendering a web page / localhost view / local HTML file into a Figma project frame. Collects the reference URL and the target Figma page up front, inspects the live reference via Chrome DevTools MCP, authors the Figma content via `use_figma` under the rules in `figma-operator-guide`, then audits the result with `render-check`. Trigger when the user says "/figma-render", "render this into Figma", "把這個畫面畫到 Figma", "畫一個截圖到 Figma 頁面", or pastes a web/localhost/HTML URL together with a Figma page URL.
---

# figma-render — Reference URL → Figma frame

This skill drives the full pipeline for turning a live visual reference (a web page, a `localhost` dev view, or a local `.html` file) into a Figma frame inside one of the project's registered application files. It is a **router and orchestrator** — it does not replace `figma-operator-guide`, `figma-use`, or `render-check`, it sequences them.

The deliverable is a freshly drawn frame on the agreed Figma page that matches the visual reference, authored with the project's design system (variables / styles / published components), and signed off by a `render-check` audit.

---

## Pipeline

Execute the steps in order. Use `TaskCreate` to track progress and mark each task complete as soon as it finishes (don't batch).

### Step 1 — Collect inputs

Trigger a single `AskUserQuestion` call that gathers both inputs at once. Do **not** proceed past this step until both are provided.

1. **Reference URL** — what we are going to draw. One of:
   - a public web URL (`https://...`),
   - a local dev server URL (`http://localhost:...`, `http://127.0.0.1:...`),
   - a local HTML file path / `file://` URL.
2. **Figma URL** — the target Figma page where the frame will be authored. Must be a `figma.com/design/...` URL with a `node-id` query param so we can derive `fileKey` + `pageId`.

Parse the Figma URL:

- Extract `fileKey` from `/design/<fileKey>/...`.
- Extract `pageId` from the `node-id` query param (convert `-` → `:`).

Reconcile against `figma.config.json` → `.projects[]`:

- If an entry with the same `fileKey` already exists, use it as the authoring target. Surface `name` + `defaultPageName` back to the user so they can confirm the right project.
- If no entry matches, invoke the `add-project` skill with the supplied Figma URL **before** moving on. `add-project` will register the project under `figma.config.json` and pull the per-project index under `.projects/{name}/`. Resume this pipeline only after it finishes.

Record in the task list: the resolved `fileKey`, `pageId`, project `name`, and the reference URL.

### Step 2 — Inspect the reference via Chrome DevTools MCP

Before any Figma write, load the **`figma:figma-use`** skill (mandatory prerequisite for `use_figma`) so the authoring step in Step 3 is ready to fire without an extra round-trip.

Then drive `chrome-devtools` MCP to gather the source of truth:

- Open / navigate the page with `mcp__chrome-devtools__new_page` (or `navigate_page` if a page already exists).
- Capture at least one full-viewport screenshot via `mcp__chrome-devtools__take_screenshot` — this becomes the primary visual reference for both Step 3 authoring and Step 4 audit.
- Pull a structural snapshot via `mcp__chrome-devtools__take_snapshot` to enumerate the section/component hierarchy, computed styles, and text content.
- For pages with conditional state (auth gates, modals, hover-only affordances), drive `click` / `hover` / `fill` to reach the state the user actually wants drawn, then re-screenshot.
- If the reference is a local HTML file, prefer `file://` over copying markup — the live render is what we want to mirror.

Save the screenshot path(s) in the task list — Step 4 needs them as "source of truth" inputs for `render-check`.

### Step 3 — Author the Figma content

Load **`figma-operator-guide`** and pull in the situational submodule(s) that match the task (typically `layout.md`, `tokens.md`, `component-rules.md`, `hygiene.md`, `content.md`; add `states.md` / `accessibility.md` if applicable). The operator guide is the ruleset; this skill does not redefine it.

Author against the resolved `fileKey` + `pageId` using `mcp__plugin_figma_figma__use_figma`:

- Re-use published components / variables / text styles from the project's library wherever possible — consult `.projects/{name}/{components,variables,styles}.json` and `figma.config.json` → `.library` to discover what exists. Do not re-implement geometry for things the library already covers.
- Build the frame section-by-section, top-down, mirroring the Chrome DevTools snapshot's hierarchy. Prefer Auto Layout with `HUG` / `FILL` sizing and token-bound spacing over absolute coordinates.
- When in doubt about visual fidelity vs design-system fit, the operator guide's priority order applies: design-system fit > tokens > Auto Layout > pixel-perfect.

After each meaningful sub-section is drawn, snapshot the in-progress node via `mcp__plugin_figma_figma__get_screenshot` and self-check against the Chrome DevTools reference before continuing.

### Step 4 — Render check

Invoke the **`render-check`** skill against the freshly drawn root frame. Required inputs for that skill:

1. **Target node** — `fileKey` + `nodeId` of the frame produced in Step 3.
2. **Source of truth** — the Chrome DevTools screenshot path(s) from Step 2, plus the reference URL itself.
3. **Scope hint** — one sentence describing what was supposed to be drawn (e.g. "Settings page hero section rendered from `http://localhost:3000/settings`").

Surface the sub-agent's **Verdict** + **Visual mismatches** verbatim to the user. If the verdict is `FAIL`, stop and report before doing anything else; do not silently iterate.

If the verdict is `PASS-WITH-NITS` and the user approves the punch list, apply the fixes via `use_figma` (still under `figma-operator-guide`), then optionally re-run `render-check` **once** to confirm.

---

## Related skills

- `add-project` — registers a Figma application file under `figma.config.json` when the target project isn't already known.
- `figma:figma-use` — mandatory prerequisite for every `use_figma` call in Step 3.
- `figma-operator-guide` — the ruleset Step 3 authors against.
- `render-check` — the audit pass in Step 4.
- `update-project` — refresh the per-project index if the project is registered but its `.projects/{name}/*.json` looks stale before Step 3.
