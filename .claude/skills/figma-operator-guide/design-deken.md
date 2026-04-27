# 天璇 Design Tokens

Source: [Figma file `stse2CgIzOugynEdDSexS4`](https://www.figma.com/design/stse2CgIzOugynEdDSexS4/%E5%A4%A9%E7%92%87)

Two variable collections + four style groups define the project's design tokens. **When building in Figma, bind to these tokens — never hard-code hex/px values.**

## Collection structure

| Collection        | Modes        | Purpose                                                                        |
| ----------------- | ------------ | ------------------------------------------------------------------------------ |
| `material-design` | 1 (`Mode 1`) | Raw palette (Material colors) + MD base values. ~300 vars.                     |
| `merak`           | 1 (`Mode 1`) | **Semantic layer.** Aliases into `material-design`. Use THIS layer in designs. |

**Rule:** Always bind to `merak/*` (semantic) tokens. Reach into `material-design/palette/*` only when no semantic token fits.

---

## 1. Semantic tokens — `merak` collection

### `alias/colors/*` — surface / text / border

| Token                                | Resolves to                         | Hex         |
| ------------------------------------ | ----------------------------------- | ----------- |
| `alias/colors/bg-default`            | `palette/background/default`        | `#FFFFFF`   |
| `alias/colors/bg-layout`             | `palette/grey/50`                   | `#FAFAFA`   |
| `alias/colors/bg-active`             | `palette/action/active`             | `#0000008A` |
| `alias/colors/bg-active-contrast`    | —                                   | `#FFFFFF8A` |
| `alias/colors/bg-outline-hover`      | `palette/action/hover`              | `#0000000A` |
| `alias/colors/bg-filled-hover`       | `palette/action/focus`              | `#0000001F` |
| `alias/colors/bg-hover-contrast`     | —                                   | `#FFFFFF0A` |
| `alias/colors/bg-selected`           | `palette/action/selected`           | `#00000014` |
| `alias/colors/bg-selected-contrast`  | —                                   | `#FFFFFF14` |
| `alias/colors/bg-disabled`           | `palette/action/disabledBackground` | `#0000001F` |
| `alias/colors/bg-disabled-contrast`  | —                                   | `#FFFFFF1F` |
| `alias/colors/bg-focus`              | `palette/action/focus`              | `#0000001F` |
| `alias/colors/bg-focus-contrast`     | —                                   | `#FFFFFF1F` |
| `alias/colors/border-defalt` _(sic)_ | `palette/divider`                   | `#0000001F` |
| `alias/colors/text-default`          | `palette/text/primary`              | `#000000DE` |
| `alias/colors/text-sub`              | `palette/text/secondary`            | `#00000099` |
| `alias/colors/text-focus`            | `palette/action/focus`              | `#0000001F` |
| `alias/colors/text-title`            | `palette/common/black`              | `#000000`   |
| `alias/colors/text-disabled`         | `palette/text/disabled`             | `#00000061` |

> Note: `border-defalt` is a typo in the Figma file — use it as-is, do not rename without coordination.

### `seed/*` — themable "color role" tokens

Each role has roughly this shape: `main`, `hover`, `focusVisible`, `outlineBorder`, `on` (contrast text), and sometimes `hover-bg` / `outline-hover` / `selected`.

#### `seed/primary` — MUI primary (blue)

| Token                        | Alias chain                    | Hex         |
| ---------------------------- | ------------------------------ | ----------- |
| `seed/primary/main`          | `palette/primary/main`         | `#1976D2`   |
| `seed/primary/hover`         | `palette/primary/dark`         | `#1565C0`   |
| `seed/primary/hover-bg`      | —                              | `#1976D20A` |
| `seed/primary/focusVisible`  | —                              | `#1976D24D` |
| `seed/primary/outlineBorder` | —                              | `#1976D280` |
| `seed/primary/selected`      | `palette/primary/light`        | `#42A5F5`   |
| `seed/primary/on`            | `palette/primary/contrastText` | `#FFFFFF`   |

#### `seed/secondary` — purple

| Token                          | Alias chain                                     | Hex         |
| ------------------------------ | ----------------------------------------------- | ----------- |
| `seed/secondary/main`          | `palette/purple/500`                            | `#9C27B0`   |
| `seed/secondary/hover`         | `palette/secondary/dark` → `palette/purple/700` | `#7B1FA2`   |
| `seed/secondary/outline-hover` | —                                               | `#9C27B00A` |
| `seed/secondary/focusVisible`  | —                                               | `#9C27B04D` |
| `seed/secondary/outlineBorder` | —                                               | `#9C27B080` |
| `seed/secondary/on`            | `palette/common/white`                          | `#FFFFFF`   |

#### `seed/tertiary`

| Token                | Alias chain        | Hex       |
| -------------------- | ------------------ | --------- |
| `seed/tertiary/main` | `palette/grey/500` | `#9E9E9E` |

#### `seed/danger` — red

| Token                       | Alias chain                              | Hex         |
| --------------------------- | ---------------------------------------- | ----------- |
| `seed/danger/main`          | `palette/error/main` → `palette/red/700` | `#D32F2F`   |
| `seed/danger/hover`         | `palette/error/dark` → `palette/red/800` | `#C62828`   |
| `seed/danger/outline-hover` | —                                        | `#D32F2F0A` |
| `seed/danger/focusVisible`  | —                                        | `#D32F2F4D` |
| `seed/danger/outlineBorder` | —                                        | `#D32F2F80` |
| `seed/danger/on`            | `palette/error/contrastText`             | `#FFFFFF`   |

#### `seed/warning` — orange

| Token                        | Alias chain                                   | Hex         |
| ---------------------------- | --------------------------------------------- | ----------- |
| `seed/warning/main`          | `palette/warning/main`                        | `#ED6C02`   |
| `seed/warning/hover`         | `palette/warning/dark` → `palette/orange/900` | `#E65100`   |
| `seed/warning/outline-hover` | —                                             | `#ED6C020A` |
| `seed/warning/focusVisible`  | —                                             | `#ED6C024D` |
| `seed/warning/outlineBorder` | —                                             | `#ED6C0280` |
| `seed/warning/on`            | `palette/warning/contrastText`                | `#FFFFFF`   |

#### `seed/success` — green

| Token                        | Alias chain                                  | Hex         |
| ---------------------------- | -------------------------------------------- | ----------- |
| `seed/success/main`          | `palette/green/500`                          | `#4CAF50`   |
| `seed/success/hover`         | `palette/success/dark` → `palette/green/900` | `#1B5E20`   |
| `seed/success/hover-bg`      | —                                            | `#2E7D320A` |
| `seed/success/focusVisible`  | —                                            | `#2E7D324D` |
| `seed/success/outlineBorder` | —                                            | `#2E7D3280` |
| `seed/success/on`            | `palette/success/contrastText`               | `#FFFFFF`   |

#### `seed/info` — light blue

| Token                     | Alias chain                                   | Hex         |
| ------------------------- | --------------------------------------------- | ----------- |
| `seed/info/main`          | `palette/info/main` → `palette/lightBlue/700` | `#0288D1`   |
| `seed/info/hover`         | `palette/info/dark` → `palette/lightBlue/900` | `#01579B`   |
| `seed/info/hover-bg`      | —                                             | `#0288D10A` |
| `seed/info/focusVisible`  | —                                             | `#0288D14D` |
| `seed/info/outlineBorder` | —                                             | `#0288D180` |
| `seed/info/on`            | `palette/info/contrastText`                   | `#FFFFFF`   |

#### `seed/neutral` — black/white baseline

| Token                           | Hex                                    |
| ------------------------------- | -------------------------------------- |
| `seed/neutral/main`             | `#9E9E9E` (aliases `palette/grey/500`) |
| `seed/neutral/black`            | `#000000`                              |
| `seed/neutral/white`            | `#FFFFFF`                              |
| `seed/neutral/focusVisible`     | `#0000004D`                            |
| `seed/neutral/outlineBorder`    | `#00000080`                            |
| `seed/neutral/on-focusVisible`  | `#FFFFFF4D`                            |
| `seed/neutral/on-outlineBorder` | `#FFFFFF80`                            |

### `component/*` — component-scoped tokens

| Token                             | Type  | Value          |
| --------------------------------- | ----- | -------------- |
| `component/chip/fill`             | COLOR | `#00000014`    |
| `component/chip/outline`          | COLOR | `#BDBDBD`      |
| `component/chip/focus-fill`       | COLOR | `#00000033`    |
| `component/chip/disabled-opacity` | FLOAT | `38` (percent) |
| `component/tooltip/fill`          | COLOR | `#616161E5`    |

---

## 2. Raw palette — `material-design` collection

Full Material Design color palette. All values live at `palette/<hue>/<weight>`. Weights follow MD convention: `50, 100–900, A100, A200, A400, A700`. Plus `palette/common/white` (`#FFFFFF`) and `palette/common/black` (`#000000`).

Hues available:

```
amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple,
green, grey, indigo, lightBlue, lightGreen, lime, orange,
pink, purple, red, teal, yellow
```

Beyond the raw palette, this collection also contains Material's semantic slots used by `seed/*`:

- `palette/primary/{light,main,dark,contrastText}`
- `palette/secondary/{light,main,dark,contrastText}`
- `palette/error/{light,main,dark,contrastText}`
- `palette/warning/{light,main,dark,contrastText}`
- `palette/info/{light,main,dark,contrastText}`
- `palette/success/{light,main,dark,contrastText}`
- `palette/text/{primary,secondary,disabled}`
- `palette/action/{active,hover,selected,focus,disabled,disabledBackground}`
- `palette/background/{default,paper}`
- `palette/divider`

**Prefer `merak/seed/*` over reaching into these directly.**

---

## 3. Typography — Text Styles

Namespace: `material-design/typography/*` and `material-design/components/*`.

| Style                  | Font                 | Size | Line height |
| ---------------------- | -------------------- | ---- | ----------- |
| `typography/h1`        | Noto Sans TC Light   | 96   | 112         |
| `typography/h2`        | Inter Light          | 60   | 72          |
| `typography/h3`        | Noto Sans TC Regular | 48   | 60          |
| `typography/h4`        | Noto Sans TC Regular | 34   | 42          |
| `typography/h5`        | Inter Regular        | 24   | 32          |
| `typography/h6`        | Noto Sans TC Medium  | 20   | 32          |
| `typography/title1`    | Noto Sans TC Medium  | 18   | 26          |
| `typography/subtitle1` | Noto Sans TC Regular | 16   | 28          |
| `typography/subtitle2` | Noto Sans TC Regular | 14   | 20          |
| `typography/body1`     | Noto Sans TC Regular | 16   | 24          |
| `typography/body2`     | Noto Sans TC Regular | 14   | 20          |
| `typography/caption`   | Noto Sans TC Regular | 12   | 20          |
| `typography/overline`  | Noto Sans TC Regular | 12   | 32          |
| `components/chip`      | Noto Sans TC Regular | 12   | 18          |

All styles: `letterSpacing: 0%`, `paragraphSpacing: 0`, `textCase: ORIGINAL`, `textDecoration: NONE`.

Primary font: **Noto Sans TC** (Traditional Chinese). `Inter` is used for `h2` and `h5` only — likely intentional for numeric/Latin-heavy headings.

---

## 4. Elevation — Effect Styles

Namespace: `material-design/shadows/shadows-{1..24}`.

Standard MD elevation ramp. Each shadow is composed of **three stacked `DROP_SHADOW` layers** (umbra/penumbra/ambient) with black at opacities:

- Layer 1 (key light): `rgba(0,0,0, 0.02)` — tight, offset-y positive, negative spread
- Layer 2 (ambient mid): `rgba(0,0,0, 0.14)` — wider, main visual shadow
- Layer 3 (ambient far): `rgba(0,0,0, 0.12)` — soft, small offset

Radius/offset/spread scale linearly with the elevation number (1 → 24). Use:

- `shadows-1` / `shadows-2` — cards, inputs at rest
- `shadows-3` to `shadows-6` — raised buttons, app bars
- `shadows-8` — menus, popovers
- `shadows-12` — nav drawer
- `shadows-16` — modal drawer
- `shadows-24` — dialogs

---

## 5. Paint Styles & Grid Styles

No local paint styles or grid styles are defined — all paints are driven by Variables. Do not create parallel paint styles; bind paint variables instead.

---

## Usage guidelines

1. **Semantic first.** Bind to `merak/alias/colors/*`, `merak/seed/*`, or `merak/component/*`. Drop to `material-design/palette/*` only when composing a new semantic token.
2. **Set `variable.scopes` explicitly when creating new variables.** Existing tokens use `ALL_SCOPES` — match that only if you truly want a token to show up everywhere; for new tokens, scope to `TEXT_FILL`, `FRAME_FILL`, `STROKE_COLOR`, `GAP`, etc.
3. **Typography:** apply text styles, don't set fontName/fontSize/lineHeight manually. Remember to `await figma.loadFontAsync({family:"Noto Sans TC", style:"Regular"})` (and the `Light`/`Medium` variants, plus Inter Light/Regular) before writing text.
4. **Elevation:** apply `material-design/shadows/shadows-N` effect style; do not hand-author drop shadows.
5. **Contrast pairs:** `*-contrast` tokens are meant for dark backgrounds — use them together with their base (e.g. `bg-hover` on light, `bg-hover-contrast` on dark).
