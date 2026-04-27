#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(PACKAGE_ROOT, '.claude', 'skills');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
function c(name, str) {
  if (!useColor) return str;
  return `${C[name] || ''}${str}${C.reset}`;
}

function readSkillMeta(name) {
  const dir = path.join(SOURCE_DIR, name);
  const skillFile = path.join(dir, 'SKILL.md');
  const meta = { name, description: null, hasSkillFile: false };
  if (!fs.existsSync(skillFile)) return meta;
  meta.hasSkillFile = true;
  const content = fs.readFileSync(skillFile, 'utf8');
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return meta;
  const descMatch = m[1].match(/^description:\s*(.+)$/m);
  if (descMatch) meta.description = descMatch[1].trim();
  return meta;
}

function listSkills() {
  if (!fs.existsSync(SOURCE_DIR)) return [];
  return fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => readSkillMeta(d.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const sp = path.join(src, entry.name);
    const dp = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(sp, dp);
    else if (entry.isSymbolicLink()) {
      const link = fs.readlinkSync(sp);
      fs.symlinkSync(link, dp);
    } else if (entry.isFile()) {
      fs.copyFileSync(sp, dp);
    }
  }
}

function ensureTTY() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      '此指令需要互動式終端機，可改用 --all / --force / --user / --project 跳過互動。',
    );
  }
}

function setupRaw() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
}
function teardownRaw() {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
}

function onCancel() {
  teardownRaw();
  process.stdout.write('\n' + c('red', '已取消') + '\n');
  process.exit(130);
}

function multiSelect(items, title) {
  ensureTTY();
  return new Promise((resolve) => {
    const selected = items.map(() => false);
    let cursor = 0;
    let lastLines = 0;
    const out = process.stdout;

    const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

    function clearLast() {
      if (lastLines > 0) {
        readline.moveCursor(out, 0, -lastLines);
        readline.clearScreenDown(out);
      }
    }
    function render() {
      clearLast();
      const lines = [];
      lines.push(
        `${c('cyan', '?')} ${c('bold', title)} ${c(
          'dim',
          '(↑/↓ 移動，space 切換，a 全選/反選，enter 確認，ctrl+c 取消)',
        )}`,
      );
      items.forEach((it, i) => {
        const arrow = i === cursor ? c('cyan', '❯') : ' ';
        const mark = selected[i] ? c('green', '◉') : c('gray', '◯');
        const name = i === cursor ? c('cyan', it.name) : it.name;
        const descRaw = it.description || (it.hasSkillFile ? '' : '(目錄，無 SKILL.md)');
        const desc = descRaw ? c('dim', '  ' + truncate(descRaw, 80)) : '';
        lines.push(`${arrow} ${mark} ${name}${desc}`);
      });
      out.write(lines.join('\n') + '\n');
      lastLines = lines.length;
    }

    setupRaw();
    render();

    const onKey = (str, key) => {
      if (!key) return;
      if (key.ctrl && key.name === 'c') return onCancel();
      if (key.name === 'up' || key.name === 'k') {
        cursor = (cursor - 1 + items.length) % items.length;
        return render();
      }
      if (key.name === 'down' || key.name === 'j') {
        cursor = (cursor + 1) % items.length;
        return render();
      }
      if (key.name === 'space') {
        selected[cursor] = !selected[cursor];
        return render();
      }
      if (key.name === 'a' && !key.ctrl && !key.meta) {
        const all = selected.every(Boolean);
        for (let i = 0; i < selected.length; i++) selected[i] = !all;
        return render();
      }
      if (key.name === 'return') {
        process.stdin.removeListener('keypress', onKey);
        teardownRaw();
        return resolve(items.filter((_, i) => selected[i]));
      }
    };
    process.stdin.on('keypress', onKey);
  });
}

