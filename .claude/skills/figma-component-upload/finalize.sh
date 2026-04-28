#!/usr/bin/env bash
# Print the run summary from /tmp/component-upload-return.json.

set -euo pipefail

fail() {
  printf 'ERROR: %s\n' "$1"
  exit 1
}

command -v jq >/dev/null 2>&1 || fail "jq is required but not found in PATH"

RET=/tmp/component-upload-return.json
[ -f "$RET" ] || fail "$RET not found (run plan.sh first)"

jq -r '
  "fileKey:          \(.fileKey)",
  "nodeId:           \(.nodeId)",
  "outputDir:        \(.outputDir)",
  "totalVariants:    \(.totalVariants // "unknown")",
  "batchesCompleted: \(.batchesCompleted)",
  "filesWritten:     \(.filesWritten | length)",
  "errors:           \(.errors | length)"
' "$RET"
