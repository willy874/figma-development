// Plugin-API payload for figma-init/config-init (variables extraction step).
// Parameterized — the caller MUST prepend three constants before this body:
//
//   const TYPE   = "meta" | "vars";
//   const OFFSET = <integer, ignored when TYPE === "meta">;
//   const LIMIT  = <integer, ignored when TYPE === "meta">;
//
// Returns a COMPACT JSON string (no indent) so each chunk stays well under
// the use_figma 20KB tool-result truncation. The chunk shape is:
//
//   meta: { collections: [{ id, name, key, modes, defaultModeId, remote,
//                            totalVariables, variableIds: [...] }, ...] }
//   slice (for TYPE="vars"): { offset, total, items: [<variable>, ...] }
//
// The "vars" slice walks all collections in order, flattening every
// variableId into a single global stream — so OFFSET indexes the global
// stream, not a per-collection list. `assemble-variables.sh` uses the meta
// payload to know which variable belongs to which collection, then merges
// into `.library.variables.collections[]` inside figma.config.json.

const collectionsRaw = await figma.variables.getLocalVariableCollectionsAsync();

if (TYPE === "meta") {
  return JSON.stringify({
    collections: collectionsRaw.map((c) => ({
      id: c.id,
      name: c.name,
      key: c.key,
      modes: c.modes,
      defaultModeId: c.defaultModeId,
      remote: c.remote,
      totalVariables: c.variableIds.length,
      variableIds: c.variableIds.slice(),
    })),
  });
}

if (TYPE !== "vars") throw new Error("Unknown TYPE: " + TYPE);

const flatIds = [];
for (const c of collectionsRaw) {
  for (const id of c.variableIds) flatIds.push(id);
}
const sliceIds = flatIds.slice(OFFSET, OFFSET + LIMIT);
const items = [];
for (const id of sliceIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (!v) continue;
  items.push({
    id: v.id,
    name: v.name,
    key: v.key,
    resolvedType: v.resolvedType,
    valuesByMode: v.valuesByMode,
    scopes: v.scopes,
    codeSyntax: v.codeSyntax || {},
    description: v.description || "",
    remote: v.remote,
  });
}

return JSON.stringify({ offset: OFFSET, total: flatIds.length, items });
