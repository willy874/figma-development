#!/usr/bin/env bash
# Read /tmp/component-upload-batch.json (the use_figma response written by the
# model via heredoc), write one JSON file per entry into outputDir, and update
# /tmp/component-upload-return.json with totals and the list of filenames.
# On failure: prints "ERROR: <reason>" to stdout and exits non-zero.

set -euo pipefail

fail() {
  printf 'ERROR: %s\n' "$1"
  exit 1
}

command -v jq >/dev/null 2>&1   || fail "jq is required but not found in PATH"
command -v node >/dev/null 2>&1 || fail "node is required but not found in PATH"

PARAMS=/tmp/component-upload-params.json
BATCH=/tmp/component-upload-batch.json
RET=/tmp/component-upload-return.json

[ -f "$PARAMS" ] || fail "$PARAMS not found"
[ -f "$BATCH" ]  || fail "$BATCH not found (write the use_figma response there first)"
[ -f "$RET" ]    || fail "$RET not found (run plan.sh first)"

jq -e 'type == "object" and has("files") and (.files | type == "object") and has("total") and has("count") and has("done")' "$BATCH" >/dev/null 2>&1 \
  || fail "$BATCH is not a valid batch response (need files, total, count, done)"

OD=$(jq -r '.outputDir // empty' "$PARAMS") || fail "failed to parse $PARAMS"
[ -n "$OD" ] || fail "params.outputDir missing"
mkdir -p "$OD" || fail "failed to create outputDir: $OD"

TMP_LIST=$(mktemp) || fail "mktemp failed"
trap 'rm -f "$TMP_LIST"' EXIT

OUTDIR="$OD" BATCH_PATH="$BATCH" LIST_PATH="$TMP_LIST" node -e '
  const fs   = require("fs");
  const path = require("path");
  const dir  = process.env.OUTDIR;
  const batch = JSON.parse(fs.readFileSync(process.env.BATCH_PATH, "utf8"));
  const list = [];
  for (const [name, value] of Object.entries(batch.files)) {
    if (typeof name !== "string" || !name) continue;
    if (name.includes("/") || name.includes("\\") || name === "." || name === "..") {
      throw new Error("unsafe filename in batch.files: " + name);
    }
    const target = path.join(dir, name);
    fs.writeFileSync(target, JSON.stringify(value, null, 2));
    list.push(name);
  }
  fs.writeFileSync(process.env.LIST_PATH, list.join("\n"));
' || fail "node writer failed"

TOTAL=$(jq -r '.total' "$BATCH")
COUNT=$(jq -r '.count' "$BATCH")
DONE=$(jq -r '.done'  "$BATCH")

jq --argjson total "$TOTAL" \
   --rawfile   written "$TMP_LIST" \
   '.totalVariants = $total
    | .batchesCompleted = (.batchesCompleted // 0) + 1
    | .filesWritten = ((.filesWritten // []) + ($written | split("\n") | map(select(. != ""))))' \
   "$RET" > "${RET}.tmp" \
  || fail "failed to update $RET"
mv "${RET}.tmp" "$RET" || fail "failed to atomically replace $RET"

printf 'wrote=%s total=%s done=%s\n' "$COUNT" "$TOTAL" "$DONE"
