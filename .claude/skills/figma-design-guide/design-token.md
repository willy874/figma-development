# Design Tokens

Source: [Figma file `KQjP6W9Uw1PN0iipwQHyYn`](https://www.figma.com/design/KQjP6W9Uw1PN0iipwQHyYn/MUI-Library) (MUI-Library)

Local snapshots in this repo:

- `src/figma/variables.json` — variable collection snapshot
- `src/figma/styles.json` — text + effect style snapshot

One variable collection (`merak`, 78 vars) + 28 text styles + 24 effect styles. **When building in Figma, bind to these tokens — never hard-code hex/px values.**

## Collection structure

| Collection | Modes        | Vars | Purpose                                          |
| ---------- | ------------ | ---- | ------------------------------------------------ |
| `merak`    | 1 (`Mode 1`) | 78   | The project's semantic + component token layer. |

> **No raw palette collection.** The previous `material-design` collection (~300 vars) is gone — every value here is already at the semantic / component layer. If a needed value is missing, add a new semantic token rather than hard-coding hex.
>
> 14 of the 78 are **local mirrors** of upstream `merak` tokens (description: "Local mirror of merak `<name>` — opacity baked in"). Added so Checkbox State variants can swap fills without alpha-inheritance issues. Reuse by name; do not duplicate.

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

## 3. Component-scoped tokens — `component/*` (26)

Reach for these only inside the matching component. Documented per-component for traceability.

### Button (3)

| Token                                        | Hex         |
| -------------------------------------------- | ----------- |
| `component/button/contained-default-bg`      | `#E0E0E0`   |
| `component/button/contained-default-fg`      | `#000000DE` |
| `component/button/outlined-default-border`   | `#000000DE` |

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

Two namespaces: `material-design/typography/*` (13 base sizes) and `component/typography/*` (`button`, `overline`). Every style has a matching `-bold` variant — 14 default + 14 bold = **28 styles**.

| Style                               | Font                 | Size | Line height |
| ----------------------------------- | -------------------- | ---- | ----------- |
| `material-design/typography/h1`     | Noto Sans TC Light   | 96   | 112         |
| `material-design/typography/h2`     | Inter Light          | 60   | 72          |
| `material-design/typography/h3`     | Noto Sans TC Regular | 48   | 60          |
| `material-design/typography/h4`     | Noto Sans TC Regular | 34   | 42          |
| `material-design/typography/h5`     | Inter Regular        | 24   | 32          |
| `material-design/typography/h6`     | Noto Sans TC Medium  | 20   | 32          |
| `material-design/typography/title1` | Noto Sans TC Medium  | 18   | 26          |
| `material-design/typography/subtitle1` | Noto Sans TC Regular | 16 | 28          |
| `material-design/typography/subtitle2` | Noto Sans TC Regular | 14 | 20          |
| `material-design/typography/body1`  | Noto Sans TC Regular | 16   | 24          |
| `material-design/typography/body2`  | Noto Sans TC Regular | 14   | 20          |
| `material-design/typography/caption`| Noto Sans TC Regular | 12   | 20          |
| `material-design/typography/overline` | Noto Sans TC Regular | 12 | 32          |
| `component/typography/button`       | Noto Sans TC Medium  | 14   | 24          |
| `component/typography/overline`     | Noto Sans TC Regular | 12   | 32          |

> Each row above has a `*-bold` sibling that swaps the font style to **Bold** (Noto Sans TC Bold or Inter Bold). Same size/line height, just the weight changes.

All styles share: `letterSpacing: 0%`, `paragraphSpacing: 0`, `textCase: ORIGINAL`, `textDecoration: NONE`.

Primary font: **Noto Sans TC** (Traditional Chinese). `Inter` is used for `h2` and `h5` only — intentional for numeric / Latin-heavy headings.

---

## 6. Elevation — Effect Styles (24)

Namespace: `material-design/shadows/shadows-{1..24}`.

Standard MD elevation ramp. Each shadow is composed of **three stacked `DROP_SHADOW` layers** (umbra / penumbra / ambient) with black at opacities:

- Layer 1 (key light):    `rgba(0,0,0, 0.02)` — tight, offset-y positive, negative spread
- Layer 2 (ambient mid):  `rgba(0,0,0, 0.14)` — wider, main visual shadow
- Layer 3 (ambient far):  `rgba(0,0,0, 0.12)` — soft, small offset

Radius / offset / spread scale linearly with the elevation number (1 → 24). Use:

- `shadows-1` / `shadows-2` — cards, inputs at rest
- `shadows-3` to `shadows-6` — raised buttons, app bars
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
2. **Local mirrors.** 14 tokens carry a "Local mirror of merak `<name>` (opacity baked in)" description. They duplicate upstream `merak` tokens with the alpha pre-flattened so Checkbox State variants can swap fills cleanly. Reuse them by name; check before creating more.
3. **Set `variable.scopes` explicitly when creating new variables.** Existing tokens are scoped to specific surfaces (`FRAME_FILL,SHAPE_FILL` is the most common; also `STROKE_COLOR`, `TEXT_FILL`, `OPACITY`). Match the scope to the intended surface; avoid `ALL_SCOPES` unless truly universal.
4. **Typography:** apply text styles, don't set `fontName` / `fontSize` / `lineHeight` manually. Remember to `await figma.loadFontAsync({ family: "Noto Sans TC", style: "Regular" })` (and `Light` / `Medium` / `Bold` variants, plus `Inter Light` / `Regular` / `Bold`) before writing text.
5. **Elevation:** apply `material-design/shadows/shadows-N` effect style; do not hand-author drop shadows.
