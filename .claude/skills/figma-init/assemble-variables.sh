#!/usr/bin/env bash
# Merge variable chunks dumped via use_figma into figma.config.json under
# the `.library.variables` key. Reads /tmp/figma-init-variables/, writes the
# project root figma.config.json in place (preserving every other top-level
# field, including `.projects`).
#
# Each chunk file is the verbatim use_figma tool result for that slice — a
# COMPACT JSON string, possibly with HTML entities (`&lt;`, `&gt;`, `&amp;`,
# `&quot;`, `&#39;`) baked in by the tool plumbing. This script decodes
# those entities, restitches the chunks in offset order, and folds the
# result into figma.config.json's `.library.variables.collections[]`.
#
# Expected chunk filenames in /tmp/figma-init-variables/:
#
#   meta.json
#   vars-<offset>.json     (e.g. vars-0.json, vars-40.json)
#
# On any failure the script prints "ERROR: <reason>" to stderr and exits non-zero.

set -euo pipefail

fail() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }

command -v jq   >/dev/null 2>&1 || fail "jq is required but not found in PATH"
command -v node >/dev/null 2>&1 || fail "node is required but not found in PATH"

PROJECT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
CHUNK_DIR="/tmp/figma-init-variables"
CONFIG="$PROJECT_ROOT/figma.config.json"

[ -d "$CHUNK_DIR" ] || fail "chunk directory not found at $CHUNK_DIR"
[ -f "$CONFIG"    ] || fail "figma.config.json not found at $CONFIG — run config-init.md first"

CHUNK_DIR="$CHUNK_DIR" CONFIG="$CONFIG" node -e '
  const fs   = require("fs");
  const path = require("path");
  const CHUNK_DIR = process.env.CHUNK_DIR;
  const CONFIG    = process.env.CONFIG;

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
    return deepDecode(JSON.parse(raw));
  }
  function listVarsChunks() {
    return fs.readdirSync(CHUNK_DIR)
      .filter(f => f.startsWith("vars-") && f.endsWith(".json"))
      .map(f => ({ name: f, offset: parseInt(f.slice(5, -5), 10) }))
      .filter(o => Number.isFinite(o.offset))
      .sort((a, b) => a.offset - b.offset);
  }

  const meta = readChunk("meta.json");
  if (!meta || !Array.isArray(meta.collections)) {
    throw new Error("meta.json missing or malformed in " + CHUNK_DIR);
  }
  const expectedTotal = meta.collections.reduce((sum, c) => sum + (c.totalVariables || 0), 0);

  const chunks = listVarsChunks();
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
  if (total === null || items.length !== total) {
    throw new Error("variables incomplete: assembled " + items.length + " of " + (total ?? "?"));
  }
  if (total !== expectedTotal) {
    throw new Error("variables count mismatch: chunks=" + total + " meta=" + expectedTotal);
  }

  const byId = new Map();
  for (const v of items) byId.set(v.id, v);

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

  const cfg = JSON.parse(fs.readFileSync(CONFIG, "utf8"));
  if (!cfg.library || typeof cfg.library !== "object") {
    throw new Error("figma.config.json is missing top-level .library — run config-init.md first");
  }
  cfg.library.variables = {
    extractedAt: new Date().toISOString().slice(0, 10),
    collections,
  };
  fs.writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + "\n");

  process.stdout.write(
    "figma.config.json .library.variables: " + collections.length + " collection" +
    (collections.length === 1 ? "" : "s") + ", " + total + " variables\n"
  );
' || fail "assembler failed"
