---
name: figma-component-icon-storybook-render
description: Computed-style snapshot for `<Icon>` (MerakIcon sizing wrapper) measured against `src/stories/Icon.stories.tsx` via Chrome DevTools MCP. Documents the runtime per-Size box metrics, the `currentColor` inheritance contract that lets the glyph pick up its parent paint, the SVG dimensions inside the wrapper, and the drift-check protocol that decides whether a divergence is a spec bug, a story-file change, or an icon-source swap. Companion to `figma.spec.md` (the contract) and `design-token.md` (component-scoped tokens, when needed).
parent_skill: figma-components
---

# `<Icon>` Storybook Render Measurements

Computed-style snapshot probed with Chrome DevTools MCP against `src/stories/Icon.stories.tsx`. Stories used: `SizeMatrix` (8 glyphs × 6 Sizes, 48 cells) and `ColorInheritance` (`Home` glyph rendered inside a parent `Box` painted with each MUI palette token to verify `currentColor` propagation). These are the runtime numbers a Figma authoring pass should reproduce; if Storybook output diverges, the spec — not the runtime — is the source-of-truth, but the divergence is a red flag worth filing.

## 1. Size axis — outer box invariants

The Merak `<Icon>` wrapper is a square `Box` whose only varying dimension is `width = height = SIZE_PX[size]`. Everything else holds across all 6 cells.

| Property            | xs       | sm       | md       | lg       | xl       | xxl      |
| ------------------- | -------- | -------- | -------- | -------- | -------- | -------- |
| outer `width`       | `16 px`  | `20 px`  | `24 px`  | `28 px`  | `32 px`  | `48 px`  |
| outer `height`      | `16 px`  | `20 px`  | `24 px`  | `28 px`  | `32 px`  | `48 px`  |
| measured bbox       | 16 × 16  | 20 × 20  | 24 × 24  | 28 × 28  | 32 × 32  | 48 × 48  |
| `display`           | `flex`   | `flex`   | `flex`   | `flex`   | `flex`   | `flex`   |
| `align-items`       | `center` | `center` | `center` | `center` | `center` | `center` |
| `justify-content`   | `center` | `center` | `center` | `center` | `center` | `center` |
| `flex-shrink`       | `0`      | `0`      | `0`      | `0`      | `0`      | `0`      |
| `line-height`       | `0px`    | `0px`    | `0px`    | `0px`    | `0px`    | `0px`    |
| `box-sizing`        | `border-box` | `border-box` | `border-box` | `border-box` | `border-box` | `border-box` |
| `padding`           | `0px`    | `0px`    | `0px`    | `0px`    | `0px`    | `0px`    |
| `margin`            | `0px`    | `0px`    | `0px`    | `0px`    | `0px`    | `0px`    |
| `border`            | none     | none     | none     | none     | none     | none     |
| `vertical-align`    | `baseline` | `baseline` | `baseline` | `baseline` | `baseline` | `baseline` |
| `color` (default)   | `rgba(0, 0, 0, 0.87)` (= `palette.text.primary`) — same across every size  |||||  |

**Notes.**

- `display: flex` + `align: center` + `line-height: 0` collapse vertical baseline noise so the glyph sits flush in the box. Figma's Auto Layout `counterAxisAlignItems: CENTER` + `primaryAxisAlignItems: CENTER` is the equivalent; do not introduce padding to "balance" anything.
- `flex-shrink: 0` keeps the icon from collapsing when laid out next to text or a button label that owns the remaining space. The Figma cell is `layoutGrow: 0` for the same reason.
- The size step is **not** geometric — `xs/sm/md/lg/xl/xxl = 16/20/24/28/32/48`. The xxl cell jumps by 16 px (vs. 4 px increments below) to match the largest published cell in the existing Figma `<Icon>` set (`3:2723 = 48 × 48`).

## 2. SVG glyph — fills the wrapper

