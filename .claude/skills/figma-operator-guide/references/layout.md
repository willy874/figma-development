# Layout: Auto Layout by default, absolute by exception

## The default

Every container frame **must** have `layoutMode: "HORIZONTAL"` or `"VERTICAL"` unless there is a documented reason otherwise (canvas/diagram surface, true overlays).

- **Sizing:** children use `layoutSizingHorizontal` / `layoutSizingVertical` set to `HUG` (content-sized) or `FILL` (stretch). Avoid `FIXED` except for explicit constraints.
- **Spacing:** comes from `itemSpacing` + `paddingLeft/Right/Top/Bottom` — **never** from manual `x` / `y`.
- **Alignment:** comes from `primaryAxisAlignItems` / `counterAxisAlignItems` — not from manual positioning.

## Frame creation defaults

When creating a new Frame, always start from these defaults and only deviate when the design requires it:

- `layoutMode: "VERTICAL"` (Column Auto Layout)
- `paddingLeft / paddingRight / paddingTop / paddingBottom: 0`
- `itemSpacing: 0` (Gap 0)
- `clipsContent: false` (Clip Content off)

Apply tokens for padding and gap once the structure demands them — do not seed frames with arbitrary spacing. Only enable `clipsContent` when the frame is intentionally a viewport that must crop its children (e.g. scroll area, image mask).

## Absolute positioning is for overlays only

Valid uses:

- Badge on an avatar.
- Floating action button over a card.
- Tooltip arrow, dropdown caret pointing at a trigger.

If you catch yourself setting `x` / `y` on **more than one child of the same frame**, the parent is missing Auto Layout. Fix the parent, don't keep placing siblings absolutely.

Never use absolute positioning to simulate grid or flex behavior — use Auto Layout wrap or nested Auto Layout frames.

## Why the model reaches for absolute

Screenshots encode position, so generating `x` / `y` from a screenshot feels correct. But the resulting frame breaks the moment it resizes, which is the first thing a designer or engineer does.

## Resize self-check (mandatory)

Before leaving any frame:

> "If I resize this frame by ±100px, does the layout still look right?"

If the answer is no, Auto Layout is missing or wrong — fix it before moving on.

## Off-scale spacing

Spacing values should live on the 4/8-pt scale (or whatever scale the system publishes). If you're writing `13px` / `17px` / `22px`, you measured the screenshot instead of looking up the token — snap to the scale. See [tokens.md](tokens.md).
