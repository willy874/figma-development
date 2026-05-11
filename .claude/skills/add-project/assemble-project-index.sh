#!/usr/bin/env bash
# Merge add-project index chunks dumped via use_figma into
# .projects/<name>/{index,variables,styles,components}.json.
#
# Usage: assemble-project-index.sh <name>
#
# Reads chunks from /tmp/add-project-index-<name>/:
#
#   meta.json
#   vars-<offset>.json
#   styles-<offset>.json
#   components-<offset>.json
#
# Each chunk file is the verbatim use_figma tool result for that slice — a
# COMPACT JSON string, possibly with HTML entities (&lt;, &gt;, &amp;,
# &quot;, &#39;) baked in by the tool plumbing. This script HTML-decodes,
# stitches chunks in offset order, validates per-category coverage, and
# writes four output files under .projects/<name>/.
#
# Pages are not chunked — meta carries them inline; they land in index.json.
#
# On any failure, prints "ERROR: <reason>" to stderr and exits non-zero.

set -euo pipefail

fail() { printf 'ERROR: %s\n' "$1" >&2; exit 1; }

[ "$#" -eq 1 ] || fail "usage: $(basename "$0") <name>"
NAME="$1"
[ -n "$NAME" ] || fail "name argument is empty"

command -v jq   >/dev/null 2>&1 || fail "jq is required but not found in PATH"
command -v node >/dev/null 2>&1 || fail "node is required but not found in PATH"

PROJECT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
CHUNK_DIR="/tmp/add-project-index-$NAME"
OUT_DIR="$PROJECT_ROOT/.projects/$NAME"

[ -d "$CHUNK_DIR" ] || fail "chunk directory not found at $CHUNK_DIR"

mkdir -p "$OUT_DIR"

CHUNK_DIR="$CHUNK_DIR" OUT_DIR="$OUT_DIR" NAME="$NAME" node -e '
  const fs   = require("fs");
  const path = require("path");
  const CHUNK_DIR = process.env.CHUNK_DIR;
  const OUT_DIR   = process.env.OUT_DIR;
  const NAME      = process.env.NAME;

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
  function listChunks(prefix) {
    return fs.readdirSync(CHUNK_DIR)
      .filter((f) => f.startsWith(prefix + "-") && f.endsWith(".json"))
      .map((f) => ({
        name: f,
        offset: parseInt(f.slice(prefix.length + 1, -5), 10),
      }))
      .filter((o) => Number.isFinite(o.offset))
      .sort((a, b) => a.offset - b.offset);
  }
  function assembleSlices(prefix, expectedTotal) {
    const chunks = listChunks(prefix);
    if (expectedTotal === 0) {
      if (chunks.length > 0) {
        throw new Error(prefix + ": meta says 0 but found " + chunks.length + " chunk(s)");
      }
      return [];
    }
    if (chunks.length === 0) {
      throw new Error(prefix + ": meta says " + expectedTotal + " but no chunks found");
    }
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
      for (const it of data.items) items.push(it);
      nextExpected = c.offset + data.items.length;
    }
    if (total !== expectedTotal) {
      throw new Error(prefix + " count mismatch: chunks=" + total + " meta=" + expectedTotal);
    }
    if (items.length !== expectedTotal) {
      throw new Error(prefix + " incomplete: assembled " + items.length + " of " + expectedTotal);
    }
    return items;
  }

  const meta = readChunk("meta.json");
  if (!meta || !meta.counts) {
    throw new Error("meta.json missing or malformed in " + CHUNK_DIR);
  }

  const vars       = assembleSlices("vars",       meta.counts.variables);
  const styles     = assembleSlices("styles",     meta.counts.styles);
  const components = assembleSlices("components", meta.counts.components);

  const extractedAt = new Date().toISOString().slice(0, 10);

  // index.json — top-level summary + pages
  const indexJson = {
    extractedAt,
    name: NAME,
    file: meta.file || null,
    counts: meta.counts,
    pages: meta.pages || [],
  };

  // variables.json — collection-grouped
  const byId = new Map();
  for (const v of vars) byId.set(v.id, v);
  const collections = (meta.collections || []).map((c) => ({
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
  const variablesJson = { extractedAt, collections };

  // styles.json — grouped by kind
  const stylesJson = {
    extractedAt,
    paint: [],
    text: [],
    effect: [],
    grid: [],
  };
  for (const s of styles) {
    if      (s.kind === "PAINT")  stylesJson.paint.push(s);
    else if (s.kind === "TEXT")   stylesJson.text.push(s);
    else if (s.kind === "EFFECT") stylesJson.effect.push(s);
    else if (s.kind === "GRID")   stylesJson.grid.push(s);
    else throw new Error("unknown style kind: " + s.kind);
  }

  // components.json — flat list
  const componentsJson = { extractedAt, items: components };

  function writeAtomic(p, data) {
    const tmp = p + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n");
    fs.renameSync(tmp, p);
  }

  writeAtomic(path.join(OUT_DIR, "index.json"),      indexJson);
  writeAtomic(path.join(OUT_DIR, "variables.json"),  variablesJson);
  writeAtomic(path.join(OUT_DIR, "styles.json"),     stylesJson);
  writeAtomic(path.join(OUT_DIR, "components.json"), componentsJson);

  const cv = collections.length;
  const vv = meta.counts.variables;
  const sv = meta.counts.styles;
  const kv = meta.counts.components;
  const pv = meta.counts.pages;
  const plural = (n, s) => n + " " + s + (n === 1 ? "" : "s");
  process.stdout.write(
    ".projects/" + NAME + ": " +
    plural(cv, "collection") + " / " +
    plural(vv, "variable") + ", " +
    plural(sv, "style") + ", " +
    plural(kv, "component") + ", " +
    plural(pv, "page") + "\n"
  );
' || fail "assembler failed"
