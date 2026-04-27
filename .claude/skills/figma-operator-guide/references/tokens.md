# Tokens: bind everything, invent nothing

A finished screen has **zero** unbound hex colors and **zero** magic-number spacings.

## Required before using values

Run `get_variable_defs` during [discovery](discovery.md) so the variable namespace is loaded before you place any node.

## Binding rules

- **Color (fill, stroke, background):** bind to a variable. Never type a hex literal.
- **Spacing (padding, gap, margin):** bind to a spacing variable on the system's scale (typically 4/8-pt).
- **Radius:** bind to a radius variable or effect style.
- **Shadow / elevation:** use published effect styles, not custom `box-shadow`.
- **Typography:** use a published text style (`textStyleId`), not ad-hoc font / size / weight combinations. Every text node references a style.

## When the closest token is slightly off

Use the variable anyway and **flag the mismatch** to the user:

> "Spec shows `#2563EC` but the closest token is `color.blue.600 = #2563EB`. Used the token."

Never silently invent a one-off value to achieve pixel fidelity. The design system outranks the screenshot.

## Common failure signatures

| Symptom                            | What it means                                 |
| ---------------------------------- | --------------------------------------------- |
| `#2563EB` hard-coded on a fill     | Screenshot colors were copied, not looked up  |
| `padding: 13px` or `gap: 17px`     | Off-scale — measured from pixels              |
| `font-size: 15px, weight: 550`     | Freestyled typography — no text style applied |
| `border-radius: 7px`               | One-off radius — fragments the system         |
| Neutral grays drift between frames | No semantic color variable bound              |

## Theme survival

Bind to **semantic** variables (`surface.default`, `text.primary`) rather than palette primitives (`gray.50`, `gray.900`). Semantic bindings switch with the theme for free; primitives break in dark mode. See also [states.md](states.md) for theme coverage.

## Self-check

- [ ] No raw hex anywhere.
- [ ] No spacing / radius values off the system scale.
- [ ] Every text node uses a published text style.
- [ ] Shadows come from effect styles, not custom values.
- [ ] Colors are bound to semantic variables, not palette primitives.

---

## Plugin API binding — mandatory pattern

When writing via `use_figma`, the Plugin API makes it easy to "bind" a color variable in a way that silently fails — the Inspect panel shows the variable name but the canvas renders pure black. This happens because:

1. `figma.variables.setBoundVariableForPaint(paint, "color", variable)` returns a **NEW paint object** — it does NOT mutate the input. If the return value is discarded, the fill remains unbound.
2. `node.fills` is **immutable** — `node.fills[0] = newPaint` is a no-op. You must reassign the whole array.
3. If the node's owning frame has no explicit mode for the variable's collection, Figma falls back to the paint's raw `color`. A `{r:0, g:0, b:0}` placeholder then renders as black even though the binding is "correct."

### Rule 1 — Always use these helpers, never call `setBoundVariableForPaint` directly

Define these at the top of every `use_figma` script that binds color variables:

```js
// Bind a color variable to node.fills. Returns the bound paint.
// Pre-fills the paint with the variable's resolved value so that if binding
// fails or the mode is unresolved, the canvas shows the RIGHT color (not black).
async function bindFill(node, variable, opacity = 1) {
  const resolved = await variable.resolveForConsumer(node);
  const base = {
    type: 'SOLID',
    color: resolved?.value ?? { r: 0, g: 0, b: 0 },
    opacity,
  };
  const bound = figma.variables.setBoundVariableForPaint(base, 'color', variable);
  node.fills = [bound]; // whole-array reassign — fills is immutable
  return bound;
}

async function bindStroke(node, variable, opacity = 1) {
  const resolved = await variable.resolveForConsumer(node);
  const base = {
    type: 'SOLID',
    color: resolved?.value ?? { r: 0, g: 0, b: 0 },
    opacity,
  };
  const bound = figma.variables.setBoundVariableForPaint(base, 'color', variable);
  node.strokes = [bound];
  return bound;
}
```

### Rule 2 — Forbidden patterns

```js
// ❌ Return value discarded — binding is lost
figma.variables.setBoundVariableForPaint(paint, 'color', v);
node.fills = [paint];

// ❌ Mutating a fill in place — fills is immutable, this is a no-op
node.fills[0] = boundPaint;

// ❌ Raw black placeholder with no resolved fallback — if mode doesn't resolve, canvas goes black
const paint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
node.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', v)];
```

### Rule 3 — Audit before declaring done

After building a component/screen, run this audit. Any hits must be fixed before handoff:

```js
function auditFills(root) {
  const issues = [];
  const nodes = 'findAll' in root ? root.findAll(() => true) : [root];
  for (const n of nodes) {
    for (const key of ['fills', 'strokes']) {
      if (!(key in n) || !Array.isArray(n[key])) continue;
      n[key].forEach((p, i) => {
        if (p.type !== 'SOLID') return;
        const black = p.color.r === 0 && p.color.g === 0 && p.color.b === 0;
        const bound = p.boundVariables?.color;
        if (black && !bound)
          issues.push({ id: n.id, name: n.name, key, index: i, reason: 'black-unbound' });
      });
    }
  }
  return issues;
}
```

A non-empty result means: either the node was never bound (fix by calling `bindFill`), or the binding was lost (fix by re-running `bindFill` — never patch the raw color).

### Rule 4 — Mode coverage

If the component renders inside a frame whose collection modes are ambiguous, set the mode explicitly on the top-level frame:

```js
rootFrame.setExplicitVariableModeForCollection(collection, modeId);
```

This guarantees variables resolve on canvas instead of falling back to paint defaults.

## Self-check (Plugin API)

- [ ] Every color binding goes through `bindFill` / `bindStroke` — no direct `setBoundVariableForPaint` calls.
- [ ] `node.fills` / `node.strokes` are always whole-array reassigned, never index-mutated.
- [ ] `auditFills(root)` returns `[]` before declaring the task done.
- [ ] Top-level frames have explicit modes set for every consumed variable collection.
