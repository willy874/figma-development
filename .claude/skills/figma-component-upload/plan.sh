#!/usr/bin/env bash
# Validate /tmp/component-upload-params.json, create outputDir, seed
# /tmp/component-upload-return.json, and stage /tmp/component-upload-extract.js
# (the per-batch use_figma script with NODE_ID/BATCH_SIZE/FILENAME_AXES baked in).
# Prints the resolved params to stdout. On failure: prints "ERROR: <reason>" and exits non-zero.

set -euo pipefail

fail() {
  printf 'ERROR: %s\n' "$1"
  exit 1
}

command -v jq >/dev/null 2>&1   || fail "jq is required but not found in PATH"
command -v node >/dev/null 2>&1 || fail "node is required but not found in PATH"

PARAMS=/tmp/component-upload-params.json
RET=/tmp/component-upload-return.json
EXTRACT=/tmp/component-upload-extract.js
SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE="$SKILL_DIR/extract.js"

[ -f "$PARAMS" ]   || fail "$PARAMS not found"
[ -f "$TEMPLATE" ] || fail "$TEMPLATE not found"

jq -e 'type == "object"' "$PARAMS" >/dev/null 2>&1 \
  || fail "$PARAMS is not a JSON object"

FK=$(jq -r '.fileKey   // empty' "$PARAMS") || fail "failed to parse $PARAMS"
NID=$(jq -r '.nodeId   // empty' "$PARAMS") || fail "failed to parse $PARAMS"
OD=$(jq -r '.outputDir // empty' "$PARAMS") || fail "failed to parse $PARAMS"
BSIZE=$(jq -r '.batchSize // 10'  "$PARAMS") || fail "failed to parse $PARAMS"
FAXES=$(jq -c '.filenameAxes // []' "$PARAMS") || fail "failed to parse $PARAMS"

[ -n "$FK" ]  || fail "params.fileKey missing or empty"
[ -n "$NID" ] || fail "params.nodeId missing or empty"
[ -n "$OD" ]  || fail "params.outputDir missing or empty"

[[ "$NID" =~ ^-?[0-9]+[:-]-?[0-9]+$ ]] \
  || fail "params.nodeId must match X:Y or X-Y, got: $NID"

case "$BSIZE" in
  ''|*[!0-9]*) fail "params.batchSize must be a positive integer, got: $BSIZE" ;;
esac
[ "$BSIZE" -ge 1 ] || fail "params.batchSize must be >= 1"

jq -e '.filenameAxes == null or (type == "object" and (.filenameAxes | type == "array" and (all(type == "string"))))' "$PARAMS" >/dev/null 2>&1 \
  || fail "params.filenameAxes must be an array of strings (or omitted)"

mkdir -p "$OD" || fail "failed to create outputDir: $OD"

jq -n \
  --arg fk "$FK" \
  --arg nid "$NID" \
  --arg od "$OD" \
  '{
    fileKey: $fk,
    nodeId: $nid,
    outputDir: $od,
    totalVariants: null,
    batchesCompleted: 0,
    filesWritten: [],
    errors: []
  }' > "$RET" || fail "failed to write $RET"

# Stage extract.js with stable params baked in. Only BATCH_INDEX varies per batch.
# Use Python-style replace via awk to keep substitution literal-safe.
NID_JSON=$(printf '%s' "$NID" | jq -Rs .)
export NID_JSON BSIZE FAXES
awk '
  { gsub(/"__NODE_ID__"/, ENVIRON["NID_JSON"])
    gsub(/__BATCH_SIZE__/, ENVIRON["BSIZE"])
    gsub(/__FILENAME_AXES__/, ENVIRON["FAXES"])
    print }
' "$TEMPLATE" > "$EXTRACT" || fail "failed to stage $EXTRACT"

printf 'fileKey=%s\nnodeId=%s\noutputDir=%s\nbatchSize=%s\nextractPath=%s\n' \
  "$FK" "$NID" "$OD" "$BSIZE" "$EXTRACT"
