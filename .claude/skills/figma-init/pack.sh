#!/usr/bin/env bash
# Pack a Figma variables.json snapshot into compact arrays per collection.
# Reads /tmp/params.json (fileKey, variablesPath).
# Writes one or more /tmp/figma-init-pack-<safe-name>[-partN].json per collection.
# Any pack > MAX_BYTES is auto-split into roughly equal sub-packs so each fits
# inside the use_figma 50000-character code limit.
# Prints manifest to stdout, one line per file: <name>\t<path>\t<count>.
# On failure: prints "ERROR: <reason>" to stdout and exits non-zero.

set -euo pipefail

MAX_BYTES=45000   # leave ~5KB headroom for the use_figma template wrapper
TARGET_BYTES=40000  # aim each split chunk near this for safety margin

fail() {
  printf 'ERROR: %s\n' "$1"
  exit 1
}

command -v jq >/dev/null 2>&1 || fail "jq is required but not found in PATH"

PARAMS=/tmp/params.json
[ -f "$PARAMS" ] || fail "/tmp/params.json not found"

FILE_KEY=$(jq -r '.fileKey // empty' "$PARAMS" 2>/dev/null) \
  || fail "failed to parse /tmp/params.json"
VARS_PATH=$(jq -r '.variablesPath // empty' "$PARAMS" 2>/dev/null) \
  || fail "failed to parse /tmp/params.json"

[ -n "$FILE_KEY" ]  || fail "params.fileKey missing or empty"
[ -n "$VARS_PATH" ] || fail "params.variablesPath missing or empty"
[ -f "$VARS_PATH" ] || fail "variablesPath not found: $VARS_PATH"

jq -e 'type == "object" and (.collections | type == "array")' "$VARS_PATH" >/dev/null \
  || fail "variables JSON has no collections array"

emit_manifest() {
  local coll="$1" path="$2" count
  count=$(jq 'length' "$path")
  printf '%s\t%s\t%s\n' "$coll" "$path" "$count"
}

while IFS= read -r COLL_NAME; do
  SAFE_NAME=$(printf '%s' "$COLL_NAME" | LC_ALL=C tr -c 'a-zA-Z0-9-' '_')
  OUT="/tmp/figma-init-pack-${SAFE_NAME}.json"

  jq -c --arg coll "$COLL_NAME" '
    .collections[]
    | select(.name == $coll)
    | .variables
    | map(
        [
          .name,
          ( .valuesByMode
            | with_entries(
                .value |= (
                  if   type == "object" and .type == "VARIABLE_ALIAS" then ["a", .name]
                  elif type == "object" and has("r")                  then ["c", .r, .g, .b, (.a // 1)]
                  elif type == "number"                               then ["n", .]
                  elif type == "boolean"                              then ["b", .]
                  elif type == "string"                               then ["s", .]
                  else null
                  end
                )
              )
            | with_entries(select(.value != null))
          )
        ]
      )
  ' "$VARS_PATH" > "$OUT"

  SIZE=$(wc -c < "$OUT" | tr -d ' ')

  if [ "$SIZE" -le "$MAX_BYTES" ]; then
    emit_manifest "$COLL_NAME" "$OUT"
    continue
  fi

  # Oversized — split into chunks. Estimate chunk count from ratio of bytes,
  # then emit each chunk as its own file.
  COUNT=$(jq 'length' "$OUT")
  CHUNK=$(( COUNT * TARGET_BYTES / SIZE ))
  [ "$CHUNK" -lt 1 ] && CHUNK=1

  PART_INDEX=0
  while IFS= read -r SUBPACK; do
    PART_OUT="${OUT%.json}-part${PART_INDEX}.json"
    printf '%s\n' "$SUBPACK" > "$PART_OUT"
    emit_manifest "$COLL_NAME" "$PART_OUT"
    PART_INDEX=$(( PART_INDEX + 1 ))
  done < <(jq -c "_nwise($CHUNK)" "$OUT")

  rm -f "$OUT"
done < <(jq -r '.collections[].name' "$VARS_PATH")
