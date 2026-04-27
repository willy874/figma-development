# figma-development

互動式 CLI，透過 `npx` 從 GitHub 直接安裝這個 repo 提供的 Claude Code Figma skills。

不需要先 `clone`、不需要 `npm install`、不需要全域安裝。一行指令打開選單，挑選想要的 skills，自動複製到 `.claude/skills/`。

---

## 安裝與執行

只要本機有 Node.js（>= 16）即可：

```bash
# 互動式安裝到當前專案 ./.claude/skills/
npx github:willy874/figma-development
```

`npx` 會自動 clone 這個 repo 到一個暫存目錄並執行 CLI；執行結束後就可以丟掉。

> 第一次執行可能需要 10–30 秒（取決於網路），後續 `npx` 會使用快取。

### 選擇版本（可選）

預設會跑 `main` 分支的最新內容。如果想鎖到特定版本，在 spec 後面加 `#` 接 git ref（tag、branch 或 commit SHA）：

| 用法                                                   | 說明                                                 |
| ------------------------------------------------------ | ---------------------------------------------------- |
| `npx github:willy874/figma-development`                | 跟著預設分支 `main`（**最常用**）                    |
| `npx github:willy874/figma-development#main`           | 明確指向 `main`，並讓 `npx` 重新拉一次（更新快取）   |
| `npx github:willy874/figma-development#v1.0.0`         | 鎖定 release tag，行為穩定可重現                     |
| `npx github:willy874/figma-development#<commit-sha>`   | 鎖定到特定 commit                                    |

---

## 互動式介面

直接執行不帶任何參數時，會進入互動式選單：

```text
Figma Development Skills 安裝精靈
來源：/.../figma-development/.claude/skills

? 選擇要安裝的 Skills (↑/↓ 移動，space 切換，a 全選/反選，enter 確認，ctrl+c 取消)
❯ ◯ figma-components       (目錄，無 SKILL.md)
  ◉ figma-operator-guide   Operator guide for driving Claude Code to produce high-quality Figma designs…
  ◯ figma-spec-guide       Authoring guide for Figma component specifications under `.claude/skills/...`

? 選擇安裝位置 (↑/↓ 移動，enter 確認)
❯ 專案範圍   (/Users/me/my-app/.claude/skills)
  使用者範圍 (/Users/me/.claude/skills)
```

### 操作鍵

| 鍵                 | 動作                       |
| ------------------ | -------------------------- |
| `↑` / `↓`、`k`/`j` | 移動游標                   |
| `space`            | 切換目前 skill 的勾選狀態  |
| `a`                | 全選 / 全部取消勾選        |
| `enter`            | 確認選擇                   |
| `ctrl+c`           | 取消並結束（exit code 130） |

---

## 安裝位置

CLI 會把選定的 skill 目錄整包複製到下列其中一個位置：

| 範圍   | 路徑                              | 用途                                                       |
| ------ | --------------------------------- | ---------------------------------------------------------- |
| 專案   | `./.claude/skills/<skill>/`       | 只在當前 repo 的 Claude Code 工作階段中可用（預設）        |
| 使用者 | `~/.claude/skills/<skill>/`       | 對該使用者所有專案皆可用                                   |

執行 CLI 時的 **目前工作目錄** 會作為「專案範圍」的根，因此請在你想安裝 skill 的專案資料夾內執行。

---

## 處理重複名稱

如果目標目錄下已經存在同名的 skill（例如 `./.claude/skills/figma-operator-guide/` 已存在），CLI 會逐一詢問：

```text
? figma-operator-guide 已存在，是否覆蓋？ (y/N)
```

- 回覆 `y`：先刪除既有目錄，再寫入完整新版本（不會 merge）。
- 回覆 `n` 或直接 `enter`：略過該 skill，其他 skill 不受影響。

不想被詢問時，可改用旗標：

- `--force` / `-f`：所有重複的一律覆蓋。
- `--skip-existing`：所有重複的一律略過。

> `--force` 與 `--skip-existing` 互斥，同時指定會直接結束並回報錯誤。

---

## 命令列參數

```text
npx github:willy874/figma-development [options]
```

| 參數               | 說明                                                          |
| ------------------ | ------------------------------------------------------------- |
| `-l`, `--list`     | 只列出可用的 skills，不進入安裝流程                            |
| `--all`            | 跳過互動選單，直接選取全部 skills                              |
| `--only <a,b,c>`   | 跳過互動選單，僅安裝逗號分隔的指定 skills（找不到名稱會報錯）  |
| `--project`        | 安裝到當前專案 `./.claude/skills`（預設）                      |
| `--user`           | 安裝到使用者目錄 `~/.claude/skills`                            |
| `-f`, `--force`    | 目標已存在時直接覆蓋（不再詢問）                               |
| `--skip-existing`  | 目標已存在時直接略過（不再詢問）                               |
| `-h`, `--help`     | 顯示說明                                                       |

### 範例

```bash
# 一次安裝全部到使用者目錄並覆蓋既有檔案
npx github:willy874/figma-development --all --user --force

# 只安裝指定 skill 到專案，已存在則略過
npx github:willy874/figma-development \
  --only figma-operator-guide,figma-spec-guide \
  --project --skip-existing

# 在 CI / 不互動環境中先列出可選 skills
npx github:willy874/figma-development --list
```

> 在非 TTY 環境（CI、pipe）執行時，必須帶上能跳過互動的旗標（例如 `--all` 或 `--only` 搭配 `--force` / `--skip-existing`），否則 CLI 會回報「需要互動式終端機」並結束。
> 此情境下若未指定 `--user` / `--project`，預設使用 `--project`。

---

## 內含的 Skills

| Skill 名稱             | 簡介                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `figma-operator-guide` | Operator guide，引導 Claude Code 產出高品質的 Figma 設計，並依任務情境載入相應子模組。 |
| `figma-spec-guide`     | 撰寫 / 維護 `.claude/skills/figma-components/<Component>.md` 規格的作者指南。          |
| `figma-components`     | 由 `figma-spec-guide` 引用的 component spec 內容（Button、Dialog、TextField 等）。    |

> `figma-components` 是 `figma-spec-guide` 的素材庫；通常兩者一起安裝最有用，但你可以只裝其中一個。

執行 `npx github:willy874/figma-development --list` 可以看到目前 repo 中所有可安裝的 skills 與最新描述。

---

## 在地開發

```bash
git clone https://github.com/willy874/figma-development.git
cd figma-development

# 直接從原始碼跑 CLI
node bin/cli.js --help
node bin/cli.js --list
node bin/cli.js              # 互動模式

# 模擬 npx 安裝行為（用 npm link）
npm link
figma-development --help
```

CLI 來源是純 Node.js，沒有任何 runtime 依賴，因此不需要 `npm install`。

---

## License

ISC
