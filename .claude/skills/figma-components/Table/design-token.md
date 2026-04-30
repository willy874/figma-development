---
name: figma-component-table-design-token
description: Component-scoped tokens minted in the MUI Library Figma file's local `merak` collection for `<Table>`. Documents two pre-α'd primary-themed selected-row overlays that the catalogue's seed/alias families do not cover, plus the chosen text-style bindings for Head vs Body cells. Companion to `figma.spec.md` (the contract) and `storybook.render.md` (the runtime measurements).
parent_skill: figma-components
---

# `<Table>` Component-scoped Tokens

The Table cell + row sets bind every paint to the file's local `merak` collection per the project's local-only directive (`figma.spec.md` §1). Two roles are not covered by the shared `seed/*` or `alias/*` families and require **component-scoped** tokens minted in the local collection. Both bake their alpha into the resolved value so the bound paint can stay at `opacity: 1` (Figma flattens `paint.opacity < 1` when bound to a variable on instance creation — see `figma-component-spec-guide` §4.4–§4.5).

The third entry below is **not** a new variable — it documents the chosen text-style binding for head cells, since the catalogue does not ship a Roboto-Medium 14/24 body style.

---

## 1. `component/table/selected-bg`

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Type             | `COLOR`                                                          |
| Scopes           | `["FRAME_FILL", "SHAPE_FILL"]`                                   |
| Resolved value (light) | `rgba(25, 118, 210, 0.08)`                                 |
| Hex notation     | `#1976D214`                                                      |
| Resolution chain | `seed/primary/main` (`#1976D2`) × `0.08` (alpha)                 |
| Used by          | `<TableRow>` `Hover=Off, Selected=On` background paint           |

**Why it's component-scoped.** MUI hard-codes the selected row overlay to `alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)` (`0.08`) inside `TableRow.js`. The shared catalogue ships a neutral-black `alias/colors/bg-selected` (`palette/action/selected` = `#00000014`, ~8 %-α black) — that is the Material spec for non-themed selection, **not** the primary-themed value Table actually uses at runtime. Binding the row to `bg-selected` would paint the wrong colour. Minting `component/table/selected-bg` carries the `seed/primary/main × 0.08` alpha into a single bound paint without polluting the seed family.

If we ever theme Table by another color (e.g. a `Color=Danger` row variant), mint `component/table/selected-bg-<c>` siblings using the same `seed/<C>/main × 0.08` recipe — same pattern Pagination uses for its themed Selected cells.

## 2. `component/table/selected-hover-bg`

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Type             | `COLOR`                                                          |
| Scopes           | `["FRAME_FILL", "SHAPE_FILL"]`                                   |
| Resolved value (light) | `rgba(25, 118, 210, 0.12)`                                 |
| Hex notation     | `#1976D21F`                                                      |
| Resolution chain | `seed/primary/main` (`#1976D2`) × `0.12` (alpha = `selectedOpacity 0.08` + `hoverOpacity 0.04`) |
| Used by          | `<TableRow>` `Hover=On, Selected=On` background paint            |

**Why it's component-scoped.** MUI combines `&.Mui-selected` (8 %-α primary) and `:hover` (4 %-α neutral) into the resting `&.Mui-selected:hover` overlay (12 %-α primary). The shared catalogue does not ship a 12 %-α primary token. Same reasoning as `selected-bg` above — bake the alpha into a single variable so the row paint stays at `opacity: 1`.

We deliberately do **not** stack the 4 %-α `bg-outline-hover` on top of a `selected-bg` fill at the row level; the resulting composite resolves to a different colour than the runtime (mixing 8 %-α primary with 4 %-α neutral ≠ 12 %-α primary). Pre-α'd is the correct model.

## 3. Cell text style — chosen approach (hand-set, not bound)

| Cell variant        | Font family | Style    | Size    | Line-height | Letter-spacing  |
| ------------------- | ----------- | -------- | ------- | ----------- | --------------- |
| `Variant=Head`      | Roboto      | Medium   | `14 px` | `24 px`     | `0.14994 px`    |
| `Variant=Body`      | Roboto      | Regular  | `14 px` | `20.02 px`  | `0.14994 px`    |

**Why hand-set instead of bound.** The MUI Library file does not own any **local** text styles — `figma.getLocalTextStylesAsync()` returns an empty list. Every `material-design/typography/*` style is published by an upstream consumed library, not minted in this file. Per the project's local-only directive (`figma.spec.md` §1) we cannot bind to a consumed-library text style without breaking self-containment, so the Table cells set `fontName / fontSize / lineHeight / letterSpacing` directly to match MUI runtime exactly:

- Head cells: `Roboto Medium 14 / 24`, `letter-spacing 0.14994 px` (matches `storybook.render.md` §1.1).
- Body cells: `Roboto Regular 14 / 20.02`, `letter-spacing 0.14994 px`.

**When to revisit.** If the file mints local equivalents (e.g. `merak/typography/table-head` and `merak/typography/table-body`) under the local-only rule, rebind cell text via `setTextStyleIdAsync` and drop the hand-set values. Tracked in `figma.spec.md` §8.

---

## 5. Pre-flight check before authoring (Step 5 of `figma-create-component`)

Before any `use_figma` write to the cell / row sets, confirm the variables in §1 and §2 already exist in the local `merak` collection. If not, mint them via `use_figma`:

```js
const collection = (await figma.variables.getLocalVariableCollectionsAsync())
  .find(c => c.name === 'merak');
const seedPrimaryMain = (await figma.variables.getLocalVariablesAsync('COLOR'))
  .find(v => v.name === 'seed/primary/main');

// Compose pre-α'd RGBA from seed/primary/main × alpha
const computeRgba = (alpha) => {
  const modeId = collection.defaultModeId;
  const base = seedPrimaryMain.valuesByMode[modeId]; // {r,g,b,a:1}
  return { r: base.r, g: base.g, b: base.b, a: alpha };
};

const mint = (name, alpha) => {
  let v = (await figma.variables.getLocalVariablesAsync('COLOR'))
    .find(x => x.name === name && x.variableCollectionId === collection.id);
  if (!v) {
    v = figma.variables.createVariable(name, collection, 'COLOR');
    v.scopes = ['FRAME_FILL', 'SHAPE_FILL'];
  }
  for (const m of collection.modes) v.setValueForMode(m.modeId, computeRgba(alpha));
  return v.id;
};

return {
  selectedBg: await mint('component/table/selected-bg', 0.08),
  selectedHoverBg: await mint('component/table/selected-hover-bg', 0.12),
};
```

(Snippet illustrative — adapt to the file's actual mode setup; multi-mode files need per-mode resolution if `seed/primary/main` differs across modes.)
