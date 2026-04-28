import type { Meta, StoryObj } from '@storybook/react';
import { Button, Stack, type ButtonProps } from '@mui/material';

// Inline 20x20 glyphs — `@mui/icons-material` is intentionally not a dependency
// of this package. Swap to real icons when consuming Button.tsx in the host app.
const StartGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.7L10 14.8l-5.3 2.7 1-5.7L1.5 7.7l5.9-.9L10 1.5z" />
  </svg>
);

const EndGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M7 4l6 6-6 6V4z" />
  </svg>
);

// MerakColorTheme → MUI palette (per .claude/skills/figma-components/Button.md §2.1).
// The current src directly re-exports MUI Button, so stories use MUI color names;
// the right-hand label documents the Merak design-system value a host app would pass.
const MERAK_COLORS = [
  { merak: 'default', mui: 'inherit' as const },
  { merak: 'primary', mui: 'primary' as const },
  { merak: 'danger', mui: 'error' as const },
  { merak: 'warning', mui: 'warning' as const },
  { merak: 'info', mui: 'info' as const },
  { merak: 'success', mui: 'success' as const },
];

const VARIANTS: Array<NonNullable<ButtonProps['variant']>> = [
  'text',
  'outlined',
  'contained',
];

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Button>` Figma spec at `.claude/skills/figma-components/Button.md` — 90 variants (6 colors × 3 variants × 5 states, Size=Medium). `Hovered` / `Pressed` are pseudo-class states; trigger them by interacting with the rendered button.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: VARIANTS,
    },
    color: {
      control: 'select',
      options: MERAK_COLORS.map((c) => c.mui),
      description:
        'MUI palette key. Merak mapping: default→inherit, primary→primary, danger→error, warning→warning, info→info, success→success.',
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: 'Spec ships Medium only; Small / Large kept for prop parity.',
    },
    disabled: { control: 'boolean' },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  args: {
    children: 'Button',
    size: 'medium',
    color: 'primary',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Variant axis ───────────────────────────────────────────────────────────

export const Contained: Story = {
  args: { variant: 'contained' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Text: Story = {
  args: { variant: 'text' },
};

// ─── Icon properties ────────────────────────────────────────────────────────

export const WithStartIcon: Story = {
  args: { variant: 'contained', startIcon: <StartGlyph /> },
};

export const WithEndIcon: Story = {
  args: { variant: 'contained', endIcon: <EndGlyph /> },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'contained',
    startIcon: <StartGlyph />,
    endIcon: <EndGlyph />,
  },
};

// ─── State axis (statically renderable subset) ──────────────────────────────
// Hovered / Pressed are pseudo-class states (`:hover`, `:active`) and need
// real interaction or an addon like `storybook-addon-pseudo-states`.

export const Focused: Story = {
  args: { variant: 'contained', className: 'Mui-focusVisible' },
};

export const Disabled: Story = {
  args: { variant: 'contained', disabled: true },
};

// ─── Matrices (all combinations) ────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 96,
  textTransform: 'none',
};

export const ColorMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { children: 'Button' },
  render: (args) => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 120 }}>
            {v}
          </span>
        ))}
      </Stack>
      {MERAK_COLORS.map(({ merak, mui }) => (
        <Stack key={merak} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>
            {merak}
            <span style={{ color: '#aaa' }}> ({mui})</span>
          </span>
          {VARIANTS.map((v) => (
            <div key={v} style={{ width: 120 }}>
              <Button {...args} variant={v} color={mui}>
                {merak}
              </Button>
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const StateMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { color: 'primary', children: 'Button' },
  render: (args) => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>state \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 120 }}>
            {v}
          </span>
        ))}
      </Stack>
      {(
        [
          { label: 'Enabled', extra: {} },
          {
            label: 'Focused',
            extra: { className: 'Mui-focusVisible' },
          },
          { label: 'Disabled', extra: { disabled: true } },
        ] as const
      ).map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{label}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={{ width: 120 }}>
              <Button {...args} {...extra} variant={v}>
                {label}
              </Button>
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        Hovered / Pressed are pseudo-class states — hover or press a button to
        observe them. Add `storybook-addon-pseudo-states` to render them
        statically.
      </span>
    </Stack>
  ),
};
