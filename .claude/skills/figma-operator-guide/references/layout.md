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

## HTML → Figma：以結構為主、computed style 為輔

當輸入來源是 HTML（live DOM、screenshot + DOM、或一段 markup）時：

- **以 HTML 結構組成 Frame 階層** — 每個 block-level / flex / grid container 對應一個 Auto Layout Frame，子元素順序與巢狀關係必須與 DOM tree 一致。不要把多個兄弟節點壓成單一 Frame，也不要為了視覺上的方便重排節點。
- **以 computed style（不是 source CSS、不是目測）補足視覺屬性** — `padding` / `margin` / `gap` 取自 `getComputedStyle()`，顏色取自 `color` / `background-color` 的 computed 值，排列方式從 `display` / `flex-direction` / `justify-content` / `align-items` 推導到 `layoutMode` / `primaryAxisAlignItems` / `counterAxisAlignItems`。
- **margin → itemSpacing / padding** — HTML 的 margin 不存在於 Figma；把相鄰兄弟的 margin 折算成父層的 `itemSpacing`，把外側 margin 折算成祖父層的 padding。不要為了還原 margin 而使用絕對定位。
- **仍然要過 token 對齊** — computed style 給出的是 raw 數值，最後一步仍須對應到設計系統的 spacing / color token；off-scale 的數值要 snap 到 scale 上（見 [tokens.md](tokens.md)）。

順序：先依 DOM 落出 Frame 骨架 → 套 Auto Layout 與 sizing → 用 computed style 填 padding / gap / 顏色 → 對 token。

## Off-scale spacing

Spacing values should live on the 4/8-pt scale (or whatever scale the system publishes). If you're writing `13px` / `17px` / `22px`, you measured the screenshot instead of looking up the token — snap to the scale. See [tokens.md](tokens.md).
