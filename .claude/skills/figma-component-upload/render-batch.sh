#!/usr/bin/env bash
# Render the use_figma extraction script for one batch.
# Usage: render-batch.sh <batch-index>
# Outputs the ready-to-execute use_figma JavaScript on stdout.
# On failure: prints "ERROR: <reason>" to stderr and exits non-zero.
#
# The JS template is embedded below as a quoted heredoc with four placeholder
# lines, each replaced verbatim by awk on whole-line equality:
#   __NODE_ID_PLACEHOLDER__       → JSON-encoded nodeId string
#   __BATCH_INDEX_PLACEHOLDER__   → integer batch index
#   __BATCH_SIZE_PLACEHOLDER__    → integer batch size
#   __FILENAME_AXES_PLACEHOLDER__ → JSON array of axis names (or [])
# Edit the JS body inside the heredoc when changing extraction semantics; do
# not touch the placeholder lines.

set -euo pipefail

err() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }

[ "$#" -eq 1 ] || err "usage: render-batch.sh <batch-index>"

BIDX="$1"
case "$BIDX" in
  ''|*[!0-9]*) err "batch-index must be a non-negative integer, got: $BIDX" ;;
esac

PARAMS=/tmp/component-upload-params.json
[ -f "$PARAMS" ] || err "$PARAMS not found (run plan.sh first)"
command -v jq >/dev/null 2>&1 || err "jq is required but not found in PATH"

NID=$(jq -r '.nodeId    // empty' "$PARAMS")
BSIZE=$(jq -r '.batchSize // 5'   "$PARAMS")
FAXES=$(jq -c '.filenameAxes // []' "$PARAMS")

[ -n "$NID" ] || err "params.nodeId missing"

# JSON-encode the nodeId string. Pass via ENVIRON so awk does not unescape.
export NID_JSON FAXES_JSON BIDX_VAL BSIZE_VAL
NID_JSON=$(printf '%s' "$NID" | jq -Rs .)
FAXES_JSON="$FAXES"
BIDX_VAL="$BIDX"
BSIZE_VAL="$BSIZE"

awk '
  BEGIN {
    seen_nid = 0; seen_bidx = 0; seen_bsize = 0; seen_faxes = 0
  }
  $0 == "__NODE_ID_PLACEHOLDER__"        { seen_nid = 1;   print ENVIRON["NID_JSON"];   next }
  $0 == "__BATCH_INDEX_PLACEHOLDER__"    { seen_bidx = 1;  print ENVIRON["BIDX_VAL"];   next }
  $0 == "__BATCH_SIZE_PLACEHOLDER__"     { seen_bsize = 1; print ENVIRON["BSIZE_VAL"];  next }
  $0 == "__FILENAME_AXES_PLACEHOLDER__"  { seen_faxes = 1; print ENVIRON["FAXES_JSON"]; next }
  { print }
  END {
    if (!seen_nid)   { print "ERROR: template missing __NODE_ID_PLACEHOLDER__"       > "/dev/stderr"; exit 1 }
    if (!seen_bidx)  { print "ERROR: template missing __BATCH_INDEX_PLACEHOLDER__"   > "/dev/stderr"; exit 1 }
    if (!seen_bsize) { print "ERROR: template missing __BATCH_SIZE_PLACEHOLDER__"    > "/dev/stderr"; exit 1 }
    if (!seen_faxes) { print "ERROR: template missing __FILENAME_AXES_PLACEHOLDER__" > "/dev/stderr"; exit 1 }
  }
' <<'__EXTRACT_JS__'
const NODE_ID =
__NODE_ID_PLACEHOLDER__
;
const BATCH_INDEX =
__BATCH_INDEX_PLACEHOLDER__
;
const BATCH_SIZE =
__BATCH_SIZE_PLACEHOLDER__
;
const FILENAME_AXES =
__FILENAME_AXES_PLACEHOLDER__
;

const setNode = await figma.getNodeByIdAsync(NODE_ID);
if (!setNode) throw new Error("Node not found: " + NODE_ID);
let p = setNode;
while (p && p.type !== "PAGE") p = p.parent;
if (p) await figma.setCurrentPageAsync(p);

const FULL_PROPS = ["id","name","type","visible","x","y","width","height","opacity","blendMode","fills","strokes","strokeWeight","strokeAlign","strokeTopWeight","strokeBottomWeight","strokeLeftWeight","strokeRightWeight","cornerRadius","topLeftRadius","topRightRadius","bottomLeftRadius","bottomRightRadius","effects","clipsContent","layoutMode","layoutWrap","primaryAxisAlignItems","counterAxisAlignItems","primaryAxisSizingMode","counterAxisSizingMode","layoutSizingHorizontal","layoutSizingVertical","layoutAlign","layoutGrow","paddingTop","paddingRight","paddingBottom","paddingLeft","itemSpacing","counterAxisSpacing","characters","fontSize","fontName","textAlignHorizontal","textAlignVertical","textAutoResize","lineHeight","letterSpacing","textCase","textDecoration","fontWeight","boundVariables","componentPropertyReferences","constraints"];
const INSTANCE_PROPS = ["id","name","type","visible","x","y","width","height","layoutSizingHorizontal","layoutSizingVertical","componentPropertyReferences"];
const DEFAULTS = {visible:true,opacity:1,blendMode:"PASS_THROUGH",strokeWeight:1,strokeAlign:"INSIDE",layoutWrap:"NO_WRAP",layoutGrow:0,layoutAlign:"INHERIT",textCase:"ORIGINAL",textDecoration:"NONE",clipsContent:false};

function isEmpty(v) {
  return (Array.isArray(v) && v.length === 0) ||
    (v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);
}
function pickProps(n, keys) {
  const o = {};
  for (const k of keys) {
    try {
      const v = n[k];
      if (v === undefined) continue;
      if (typeof v === "symbol") continue;
      if (k in DEFAULTS && DEFAULTS[k] === v) continue;
      if (isEmpty(v)) continue;
      o[k] = v;
    } catch {}
  }
  return o;
}
function ser(n) {
  if (n.type === "INSTANCE") {
    const o = pickProps(n, INSTANCE_PROPS);
    try { if (n.mainComponent) o.mainComponentId = n.mainComponent.id; } catch {}
    return o;
  }
  const o = pickProps(n, FULL_PROPS);
  if ("children" in n && Array.isArray(n.children)) o.children = n.children.map(ser);
  return o;
}
function parseProps(name) {
  const o = {};
  for (const part of String(name).split(",")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    o[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return o;
}
function deriveFilename(name) {
  if (Array.isArray(FILENAME_AXES) && FILENAME_AXES.length) {
    const props = parseProps(name);
    return FILENAME_AXES.map(function (a) { return props[a] || ""; }).join("-") + ".json";
  }
  return String(name).replace(/[^A-Za-z0-9_-]+/g, "_") + ".json";
}

const all = (setNode.type === "COMPONENT_SET" && Array.isArray(setNode.children))
  ? setNode.children.slice()
  : [setNode];
all.sort(function (a, b) { return a.name.localeCompare(b.name); });
const total = all.length;
const start = BATCH_INDEX * BATCH_SIZE;
const slice = all.slice(start, start + BATCH_SIZE);

const out = {};
for (const c of slice) out[deriveFilename(c.name)] = ser(c);

return {
  batchIndex: BATCH_INDEX,
  total: total,
  count: slice.length,
  done: start + slice.length >= total,
  files: out
};
__EXTRACT_JS__
