# States & responsive coverage

Missing states are the #1 source of handoff rework. Default-only designs look finished but aren't.

This project models interaction states as a **Variant axis** on the Figma component set — never as separate frames, detached copies, or hand-coloured one-offs. The MUI Library `<Button>` and `<Checkbox>` component sets are the canonical reference: every interactive component publishes a `State` axis whose values match the React component's runtime states.

## 1. Interaction states — the `State` Variant axis

For every interactive component, the `State` Variant axis must expose these values, with these exact capitalizations:

| `State`    | Runtime trigger                              | Visual delta over `Enabled`                                                                                          |
| ---------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Enabled`  | Idle / default.                              | Baseline — every other state is a delta on top of this one.                                                          |
| `Hovered`  | Pointer is over the component (`:hover`).    | Halo / overlay bound to `seed/{color}/hover-bg` (or `outline-hover` for danger / warning / secondary families).      |
| `Focused`  | Keyboard focus (`:focus-visible`).           | Ring / halo bound to `seed/{color}/focusVisible`. Required for accessibility — never skip.                           |
| `Pressed`  | Active press (`:active`).                    | May visually equal `Hovered` in v2 (same token). Keep as a distinct value so a future tighter pressed binding lands without a variant explosion. |
| `Disabled` | The runtime sets `disabled`.                 | Bindings switch to `alias/colors/text-disabled` / `alias/colors/bg-disabled`. Color-agnostic — see §1.2.             |

Use these names verbatim. Do **not** publish `Default`, `Hover`, `Active`, `Inactive` etc.: they break the source-to-Figma mapping that the per-component specs in `figma-components/` rely on (`Button.tsx`, `Checkbox.tsx`, … consume runtime states with the names above).

### 1.1 Variant axis structure

Pair `State` with the other canonical axes the library uses:

```
Color × Variant × State        (e.g. <Button>:    6 × 3 × 5 = 90 variants)
Color × Size × Checked × Indeterminate × State   (e.g. <Checkbox>: sparse — see §1.3)
```

The rule: `State` is **always its own axis**. Do not fold interaction states into `Variant` (which means visual style — `Text` / `Outlined` / `Contained`) or into a boolean property.

### 1.2 `Disabled` is color-agnostic

`Disabled` paints come from alias tokens (`alias/colors/text-disabled`, `alias/colors/bg-disabled`) that have no per-color-family variant. To avoid variant explosion:

- Publish `State=Disabled` only under `Color=Default` (one neutral cell per `Variant` × `Size`).
- Designers always pick `Color=Default, State=Disabled` regardless of the surrounding flow's brand color.
- Don't publish `Color=Primary, State=Disabled` (or any other non-default color × disabled) as a separate cell — it would render identically.

### 1.3 Reduced `State` axis is allowed — but must be tracked

A `State` axis may temporarily ship with fewer values **only** when the source code does not yet render those interaction halos. The current `<Checkbox>` set, for example, ships `State ∈ {Enabled, Disabled}` because `Checkbox.tsx` has no hover / focus / pressed styling yet.

When you reduce the axis:

- List the missing values in the component spec's variant-matrix exclusions (see e.g. `figma-components/Checkbox.md` §3).
- Add a "Source Sync Rule" entry that says the values must be reintroduced when source ships the corresponding styling.
- Picking a missing state in a mockup is a **request for source work**, not an excuse to detach and recolor.

## 2. Lifecycle / data states — different artifacts, not the same axis

Interaction states (§1) describe a single component reacting to pointer / keyboard. **Lifecycle states** describe whether the screen has data to show. They are not values on a component's `State` axis — they are different screens, or different instances composed together.

For every data-driven screen, explicitly design:

- **Populated** — the happy path.
- **Empty** — no data yet **and** filters returned nothing (these are two different empties; both need a design).
- **Loading** — skeleton or spinner. For async _actions_ on a trigger component (Button, etc.), introduce a separate `loading` BOOLEAN property on that component once the source exposes a `loading` prop — don't smuggle it into `State`.
- **Error** — fetch / mutation failure.

A screen that only shows "populated" is a screenshot, not a design.

## 3. Responsive / breakpoints

**Symptom:** A single fixed-width frame with no indication of narrower or wider behavior.

**Fix:**

- At minimum, design the canonical width **plus one constrained width** (e.g. a narrower container or a sidebar-collapsed state).
- Verify Auto Layout sizing (`HUG` / `FILL`) survives both. See [layout.md](layout.md).

## 4. Theme coverage

**Symptom:** Only the light variant produced even though the design system publishes dark tokens.

**Fix:**

- Bind colors to **semantic** variables, not palette primitives. Theme switch is then free. See [tokens.md](tokens.md).
- Hover / focus / pressed halos bind to per-color-family tokens (`seed/{color}/hover-bg`, `seed/{color}/outline-hover`, `seed/{color}/focusVisible`) — opacity is baked into the token value, never pasted as RGBA.
- `Color=Default` halos / focus rings fall back to `alias/colors/bg-outline-hover` and `seed/neutral/focusVisible` — `Default` has no seed family of its own.
- If any color is a one-off (not bound), it will break in dark mode — that's a token bug, fix it at the source.

## Self-check before declaring done

- [ ] Every interactive component publishes a `State` Variant axis using exactly `Enabled / Hovered / Focused / Pressed / Disabled` (or has a documented reduction per §1.3 in its component spec).
- [ ] `State` is its own axis, not folded into `Variant` or a boolean prop.
- [ ] `State=Disabled` is published only under `Color=Default` (color-agnostic — §1.2).
- [ ] Hovered / Focused / Pressed halos bind to `seed/{color}/hover-bg|outline-hover|focusVisible` tokens, not raw RGBA.
- [ ] Every data screen covers populated / empty / loading / error as separate artifacts (§2) — not as values on a component's `State` axis.
- [ ] Layout survives at least one alternate width.
- [ ] Dark / alt themes work via token swap, not a separate copy of the frame.
