import type { Meta, StoryObj } from '@storybook/react';
import { Box, Stack, type SxProps, type Theme } from '@mui/material';
import * as React from 'react';

// Merak `<Icon>` is a sizing wrapper around an SVG glyph — design counterpart of
// the Figma component set `<Icon>` (`3:2722`) on the **Foundation Components**
// page of the MUI Library file. Six Size variants
// (xs=16 / sm=20 / md=24 / lg=28 / xl=32 / xxl=48) drive the box; the glyph
// itself is supplied via `children` and inherits color via `currentColor`,
// matching the Figma instance-swap glyph slot.
//
// `@mui/material/Icon` uses the Material Icons font ligature and only exposes
// `fontSize: 'small' | 'medium' | 'large' | 'inherit'` — it does not match the
// six-step Merak axis 1:1, so the story defines its own `MerakIcon` wrapper.

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const SIZE_PX: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 48,
};

const SIZES: IconSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

interface MerakIconProps {
  size?: IconSize;
  color?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  'aria-label'?: string;
}

// Inline SVG glyphs sourced from Google's `material-design-icons` library
// (https://github.com/google/material-design-icons → `material-symbols`
// 24×24 outlined set). `@mui/icons-material` is intentionally not a
// dependency of this package — host apps swap to real icons at consumption.
//
// The glyph names below mirror entries in the Figma "Icon library"
// (`.claude/skills/figma-design-guide/components.md` §Icon library) so each
// inline glyph is traceable back to its published Figma component.

const HomeGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const SearchGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.471 6.471 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const AddGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
  </svg>
);

const CloseGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const CheckGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const DeleteGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" />
  </svg>
);

const EditGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z" />
  </svg>
);

const UserGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" />
  </svg>
);

const MerakIcon = ({
  size = 'md',
  color,
  sx,
  children,
  'aria-label': ariaLabel,
}: MerakIconProps) => {
  const px = SIZE_PX[size];
  return (
    <Box
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: px,
          height: px,
          color: color ?? 'inherit',
          flexShrink: 0,
          lineHeight: 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children ?? <UserGlyph />}
    </Box>
  );
};

const meta = {
  title: 'Components/Icon',
  component: MerakIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Icon>` Figma spec at `.claude/skills/figma-components/Icon/figma.spec.md` — 6 Size variants (xs=16, sm=20, md=24, lg=28, xl=32, xxl=48). The Merak `<Icon>` is a sizing wrapper; the glyph itself is supplied via `children` and sourced from Google `material-design-icons` (`material-symbols` outlined, 24×24 viewBox). Color inherits via `currentColor` so the icon picks up its parent text/button paint. `@mui/material/Icon` is **not** used because its `fontSize` prop only exposes 3 sizes and depends on the Material Icons font being loaded.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: SIZES,
    },
    color: {
      control: 'color',
      description: 'CSS color for the glyph (defaults to `currentColor`).',
    },
  },
  args: { size: 'md' },
} satisfies Meta<typeof MerakIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Size axis ──────────────────────────────────────────────────────────────

export const Xs: Story = { args: { size: 'xs' } };
export const Sm: Story = { args: { size: 'sm' } };
export const Md: Story = { args: { size: 'md' } };
export const Lg: Story = { args: { size: 'lg' } };
export const Xl: Story = { args: { size: 'xl' } };
export const Xxl: Story = { args: { size: 'xxl' } };

// ─── Glyph showcase (single size, multiple glyphs) ──────────────────────────

const GLYPHS: Array<{ name: string; render: () => React.ReactElement }> = [
  { name: 'Home', render: () => <HomeGlyph /> },
  { name: 'Search', render: () => <SearchGlyph /> },
  { name: 'Add', render: () => <AddGlyph /> },
  { name: 'Close', render: () => <CloseGlyph /> },
  { name: 'Check', render: () => <CheckGlyph /> },
  { name: 'Delete', render: () => <DeleteGlyph /> },
  { name: 'Edit', render: () => <EditGlyph /> },
  { name: 'User', render: () => <UserGlyph /> },
];

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 72,
  textTransform: 'none',
};

// Full Size × Glyph matrix — every Figma cell has a runtime equivalent so
// step-2 measurement can sample any combination.
export const SizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>glyph \ size</span>
        {SIZES.map((s) => (
          <span key={s} style={{ ...cellLabel, width: 56 }}>
            {s} ({SIZE_PX[s]})
          </span>
        ))}
      </Stack>
      {GLYPHS.map(({ name, render }) => (
        <Stack key={name} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{name}</span>
          {SIZES.map((s) => (
            <div
              key={s}
              style={{
                width: 56,
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <MerakIcon size={s} aria-label={name}>
                {render()}
              </MerakIcon>
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

// Single-glyph color check — verifies `currentColor` inheritance through
// MUI's palette so consumers can place `<Icon>` inside a tinted button or
// alert without re-coloring.
export const ColorInheritance: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack direction="row" spacing={3} alignItems="center">
      {(
        ['inherit', 'primary.main', 'error.main', 'success.main'] as const
      ).map((token) => (
        <Box key={token} sx={{ color: token, display: 'flex', gap: 1, alignItems: 'center' }}>
          <MerakIcon size="lg" aria-label={`Home (${token})`}>
            <HomeGlyph />
          </MerakIcon>
          <span style={{ fontSize: 12 }}>{token}</span>
        </Box>
      ))}
    </Stack>
  ),
};
