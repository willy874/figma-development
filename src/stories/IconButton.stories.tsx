import type { Meta, StoryObj } from '@storybook/react';
import {
  IconButton,
  Stack,
  type IconButtonProps,
  type SxProps,
  type Theme,
} from '@mui/material';

// Inline 24×24 glyph — `@mui/icons-material` is intentionally not a dependency
// of this package. Swap to a real icon when consuming IconButton in the host app.
const Glyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

// MerakColorTheme → MUI palette (mirrors `<Button>` mapping).
const MERAK_COLORS = [
  { merak: 'default', mui: 'default' as const },
  { merak: 'primary', mui: 'primary' as const },
  { merak: 'danger', mui: 'error' as const },
  { merak: 'warning', mui: 'warning' as const },
  { merak: 'info', mui: 'info' as const },
  { merak: 'success', mui: 'success' as const },
];

// Merak `<IconButton>` extends MUI's IconButton with a `Variant` axis
// (Contained / Outlined / Text). MUI native IconButton has no `variant`
// prop, so the visual treatment is applied via `sx` here so every
// Figma cell has a runtime equivalent for step-2 measurement.
type Variant = 'text' | 'outlined' | 'contained';
const VARIANTS: Variant[] = ['text', 'outlined', 'contained'];

const PALETTE_KEY: Record<
  IconButtonProps['color'] & string,
  string | null
> = {
  default: null, // routes through inherit / grey
  inherit: null,
  primary: 'primary',
  secondary: 'secondary',
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'success',
};

function variantSx(
  variant: Variant,
  color: IconButtonProps['color'] = 'default',
): SxProps<Theme> {
  return (theme) => {
    const key = PALETTE_KEY[color as keyof typeof PALETTE_KEY];
    const isDefault = !key;
    const main = isDefault
      ? theme.palette.text.primary
      : (theme.palette as never)[key as string].main;
    const contrast = isDefault
      ? theme.palette.text.primary
      : (theme.palette as never)[key as string].contrastText;
    const containedBg = isDefault ? theme.palette.grey[300] : main;
    const outlinedBorder = isDefault
      ? theme.palette.text.primary // currentColor / 87% black
      : `rgba(${hexToRgb(main)}, 0.5)`;
    const overlay = isDefault
      ? 'rgba(0, 0, 0, 0.04)'
      : `rgba(${hexToRgb(main)}, 0.04)`;
    const disabledBg = 'rgba(0, 0, 0, 0.12)';
    const disabledFg = 'rgba(0, 0, 0, 0.26)';

    if (variant === 'contained') {
      return {
        backgroundColor: containedBg,
        color: contrast,
        boxShadow: theme.shadows[2],
        '&:hover': { backgroundColor: containedBg, boxShadow: theme.shadows[4] },
        '&.Mui-focusVisible': { boxShadow: theme.shadows[6] },
        '&:active': { boxShadow: theme.shadows[8] },
        '&.Mui-disabled': {
          backgroundColor: disabledBg,
          color: disabledFg,
          boxShadow: 'none',
        },
      };
    }
    if (variant === 'outlined') {
      return {
        color: isDefault ? theme.palette.text.primary : main,
        border: `1px solid ${outlinedBorder}`,
        backgroundColor: 'transparent',
        '&:hover': { backgroundColor: overlay },
        '&.Mui-disabled': {
          color: disabledFg,
          borderColor: disabledBg,
        },
      };
    }
    // text
    return {
      color: isDefault ? theme.palette.text.primary : main,
      backgroundColor: 'transparent',
      '&:hover': { backgroundColor: overlay },
      '&.Mui-disabled': { color: disabledFg },
    };
  };
}

function hexToRgb(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return '0, 0, 0';
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
}

interface MerakIconButtonProps extends Omit<IconButtonProps, 'color'> {
  variant?: Variant;
  color?: IconButtonProps['color'];
}

const MerakIconButton = ({
  variant = 'text',
  color = 'default',
  sx,
  children,
  ...rest
}: MerakIconButtonProps) => (
  <IconButton
    color={color === 'default' ? 'inherit' : color}
    sx={[variantSx(variant, color), ...(Array.isArray(sx) ? sx : [sx])]}
    {...rest}
  >
    {children ?? <Glyph />}
  </IconButton>
);

const meta = {
  title: 'Components/IconButton',
  component: MerakIconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<IconButton>` Figma spec at `.claude/skills/figma-components/IconButton/figma.spec.md` — 90 variants (6 colors × 3 variants × 5 states, Size=Medium). MUI native IconButton has no `variant` prop; Contained/Outlined/Text visuals are applied via `sx` so every Figma cell has a runtime equivalent. `Hovered` / `Pressed` are pseudo-class states (`:hover`, `:active`) and require interaction or `storybook-addon-pseudo-states` to render statically.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    color: {
      control: 'select',
      // Only the 6 colors with Figma cells. MUI's native `secondary` /
      // `inherit` have no Merak counterpart — adding them here would offer
      // a control that has no design representation.
      options: MERAK_COLORS.map((c) => c.mui),
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: 'Spec ships Medium only; Small / Large kept for prop parity.',
    },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'text', color: 'primary', size: 'medium' },
} satisfies Meta<typeof MerakIconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Variant axis ───────────────────────────────────────────────────────────

export const Contained: Story = { args: { variant: 'contained' } };
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Text: Story = { args: { variant: 'text' } };

// ─── State axis (statically renderable subset) ──────────────────────────────

export const Focused: Story = {
  args: { variant: 'contained', className: 'Mui-focusVisible' },
};
export const Disabled: Story = {
  args: { variant: 'contained', disabled: true },
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 96,
  textTransform: 'none',
};

export const ColorMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 80 }}>
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
            <div key={v} style={{ width: 80 }}>
              <MerakIconButton variant={v} color={mui} />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const StateMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { color: 'primary' },
  render: (args) => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>state \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 80 }}>
            {v}
          </span>
        ))}
      </Stack>
      {(
        [
          { label: 'Enabled', extra: {} },
          { label: 'Focused', extra: { className: 'Mui-focusVisible' } },
          { label: 'Disabled', extra: { disabled: true } },
        ] as const
      ).map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{label}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={{ width: 80 }}>
              <MerakIconButton {...args} {...extra} variant={v} />
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
