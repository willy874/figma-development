---
name: render-check
description: Post-write verification pass for Figma output. Spawns a Sonnet sub-agent that audits the freshly drawn node(s) against the rules in `figma-operator-guide` — with primary emphasis on visual fidelity to the source (screenshot / HTML / design intent), and secondary checks on structure, Auto Layout, tokens, and hygiene. Trigger automatically after any `use_figma` / `generate_figma_design` write completes, or when the user says "render check", "檢查繪製結果", "驗收 Figma", or `/render-check`.
---

# Render Check — Post-write Figma audit

After Claude Code finishes drawing or editing nodes in Figma, the result frequently _looks_ close in a thumbnail but is wrong on closer inspection: wrong spacing, drifted colors, off-by-one structure, missing states, hard-coded values instead of tokens. This skill runs a second pair of eyes.

The check is performed by a **sub-agent** (Sonnet) so the main session's context is not flooded with screenshot + node-tree output. The sub-agent returns a verdict + a punch list.

---

## When to invoke

- Immediately after any Figma write batch (`use_figma` create/edit, `generate_figma_design`, `figma-create-component` authoring step) completes.
- When the user explicitly asks to verify / review what was just drawn.
- Skip for trivial single-property edits (renaming a layer, toggling visibility) — reserve for anything that produced new structure or visual surface.

Run at most once per write batch. If the sub-agent flags issues and the main agent fixes them, you may re-run once to confirm.

---

## Required inputs (the main agent must collect these before spawning)

1. **Target node** — `fileKey` + `nodeId` of the frame that was just drawn / edited. If a batch produced multiple roots, list each.
2. **Source of truth for visual comparison** — at least one of:
   - the original screenshot / image the user provided,
   - the source HTML URL or pasted markup (for HTML → Figma flows),
   - the reference Figma node that was being mirrored,
   - a written description of the intended visual.
3. **Scope hints** — what the write batch was supposed to accomplish (e.g. "add hover variant", "build Settings page hero section"). Lets the sub-agent ignore unrelated surrounding nodes.

Do NOT spawn the sub-agent without all three. If any is missing, ask the user or re-derive from conversation context first.

---

## How to spawn

Use the `Agent` tool with `subagent_type: "general-purpose"` and `model: "sonnet"`. Pass a self-contained prompt — the sub-agent does not see this conversation.

The prompt must:

- State the target node (fileKey + nodeId) and the source-of-truth reference.
- Instruct the sub-agent to **load `.claude/skills/figma-operator-guide/SKILL.md` first** and pull in the relevant submodules (`layout.md`, `tokens.md`, `component-rules.md`, `hygiene.md`, `accessibility.md`, `content.md` as applicable).
- Instruct the sub-agent to call `get_screenshot` on the target node and (where useful) `get_metadata` / `get_variable_defs` to inspect structure and bindings.
- Make clear that **visual fidelity to the source is the primary check** — structural / token / hygiene findings are reported but ranked below visual mismatches.
- Ask for a structured report (see "Expected output" below) and cap the length.

Example skeleton:

```
You are auditing a Figma render that another agent just produced.

Target: fileKey=<KEY>, nodeId=<ID>
Source of truth: <screenshot path / HTML URL / reference nodeId / description>
What the write batch was supposed to do: <scope hint>

Steps:
1. Load .claude/skills/figma-operator-guide/SKILL.md and the submodules whose triggers match this task.
2. Call get_screenshot on the target node. Compare side-by-side with the source.
3. Call get_metadata and get_variable_defs on the target as needed to verify Auto Layout, sizing, token bindings, and layer hygiene.
4. Produce the structured report below. Under 400 words. Do not modify the Figma file.

Report format:
- Verdict: PASS / PASS-WITH-NITS / FAIL
- Visual mismatches (ranked, each: location → expected vs actual → severity)
- Structural / token / hygiene findings (bulleted, each tagged with the operator-guide submodule it comes from)
- Suggested fixes (concrete, actionable — node id + property where possible)
```

---

## What the sub-agent checks (priority order)

1. **Visual fidelity** — does the rendered node match the source screenshot / HTML / reference at a glance and on close inspection? Layout proportions, spacing rhythm, color, typography, iconography, content. This is the dominant signal.
2. **Auto Layout integrity** — per `layout.md`: no stray absolute positioning, sensible `HUG` / `FILL` sizing, spacing via `itemSpacing` + padding (not `x` / `y`). Resize self-check.
3. **Token bindings** — per `tokens.md` + `figma-create-component/library-tokens.md`: colors / spacing / radii / typography bound to variables and text styles, not raw values. Off-scale numbers flagged.
4. **Component reuse** — per `component-rules.md` + `figma-create-component/library-components.md`: did the agent re-implement geometry where a published component already existed?
5. **Content** — per `content.md`: real data, not Lorem ipsum or "Label Label Label".
6. **States coverage** (if interactive) — per `states.md`.
7. **Accessibility & hygiene** — per `accessibility.md` + `hygiene.md`: contrast, touch target, focus, layer names, no orphan / detached instances.

When findings conflict, the operator guide's priority order applies: design-system fit > tokens > Auto Layout > pixel-perfect.

---

## Expected output (back to the main agent)

The sub-agent returns a single structured report. The main agent should:

- Surface the **Verdict** line verbatim to the user.
- Quote the **Visual mismatches** list as-is (this is the part the user cares about most).
- Treat the **Suggested fixes** as a punch list — apply the ones the user approves, then optionally re-run this skill once.

Do not silently swallow a FAIL verdict. If the sub-agent reports FAIL, stop and surface it before doing anything else.

---

## Related skills

- `figma-operator-guide` — the ruleset this check enforces.
- `figma:figma-use` — required reading for any subsequent fix that writes back to Figma.
- `figma-create-component` — the component-authoring pipeline this check often runs at the tail end of.
