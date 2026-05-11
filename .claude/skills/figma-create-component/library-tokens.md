# Design Tokens

Source: see [`figma.config.json`](../../../figma.config.json) `.library.fileUrl` (single source of truth — the link below is for human navigation only).

[Figma file `KQjP6W9Uw1PN0iipwQHyYn`](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn/MUI-Library) (MUI-Library)

One variable collection (`mui`, 82 vars) + 28 text styles + 29 effect styles. **When building in Figma, bind to these tokens — never hard-code hex/px values.**

## Collection structure

| Collection | Modes        | Vars | Purpose                                          |
| ---------- | ------------ | ---- | ------------------------------------------------ |
| `mui`    | 1 (`Mode 1`) | 82   | The project's semantic + component token layer. |

> **No raw palette collection.** The previous `material-design` collection (~300 vars) is gone — every value here is already at the semantic / component layer. If a needed value is missing, add a new semantic token rather than hard-coding hex.
>
> 14 of the 82 are **local mirrors** of upstream `mui` tokens (description: "Local mirror of mui `<name>` — opacity baked in"). Added so Checkbox State variants can swap fills without alpha-inheritance issues. Reuse by name; do not duplicate.

---

## 1. Alias colors — `alias/colors/*` (12)

Surface / text / border roles. Reach for these before `seed/*`.

| Token                                                | Hex         |
| ---------------------------------------------------- | ----------- |
| `alias/colors/bg-default`                            | `#FFFFFF`   |
| `alias/colors/bg-active`                             | `#0000008A` |
| `alias/colors/bg-outline-hover`                      | `#0000000A` |
| `alias/colors/bg-filled-hover`                       | `#0000001F` |
| `alias/colors/bg-selected`                           | `#00000014` |
| `alias/colors/bg-focus`                              | `#0000001F` |
| `alias/colors/bg-disabled`                           | `#0000001F` |
| `alias/colors/border-defalt` _(sic — typo retained)_ | `#0000001F` |
| `alias/colors/text-default`                          | `#000000DE` |
| `alias/colors/text-sub`                              | `#00000099` |
| `alias/colors/text-disabled`                         | `#00000061` |
| `alias/colors/fg-disabled`                           | `#00000042` |

> `border-defalt` is a typo in the Figma file. Use it as-is — do not rename without coordination.

---

## 2. Seed roles — `seed/*` (38)

Themable color roles. Not every role has every slot — only what's actually defined. Slot meanings: `main` (the role itself), `hover` (darker hover), `hover-bg` (subtle background tint, ~4% alpha), `outline-hover` (light tint for outlined variants, ~4% alpha), `focusVisible` (focus ring, ~30% alpha), `outlineBorder` (border tint, ~50% alpha), `on` (contrast text on `main`).

### `seed/primary` — blue (6)

| Token                        | Hex         |
| ---------------------------- | ----------- |
| `seed/primary/main`          | `#1976D2`   |
| `seed/primary/hover`         | `#1565C0`   |
| `seed/primary/hover-bg`      | `#1976D20A` |
| `seed/primary/focusVisible`  | `#1976D24D` |
| `seed/primary/outlineBorder` | `#1976D280` |
| `seed/primary/on`            | `#FFFFFF`   |

### `seed/secondary` — purple (3)

| Token                          | Hex         |
| ------------------------------ | ----------- |
| `seed/secondary/main`          | `#9C27B0`   |
| `seed/secondary/outline-hover` | `#9C27B00A` |
| `seed/secondary/focusVisible`  | `#9C27B04D` |

### `seed/tertiary` (1)

| Token                | Hex       |
| -------------------- | --------- |
| `seed/tertiary/main` | `#9E9E9E` |

### `seed/danger` — red (6)

| Token                       | Hex         |
| --------------------------- | ----------- |
| `seed/danger/main`          | `#D32F2F`   |
| `seed/danger/hover`         | `#C62828`   |
| `seed/danger/outline-hover` | `#D32F2F0A` |
| `seed/danger/focusVisible`  | `#D32F2F4D` |
| `seed/danger/outlineBorder` | `#D32F2F80` |
| `seed/danger/on`            | `#FFFFFF`   |

### `seed/warning` — orange (6)

| Token                        | Hex         |
| ---------------------------- | ----------- |
| `seed/warning/main`          | `#ED6C02`   |
| `seed/warning/hover`         | `#E65100`   |
| `seed/warning/outline-hover` | `#ED6C020A` |
| `seed/warning/focusVisible`  | `#ED6C024D` |
| `seed/warning/outlineBorder` | `#ED6C0280` |
| `seed/warning/on`            | `#FFFFFF`   |

