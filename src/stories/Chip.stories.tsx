import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Chip, Stack, type ChipProps } from '@mui/material';

// Inline 18×18 glyphs — `@mui/icons-material` is intentionally not a dependency
// of this package. Swap to real icons when consuming Chip in the host app.
const LeadingGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
    <path d="M9 1.5l2.4 4.7 5.1.7-3.7 3.6.9 5.1L9 13l-4.7 2.6.9-5.1L1.5 6.9l5.1-.7L9 1.5z" />
  </svg>
);

const DeleteGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
    <path d="M9 1.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm3.7 10.4l-1.3 1.3L9 10.8l-2.4 2.4-1.3-1.3L7.7 9.5 5.3 7.1l1.3-1.3L9 8.2l2.4-2.4 1.3 1.3-2.4 2.4 2.4 2.4z" />
  </svg>
);

// MerakColorTheme → MUI palette (matches `<Button>` Figma spec at
// `.claude/skills/figma-components/Button/figma.spec.md` §2.1). The current src
// directly re-exports MUI Chip, so stories use MUI color names; the right-hand
// label documents the Merak design-system value a host app would pass.
// MUI `secondary` is intentionally omitted to mirror Button's 6-color matrix.
const MERAK_COLORS = [
  { merak: 'default', mui: 'default' as const },
  { merak: 'primary', mui: 'primary' as const },
  { merak: 'danger', mui: 'error' as const },
  { merak: 'warning', mui: 'warning' as const },
  { merak: 'info', mui: 'info' as const },
  { merak: 'success', mui: 'success' as const },
];

const VARIANTS: Array<NonNullable<ChipProps['variant']>> = ['filled', 'outlined'];

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Chip>` Figma spec at `.claude/skills/figma-components/Chip/figma.spec.md` — 60 variants (6 Colors × 2 Variants × 5 States, Size=Medium). `Hovered` / `Pressed` are pseudo-class states; trigger them by interacting with the rendered chip. `Icon` / `Avatar` / `Delete` are component-property booleans (not variant axes).',
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
        'MUI palette key. Merak mapping: default→default, primary→primary, danger→error, warning→warning, info→info, success→success.',
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
      description: 'Spec ships Medium only; Small kept for prop parity.',
    },
    disabled: { control: 'boolean' },
    clickable: { control: 'boolean' },
    icon: { control: false },
    avatar: { control: false },
    onDelete: { control: false },
    deleteIcon: { control: false },
  },
  args: {
    label: 'Chip',
    size: 'medium',
    color: 'primary',
    variant: 'filled',
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Variant axis ───────────────────────────────────────────────────────────

export const Filled: Story = {
  args: { variant: 'filled' },
};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

// ─── Slot properties ────────────────────────────────────────────────────────
// `Icon` and `Avatar` both occupy the leading slot in MUI; `Avatar` wins when
// both are passed. The Figma component exposes them as separate booleans to
// mirror the prop surface, with the same precedence rule.

export const WithIcon: Story = {
  args: { variant: 'filled', icon: <LeadingGlyph /> },
};

export const WithAvatar: Story = {
  args: {
    variant: 'filled',
    avatar: <Avatar>A</Avatar>,
  },
};

export const WithDelete: Story = {
  args: {
    variant: 'filled',
    onDelete: () => {},
  },
};

export const WithIconAndDelete: Story = {
  args: {
    variant: 'filled',
    icon: <LeadingGlyph />,
    onDelete: () => {},
  },
};

export const WithAvatarAndDelete: Story = {
  args: {
    variant: 'filled',
    avatar: <Avatar>A</Avatar>,
    onDelete: () => {},
  },
};

// ─── State axis (statically renderable subset) ──────────────────────────────
// Hovered / Pressed are pseudo-class states (`:hover`, `:active`) and need
// real interaction or an addon like `storybook-addon-pseudo-states`.

export const Focused: Story = {
  args: { variant: 'filled', className: 'Mui-focusVisible' },
};

export const Disabled: Story = {
  args: { variant: 'filled', disabled: true },
};

export const Clickable: Story = {
  args: { variant: 'filled', clickable: true, onClick: () => {} },
};

// ─── Size axis ──────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { variant: 'filled', size: 'small' },
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
  args: { label: 'Chip' },
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
              <Chip {...args} variant={v} color={mui} label={merak} />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const StateMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { color: 'primary', label: 'Chip' },
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
              <Chip {...args} {...extra} variant={v} label={label} />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        Hovered / Pressed are pseudo-class states — hover or press a chip to
        observe them. Add `storybook-addon-pseudo-states` to render them
        statically.
      </span>
    </Stack>
  ),
};

export const SlotMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { color: 'primary', label: 'Chip' },
  render: (args) => {
    const slots = [
      { label: 'No slots', extra: {} },
      { label: 'Icon', extra: { icon: <LeadingGlyph /> } },
      { label: 'Avatar', extra: { avatar: <Avatar>A</Avatar> } },
      { label: 'Delete', extra: { onDelete: () => {} } },
      {
        label: 'Icon + Delete',
        extra: { icon: <LeadingGlyph />, onDelete: () => {} },
      },
      {
        label: 'Avatar + Delete',
        extra: { avatar: <Avatar>A</Avatar>, onDelete: () => {} },
      },
    ] as const;
    return (
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={2} alignItems="center">
          <span style={{ ...cellLabel, width: 140 }}>slot \ variant</span>
          {VARIANTS.map((v) => (
            <span key={v} style={{ ...cellLabel, width: 160 }}>
              {v}
            </span>
          ))}
        </Stack>
        {slots.map(({ label, extra }) => (
          <Stack key={label} direction="row" spacing={2} alignItems="center">
            <span style={{ ...cellLabel, width: 140 }}>{label}</span>
            {VARIANTS.map((v) => (
              <div key={v} style={{ width: 160 }}>
                <Chip {...args} {...extra} variant={v} />
              </div>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const SizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { color: 'primary', label: 'Chip' },
  render: (args) => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>size \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 120 }}>
            {v}
          </span>
        ))}
      </Stack>
      {(['medium', 'small'] as const).map((size) => (
        <Stack key={size} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{size}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={{ width: 120 }}>
              <Chip {...args} size={size} variant={v} />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
