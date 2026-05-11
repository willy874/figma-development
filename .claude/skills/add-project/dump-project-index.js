// Plugin-API payload for add-project's "pull project index" step.
// Parameterized — the caller MUST prepend three constants before this body:
//
//   const TYPE   = "meta" | "vars" | "styles" | "components";
//   const OFFSET = <integer>;   // ignored when TYPE === "meta"
//   const LIMIT  = <integer>;   // ignored when TYPE === "meta"
//
// Returns a COMPACT JSON string (no indent) so each chunk stays well under
// the use_figma 20 KB tool-result truncation. Chunk shapes:
//
//   meta:             { file, pages[], collections[], counts }
//   vars slice:       { offset, total, items: [<variable>, ...] }
//   styles slice:     { offset, total, items: [<style>, ...] }
//   components slice: { offset, total, items: [<component>, ...] }
//
// The slices index into category-specific global streams (variableIds
// flattened across collections, styles flattened across paint/text/effect/
// grid in that order, components from findAllWithCriteria). OFFSET is the
// global offset within that category.
//
// IMPORTANT: this is a LIGHTWEIGHT index — no valuesByMode on variables, no
// full paints / textProperties / effects / grid on styles. Full token
// values live in figma.config.json's .library.variables (owned by
// figma-init's main flow, against the library file).

if (typeof figma.loadAllPagesAsync === "function") {
  await figma.loadAllPagesAsync();
}

async function listStyles() {
  const paint = await figma.getLocalPaintStylesAsync();
  const text = await figma.getLocalTextStylesAsync();
  const effect = await figma.getLocalEffectStylesAsync();
  const grid = await figma.getLocalGridStylesAsync();
  const out = [];
  for (const s of paint) out.push([s, "PAINT"]);
  for (const s of text) out.push([s, "TEXT"]);
  for (const s of effect) out.push([s, "EFFECT"]);
  for (const s of grid) out.push([s, "GRID"]);
  return out;
}

function listComponents() {
  return figma.root.findAllWithCriteria({
    types: ["COMPONENT", "COMPONENT_SET"],
  });
}

if (TYPE === "meta") {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const styles = await listStyles();
  const components = listComponents();

  let variableTotal = 0;
  for (const c of collections) variableTotal += c.variableIds.length;

  return JSON.stringify({
    file: { name: figma.root.name },
    pages: figma.root.children.map((p) => ({ id: p.id, name: p.name })),
    collections: collections.map((c) => ({
      id: c.id,
      name: c.name,
      key: c.key,
      modes: c.modes,
      defaultModeId: c.defaultModeId,
      remote: c.remote,
      totalVariables: c.variableIds.length,
      variableIds: c.variableIds.slice(),
    })),
    counts: {
      variables: variableTotal,
      styles: styles.length,
      components: components.length,
      pages: figma.root.children.length,
    },
  });
}

if (TYPE === "vars") {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const flat = [];
  for (const c of collections) for (const id of c.variableIds) flat.push(id);
  const sliceIds = flat.slice(OFFSET, OFFSET + LIMIT);
  const items = [];
  for (const id of sliceIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (!v) continue;
    items.push({
      id: v.id,
      name: v.name,
      key: v.key,
      collectionId: v.variableCollectionId,
      resolvedType: v.resolvedType,
      scopes: v.scopes,
      remote: v.remote,
      description: v.description || "",
    });
  }
  return JSON.stringify({ offset: OFFSET, total: flat.length, items });
}

if (TYPE === "styles") {
  const styles = await listStyles();
  const slice = styles.slice(OFFSET, OFFSET + LIMIT);
  const items = slice.map((entry) => {
    const s = entry[0];
    const kind = entry[1];
    return {
      id: s.id,
      name: s.name,
      key: s.key,
      kind,
      remote: s.remote,
      description: s.description || "",
    };
  });
  return JSON.stringify({ offset: OFFSET, total: styles.length, items });
}

if (TYPE === "components") {
  const all = listComponents();
  const slice = all.slice(OFFSET, OFFSET + LIMIT);
  const items = slice.map((n) => {
    let p = n.parent;
    while (p && p.type !== "PAGE") p = p.parent;
    return {
      id: n.id,
      name: n.name,
      key: n.key,
      type: n.type,
      pageId: p ? p.id : null,
      pageName: p ? p.name : null,
      variantGroupProperties:
        n.type === "COMPONENT_SET" && n.variantGroupProperties
          ? n.variantGroupProperties
          : null,
      description: n.description || "",
    };
  });
  return JSON.stringify({ offset: OFFSET, total: all.length, items });
}

throw new Error("Unknown TYPE: " + TYPE);