Every glyph in `Icon.stories.tsx` is an inline `<svg>` with `viewBox="0 0 24 24"`, `width="100%"`, `height="100%"`, `fill="currentColor"`. The SVG therefore renders at exactly the wrapper's pixel size and inherits the wrapper's `color`:

| Property                  | xs       | sm       | md       | lg       | xl       | xxl      |
| ------------------------- | -------- | -------- | -------- | -------- | -------- | -------- |
| `<svg>` rendered width    | `16 px`  | `20 px`  | `24 px`  | `28 px`  | `32 px`  | `48 px`  |
| `<svg>` rendered height   | `16 px`  | `20 px`  | `24 px`  | `28 px`  | `32 px`  | `48 px`  |
| `<svg>` `viewBox`         | `0 0 24 24` (constant — Material Design Icons authoring grid) |||||  |
| `<svg>` `fill`            | `currentColor` resolved → `rgba(0, 0, 0, 0.87)` (default) |||||  |
| inner `<path>` `fill`     | `rgba(0, 0, 0, 0.87)` (inherits from SVG)                 |||||  |

**Authoring grid note.** All eight inline glyphs in the story (`Home`, `Search`, `Add`, `Close`, `Check`, `Delete`, `Edit`, `User`) are sourced from Google `material-design-icons` (the `material-symbols` outlined / filled set, 24 px authoring grid). The Figma cells in the published `<Icon>` set (`3:2722`) are likewise `targetAspectRatio: 48 / 48` with a 24 px raster grid for the `material-symbols:*` glyph slot — the runtime and Figma agree on the scale-by-2 contract for `xxl`. xs/sm/md/lg/xl downsample the same authoring grid; expect minor sub-pixel anti-aliasing differences vs. Figma's vector renderer.

## 3. `currentColor` inheritance contract (`ColorInheritance` story)

`<Icon>` does not own its paint. The wrapper's `color` is `'inherit'` by default; setting `sx={{ color: token }}` on **any ancestor** propagates straight through to the `<path>` because the SVG `fill` is `currentColor`.

| Parent `sx.color`   | Resolved hex               | Wrapper `color`            | SVG `fill`                  | Path `fill`                 |
| ------------------- | -------------------------- | -------------------------- | --------------------------- | --------------------------- |
| `inherit`           | `rgba(0, 0, 0, 0.87)`      | `rgba(0, 0, 0, 0.87)`      | `rgba(0, 0, 0, 0.87)`       | `rgba(0, 0, 0, 0.87)`       |
| `primary.main`      | `#1976d2`                  | `rgb(25, 118, 210)`        | `rgb(25, 118, 210)`         | `rgb(25, 118, 210)`         |
| `error.main`        | `#d32f2f`                  | `rgb(211, 47, 47)`         | `rgb(211, 47, 47)`          | `rgb(211, 47, 47)`          |
| `success.main`      | `#2e7d32`                  | `rgb(46, 125, 50)`         | `rgb(46, 125, 50)`          | `rgb(46, 125, 50)`          |

**Implication for Figma.** The Figma cell does **not** bind a paint variable to the icon `<Icon>` instance — it leaves the glyph color undefined so the host component (`<IconButton>`, `<Button>`, `<Chip>`, etc.) drives it via the variant's foreground token. Authoring an explicit fill on an `<Icon>` cell breaks the inheritance contract and forces consumers to detach.

## 4. Cross-cutting observations

- **No theme overrides.** Unlike `<Button>` and `<IconButton>`, the project's `mui-theme.ts` does not patch `MuiBox` or any Icon-related slot; everything observed comes from MUI's default `<Box>` baseline (`display: flex` is from the story's `sx`, not a global override).
- **No transitions.** `transition` is `all 0s ease 0s` — the icon never animates by itself. State-bound color changes ride entirely on the parent's transition (e.g. `<IconButton>`'s `background-color, color 0.25s` ramp).
- **No focus / disabled deltas.** The wrapper has no interactive state. Disabled visual treatment is owned by the parent (`<IconButton>` paints `color: rgba(0, 0, 0, 0.26)` on `.Mui-disabled`); `<Icon>` has nothing to override.
- **No size axis exposed via MUI.** `@mui/material/Icon` accepts `fontSize: 'inherit' | 'small' | 'medium' | 'large'` — only 3 size steps and font-driven. The Merak `<Icon>` rejects that contract entirely (no font, 6 size steps); `figma.spec.md` §1 calls this out.

