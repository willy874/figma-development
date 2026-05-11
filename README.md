# figma-development

讓 Claude Code 為你生產 Figma Component 的工作流。

整個專案圍繞著一個核心 skill：[`.claude/skills/figma-create-component`](./.claude/skills/figma-create-component/SKILL.md)。其餘的 skills、Storybook 故事、`figma-components/` 規格資料夾都是這條 pipeline 的支撐零件。

---

## 它在做什麼

給 Claude Code 一個元件名稱（例如 `Chip`）和來源 library（例如 `@mui/material`），它會跑完整條 pipeline：

1. **Storybook story** — 根據 library 的 props 列舉所有變體，產出 `src/stories/<Name>.stories.tsx`。
2. **Runtime measurement** — 用 Chrome DevTools MCP 量出每個 cell 的 computed style，記到 `storybook.render.md`。
3. **`figma.spec.md`** — Figma ↔ source 的契約：variant axes、property API、layout、token bindings、sync rules。
4. **Design tokens** — 把 spec 裡每個 paint / stroke / typography 綁到 local variable；catalogue 沒有的就 mint 在 `component/<name>/*` 並寫進 `design-token.md`。
5. **Figma 元件** — 透過 `use_figma` 在指定的 page / frame 上發佈 `COMPONENT_SET`，每個變體都對齊 spec。
6. **Subagent review** — 獨立的 agent 跑 spec ↔ render ↔ Figma ↔ operator-guide 的對齊檢查，產出 pass/fail 清單。
7. **Resolve findings** — 修掉或記錄豁免項。

完整的步驟、輸入規格、in-place edit 與 reference-only node 的處理細節都寫在 [`figma-create-component/SKILL.md`](./.claude/skills/figma-create-component/SKILL.md)。

---

## 安裝 skills 到你的專案

這個 repo 同時是個 CLI — 透過 `npx` 直接從 GitHub 安裝其中的 skills：

```bash
# 互動式選擇要裝哪些 skill，安裝到當前專案的 .claude/skills
npx github:willy874/figma-development

# 一次裝全部到使用者目錄並覆蓋
npx github:willy874/figma-development --all --user --force

# 只裝指定 skill，已存在則略過
npx github:willy874/figma-development --only figma-create-component,figma-operator-guide --skip-existing

# 列出所有可用 skill
npx github:willy874/figma-development --list

# 鎖版（tag / branch / commit）
npx github:willy874/figma-development#v1.0.0
```

完整選項：`npx github:willy874/figma-development --help`。

---

## Skills 一覽

| Skill                                                                                | 角色                                                                                 |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| [`figma-create-component`](./.claude/skills/figma-create-component/SKILL.md)         | **核心 pipeline router** — 串起底下所有 skill；內附 [`component-spec-guide.md`](./.claude/skills/figma-create-component/component-spec-guide.md) submodule 規範 `figma.spec.md` / `storybook.render.md` / `design-token.md` 撰寫 |
| [`figma-design-guide`](./.claude/skills/figma-design-guide/SKILL.md)                 | 本專案 Figma 檔的 token / text style / elevation / 已發佈元件清單                    |
| [`figma-operator-guide`](./.claude/skills/figma-operator-guide/SKILL.md)             | 任何 `use_figma` 寫入動作前的 router；指向 layout / tokens / states / hygiene 子模組 |
| [`figma-init`](./.claude/skills/figma-init/SKILL.md)                                 | 用 JSON snapshot 強制覆寫某個 Figma 檔的所有變數值；也負責產出 `figma.config.json`   |

---

## 倉庫結構

```
.claude/skills/                 # 對外發佈的 Claude Code skills
  figma-create-component/       # ← 核心 pipeline
    SKILL.md
    component-spec-guide.md     # spec 撰寫規範（submodule）
  figma-components/             # 每個元件一個資料夾（spec / render / design-token）
  figma-design-guide/
  figma-operator-guide/
  figma-init/
bin/cli.js                      # npx 安裝精靈
src/stories/                    # pipeline step 1 產出的 Storybook stories
src/index.ts                    # mui-ui 元件庫進入點（peerDeps: MUI v7 + React 18）
```

---

## 本機開發

需要的 MCP / 工具：

- Claude Code 已設定 Figma MCP（`mcp__claude_ai_Figma__*`、`mcp__plugin_figma_figma__use_figma`）
- Chrome DevTools MCP（pipeline step 2 量 runtime computed style）

---

## 怎麼觸發 pipeline

在已經安裝好 skills 的專案裡，對 Claude Code 說：

> 用 `figma-create-component` 從 `@mui/material` 加一個 `Chip` 進來。

或直接：

> /figma-create-component

Claude 會問你 `library`、`component name`，以及（可選的）既有 JSX、可編輯的 Figma node、純參考的 Figma node、既有的 `figma.spec.md`。詳見 SKILL.md 的 _Inputs_ 段。
