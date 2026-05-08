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

### Slot-first: the decision rule for `addComponentProperty`

Whenever you call `addComponentProperty` (or design any content-injection surface), the **default ComponentPropertyType is `SLOT`**. `INSTANCE_SWAP` is the narrow fallback, not the starting point. The goal is to extend each component's property surface with SLOT capability and actively retire INSTANCE_SWAP from the default vocabulary.

**Pick `SLOT` when any of these apply** (most components do):

- **Sub-components are involved.** If the Figma component is composed of, or expected to host, other components that consumers may rearrange, replace, or combine, that is exactly the case SLOT was designed for. Sub-component composition ⇒ SLOT.
- **The React component's primary content API is `children`.** Card, Dialog, Drawer, Modal, ListItem, MenuItem, Tooltip, Popover, Section… — anything whose runtime contract is "render whatever the consumer passes". `children` ≈ SLOT; mirror the runtime flexibility in Figma so the design API matches the code API.
- **The injected content is heterogeneous or open-ended** — text + icon, multiple chips, a mixed composition, an empty state, or nothing at all.
- **You cannot enumerate every shape the content might take** in advance.

A SLOT is a pass-through container — consumers fill it with arbitrary children without detaching. See Section 4 for the auto-layout defaults that keep slots opinion-free.

**Pick `INSTANCE_SWAP` only when all of these hold:**

- The slot must be exactly **one** instance.
- That instance must come from a **known, enumerable** component set (e.g. the icon library).
- There is **no realistic future** in which a consumer needs to compose, combine, or mix content there.

A canonical example: a Button's leading `Icon` slot that always holds exactly one icon from the icon library. The moment a consumer might want two icons, an icon + label, or a non-component element, they will detach — violating Rule 5. **When in doubt, choose `SLOT`.**

### Rule: local Plugin API typings can lie about what is supported

> **Treat the bundled Plugin API typings as a stale snapshot, not as ground truth.** When the local `.d.ts` shows no method, no type, or an "unsupported" comment for a capability you need, that absence is **not** evidence the runtime lacks it. The shipped typings cache often trails the live Figma runtime by many versions. Before declaring a feature unavailable, verify against the **upstream** typings and, where possible, probe the **runtime** itself — only then is it fair to fall back.

This rule is the reason the SLOT workflow below exists, and it generalises: any time a Figma capability appears missing from local typings, follow the same verify-upstream-then-runtime path before downgrading.

### Creating SLOTs via Plugin API (do NOT silently downgrade to INSTANCE_SWAP)

A real Figma SLOT (`node.type === 'SLOT'`) is created by calling **`componentNode.createSlot()`** — the method lives on each variant `COMPONENT`, not on the `figma` global, and not on `COMPONENT_SET`. Per the rule above, the bundled plugin typings in this project's Figma plugin cache can lag the runtime by many versions and may show **zero** mentions of `slot` even though the runtime fully supports it.

When the user asks for a "Slot" / "SLOT", or when the decision rule above selects SLOT, do not silently downgrade to `INSTANCE_SWAP` because the local typings look empty. Try in this order:

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
- `set.addComponentProperty('My Slot', 'SLOT', …)` — registering a SLOT property at the COMPONENT_SET level via `addComponentProperty` rejects every defaultValue probed (`null`, `{}`, `''`, missing) with `"Property defaultValue failed validation"`. The runtime intentionally routes SLOT registration through `variant.createSlot()` instead. (Re-probe upstream typings if you suspect the API has gained a SLOT default-shape since.)

### One SLOT property on the Main Component, all variants reuse it

Calling `variant.createSlot()` on **each** variant **registers a separate SET-level SLOT property per call**. After authoring N variants, `componentPropertyDefinitions` shows N entries (`Message Slot#873:0`, `Message Slot#874:0`, …) and an instance's right panel exposes N separate controls. Almost never the intent — designers should see one slot, not one-per-variant.

Consolidate immediately after the per-variant `createSlot` pass:

1. **Pick the first slot's property id as canonical** (e.g. `Message Slot#873:0`).
2. **Rebind every other variant's slot node** to the canonical id — `slot.componentPropertyReferences = { ...existing, slotContentId: '<canonical>' }`. The binding key for slots is `slotContentId` (not `mainComponent` — that's for INSTANCE_SWAP).
3. **Delete the duplicate properties** — `set.deleteComponentProperty('<dup-id>')` per orphan.

After consolidation, `componentPropertyDefinitions` shows exactly one entry for the slot, and an instance exposes exactly one slot control.

The Main-Component-defines-once / variants-reuse pattern generalises to TEXT, BOOLEAN, INSTANCE_SWAP — register the property once at the COMPONENT_SET level via `set.addComponentProperty(name, type, defaultValue)`, then bind inner nodes via `componentPropertyReferences.{characters, visible, mainComponent}`. SLOT is the special case where `addComponentProperty` doesn't accept a viable defaultValue, so the per-variant + post-hoc-consolidate workflow is unavoidable. The end state is identical: one property entry, all variants reuse.

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
- **Clip Content**: off

A slot is a pass-through container — it imposes no layout opinions on injected content. Consumers set their own spacing and direction; the slot just hugs whatever lands in it. Any non-zero gap/padding or fixed height silently distorts every consumer's layout.

### Migrating an existing wrapper into a SLOT

Existing components often have a wrapper Auto Layout with non-zero padding (`8 0`, `4 16`, etc.) around the content that's about to become the slot. The slot itself MUST default to padding `0` per the rule above — but discarding the wrapper's padding loses visual parity with the prior layout. Migrate cleanly:

1. **Sum the wrapper's prior vertical / horizontal padding into the parent cell's outer padding.** Example: MUI `MuiAlert-message` had `padding: 8 0` inside a cell with `padding: 6 16`. After promoting the message wrapper to a SLOT, the slot has `padding: 0` and the cell becomes `padding: 14 16` (`6 + 8 = 14`). Net visual: cell-edge → default-content top unchanged at 14 px.
2. **Document the side-effect** in the component spec's §7 (divergences) so consumers know what to compensate for. When designers drop their own custom content into the slot, that content sits with the cell's outer padding (`14 16` in the example) — if the custom content has its own internal padding, the total visible whitespace stacks.

### Single default content forces uniform per-variant styling

Once all variants share a single SLOT property (per §3 "One SLOT property on the Main Component"), the slot's **default content** is also uniform across variants. Any per-variant styling that previously lived in the wrapper TEXT — e.g. font weight differing across Severity / Default variants — is lost the moment designers rely on the slot's default. The slot's default TEXT can only carry one set of paint / font / size values.

Two resolution patterns:

- **Accept uniformity (default).** Pick one default-content treatment — usually the most common variant's — and document the lost differentiation as a `figma.spec.md` §7 divergence. Designers needing a different treatment override the slot per instance, or drop a styled custom component into it.
- **Promote differentiation to a Variant axis** when the design semantics genuinely require per-variant styling on the default content. Either model the variation as a new Variant axis above the slot (so the variant decides which sub-component to host inside), or expose a sibling property the slot's default content reads from. This expands the variant matrix — only do it when the differentiation is load-bearing.

Default to uniformity unless a design-system requirement explicitly calls for the differentiation.

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
