#!/usr/bin/env bash
# Assemble token chunks dumped via use_figma into src/figma/<styles|variables>.json.
#
# Usage:
#   assemble-tokens.sh styles      # reads /tmp/figma-token-sync/styles/
#   assemble-tokens.sh variables   # reads /tmp/figma-token-sync/variables/
#
# Each chunk file is the verbatim use_figma tool result for that slice — a
# COMPACT JSON string, possibly with HTML entities (`&lt;`, `&gt;`, `&amp;`,
# `&quot;`, `&#39;`) baked in by the tool plumbing. This script decodes
# those entities, restitches the chunks in offset order, fetches the
# canonical fileName via the Figma REST API (because the use_figma sandbox
# returns figma.fileKey="headless" and figma.root.name="Document"), and
# writes the final 2-space-indented JSON.
#
# Expected chunk filenames:
#
#   styles/        counts.json
#                  text-<offset>.json     (e.g. text-0.json, text-10.json)
#                  effect-<offset>.json
#                  paint-<offset>.json
#                  grid-<offset>.json
#
#   variables/     meta.json
#                  vars-<offset>.json
#
# On any failure the script prints "ERROR: <reason>" to stderr and exits non-zero.

set -euo pipefail

fail() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }

command -v jq   >/dev/null 2>&1 || fail "jq is required but not found in PATH"
command -v curl >/dev/null 2>&1 || fail "curl is required but not found in PATH"
command -v node >/dev/null 2>&1 || fail "node is required but not found in PATH"

TOKEN="${1:-}"
case "$TOKEN" in
  styles|variables) ;;
  *) fail "usage: assemble-tokens.sh <styles|variables>" ;;
esac

PROJECT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
CHUNK_DIR="/tmp/figma-token-sync/$TOKEN"
OUT_PATH="$PROJECT_ROOT/src/figma/${TOKEN}.json"
INDEX="$PROJECT_ROOT/.claude/skills/figma-design-guide/components.md"
PARAMS="/tmp/component-sync-params.json"

[ -d "$CHUNK_DIR" ] || fail "chunk directory not found at $CHUNK_DIR"

# Resolve fileKey: explicit /tmp/component-sync-params.json wins, else parse from components.md.
FK=""
if [ -f "$PARAMS" ]; then
  FK=$(jq -r '.fileKey // empty' "$PARAMS" 2>/dev/null || true)
fi
if [ -z "$FK" ]; then
  [ -f "$INDEX" ] || fail "could not resolve fileKey (no params, lookup file missing at $INDEX)"
  FK=$(grep -oE 'figma\.com/design/[A-Za-z0-9]+' "$INDEX" | head -n1 | awk -F/ '{print $NF}')
fi
[ -n "$FK" ] || fail "could not resolve fileKey"

# Resolve FIGMA_TOKEN via env or .env.
if [ -z "${FIGMA_TOKEN:-}" ]; then
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
[ -n "${FIGMA_TOKEN:-}" ] || fail "FIGMA_TOKEN not set. See extract.sh header for setup."

# Fetch fileName from REST (depth=1 keeps the response tiny).
META=$(curl -sS -H "X-Figma-Token: ${FIGMA_TOKEN}" \
  "https://api.figma.com/v1/files/${FK}?depth=1") || fail "REST fetch failed"
FILE_NAME=$(printf '%s' "$META" | jq -r '.name // empty')
[ -n "$FILE_NAME" ] || fail "REST response missing .name (HTTP error?): $(printf '%s' "$META" | head -c 200)"

mkdir -p "$(dirname "$OUT_PATH")" || fail "failed to mkdir $(dirname "$OUT_PATH")"