### `seed/success` — green (6)

| Token                        | Hex         |
| ---------------------------- | ----------- |
| `seed/success/main`          | `#2E7D32`   |
| `seed/success/hover`         | `#1B5E20`   |
| `seed/success/hover-bg`      | `#2E7D320A` |
| `seed/success/focusVisible`  | `#2E7D324D` |
| `seed/success/outlineBorder` | `#2E7D3280` |
| `seed/success/on`            | `#FFFFFF`   |

### `seed/info` — light blue (6)

| Token                     | Hex         |
| ------------------------- | ----------- |
| `seed/info/main`          | `#0288D1`   |
| `seed/info/hover`         | `#01579B`   |
| `seed/info/hover-bg`      | `#0288D10A` |
| `seed/info/focusVisible`  | `#0288D14D` |
| `seed/info/outlineBorder` | `#0288D180` |
| `seed/info/on`            | `#FFFFFF`   |

### `seed/neutral` — black/white baseline (4)

| Token                       | Hex         |
| --------------------------- | ----------- |
| `seed/neutral/main`         | `#9E9E9E`   |
| `seed/neutral/black`        | `#000000`   |
| `seed/neutral/white`        | `#FFFFFF`   |
| `seed/neutral/focusVisible` | `#0000004D` |

---

## 3. Component-scoped tokens — `component/*` (30)

Reach for these only inside the matching component. Documented per-component for traceability.

### Button (6)

| Token                                        | Type  | Value           |
| -------------------------------------------- | ----- | --------------- |
| `component/button/contained-default-bg`      | COLOR | `#E0E0E0`       |
| `component/button/contained-default-fg`      | COLOR | `#000000DE`     |
| `component/button/outlined-default-border`   | COLOR | `#000000DE`     |
| `component/button/focus-ring-width`          | FLOAT | `3` (px, `STROKE_FLOAT`) |
| `component/button/icon-gap`                  | FLOAT | `8` (px, `GAP`) |
| `component/button/icon-edge-offset`          | FLOAT | `-4` (px, `GAP`) |

### IconButton (1)

| Token                                          | Type  | Value                       |
| ---------------------------------------------- | ----- | --------------------------- |
| `component/icon-button/focus-ring-width`       | FLOAT | `3` (px, `STROKE_FLOAT`)    |

### Chip (4)

| Token                             | Type  | Value          |
| --------------------------------- | ----- | -------------- |
| `component/chip/fill`             | COLOR | `#00000014`    |
| `component/chip/outline`          | COLOR | `#BDBDBD`      |
| `component/chip/focus-fill`       | COLOR | `#00000033`    |
| `component/chip/disabled-opacity` | FLOAT | `0.38` (38%)   |

### Input — TextField / Select (6)

| Token                                      | Hex         |
| ------------------------------------------ | ----------- |
| `component/input/standard/enabledBorder`   | `#0000006B` |
| `component/input/standard/hoverBorder`     | `#000000DE` |
| `component/input/outlined/enabledBorder`   | `#0000001F` |
| `component/input/outlined/hoverBorder`     | `#000000DE` |
| `component/input/filled/enabledFill`       | `#0000000F` |
| `component/input/filled/hoverFill`         | `#00000017` |

### Autocomplete (2)

| Token                                                 | Hex         |
| ----------------------------------------------------- | ----------- |
| `component/autocomplete/option-selected-bg`           | `#1976D214` |
| `component/autocomplete/option-selected-focused-bg`   | `#1976D21F` |

### NavMenu (1)

| Token                            | Hex         |
| -------------------------------- | ----------- |
| `component/navmenu/selected-bg`  | `#1976D214` |

### Pagination (5)

Per-color selected-state backgrounds (paired with `seed/<role>/main`):

| Token                                       | Hex         |
| ------------------------------------------- | ----------- |
| `component/pagination/selected-bg-primary`  | `#1976D21F` |
| `component/pagination/selected-bg-info`     | `#0288D11F` |
| `component/pagination/selected-bg-success`  | `#2E7D321F` |
| `component/pagination/selected-bg-warning`  | `#ED6C021F` |
| `component/pagination/selected-bg-danger`   | `#D32F2F1F` |

### Snackbar (2)

| Token                              | Hex         |
| ---------------------------------- | ----------- |
| `component/snackbar/default-bg`    | `#323232`   |
| `component/snackbar/alert-icon-fg` | `#FFFFFFE6` |

### Table (2)

| Token                              | Hex         |
| ---------------------------------- | ----------- |
| `component/table/selected-bg`      | `#1976D214` |
| `component/table/selected-hover-bg`| `#1976D21F` |

### Tooltip (1)

