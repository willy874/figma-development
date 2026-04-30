# Component rules: reuse first, design second

> For the **actual inventory** of published components in this project's Figma file (names, node IDs, variants), see [components.md](../components.md). This file is about the _rules_ for working with components.

## 1. Reuse over rebuild

If [discovery](discovery.md) — or [components.md](../components.md) — returned a matching component, **import and configure the instance**; do not rebuild from geometry.

- Use variant properties and instance swaps for the intended variation.
- If an override isn't reachable through the component's property surface, that's a signal the component API is wrong — extend the main component, don't detach.

## 2. Promote repeats to components

Before producing the **second instance** of any visual pattern, stop and create a Component.

- Name it using the design system's existing naming convention (check sibling components in [components.md](../components.md) first — e.g. `Tag / Success`, not `green-tag`).
- Place it on the library/components page, not inline next to the consuming screen.
- Expose only properties that actually vary (text, icon, state). Don't expose everything "just in case."

## 3. Component API hygiene

### Prefer Slot over Instance Swap

When a property exists to let consumers inject content, default to a **Slot Property** (a nested frame they fill with arbitrary children) rather than an **Instance Swap Property** (a single instance reference they replace).

- **Slot** accepts any layer or composition — text + icon, multiple chips, an empty state, nothing at all. Consumers don't have to detach to combine.
- **Instance Swap** is constrained to one instance of one component. The moment a consumer needs two icons, an icon + label, or a non-component element, they detach — which violates Rule 5.
- Use Instance Swap **only** when the slot must be exactly one instance of a known, enumerable component set (e.g. an `Icon` slot in a button that only ever holds an icon from the icon library). If there's any chance of mixed or composed content, use a Slot.

See Section 4 for the required Auto Layout defaults that make slots safely pass-through.

### Creating SLOTs via Plugin API (do NOT fall back to INSTANCE_SWAP)

A real Figma SLOT (`node.type === 'SLOT'`) is created by calling **`componentNode.createSlot()`** — the method lives on each variant `COMPONENT`, not on the `figma` global, and not on `COMPONENT_SET`. The bundled plugin typings shipped with this project's Figma plugin cache can lag the runtime by many versions and may show **zero** mentions of `slot` even though the runtime fully supports it.

When the user asks for a "Slot" / "SLOT", do not silently downgrade to `INSTANCE_SWAP` because the local typings look empty. Try in this order:

1. **`variant.createSlot()`** on each variant `COMPONENT` (the canonical API). Returns a `SlotNode` already parented to the variant; configure auto-layout per Section 4 and append default content.
2. If `createSlot` is missing at runtime, fetch the upstream typings to confirm the method name / signature before giving up:
   - `https://raw.githubusercontent.com/figma/plugin-typings/master/plugin-api-standalone.d.ts` (canonical, always current)
   - The plugin you have installed via `claude-plugins-official/figma/<version>/` may also have a newer release on GitHub — check `https://raw.githubusercontent.com/figma/mcp-server-guide/HEAD/.claude-plugin/plugin.json` for the upstream version and prompt the user to `/plugin` update if it's behind.
3. Only after both runtime and upstream typings confirm SLOT is genuinely unavailable, fall back to a named `INSTANCE_SWAP` property — and tell the user explicitly that you downgraded and why.

What does **not** work and should not be retried:
- `figma.createSlot()` — the factory is on `ComponentNode`, not the global.
- `slot.clone()` — degrades to `FRAME`, loses the SLOT type.
- `figma.createNodeFromJSXAsync({ type: 'SLOT' })` — returns "not yet supported".
- `frame.markAsSlot()` / `instance.markAsSlot()` — no such method exists.

### Over-exposed properties

**Symptom:** A Button with 14 boolean props, half never set.
**Fix:** Expose only variation that exists in real usage. Prefer **variants** for discrete states (size, tone, state); prefer **slots** for content flexibility (see "Prefer Slot over Instance Swap" above).

### Variant explosion

**Symptom:** Cartesian product of every prop → hundreds of variants, most unused.
**Fix:** Split orthogonal concerns into separate properties; don't enumerate unused combinations.

### Missing description / usage notes

**Symptom:** Component has no description or "when to use / not use" guidance.
**Fix:** Short description + one-line usage rule on every published component.

## 4. Slot Property defaults

Whenever a component exposes a **Slot Property** (an inner frame consumers swap content into), the slot frame MUST default to:

- **Auto Layout**: on
- **Direction**: Vertical
- **Height**: Hug contents
- **Gap**: `0`
- **Padding**: `0`

A slot is a pass-through container — it imposes no layout opinions on injected content. Consumers set their own spacing and direction; the slot just hugs whatever lands in it. Any non-zero gap/padding or fixed height silently distorts every consumer's layout.

## 5. Never detach to "just tweak it"

A detached instance is a bug:

- It can't receive future updates from the main component.
- It silently drifts from the system.

If you need a variation the main component doesn't support, **add the property/variant to the main component** and use it as an instance. If the change is truly one-off, question whether it belongs in the design at all.

## Self-check

- [ ] Every reusable-looking element is an instance, not raw geometry.
- [ ] No visual pattern appears twice as loose layers.
- [ ] New components live on the library page, not inline.
- [ ] Component properties describe real variation, not hypothetical flexibility.
- [ ] No detached instances anywhere in the output.