TOKEN="$TOKEN" CHUNK_DIR="$CHUNK_DIR" OUT_PATH="$OUT_PATH" FK="$FK" FILE_NAME="$FILE_NAME" node -e '
  const fs   = require("fs");
  const path = require("path");
  const TOKEN     = process.env.TOKEN;
  const CHUNK_DIR = process.env.CHUNK_DIR;
  const OUT_PATH  = process.env.OUT_PATH;
  const FK        = process.env.FK;
  const FILE_NAME = process.env.FILE_NAME;

  const ENTITIES = {
    "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#39;": "'\''",
    "&apos;": "'\''", "&nbsp;": " ",
  };
  function htmlDecode(s) {
    if (typeof s !== "string") return s;
    let out = s.replace(/&(lt|gt|quot|#39|apos|nbsp);/g, (m) => ENTITIES[m] || m);
    out = out.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)));
    out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)));
    out = out.replace(/&amp;/g, "&");
    return out;
  }
  function deepDecode(node) {
    if (typeof node === "string") return htmlDecode(node);
    if (Array.isArray(node)) return node.map(deepDecode);
    if (node && typeof node === "object") {
      const out = {};
      for (const k of Object.keys(node)) out[k] = deepDecode(node[k]);
      return out;
    }
    return node;
  }
  function readChunk(name) {
    const p = path.join(CHUNK_DIR, name);
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, "utf8").trim();
    // Chunk file may contain literal `&lt;` etc. — decode after JSON.parse so JSON
    // structural characters stay intact (the entities only show up inside string values).
    const parsed = JSON.parse(raw);
    return deepDecode(parsed);
  }
  function listChunks(prefix) {
    return fs.readdirSync(CHUNK_DIR)
      .filter(f => f.startsWith(prefix + "-") && f.endsWith(".json"))
      .map(f => ({
        name: f,
        offset: parseInt(f.slice(prefix.length + 1, -5), 10)
      }))
      .filter(o => Number.isFinite(o.offset))
      .sort((a, b) => a.offset - b.offset);
  }
  function gather(prefix) {
    const chunks = listChunks(prefix);
    const items = [];
    let total = null;
    let nextExpected = 0;
    for (const c of chunks) {
      const data = readChunk(c.name);
      if (!data || !Array.isArray(data.items)) {
        throw new Error("chunk " + c.name + " malformed (missing .items)");
      }
      if (total === null) total = data.total;
      else if (total !== data.total) {
        throw new Error("chunk " + c.name + " total mismatch: " + data.total + " vs " + total);
      }
      if (c.offset !== nextExpected) {
        throw new Error("chunk " + c.name + " offset gap: expected " + nextExpected + ", got " + c.offset);
      }
      items.push(...data.items);
      nextExpected = c.offset + data.items.length;
    }
    if (total !== null && items.length !== total) {
      throw new Error(prefix + " incomplete: assembled " + items.length + " of " + total);
    }
    return { items, total: total ?? 0 };
  }

  const extractedAt = new Date().toISOString().slice(0, 10);
  let payload;
  let summary;

  if (TOKEN === "styles") {
    const counts = readChunk("counts.json");
    if (!counts) throw new Error("counts.json missing in " + CHUNK_DIR);
    const paint  = gather("paint");
    const grid   = gather("grid");
    const text   = gather("text");
    const effect = gather("effect");

    if (paint.total  !== counts.paint)  throw new Error("paint count mismatch: chunks=" + paint.total + " counts=" + counts.paint);
    if (grid.total   !== counts.grid)   throw new Error("grid count mismatch: chunks="  + grid.total  + " counts=" + counts.grid);
    if (text.total   !== counts.text)   throw new Error("text count mismatch: chunks="  + text.total  + " counts=" + counts.text);
    if (effect.total !== counts.effect) throw new Error("effect count mismatch: chunks="+ effect.total+ " counts=" + counts.effect);

    payload = {
      fileKey: FK,
      fileName: FILE_NAME,
      extractedAt,
      counts: { paint: counts.paint, text: counts.text, effect: counts.effect, grid: counts.grid },
      paintStyles: paint.items,
      gridStyles: grid.items,
      textStyles: text.items,
      effectStyles: effect.items,
    };
    summary =
      "src/figma/styles.json:    " + counts.text + " text styles, " +
      counts.effect + " effect styles, " + counts.paint + " paint, " + counts.grid + " grid";
  } else {
    const meta = readChunk("meta.json");
    if (!meta) throw new Error("meta.json missing in " + CHUNK_DIR);
    if (!Array.isArray(meta.collections)) throw new Error("meta.json missing .collections");

    const expectedTotal = meta.collections.reduce((sum, c) => sum + (c.totalVariables || 0), 0);
    const vars = gather("vars");
    if (vars.total !== expectedTotal) {
      throw new Error("variables count mismatch: chunks=" + vars.total + " meta=" + expectedTotal);
    }

    const byId = new Map();
    for (const v of vars.items) byId.set(v.id, v);

    const collections = meta.collections.map((c) => ({
      id: c.id,
      name: c.name,
      key: c.key,
      modes: c.modes,
      defaultModeId: c.defaultModeId,
      remote: c.remote,
      totalVariables: c.totalVariables,
      variables: c.variableIds.map((id) => {
        const v = byId.get(id);
        if (!v) throw new Error("variable " + id + " missing from chunks");
        return v;
      }),
    }));
    // Strip variableIds — they were only needed for assembly.
    payload = { fileKey: FK, fileName: FILE_NAME, extractedAt, collections };
    summary =
      "src/figma/variables.json: " + meta.collections.length + " collection" +
      (meta.collections.length === 1 ? "" : "s") + ", " + expectedTotal + " variables";
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2));
  process.stdout.write(summary + "\n");
' || fail "assembler failed"
