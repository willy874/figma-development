// Plugin-API payload for figma-component-sync (token sync).
// Parameterized — the caller MUST prepend three constants before this body:
//
//   const TYPE   = "counts" | "text" | "effect" | "paint" | "grid";
//   const OFFSET = <integer, ignored when TYPE === "counts">;
//   const LIMIT  = <integer, ignored when TYPE === "counts">;
//
// Returns a COMPACT JSON string (no indent) so each chunk stays well under
// the use_figma 20KB tool-result truncation. The chunk shape is:
//
//   counts: { paint, text, effect, grid }
//   slice : { type, offset, total, items: [...] }
//
// `assemble-tokens.sh styles` HTML-decodes every chunk, restitches the
// items in offset order, and writes src/figma/styles.json with the correct
// fileKey/fileName/extractedAt + 2-space indent.

const dumpText = (s) => ({
  id: s.id,
  name: s.name,
  key: s.key,
  description: s.description || "",
  fontSize: s.fontSize,
  fontName: s.fontName,
  letterSpacing: s.letterSpacing,
  lineHeight: s.lineHeight,
  paragraphIndent: s.paragraphIndent,
  paragraphSpacing: s.paragraphSpacing,
  textCase: s.textCase,
  textDecoration: s.textDecoration,
  remote: s.remote,
  boundVariables: s.boundVariables || {},
});
const dumpEffect = (s) => ({
  id: s.id,
  name: s.name,
  key: s.key,
  description: s.description || "",
  remote: s.remote,
  boundVariables: s.boundVariables || {},
  effects: s.effects,
});
const dumpPaint = (s) => ({
  id: s.id,
  name: s.name,
  key: s.key,
  description: s.description || "",
  remote: s.remote,
  boundVariables: s.boundVariables || {},
  paints: s.paints,
});
const dumpGrid = (s) => ({
  id: s.id,
  name: s.name,
  key: s.key,
  description: s.description || "",
  remote: s.remote,
  boundVariables: s.boundVariables || {},
  layoutGrids: s.layoutGrids,
});

const fetchers = {
  text: () => figma.getLocalTextStylesAsync(),
  effect: () => figma.getLocalEffectStylesAsync(),
  paint: () => figma.getLocalPaintStylesAsync(),
  grid: () => figma.getLocalGridStylesAsync(),
};
const dumpers = { text: dumpText, effect: dumpEffect, paint: dumpPaint, grid: dumpGrid };

if (TYPE === "counts") {
  const [paint, text, effect, grid] = await Promise.all([
    fetchers.paint(),
    fetchers.text(),
    fetchers.effect(),
    fetchers.grid(),
  ]);
  return JSON.stringify({
    paint: paint.length,
    text: text.length,
    effect: effect.length,
    grid: grid.length,
  });
}

if (!fetchers[TYPE]) throw new Error("Unknown TYPE: " + TYPE);
const items = await fetchers[TYPE]();
const slice = items.slice(OFFSET, OFFSET + LIMIT).map(dumpers[TYPE]);
return JSON.stringify({ type: TYPE, offset: OFFSET, total: items.length, items: slice });