## 5. Drift-check protocol

A divergence between this document and a future Storybook build means one of:

1. **Story-file change.** Someone edited `src/stories/Icon.stories.tsx` (added a `Color` axis, swapped the `Box` for an MUI `<Icon>`, etc.). Re-probe with the script in §6 and update §1–§4 if the new behavior is intentional; revert the story if not.
2. **MUI upgrade.** A `@mui/material` bump changed `<Box>` defaults or the palette resolution. Cross-check `package.json` and re-probe; if only the resolved hex moved (e.g. palette tweak), §3 needs an update but §1–§2 do not.
3. **Icon-source swap.** A future PR replaces inline SVGs with `@mui/icons-material` components or an Iconify dependency. Re-probe §2 — `<svg>` may be replaced by an `<MuiSvgIcon>` wrapper and the `viewBox` / fill conventions can shift. Update `figma.spec.md` §1 and §5 accordingly so the Figma instance-swap glyph stays consistent.

When in doubt, treat the runtime as ground truth and amend `figma.spec.md` rather than the other way around — the Figma cells are visual artifacts; the story is executable.

## 6. Re-probe script

Paste into the Chrome DevTools MCP `evaluate_script` function while the relevant Storybook story is loaded.

```js
// SizeMatrix — outer box & svg per Size (sample row 0 = Home)
() => {
  const stacks = Array.from(document.querySelectorAll('.MuiBox-root'));
  const iconBoxes = stacks.filter(el => el.querySelector(':scope > svg'));
  const sizes = ['xs','sm','md','lg','xl','xxl'];
  return Object.fromEntries(sizes.map((s, i) => {
    const el = iconBoxes[i]; if (!el) return [s, null];
    const cs = getComputedStyle(el);
    const svg = el.querySelector(':scope > svg');
    const path = svg.querySelector('path');
    return [s, {
      box: { width: cs.width, height: cs.height, display: cs.display, lineHeight: cs.lineHeight, color: cs.color },
      svg: { width: getComputedStyle(svg).width, fill: getComputedStyle(svg).fill, viewBox: svg.getAttribute('viewBox') },
      path: { fill: getComputedStyle(path).fill },
    }];
  }));
}

// ColorInheritance — verify currentColor propagation
() => {
  return Array.from(document.querySelectorAll('.MuiBox-root'))
    .filter(w => w.querySelector(':scope > .MuiBox-root > svg'))
    .map(w => {
      const inner = w.querySelector(':scope > .MuiBox-root');
      const path = inner.querySelector('svg path');
      return {
        outer: getComputedStyle(w).color,
        wrapper: getComputedStyle(inner).color,
        path: getComputedStyle(path).fill,
      };
    });
}
```

## 7. Sync rule (companion to `figma.spec.md` §8)

Update this document **and** the relevant section of `figma.spec.md` in the same PR when:

- `src/stories/Icon.stories.tsx` `SIZE_PX` table changes → re-probe §1 and update `figma.spec.md` §3 (variant table) + §4.1 (Sizing).
- The story replaces inline SVGs with a real icon library (`@mui/icons-material`, `@iconify/react`, etc.) → re-probe §2 and rewrite `figma.spec.md` §1 + §5 (icon source library).
- `mui-theme.ts` adds an override that touches `palette.text.primary` or any palette `<color>.main` referenced in §3 → re-resolve §3's hex column and update `figma.spec.md` §10 if any token rebinds.
- `@mui/material` major bump → re-probe §1–§3 wholesale; if `<Box>` defaults shift, document the delta in §4 and surface a TODO in `figma.spec.md` §7.
