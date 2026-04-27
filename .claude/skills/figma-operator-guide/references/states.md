# States & responsive coverage

Missing states are the #1 source of handoff rework. Default-only designs look finished but aren't.

## 1. Required states for interactive components

For every interactive component, explicitly design:

- **Default**
- **Hover** (and / or **Focus**)
- **Active / pressed** (if meaningful)
- **Disabled**
- **Loading** (if the action is async)
- **Error** (if validation / failure is possible)

For every data-driven screen, explicitly design:

- **Populated** (the happy path)
- **Empty** (no data yet, or filters returned nothing — these are two different empties)
- **Loading** (skeleton or spinner)
- **Error** (fetch failure)

A screen that only shows "populated" is a screenshot, not a design.

## 2. Responsive / breakpoints

**Symptom:** A single fixed-width frame with no indication of narrower or wider behavior.

**Fix:**

- At minimum, design the canonical width **plus one constrained width** (e.g. a narrower container or a sidebar-collapsed state).
- Verify Auto Layout sizing (`HUG` / `FILL`) survives both. See [layout.md](layout.md).

## 3. Theme coverage

**Symptom:** Only the light variant produced even though the design system publishes dark tokens.

**Fix:**

- Bind colors to **semantic** variables, not palette primitives. Theme switch is then free. See [tokens.md](tokens.md).
- If any color is a one-off (not bound), it will break in dark mode — that's a token bug, fix it at the source.

## Self-check before declaring done

- [ ] Every interactive component covers default / hover / focus / disabled / loading / error.
- [ ] Every data screen covers populated / empty / loading / error.
- [ ] Layout survives at least one alternate width.
- [ ] Dark / alt themes work via token swap, not a separate copy of the frame.
