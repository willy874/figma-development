# figma-development

讓 Claude Code 為你生產 Figma Component 的工作流。

整個 repo 是一組互相搭配的 **Claude Code skills**,分成兩個叢集,共用一個資料源:

- **叢集 A — Figma 元件生產**:`figma-create-component` 串起 Storybook → runtime 量測 → spec → token → Figma 發佈 → subagent review 的完整 pipeline。
- **叢集 B — 資料快照**:`figma-init` + `add-project` / `update-project` 把 Figma 檔的變數值、樣式、元件、頁面索引拉進 `figma.config.json`,當作整個 repo 解析 token 真值的單一來源。

兩個叢集共用 `figma:figma-use`(寫 `use_figma` 的前置 skill),以及 `library-tokens.md` / `library-components.md` 兩份 catalog。

---

## 心智模型

```
┌─────────────────── 叢集 A:Authoring ───────────────────┐
│                                                         │
│  figma-create-component (orchestrator)                  │
│    ├─ step 1  src/stories/<Name>.stories.tsx           │
│    ├─ step 2  storybook.render.md  ← Chrome DevTools   │
│    ├─ step 3  figma.spec.md       ← component-spec-guide│
│    ├─ step 4  design tokens                             │
│    ├─ step 5  Figma 發佈            ← figma-operator-guide
│    │                                  ← figma:figma-use │
│    ├─ step 6  subagent review                           │
│    └─ step 7  resolve findings                          │
│                                                         │
│  產出收進 .claude/skills/figma-components/<Name>/      │
└─────────────────────────┬───────────────────────────────┘
                          │ reads
                          ▼
                  figma.config.json
                          ▲
                          │ writes
┌─────────────────────────┴───────────────────────────────┐
│                叢集 B:Snapshot                          │
│                                                         │
│  figma-init (main flow)                                 │
│    └─ refresh .library.variables (Figma → config)      │
│  figma-init/config-init.md                              │
│    └─ bootstrap .library.* + 觸發 add-project loop    │
│  add-project                                            │
│    └─ append .projects[] + .projects/<name>/*.json     │
│  update-project                                         │
│    └─ re-sync .projects/<name>/*.json(線上 → 本地)   │
└─────────────────────────────────────────────────────────┘
```

`figma.config.json` 是 single source of truth:叢集 A 從這裡解析 token 真值,文件不直接寫 hex / px;叢集 B 負責把它養新。

---

## Skills 一覽

| Skill | 屬於 | 職責 |
| --- | --- | --- |
| [`figma-create-component`](./.claude/skills/figma-create-component/SKILL.md) | A | 新元件 pipeline 的 orchestrator。內含 [`component-spec-guide.md`](./.claude/skills/figma-create-component/component-spec-guide.md)(spec / render / design-token 撰寫規範)、[`library-tokens.md`](./.claude/skills/figma-create-component/library-tokens.md)、[`library-components.md`](./.claude/skills/figma-create-component/library-components.md)(catalog) |
| [`figma-operator-guide`](./.claude/skills/figma-operator-guide/SKILL.md) | A | 任何 `use_figma` 寫入前的 router:phase 1 `discovery.md`,phase 2 `layout / tokens / component-rules / content`,phase 3 `states / accessibility / hygiene / handoff` |
| [`figma-init`](./.claude/skills/figma-init/SKILL.md) | B | Main flow:把 library 檔的所有變數值 snapshot 進 `.library.variables`。Bootstrap(config 不存在)時自動跑 [`config-init.md`](./.claude/skills/figma-init/config-init.md) |
| [`add-project`](./.claude/skills/add-project/SKILL.md) | B | 註冊一個下游 application 檔到 `.projects[]`,並把它的 variables / styles / components / pages 寫進 `.projects/<name>/` |
| [`update-project`](./.claude/skills/update-project/SKILL.md) | B | 以線上 Figma 為主,重新拉取既有 `.projects[]` 條目的 variables / styles / components / pages,覆寫 `.projects/<name>/`;順手把 `fileName` / `defaultPageName` 從 meta 同步回 entry。共用 `add-project` 的 dump/assemble 腳本 |

> **特殊資料夾**:`.claude/skills/figma-components/` 不是 skill(沒有 `SKILL.md`),它是 `figma-create-component` 的產出落地處 — 每個元件一個資料夾(`figma.spec.md` + `storybook.render.md` + 可選的 `design-token.md`)。

---

## 它在做什麼(叢集 A pipeline)

給 Claude Code 一個元件名稱(例如 `Chip`)和來源 library(例如 `@mui/material`),它會跑完整條 pipeline:

1. **Storybook story** — 列舉所有變體,產出 `src/stories/<Name>.stories.tsx`。
2. **Runtime measurement** — 用 Chrome DevTools MCP 量出每個 cell 的 computed style,記到 `storybook.render.md`(以 Canonical Constants block 收尾,作為 spec 的單一引用源)。
3. **`figma.spec.md`** — Figma ↔ source 的契約:variant axes、property API、layout、token bindings、sync rules。constants 直接 verbatim 從 render doc 抄進來,後續所有 section 一律以名字引用。
4. **Design tokens** — 把 spec 裡每個 paint / stroke / typography 綁到 **本檔的 local variable**(不允許 consumed-library binding);catalog 沒有的就 mint 在 `component/<name>/*` 並寫進 `design-token.md`。
5. **Figma 發佈** — 透過 `use_figma` 在指定的 page / frame 上發佈 `COMPONENT_SET`。step 5 強制載入 `figma-operator-guide` + `figma:figma-use`。
6. **Subagent review** — 獨立 agent 跑 spec ↔ render ↔ Figma ↔ operator-guide 對齊檢查,產出 pass/fail 清單。
7. **Resolve findings** — 修掉或記錄豁免項。