function selectOne(items, title, defaultIndex = 0) {
  ensureTTY();
  return new Promise((resolve) => {
    let cursor = defaultIndex;
    let lastLines = 0;
    const out = process.stdout;

    function clearLast() {
      if (lastLines > 0) {
        readline.moveCursor(out, 0, -lastLines);
        readline.clearScreenDown(out);
      }
    }
    function render() {
      clearLast();
      const lines = [];
      lines.push(
        `${c('cyan', '?')} ${c('bold', title)} ${c(
          'dim',
          '(↑/↓ 移動，enter 確認)',
        )}`,
      );
      items.forEach((it, i) => {
        const arrow = i === cursor ? c('cyan', '❯') : ' ';
        const label = i === cursor ? c('cyan', it.label) : it.label;
        lines.push(`${arrow} ${label}`);
      });
      out.write(lines.join('\n') + '\n');
      lastLines = lines.length;
    }

    setupRaw();
    render();

    const onKey = (str, key) => {
      if (!key) return;
      if (key.ctrl && key.name === 'c') return onCancel();
      if (key.name === 'up') {
        cursor = (cursor - 1 + items.length) % items.length;
        return render();
      }
      if (key.name === 'down') {
        cursor = (cursor + 1) % items.length;
        return render();
      }
      if (key.name === 'return') {
        process.stdin.removeListener('keypress', onKey);
        teardownRaw();
        return resolve(items[cursor].value);
      }
    };
    process.stdin.on('keypress', onKey);
  });
}

function confirm(message, defaultYes = false) {
  ensureTTY();
  return new Promise((resolve) => {
    const out = process.stdout;
    const hint = defaultYes ? '(Y/n)' : '(y/N)';
    out.write(`${c('cyan', '?')} ${message} ${c('dim', hint)} `);

    setupRaw();
    const onKey = (str, key) => {
      if (!key) return;
      if (key.ctrl && key.name === 'c') return onCancel();
      let answer = null;
      if (str === 'y' || str === 'Y') answer = true;
      else if (str === 'n' || str === 'N') answer = false;
      else if (key.name === 'return') answer = defaultYes;
      if (answer === null) return;
      process.stdin.removeListener('keypress', onKey);
      teardownRaw();
      out.write((answer ? 'yes' : 'no') + '\n');
      resolve(answer);
    };
    process.stdin.on('keypress', onKey);
  });
}

function parseArgs(argv) {
  const opts = {
    all: false,
    force: false,
    skip: false,
    scope: null,
    list: false,
    help: false,
    only: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') opts.all = true;
    else if (a === '--force' || a === '-f') opts.force = true;
    else if (a === '--skip-existing') opts.skip = true;
    else if (a === '--user') opts.scope = 'user';
    else if (a === '--project') opts.scope = 'project';
    else if (a === '--list' || a === '-l') opts.list = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--only') {
      const next = argv[++i];
      if (next) opts.only = next.split(',').map((s) => s.trim()).filter(Boolean);
    } else if (a.startsWith('--only=')) {
      opts.only = a.slice('--only='.length).split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      console.error(c('red', `未知參數：${a}`));
      process.exit(2);
    }
  }
  if (opts.force && opts.skip) {
    console.error(c('red', '--force 與 --skip-existing 不可同時使用。'));
    process.exit(2);
  }
  return opts;
}