| Token                     | Hex         |
| ------------------------- | ----------- |
| `component/tooltip/fill`  | `#616161E5` |

---

## 4. Misc top-level tokens (2)

| Token                          | Hex         |
| ------------------------------ | ----------- |
| `background/paper-elevation-0` | `#FFFFFF`   |
| `text/disabled`                | `#00000061` |

---

## 5. Typography — Text Styles (28)

Two namespaces, **15 base + 13 bold = 28** styles:

- `material-design/typography/*` — 13 base (h1–h6, title1, subtitle1–2, body1–2, caption, overline) + 11 `-bold` companions = **24**
- `component/typography/*` — 2 base (`button`, `overline`, both `textCase: UPPER`) + 2 `-bold` companions = **4**

### Base styles

| Style                                  | Font                 | Size | LH  | Case     | Has `-bold`? |
| -------------------------------------- | -------------------- | ---- | --- | -------- | ------------ |
| `material-design/typography/h1`        | Noto Sans TC Light   | 96   | 112 | ORIGINAL | ✓            |
| `material-design/typography/h2`        | Inter Light          | 60   | 72  | ORIGINAL | ✓            |
| `material-design/typography/h3`        | Noto Sans TC Regular | 48   | 60  | ORIGINAL | ✓            |
| `material-design/typography/h4`        | Noto Sans TC Regular | 34   | 42  | ORIGINAL | ✓            |
| `material-design/typography/h5`        | Inter Regular        | 24   | 32  | ORIGINAL | ✓            |
| `material-design/typography/h6`        | Noto Sans TC Medium  | 20   | 32  | ORIGINAL | ✓            |
| `material-design/typography/title1`    | Noto Sans TC Medium  | 18   | 26  | ORIGINAL | ✗            |
| `material-design/typography/subtitle1` | Noto Sans TC Regular | 16   | 28  | ORIGINAL | ✓            |
| `material-design/typography/subtitle2` | Noto Sans TC Regular | 14   | 20  | ORIGINAL | ✓            |
| `material-design/typography/body1`     | Noto Sans TC Regular | 16   | 24  | ORIGINAL | ✓            |
| `material-design/typography/body2`     | Noto Sans TC Regular | 14   | 20  | ORIGINAL | ✓            |
| `material-design/typography/caption`   | Noto Sans TC Regular | 12   | 20  | ORIGINAL | ✓            |
| `material-design/typography/overline`  | Noto Sans TC Regular | 12   | 32  | ORIGINAL | ✗ (see below) |
| `component/typography/button`          | Noto Sans TC Medium  | 14   | 24  | **UPPER**| ✓            |
| `component/typography/overline`        | Noto Sans TC Regular | 12   | 32  | **UPPER**| ✓            |

### Bold companions (`*-bold`)

Each `-bold` style mirrors its sibling exactly — same size, line height, letterSpacing, textCase — and only swaps the font style to **Bold** (`Noto Sans TC Bold`, or `Inter Bold` for h2/h5).

Bold variants are **local-only**: the upstream design-system file does not yet ship bold typography. They exist so the Figma `<Typography>` component set can resolve `Bold=On`.

The 13 bold styles:

```
material-design/typography/{h1,h2,h3,h4,h5,h6,subtitle1,subtitle2,body1,body2,caption}-bold
component/typography/{button,overline}-bold
```

### Intentional gaps

- **No `material-design/typography/button`.** The design-system convention zeroes `textCase` on every `material-design/typography/*` style, so MUI's uppercase Button label cannot live there. `component/typography/button` (UPPER) fills the gap.
- **No `material-design/typography/overline-bold`.** Same reasoning — `component/typography/overline` already bakes `textCase: UPPER` into the cell so it keeps its `textStyleId`. The bold companion stays in the component namespace as `component/typography/overline-bold`.
- **No `material-design/typography/title1-bold`.** title1 simply has no bold variant; `<Typography Variant=title1 Bold=On>` is unsupported.

### Shared properties (all 28)

- `letterSpacing`: `0%`
- `paragraphIndent`: `0`
- `paragraphSpacing`: `0`
- `textDecoration`: `NONE`
- `textCase`: `ORIGINAL` for all except the **four** `component/typography/{button,button-bold,overline,overline-bold}` styles, which are `UPPER`.

Primary font: **Noto Sans TC** (Traditional Chinese). `Inter` is used for `h2` / `h5` (and their bold companions) only — intentional for numeric / Latin-heavy headings. Required font load list before writing text:

```
Noto Sans TC — Light, Regular, Medium, Bold
Inter        — Light, Regular, Bold
```

---

## 6. Elevation — Effect Styles (29)

Two namespaces:

