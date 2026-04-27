#!/usr/bin/env bash
# Render the figma-init upload script for one (sub-)pack.
# Usage: render.sh <collection-name> <pack-path>
# Outputs the ready-to-execute use_figma JavaScript on stdout.
# On failure: prints "ERROR: <reason>" to stderr and exits non-zero.
#
# The JS template is embedded below as a quoted heredoc with two placeholder
# lines:
#   __PACK_PLACEHOLDER__   → replaced verbatim with the pack file's JSON content
#   __COLL_PLACEHOLDER__   → replaced with the collection name as a JSON string
# Substitution is done by awk on whole-line equality, so neither the pack
# content nor the JSON-encoded collection name is ever interpreted as a regex
# or shell expansion. Edit the JS body inside the heredoc when changing upload
# semantics; do not touch the placeholder lines.

set -euo pipefail

err() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }

[ "$#" -eq 2 ] || err "usage: render.sh <collection-name> <pack-path>"

COLL="$1"
PACK_PATH="$2"

[ -n "$COLL" ]      || err "collection name is empty"
[ -f "$PACK_PATH" ] || err "pack file not found: $PACK_PATH"
command -v jq >/dev/null 2>&1 || err "jq is required but not found in PATH"

# JSON-encode the collection name so quotes/backslashes round-trip safely.
# Passed via ENVIRON to avoid awk's `-v` backslash processing, which would
# otherwise unescape \" and \\ and corrupt the rendered string literal.
export COLL_JSON
COLL_JSON=$(printf '%s' "$COLL" | jq -Rs .)

awk -v pack_path="$PACK_PATH" '
  BEGIN {
    coll_json = ENVIRON["COLL_JSON"]
    seen_pack = 0
    seen_coll = 0
  }
  $0 == "__PACK_PLACEHOLDER__" {
    seen_pack = 1
    while ((getline line < pack_path) > 0) print line
    close(pack_path)
    next
  }
  $0 == "__COLL_PLACEHOLDER__" {
    seen_coll = 1
    print coll_json
    next
  }
  { print }
  END {
    if (!seen_pack) { print "ERROR: template missing __PACK_PLACEHOLDER__ line" > "/dev/stderr"; exit 1 }
    if (!seen_coll) { print "ERROR: template missing __COLL_PLACEHOLDER__ line" > "/dev/stderr"; exit 1 }
  }
' <<'__UPLOAD_JS__'
const PACK =
__PACK_PLACEHOLDER__
;
const COLLECTION_NAME =
__COLL_PLACEHOLDER__
;

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const targetColl = collections.find(c => c.name === COLLECTION_NAME);
if (!targetColl) throw new Error('Collection not found: ' + COLLECTION_NAME);

const allVars = await figma.variables.getLocalVariablesAsync();
const nameToVar = new Map();
for (const v of allVars) nameToVar.set(v.name, v);

const targetMap = new Map();
for (const v of allVars) {
  if (v.variableCollectionId === targetColl.id) targetMap.set(v.name, v);
}

const modeNameToId = {};
for (const m of targetColl.modes) modeNameToId[m.name] = m.modeId;

const errors = [];
const written = [];

for (const entry of PACK) {
  const [name, valByMode] = entry;
  const v = targetMap.get(name);
  if (!v) { errors.push({ name, error: 'not-found' }); continue; }
  let touched = false;
  for (const modeName of Object.keys(valByMode)) {
    const modeId = modeNameToId[modeName];
    if (!modeId) { errors.push({ name, mode: modeName, error: 'mode-not-found' }); continue; }
    const packed = valByMode[modeName];
    const kind = packed[0];
    try {
      if (kind === 'c') {
        v.setValueForMode(modeId, { r: packed[1], g: packed[2], b: packed[3], a: packed[4] });
      } else if (kind === 'a') {
        const target = nameToVar.get(packed[1]);
        if (!target) { errors.push({ name, mode: modeName, error: 'alias-target-not-found', targetName: packed[1] }); continue; }
        v.setValueForMode(modeId, figma.variables.createVariableAlias(target));
      } else if (kind === 'n') {
        v.setValueForMode(modeId, packed[1]);
      } else if (kind === 'b') {
        v.setValueForMode(modeId, packed[1]);
      } else if (kind === 's') {
        v.setValueForMode(modeId, packed[1]);
      } else {
        errors.push({ name, mode: modeName, error: 'unknown-kind', kind });
        continue;
      }
      touched = true;
    } catch (e) {
      errors.push({ name, mode: modeName, error: String(e && e.message || e) });
    }
  }
  if (touched) written.push(v.id);
}

return {
  collection: COLLECTION_NAME,
  attempted: PACK.length,
  writtenCount: written.length,
  errorCount: errors.length,
  errors: errors.slice(0, 30),
  mutatedNodeIds: written,
};
__UPLOAD_JS__
