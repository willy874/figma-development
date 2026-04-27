---
name: figma-operator-guide
description: Operator guide for driving Claude Code to produce high-quality Figma designs. Load this BEFORE generating or editing Figma files. Acts as a router — pulls in the situational submodule(s) that match the current task.
---

# Figma Operator Guide — Router

When Claude Code writes directly to Figma (via `use_figma`, `generate_figma_design`, or similar), it tends to produce output that _looks_ correct in a screenshot but is structurally broken as a design file — unusable for designers, un-maintainable, and disconnected from the design system.

This skill is organized as **situational submodules**. Load the ones whose triggers match the current task. `discovery.md` is always the starting point; `hygiene.md`, `accessibility.md`, and `handoff.md` are always the closing review.

Load alongside `figma:figma-use` and `figma:figma-generate-design`.

---

## Priority order when a conflict arises

When the screenshot, the system, and layout intent disagree, resolve in this order:

1. **Design system components** — if one fits, use it even if slightly different from the mock.
2. **Design system variables / text styles** — bind tokens over inventing values.
3. **Auto Layout structure** — resize-safe composition over pixel positioning.
4. **Pixel-perfect match to the screenshot**.

The screenshot is a **visual target**, not a **structural spec**.

---

## Submodule index

Each submodule lists its own `triggers:` block. Load the ones that match.

### Phase 1 — Before you write (always)

- **[discovery.md](references/discovery.md)** — Starting any Figma write task. Run `get_libraries` → `search_design_system` → `get_variable_defs` **first**.

### Phase 2 — While you build (situational)

- **[component-rules.md](references/component-rules.md)** — Inserting, duplicating, or creating any reusable UI (button, input, card, tag, modal). Or designing a component's variant/property API.
- **[components.md](components.md)** — You need the **actual inventory** of this project's published components (names, node IDs, variant counts).
- **[layout.md](references/layout.md)** — Creating a container frame, setting `x`/`y`/`width`/`height`, or considering `layoutPositioning: "ABSOLUTE"`.
- **[tokens.md](references/tokens.md)** — Applying any color, spacing, radius, shadow, or typography value. **Required** whenever you call `setBoundVariableForPaint` — see "Plugin API binding" section for the mandatory helper pattern that prevents silent black-fill failures.
- **[content.md](references/content.md)** — Filling text, table rows, labels, or reaching for Lorem ipsum / generic placeholder data.

### Phase 3 — Before you declare done (always)

- **[states.md](references/states.md)** — Finishing an interactive component or data-driven screen. Cover hover/focus/disabled/loading/empty/error and alternate widths/themes.
- **[accessibility.md](references/accessibility.md)** — Final review: contrast, touch targets ≥44px, icon-only labels, visible focus.
- **[hygiene.md](references/hygiene.md)** — Final review: meaningful layer names, no orphans, no detached instances, correct page placement.
- **[handoff.md](references/handoff.md)** — Final review: information hierarchy, dev annotations for non-visual behavior, Code Connect mappings.

---

## Minimum viable workflow

1. **Discover** → [discovery.md](references/discovery.md)
2. **Build containers** → [layout.md](references/layout.md)
3. **Insert components, not geometry** → [component-rules.md](references/component-rules.md) + [components.md](components.md)
4. **Bind tokens** → [tokens.md](references/tokens.md)
5. **Fill real content** → [content.md](references/content.md)
6. **Cover states** → [states.md](references/states.md)
7. **Final review** → [accessibility.md](references/accessibility.md) + [hygiene.md](references/hygiene.md) + [handoff.md](references/handoff.md)

---

## Related skills

- `figma:figma-use` — required before any `use_figma` call; explains the Plugin API surface.
- `figma:figma-generate-design` — page/screen generation workflow; load together with this skill.
- `figma:figma-generate-library` — for building the design system itself.
- `figma:figma-implement-design` — the reverse direction (Figma → code); many principles apply in reverse.
