import type { Meta, StoryObj } from '@storybook/react';
import { Radio, Stack, type RadioProps } from '@mui/material';

// MUI Radio `color` accepts the full palette set: default / primary /
// secondary / error / info / success / warning. The Figma `Color` axis
// publishes the same seven values; the right-hand label documents the Merak
// design-system value a host app would pass.
const MERAK_COLORS: Array<{
  merak: string;
  mui: NonNullable<RadioProps['color']>;
}> = [
  { merak: 'default', mui: 'default' },
  { merak: 'primary', mui: 'primary' },
  { merak: 'secondary', mui: 'secondary' },
  { merak: 'danger', mui: 'error' },
  { merak: 'warning', mui: 'warning' },
  { merak: 'info', mui: 'info' },
  { merak: 'success', mui: 'success' },
];

// MUI Radio ships only `small` and `medium`. The Figma `Size=Large` cell is
// a synthetic over-extension — passing `size="large"` falls back to `medium`
// at runtime, so the matrix story renders only the two natively-supported
// sizes and the spec §2 / §7 calls out the Large drift.
const SIZES: Array<NonNullable<RadioProps['size']>> = ['small', 'medium'];

// Two-state value surface. Unlike Checkbox there is no `indeterminate` —
// Radio is single-select.
type ValueCombo = {
  label: string;
  checked: boolean;
};

const VALUE_COMBOS: readonly ValueCombo[] = [
  { label: 'unchecked', checked: false },
  { label: 'checked', checked: true },
] as const;

// Statically renderable states. `Hovered` / `Pressed` are pseudo-class states
// (`:hover`, `:active`) and need real interaction or
// `storybook-addon-pseudo-states`. `Focused` is reachable via the
// `Mui-focusVisible` class override that MUI ships for snapshot testing.
const STATES = [
  { label: 'Enabled', extra: {} },
  { label: 'Focused', extra: { className: 'Mui-focusVisible' } },
  { label: 'Disabled', extra: { disabled: true } },
] as const;

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors the `<Radio>` Figma spec at `.claude/skills/figma-components/Radio/figma.spec.md` — 174 published variants (7 Colors × 2 Checked values × 3 Sizes × 4 interaction States, plus a 6-cell Disabled coverage limited to `Color=Default`). `Hovered` / `Pressed` are `:hover` / `:active` pseudo-class states; trigger them by interacting with the rendered field. `Size=Large` is synthetic in Figma — MUI falls back to Medium at runtime, see spec §7.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: MERAK_COLORS.map((c) => c.mui),
      description:
        'MUI palette key. Merak mapping: default→default, primary→primary, secondary→secondary, danger→error, warning→warning, info→info, success→success.',
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'MUI ships small / medium; the Figma Large cell is synthetic.',
    },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    color: 'primary',
    size: 'medium',
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Two-state axis ─────────────────────────────────────────────────────────

export const Unchecked: Story = {
  args: { defaultChecked: false },
};

export const Checked_: Story = {
  // `Checked` would shadow MUI's `Checked` constant in some Storybook docs
  // tables; the trailing underscore keeps the autodocs label readable.
  name: 'Checked',
  args: { defaultChecked: true },
};

// ─── State axis (statically renderable subset) ──────────────────────────────

export const FocusedChecked: Story = {
  args: { defaultChecked: true, className: 'Mui-focusVisible' },
};

export const DisabledUnchecked: Story = {
  args: { defaultChecked: false, disabled: true },
};

export const DisabledChecked: Story = {
  args: { defaultChecked: true, disabled: true },
};

// ─── Matrices (all combinations) ────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 120,
  textTransform: 'none',
};

const valueCell: React.CSSProperties = { width: 64 };

export const ColorMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ value</span>
        {VALUE_COMBOS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 96 }}>
            {label}
          </span>
        ))}
      </Stack>
      {MERAK_COLORS.map(({ merak, mui }) => (
        <Stack key={merak} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>
            {merak}
            <span style={{ color: '#aaa' }}> ({mui})</span>
          </span>
          {VALUE_COMBOS.map(({ label, checked }) => (
            <div key={label} style={valueCell}>
              <Radio color={mui} size="medium" checked={checked} />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const StateMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>state \ value</span>
        {VALUE_COMBOS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 96 }}>
            {label}
          </span>
        ))}
      </Stack>
      {STATES.map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{label}</span>
          {VALUE_COMBOS.map(({ label: valueLabel, checked }) => (
            <div key={valueLabel} style={valueCell}>
              <Radio
                {...extra}
                color="primary"
                size="medium"
                checked={checked}
              />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        Hovered / Pressed are pseudo-class states — hover or press a radio to
        observe them. Add `storybook-addon-pseudo-states` to render them
        statically.
      </span>
    </Stack>
  ),
};

export const SizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>size \ value</span>
        {VALUE_COMBOS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 96 }}>
            {label}
          </span>
        ))}
      </Stack>
      {SIZES.map((size) => (
        <Stack key={size} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{size}</span>
          {VALUE_COMBOS.map(({ label, checked }) => (
            <div key={label} style={valueCell}>
              <Radio color="primary" size={size} checked={checked} />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        MUI ships `small` and `medium` only. The Figma `Size=Large` cell falls
        back to `medium` at runtime — see spec §7 drift note.
      </span>
    </Stack>
  ),
};

export const DisabledMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ value (disabled)</span>
        {VALUE_COMBOS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 96 }}>
            {label}
          </span>
        ))}
      </Stack>
      {MERAK_COLORS.map(({ merak, mui }) => (
        <Stack key={merak} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>
            {merak}
            <span style={{ color: '#aaa' }}> ({mui})</span>
          </span>
          {VALUE_COMBOS.map(({ label, checked }) => (
            <div key={label} style={valueCell}>
              <Radio color={mui} size="medium" checked={checked} disabled />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        MUI applies `palette.action.disabled` regardless of `color`, so every
        row resolves identically. The Figma set publishes Disabled only under
        `Color=Default` for hygiene — see spec §3.
      </span>
    </Stack>
  ),
};
