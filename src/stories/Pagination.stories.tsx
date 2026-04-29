import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  Pagination,
  PaginationItem,
  Stack,
  type PaginationProps,
  type PaginationItemProps,
  type SxProps,
  type Theme,
} from '@mui/material';

// ─── Icon (sm) slot overrides ───────────────────────────────────────────────
//
// MUI PaginationItem defaults `slots.previous` / `slots.next` to
// `NavigateBefore` / `NavigateNext` from `@mui/icons-material`. The Figma
// spec swaps those for the published `<Icon>` instances at Size=sm (20px)
// with `ChevronLeft` / `ChevronRight` glyphs (material-symbols
// `keyboard-arrow-left` / `keyboard-arrow-right`, see `.claude/skills/
// figma-design-guide/components.md` §Icon library `512:7505` / `512:7509`).
// Inline SVGs are authored on the same 24×24 MD grid as Icon.stories.tsx so
// `currentColor` inheritance through PaginationItem's text paint is preserved.

const ChevronLeftGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
  </svg>
);

const ChevronRightGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
);

const MerakIconSm = ({ children }: { children: React.ReactNode }) => (
  <Box
    aria-hidden
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: 20,
      color: 'inherit',
      flexShrink: 0,
      lineHeight: 0,
    }}
  >
    {children}
  </Box>
);

const PreviousIcon = () => (
  <MerakIconSm>
    <ChevronLeftGlyph />
  </MerakIconSm>
);

const NextIcon = () => (
  <MerakIconSm>
    <ChevronRightGlyph />
  </MerakIconSm>
);

const PAGINATION_ITEM_SLOTS = { previous: PreviousIcon, next: NextIcon };

// ─── Color mapping ──────────────────────────────────────────────────────────
//
// MUI Pagination only natively supports `color: 'standard' | 'primary' |
// 'secondary'`. Merak Figma exposes 6 theme colors (default / primary /
// danger / warning / info / success). Non-native colors are applied at story
// time via PaginationItem `sx`, mirroring the IconButton stories pattern —
// every Figma cell has a runtime equivalent for measurement.

type MerakColor = 'default' | 'primary' | 'danger' | 'warning' | 'info' | 'success';

const PALETTE_KEY: Record<
  Exclude<MerakColor, 'default'>,
  'primary' | 'error' | 'warning' | 'info' | 'success'
> = {
  primary: 'primary',
  danger: 'error',
  warning: 'warning',
  info: 'info',
  success: 'success',
};

const MERAK_COLORS: Array<{ merak: MerakColor; mui: PaginationProps['color'] }> = [
  { merak: 'default', mui: 'standard' },
  { merak: 'primary', mui: 'primary' },
  { merak: 'danger', mui: 'primary' }, // sx-overridden
  { merak: 'warning', mui: 'primary' },
  { merak: 'info', mui: 'primary' },
  { merak: 'success', mui: 'primary' },
];

const SIZES: Array<NonNullable<PaginationProps['size']>> = ['small', 'medium', 'large'];

function hexToRgb(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return '0, 0, 0';
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
}

// `sx` for a single PaginationItem to render Merak themed colors that MUI
// doesn't expose natively (danger/warning/info/success). Default + primary
// fall through to the MUI built-ins. Treatment matches Figma node 1:5098:
//   - Hovered: bg = 4% tint, border + fg stay neutral (alias defaults)
//   - Selected: bg = 8% tint (single solid here; Figma stacks two 4% layers
//     to dodge variable-binding alpha flattening), border = 50% tint, fg = main
function paginationItemSx(color: MerakColor): SxProps<Theme> {
  return (theme) => {
    if (color === 'default' || color === 'primary') return {};
    const key = PALETTE_KEY[color];
    const main = (theme.palette as never)[key].main as string;
    const rgb = hexToRgb(main);
    return {
      '&:hover': {
        backgroundColor: `rgba(${rgb}, 0.04)`,
      },
      '&.Mui-selected': {
        backgroundColor: `rgba(${rgb}, 0.08)`,
        borderColor: `rgba(${rgb}, 0.5)`,
        color: main,
        '&:hover': {
          backgroundColor: `rgba(${rgb}, 0.12)`,
        },
      },
    };
  };
}

// MUI Pagination's `color` prop only accepts standard|primary|secondary, so
// we map every Merak color to `primary` and override the visual via sx on
// each PaginationItem. The wrapper itself just owns variant/shape/size.
interface MerakPaginationProps extends Omit<PaginationProps, 'color'> {
  color?: MerakColor;
}

const MerakPagination = ({ color = 'default', ...rest }: MerakPaginationProps) => (
  <Pagination
    variant="outlined"
    shape="rounded"
    color={color === 'default' ? 'standard' : 'primary'}
    renderItem={(item) => (
      <PaginationItem
        {...item}
        slots={PAGINATION_ITEM_SLOTS}
        sx={paginationItemSx(color)}
      />
    )}
    {...rest}
  />
);

