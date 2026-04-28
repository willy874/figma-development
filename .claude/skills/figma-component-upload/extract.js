// Variant extraction template. plan.sh stages this file into
// /tmp/component-upload-extract.js with NODE_ID, BATCH_SIZE, FILENAME_AXES
// pre-baked. The model swaps only the BATCH_INDEX literal between batches.
const BATCH_INDEX = 0;
const NODE_ID = "__NODE_ID__";
const BATCH_SIZE = __BATCH_SIZE__;
const FILENAME_AXES = __FILENAME_AXES__;

const setNode = await figma.getNodeByIdAsync(NODE_ID);
if (!setNode) throw new Error("Node not found: " + NODE_ID);
let p = setNode;
while (p && p.type !== "PAGE") p = p.parent;
if (p) await figma.setCurrentPageAsync(p);

const FP = ["id","name","type","visible","x","y","width","height","opacity","blendMode","fills","strokes","strokeWeight","strokeAlign","strokeTopWeight","strokeBottomWeight","strokeLeftWeight","strokeRightWeight","cornerRadius","topLeftRadius","topRightRadius","bottomLeftRadius","bottomRightRadius","effects","clipsContent","layoutMode","layoutWrap","primaryAxisAlignItems","counterAxisAlignItems","primaryAxisSizingMode","counterAxisSizingMode","layoutSizingHorizontal","layoutSizingVertical","layoutAlign","layoutGrow","paddingTop","paddingRight","paddingBottom","paddingLeft","itemSpacing","counterAxisSpacing","characters","fontSize","fontName","textAlignHorizontal","textAlignVertical","textAutoResize","lineHeight","letterSpacing","textCase","textDecoration","fontWeight","boundVariables","componentPropertyReferences","constraints"];
const IP = ["id","name","type","visible","x","y","width","height","layoutSizingHorizontal","layoutSizingVertical","componentPropertyReferences"];
const D = {visible:true,opacity:1,blendMode:"PASS_THROUGH",strokeWeight:1,strokeAlign:"INSIDE",layoutWrap:"NO_WRAP",layoutGrow:0,layoutAlign:"INHERIT",textCase:"ORIGINAL",textDecoration:"NONE",clipsContent:false};

const isEmpty = v => (Array.isArray(v) && !v.length) || (v && typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length);

function pickProps(n, keys) {
  const o = {};
  for (const k of keys) {
    try {
      const v = n[k];
      if (v === undefined || typeof v === "symbol") continue;
      if (k in D && D[k] === v) continue;
      if (isEmpty(v)) continue;
      o[k] = v;
    } catch {}
  }
  // Collapse per-corner radii when all equal cornerRadius.
  const cr = o.cornerRadius;
  if (cr !== undefined && o.topLeftRadius === cr && o.topRightRadius === cr && o.bottomLeftRadius === cr && o.bottomRightRadius === cr) {
    delete o.topLeftRadius; delete o.topRightRadius; delete o.bottomLeftRadius; delete o.bottomRightRadius;
  }
  // Collapse per-side stroke weights when all equal (or all = default 1).
  const sw = o.strokeWeight ?? 1;
  if (o.strokeTopWeight === sw && o.strokeBottomWeight === sw && o.strokeLeftWeight === sw && o.strokeRightWeight === sw) {
    delete o.strokeTopWeight; delete o.strokeBottomWeight; delete o.strokeLeftWeight; delete o.strokeRightWeight;
  }
  return o;
}

function ser(n) {
  if (n.type === "INSTANCE") {
    const o = pickProps(n, IP);
    try { if (n.mainComponent) o.mainComponentId = n.mainComponent.id; } catch {}
    return o;
  }
  const o = pickProps(n, FP);
  if ("children" in n && Array.isArray(n.children)) o.children = n.children.map(ser);
  return o;
}

function deriveFilename(name) {
  if (Array.isArray(FILENAME_AXES) && FILENAME_AXES.length) {
    const props = {};
    for (const part of String(name).split(",")) {
      const i = part.indexOf("=");
      if (i !== -1) props[part.slice(0, i).trim()] = part.slice(i + 1).trim();
    }
    return FILENAME_AXES.map(a => props[a] || "").join("-") + ".json";
  }
  return String(name).replace(/[^A-Za-z0-9_-]+/g, "_") + ".json";
}

const all = (setNode.type === "COMPONENT_SET" && Array.isArray(setNode.children))
  ? setNode.children.slice()
  : [setNode];
all.sort((a, b) => a.name.localeCompare(b.name));
const total = all.length;
const start = BATCH_INDEX * BATCH_SIZE;
const slice = all.slice(start, start + BATCH_SIZE);

const files = {};
for (const c of slice) files[deriveFilename(c.name)] = ser(c);

return { batchIndex: BATCH_INDEX, total, count: slice.length, done: start + slice.length >= total, files };