完整步驟、in-place edit / reference-only node 的處理細節寫在 [`figma-create-component/SKILL.md`](./.claude/skills/figma-create-component/SKILL.md)。

---

## 它在做什麼(叢集 B snapshot)

開新 repo 或要刷新變數值時:

```bash
# 第一次:會先跑 config-init.md(問你貼 library 檔 URL、至少一個 project 檔 URL)
/figma-init

# 後續再加 project 檔
/add-project

# 既有 project 檔索引過期了,重新從 Figma 拉一次
/update-project          # 互動選單;或 /update-project <name> / all / <figma-url>
                         #   貼 URL 會解析 fileKey 反查 .projects[],找不到就建議改跑 /add-project
```

產出:

- `figma.config.json`:
  - `.library.{fileKey, fileUrl, fileName, defaultPageId, defaultPageName}` — library 檔的基本識別。
  - `.library.index.{componentSetsAndPrimitives, icons, componentSpecs}` — 從 `library-components.md` 與 `figma-components/*/figma.spec.md` 解析出的 nodeId 索引。
  - `.library.variables` — 每個 local variable 的 `valuesByMode`(`figma-init` main flow 負責灌)。
  - `.projects[]` — 每個下游 application 檔的識別。
- `.projects/<name>/{index,variables,styles,components}.json` — 該 project 檔的輕量索引(`add-project` 首次灌、`update-project` 重新同步,均不含 `valuesByMode`)。

叢集 A 的所有 skill / 規格文件都假設這份 config 是新的。Spec / render / design-token 文件**不會**直接寫 hex / px,只引用 token 名;讀者透過 `figma.config.json` 解析真值。

---

## 安裝 skills 到你的專案

這個 repo 同時是個 CLI — 透過 `npx` 直接從 GitHub 安裝其中的 skills:

```bash
# 互動式選擇要裝哪些 skill,安裝到當前專案的 .claude/skills
npx github:willy874/figma-development

# 一次裝全部到使用者目錄並覆蓋
npx github:willy874/figma-development --all --user --force

# 只裝指定 skill,已存在則略過
npx github:willy874/figma-development --only figma-create-component,figma-operator-guide --skip-existing

# 列出所有可用 skill
npx github:willy874/figma-development --list

# 鎖版(tag / branch / commit)
npx github:willy874/figma-development#v1.0.0
```

完整選項:`npx github:willy874/figma-development --help`。

> 安裝對象只包含 `SKILL.md` 與其 submodule 檔案。`figma-components/` 是產出落地處,不會被安裝精靈帶到下游 — 它由 pipeline 在你的 repo 自己長出來。

---

## 倉庫結構

```
.claude/skills/                       # 對外發佈的 Claude Code skills
  figma-create-component/             # 叢集 A 核心 pipeline
    SKILL.md
    component-spec-guide.md           # spec 撰寫規範
    library-tokens.md                 # token catalog
    library-components.md             # 已發佈元件/icon catalog
  figma-operator-guide/               # 叢集 A use_figma 寫入 router
    SKILL.md
    references/                       # discovery / layout / tokens / ...
  figma-init/                         # 叢集 B main flow
    SKILL.md
    config-init.md                    # bootstrap submodule
    dump-variables.js                 # use_figma payload(chunked)
    assemble-variables.sh             # 合 chunk → figma.config.json
  add-project/                        # 叢集 B 新增 project 檔
    SKILL.md
    dump-project-index.js
    assemble-project-index.sh
  update-project/                     # 叢集 B 重新同步 project 索引
    SKILL.md                          # reuse add-project 的 dump/assemble
  figma-components/                   # ← 不是 skill,是 pipeline 產出存放區
    <ComponentName>/
      figma.spec.md
      storybook.render.md
      design-token.md (optional)
bin/cli.js                            # npx 安裝精靈
src/stories/                          # pipeline step 1 產出
src/index.ts                          # mui-ui 元件庫入口(peerDeps: MUI v7 + React 18)
figma.config.json                     # ← 兩個叢集共用的單一資料源
figma.config.example.json             # 追蹤用的 schema 樣板
```

---

## 本機開發

需要的 MCP / 工具:

- Claude Code 已設定 Figma MCP(`mcp__plugin_figma_figma__use_figma` 等)
- Chrome DevTools MCP(pipeline step 2 量 runtime computed style)

第一次跑前先做完叢集 B 的 bootstrap(`/figma-init` 或直接 `/add-project`),確保 `figma.config.json` 有 `.library.fileKey` 與 ≥1 個 `.projects[]` entry。

---

## 怎麼觸發 pipeline

在已經安裝好 skills 的專案裡,對 Claude Code 說:

> 用 `figma-create-component` 從 `@mui/material` 加一個 `Chip` 進來。

或直接:

> /figma-create-component

Claude 會問你 `library`、`component name`,以及(可選的)既有 JSX、可編輯的 Figma node、純參考的 Figma node、既有的 `figma.spec.md`。詳見 SKILL.md 的 _Inputs_ 段。