const meta = {
  title: 'Components/Pagination',
  component: MerakPagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Pagination>` Figma spec at `.claude/skills/figma-components/Pagination/figma.spec.md`. Item set ships **288 variants** (6 colors × 4 types × 3 sizes × 4 states); wrapper set ships **36 variants** (6 colors × 3 sizes × 2 states). MUI Pagination only natively supports `standard / primary / secondary` colors — danger / warning / info / success are applied via PaginationItem `sx` so every Figma cell has a runtime equivalent. `Hovered` is a pseudo-class state (`:hover`); use the addon or interact to observe it.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: MERAK_COLORS.map((c) => c.merak),
    },
    size: { control: 'inline-radio', options: SIZES },
    count: { control: { type: 'number', min: 1, max: 99 } },
    page: { control: { type: 'number', min: 1, max: 99 } },
    disabled: { control: 'boolean' },
  },
  args: {
    color: 'default',
    size: 'medium',
    count: 10,
    page: 5,
  },
} satisfies Meta<typeof MerakPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Primary stories ────────────────────────────────────────────────────────

export const Default: Story = {
  args: { color: 'default' },
};

export const Primary: Story = {
  args: { color: 'primary' },
};

export const SmallSize: Story = {
  args: { size: 'small' },
};

export const LargeSize: Story = {
  args: { size: 'large' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// First-page / last-page edge cases (collapse one ellipsis + bookend)
export const FirstPage: Story = {
  args: { page: 1, count: 10 },
};

export const LastPage: Story = {
  args: { page: 10, count: 10 },
};

// Small total — no ellipses
export const FewPages: Story = {
  args: { page: 2, count: 5 },
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 96,
  textTransform: 'none',
};

// 6 colors × 3 sizes — covers the full wrapper-component-set surface
// (Color × Size = 18 cells per State; State=Enabled here, Disabled below).
export const ColorSizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ size</span>
        {SIZES.map((s) => (
          <span key={s} style={{ ...cellLabel, width: 380 }}>
            {s}
          </span>
        ))}
      </Stack>
      {MERAK_COLORS.map(({ merak }) => (
        <Stack key={merak} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{merak}</span>
          {SIZES.map((s) => (
            <div key={s} style={{ width: 380 }}>
              <MerakPagination color={merak} size={s} count={10} page={5} />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

// Disabled axis — wrapper State=Disabled cells.
export const DisabledMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ size</span>
        {SIZES.map((s) => (
          <span key={s} style={{ ...cellLabel, width: 380 }}>
            {s}
          </span>
        ))}
      </Stack>
      {MERAK_COLORS.map(({ merak }) => (
        <Stack key={merak} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{merak}</span>
          {SIZES.map((s) => (
            <div key={s} style={{ width: 380 }}>
              <MerakPagination
                color={merak}
                size={s}
                count={10}
                page={5}
                disabled
              />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

// ─── PaginationItem-only matrices ───────────────────────────────────────────
//
// Direct PaginationItem renders for measuring item-set cells (no wrapper).
// The wrapper instantiates these; measuring them in isolation gives clean
// per-cell box / paint / typography numbers for `storybook.render.md`.

const ITEM_TYPES: Array<{
  label: 'Page' | 'Previous' | 'Next' | 'Ellipsis';
  type: NonNullable<PaginationItemProps['type']>;
  page?: number;
}> = [
  { label: 'Page', type: 'page', page: 1 },
  { label: 'Previous', type: 'previous' },
  { label: 'Next', type: 'next' },
  { label: 'Ellipsis', type: 'end-ellipsis' },
];

const ITEM_STATES: Array<{
  label: 'Enabled' | 'Hovered' | 'Selected' | 'Disabled';
  extra: Partial<PaginationItemProps> & { className?: string };
}> = [
  { label: 'Enabled', extra: {} },
  { label: 'Hovered', extra: { className: 'Mui-focusVisible' } }, // visual stand-in (no :hover statically)
  { label: 'Selected', extra: { selected: true } },
  { label: 'Disabled', extra: { disabled: true } },
];

// 4 types × 4 states grid for one (color × size) pair. Repeat across colors
// for the full 288-cell item set; the per-cell story below covers any
// individual cell on demand.
export const ItemTypeStateMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { color: 'primary', size: 'medium' },
  render: ({ color = 'default', size = 'medium' }) => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>state \ type</span>
        {ITEM_TYPES.map((t) => (
          <span key={t.label} style={{ ...cellLabel, width: 64 }}>
            {t.label}
          </span>
        ))}
      </Stack>
      {ITEM_STATES.map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{label}</span>
          {ITEM_TYPES.map((t) => (
            <div key={t.label} style={{ width: 64 }}>
              <PaginationItem
                variant="outlined"
                shape="rounded"
                color={color === 'default' ? 'standard' : 'primary'}
                size={size}
                type={t.type}
                page={t.page ?? 1}
                {...extra}
                slots={PAGINATION_ITEM_SLOTS}
                sx={paginationItemSx(color as MerakColor)}
              />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        `Hovered` row uses `Mui-focusVisible` as a static visual stand-in —
        runtime `:hover` requires interaction or `storybook-addon-pseudo-states`.
      </span>
    </Stack>
  ),
};

// 6 colors × 3 sizes for `Type=Page, State=Selected` — the only cells that
// actually differ across the Color axis (per spec §4.2 — every other cell
// renders identically across colors).
export const ItemSelectedColorSizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ size</span>
        {SIZES.map((s) => (
          <span key={s} style={{ ...cellLabel, width: 64 }}>
            {s}
          </span>
        ))}
      </Stack>
      {MERAK_COLORS.map(({ merak }) => (
        <Stack key={merak} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{merak}</span>
          {SIZES.map((s) => (
            <div key={s} style={{ width: 64 }}>
              <PaginationItem
                variant="outlined"
                shape="rounded"
                color={merak === 'default' ? 'standard' : 'primary'}
                size={s}
                type="page"
                page={1}
                selected
                sx={paginationItemSx(merak)}
              />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