- `material-design/shadows/shadows-{1..24}` — the standard MD elevation ramp (24 styles, source of truth).
- `component/{button,icon-button}/elevation-*` — 5 component-scoped aliases, each an **independent clone** of the matching MD ramp step (effect styles cannot reference other effect styles in Figma). If the MD ramp changes, re-clone the aliases:

| Alias style                                | Cloned from                          |
| ------------------------------------------ | ------------------------------------ |
| `component/button/elevation-rest`          | `material-design/shadows/shadows-2`  |
| `component/button/elevation-focused`       | `material-design/shadows/shadows-6`  |
| `component/icon-button/elevation-rest`     | `material-design/shadows/shadows-2`  |
| `component/icon-button/elevation-focused`  | `material-design/shadows/shadows-6`  |
| `component/icon-button/elevation-pressed`  | `material-design/shadows/shadows-8`  |

Material Design ramp (24 styles):

Each style is composed of **three stacked `DROP_SHADOW` layers** (umbra / penumbra / ambient), all black, all `blendMode: NORMAL`, all `showShadowBehindNode: false`, all `offset.x: 0`:

| Layer | Role        | Alpha  | Notes                                             |
| ----- | ----------- | ------ | ------------------------------------------------- |
| 1     | key light   | `0.02` | tight radius, positive `offset.y`, negative spread |
| 2     | ambient mid | `0.14` | the dominant visual shadow                        |
| 3     | ambient far | `0.12` | soft, small `offset.y`                            |

> **Exception:** `shadows-11` layer 1 uses **`0.04`** alpha (everything else uses `0.02`). This mirrors the upstream MD ramp — do not "correct" without coordination.

`shadows-24` carries the description `MUI Paper elevation={24}: composite of 3 drop shadows (umbra/penumbra/ambient).` — confirms the three-layer structure is intentional across the ramp.

### Ramp values

Radius / offset.y / spread per layer scale roughly linearly with the elevation number. Reference points:

| Style        | L1 (r, y, spread) | L2 (r, y, spread) | L3 (r, y, spread) |
| ------------ | ----------------- | ----------------- | ----------------- |
| `shadows-1`  | 1, 2, -1          | 1, 1, 0           | 3, 1, 0           |
| `shadows-2`  | 1, 3, -2          | 2, 2, 0           | 5, 1, 0           |
| `shadows-4`  | 4, 2, -1          | 5, 4, 0           | 10, 1, 0          |
| `shadows-6`  | 5, 3, -2          | 10, 6, 1          | 14, 1, 1          |
| `shadows-8`  | 5, 5, -3          | 10, 8, 1          | 14, 3, 2          |
| `shadows-12` | 8, 7, -4          | 17, 12, 2         | 22, 5, 4          |
| `shadows-16` | 10, 8, -5         | 24, 16, 2         | 30, 6, 5          |
| `shadows-24` | 15, 11, -7        | 38, 24, 3         | 46, 8, 8          |

### Usage cheat sheet

- `shadows-1` / `shadows-2` — cards, inputs at rest
- `shadows-3` – `shadows-6` — raised buttons, app bars
- `shadows-8` — menus, popovers
- `shadows-12` — nav drawer
- `shadows-16` — modal drawer
- `shadows-24` — dialogs

---

## 7. Paint Styles & Grid Styles

None defined — all paints / strokes are driven by Variables. Do not create parallel paint styles; bind paint variables instead.

---

## Usage guidelines

1. **Semantic first.** Bind to `alias/colors/*`, `seed/*`, or `component/*`. There is no raw palette collection — if a needed value is missing, add a new semantic token rather than hard-coding hex.
2. **Local mirrors.** 14 tokens carry a "Local mirror of mui `<name>` (opacity baked in)" description. They duplicate upstream `mui` tokens with the alpha pre-flattened so Checkbox State variants can swap fills cleanly. Reuse them by name; check before creating more.
3. **Set `variable.scopes` explicitly when creating new variables.** Existing tokens are scoped to specific surfaces (`FRAME_FILL,SHAPE_FILL` is the most common; also `STROKE_COLOR`, `TEXT_FILL`, `OPACITY`). Match the scope to the intended surface; avoid `ALL_SCOPES` unless truly universal.
4. **Typography:** apply text styles, don't set `fontName` / `fontSize` / `lineHeight` manually. Remember to `await figma.loadFontAsync({ family: "Noto Sans TC", style: "Regular" })` (and `Light` / `Medium` / `Bold` variants, plus `Inter Light` / `Regular` / `Bold`) before writing text.
5. **Elevation:** apply `material-design/shadows/shadows-N` effect style; do not hand-author drop shadows.