function printHelp() {
  const out = `
${c('bold', 'figma-development')} — 安裝 Figma 相關的 Claude Code skills

${c('bold', '使用方式')}
  npx github:willy874/figma-development [options]

${c('bold', '選項')}
  -l, --list             列出所有可用的 skills
      --all              安裝全部 skills（跳過互動選單）
      --only <a,b,c>     僅安裝指定名稱的 skills
      --user             安裝到使用者目錄  (~/.claude/skills)
      --project          安裝到當前專案    (./.claude/skills) [預設]
  -f, --force            目標已存在時直接覆蓋（不再詢問）
      --skip-existing    目標已存在時直接略過（不再詢問）
  -h, --help             顯示本說明

${c('bold', '範例')}
  ${c('dim', '# 互動式安裝到當前專案')}
  npx github:willy874/figma-development

  ${c('dim', '# 一次安裝全部到使用者目錄並覆蓋既有檔案')}
  npx github:willy874/figma-development --all --user --force

  ${c('dim', '# 只安裝指定 skill 到專案，已存在則略過')}
  npx github:willy874/figma-development --only figma-operator-guide,figma-spec-guide --skip-existing
`;
  process.stdout.write(out + '\n');
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  const allSkills = listSkills();
  if (allSkills.length === 0) {
    console.error(c('red', `找不到任何 skill：${SOURCE_DIR}`));
    process.exit(1);
  }

  if (opts.list) {
    for (const s of allSkills) {
      const desc = s.description ? c('dim', ' — ' + s.description) : '';
      process.stdout.write(`${c('bold', s.name)}${desc}\n`);
    }
    return;
  }

  process.stdout.write(c('bold', 'Figma Development Skills 安裝精靈') + '\n');
  process.stdout.write(c('dim', `來源：${SOURCE_DIR}`) + '\n\n');

  let chosen;
  if (opts.only.length > 0) {
    const map = new Map(allSkills.map((s) => [s.name, s]));
    const missing = opts.only.filter((n) => !map.has(n));
    if (missing.length > 0) {
      console.error(c('red', `找不到指定的 skill：${missing.join(', ')}`));
      console.error(c('dim', `可用：${allSkills.map((s) => s.name).join(', ')}`));
      process.exit(1);
    }
    chosen = opts.only.map((n) => map.get(n));
  } else if (opts.all) {
    chosen = allSkills;
  } else {
    chosen = await multiSelect(allSkills, '選擇要安裝的 Skills');
  }

  if (chosen.length === 0) {
    process.stdout.write(c('yellow', '未選擇任何 skill，結束。') + '\n');
    return;
  }

  let scope = opts.scope;
  if (!scope) {
    scope = await selectOne(
      [
        {
          label: `專案範圍   ${c('dim', '(' + path.join(process.cwd(), '.claude/skills') + ')')}`,
          value: 'project',
        },
        {
          label: `使用者範圍 ${c('dim', '(' + path.join(os.homedir(), '.claude/skills') + ')')}`,
          value: 'user',
        },
      ],
      '選擇安裝位置',
    );
  }
  const targetBase =
    scope === 'user'
      ? path.join(os.homedir(), '.claude', 'skills')
      : path.join(process.cwd(), '.claude', 'skills');

  fs.mkdirSync(targetBase, { recursive: true });

  process.stdout.write('\n' + c('bold', `安裝目標：${targetBase}`) + '\n\n');

  let installed = 0;
  let overwritten = 0;
  let skipped = 0;

  for (const skill of chosen) {
    const src = path.join(SOURCE_DIR, skill.name);
    const dst = path.join(targetBase, skill.name);

    if (fs.existsSync(dst)) {
      let overwrite;
      if (opts.force) overwrite = true;
      else if (opts.skip) overwrite = false;
      else overwrite = await confirm(`  ${c('yellow', skill.name)} 已存在，是否覆蓋？`, false);

      if (!overwrite) {
        process.stdout.write(`  ${c('gray', '-')} ${skill.name} ${c('dim', '(略過)')}\n`);
        skipped++;
        continue;
      }
      fs.rmSync(dst, { recursive: true, force: true });
      copyDir(src, dst);
      process.stdout.write(`  ${c('yellow', '↻')} ${skill.name} ${c('dim', '(已覆蓋)')}\n`);
      overwritten++;
    } else {
      copyDir(src, dst);
      process.stdout.write(`  ${c('green', '✔')} ${skill.name}\n`);
      installed++;
    }
  }

  process.stdout.write('\n' + c('bold', '完成') + '\n');
  process.stdout.write(
    `  ${c('green', '新安裝：' + installed)}   ${c('yellow', '覆蓋：' + overwritten)}   ${c(
      'gray',
      '略過：' + skipped,
    )}\n`,
  );
}

main().catch((err) => {
  teardownRaw();
  const msg = err && err.message ? err.message : String(err);
  process.stderr.write(c('red', msg) + '\n');
  process.exit(1);
});
