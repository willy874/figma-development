#!/usr/bin/env bash
# Snapshot every variant of a Figma component set into per-variant JSON files
# via the Figma REST API. Single-shot. No MCP. No batching.
#
# Reads /tmp/component-upload-params.json:
#   { "fileKey": "...", "nodeId": "X:Y", "outputDir": "...", "filenameAxes": [...] }
#
# Requires FIGMA_TOKEN env var (Figma personal access token).
# Get a PAT at https://www.figma.com/developers/api#access-tokens
#
# On failure: prints "ERROR: <reason>" to stderr and exits non-zero.

set -euo pipefail

fail() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }

command -v jq   >/dev/null 2>&1 || fail "jq is required but not found in PATH"
command -v curl >/dev/null 2>&1 || fail "curl is required but not found in PATH"
command -v node >/dev/null 2>&1 || fail "node is required but not found in PATH"

PARAMS=/tmp/component-upload-params.json
RET=/tmp/component-upload-return.json

[ -f "$PARAMS" ] || fail "$PARAMS not found"
jq -e 'type == "object"' "$PARAMS" >/dev/null 2>&1 \
  || fail "$PARAMS is not a JSON object"

FK=$(jq -r '.fileKey   // empty' "$PARAMS")
NID=$(jq -r '.nodeId   // empty' "$PARAMS")
OD=$(jq -r '.outputDir // empty' "$PARAMS")
FAXES=$(jq -c '.filenameAxes // []' "$PARAMS")

[ -n "$FK" ]  || fail "params.fileKey missing or empty"
[ -n "$NID" ] || fail "params.nodeId missing or empty"
[ -n "$OD" ]  || fail "params.outputDir missing or empty"

[[ "$NID" =~ ^-?[0-9]+[:-]-?[0-9]+$ ]] \
  || fail "params.nodeId must match X:Y or X-Y, got: $NID"

jq -e '.filenameAxes == null or (.filenameAxes | type == "array" and (all(type == "string")))' "$PARAMS" >/dev/null 2>&1 \
  || fail "params.filenameAxes must be an array of strings (or omitted)"

# If FIGMA_TOKEN is unset, try loading from .env (CWD first, then project root).
if [ -z "${FIGMA_TOKEN:-}" ]; then
  PROJECT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
  for env_file in .env "$PROJECT_ROOT/.env"; do
    [ -f "$env_file" ] || continue
    while IFS='=' read -r k v; do
      [ "$k" = "FIGMA_TOKEN" ] || continue
      v="${v#\"}"; v="${v%\"}"; v="${v#\'}"; v="${v%\'}"; v="${v%$'\r'}"
      export FIGMA_TOKEN="$v"
      break
    done < "$env_file"
    [ -n "${FIGMA_TOKEN:-}" ] && break
  done
fi
[ -n "${FIGMA_TOKEN:-}" ] || fail "FIGMA_TOKEN not set. Get a PAT at https://www.figma.com/developers/api#access-tokens, then add 'FIGMA_TOKEN=<token>' to .env at project root (or 'export FIGMA_TOKEN=<token>' in your shell)."

mkdir -p "$OD" || fail "failed to create $OD"

# REST API uses X:Y form. Accept X-Y from URLs and normalise.
NID_NORM=${NID//-/:}
NID_ENC=$(printf '%s' "$NID_NORM" | jq -sRr @uri)
URL="https://api.figma.com/v1/files/${FK}/nodes?ids=${NID_ENC}"

RESP=$(mktemp) || fail "mktemp failed"
trap 'rm -f "$RESP"' EXIT

HTTP=$(curl -sS -o "$RESP" -w '%{http_code}' \
  -H "X-Figma-Token: ${FIGMA_TOKEN}" \
  "$URL") || fail "curl failed"

case "$HTTP" in
  200) ;;
  401|403) fail "Figma API HTTP $HTTP — token rejected. Check FIGMA_TOKEN scope and that it has access to fileKey=$FK." ;;
  404) fail "Figma API HTTP 404 — file or node not found (fileKey=$FK, nodeId=$NID_NORM)." ;;
  *)   fail "Figma API HTTP $HTTP: $(jq -r '.err // .message // .' "$RESP" 2>/dev/null || cat "$RESP")" ;;
esac

FK="$FK" NID="$NID_NORM" OUTDIR="$OD" FAXES_JSON="$FAXES" RESP_PATH="$RESP" RET_PATH="$RET" node -e '
  const fs   = require("fs");
  const path = require("path");
  const resp = JSON.parse(fs.readFileSync(process.env.RESP_PATH, "utf8"));
  const nid    = process.env.NID;
  const outDir = process.env.OUTDIR;
  const faxes  = JSON.parse(process.env.FAXES_JSON);

  const wrapper = resp.nodes && resp.nodes[nid];
  if (!wrapper) throw new Error("node " + nid + " not present in API response");
  const doc = wrapper.document;
  if (!doc) throw new Error("API response missing document for " + nid);

  const variants = (doc.type === "COMPONENT_SET" && Array.isArray(doc.children))
    ? doc.children.slice()
    : [doc];
  variants.sort((a, b) => a.name.localeCompare(b.name));

  function deriveFilename(name) {
    if (Array.isArray(faxes) && faxes.length) {
      const props = {};
      for (const part of String(name).split(",")) {
        const i = part.indexOf("=");
        if (i !== -1) props[part.slice(0, i).trim()] = part.slice(i + 1).trim();
      }
      return faxes.map(a => props[a] || "").join("-") + ".json";
    }
    return String(name).replace(/[^A-Za-z0-9_-]+/g, "_") + ".json";
  }

  const written = [];
  for (const v of variants) {
    const fname = deriveFilename(v.name);
    if (!fname || fname.includes("/") || fname.includes("\\") || fname === "." || fname === "..") {
      throw new Error("unsafe filename: " + fname);
    }
    fs.writeFileSync(path.join(outDir, fname), JSON.stringify(v, null, 2));
    written.push(fname);
  }

  const summary = {
    fileKey: process.env.FK,
    nodeId: nid,
    outputDir: outDir,
    totalVariants: variants.length,
    filesWritten: written,
    errors: []
  };
  fs.writeFileSync(process.env.RET_PATH, JSON.stringify(summary, null, 2));

  process.stdout.write(
    "fileKey:        " + summary.fileKey + "\n" +
    "nodeId:         " + summary.nodeId + "\n" +
    "outputDir:      " + summary.outputDir + "\n" +
    "totalVariants:  " + summary.totalVariants + "\n" +
    "filesWritten:   " + written.length + "\n"
  );
' || fail "writer failed"
