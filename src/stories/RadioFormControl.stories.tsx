import type { Meta, StoryObj } from '@storybook/react';
import {
  FormControlLabel,
  Radio,
  Stack,
  type FormControlLabelProps,
  type RadioProps,
} from '@mui/material';

// `<RadioFormControl>` is the project's name for the composed pattern
// MUI ships as `FormControlLabel + Radio`. There is no separate
// `<RadioFormControl>` runtime component — the Storybook story is what
// designers compare the Figma cells against. Mirrors
// `src/stories/CheckboxFormControl.stories.tsx` (sibling specification).

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

const SIZES: Array<NonNullable<RadioProps['size']>> = ['small', 'medium'];

const PLACEMENTS: Array<NonNullable<FormControlLabelProps['labelPlacement']>> = [
  'end',
  'start',
  'top',
  'bottom',
];

type ValueCombo = {
  label: string;
  checked: boolean;
};

const VALUE_COMBOS: readonly ValueCombo[] = [
  { label: 'unchecked', checked: false },
  { label: 'checked', checked: true },
] as const;

const STATES = [
  { label: 'Enabled', extra: {} },
  { label: 'Disabled', extra: { disabled: true } },
] as const;

type RadioControlExtras = {
  color?: RadioProps['color'];
  size?: RadioProps['size'];
  checked?: boolean;
  className?: string;
};

const buildControl = (extras: RadioControlExtras = {}) => (
  <Radio
    color={extras.color ?? 'primary'}
    size={extras.size ?? 'medium'}
    checked={extras.checked}
    className={extras.className}
  />
);

const meta = {
  title: 'Components/RadioFormControl',
  component: FormControlLabel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors the `<RadioFormControl>` Figma spec at `.claude/skills/figma-components/RadioFormControl/figma.spec.md` — 192 published variants (4 LabelPlacements × 7 Colors × 2 Checked values × 3 Sizes at Enabled = 168, plus a 24-cell Disabled coverage limited to `Color=Default`). The Figma set wraps a `<Radio>` instance plus a sibling label; the runtime equivalent is `<FormControlLabel control={<Radio/>} label="Label" labelPlacement={...} />`.',
      },
    },
  },
  argTypes: {
    labelPlacement: {
      control: 'inline-radio',
      options: PLACEMENTS,
    },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    labelPlacement: 'end',
    label: 'Label',
    control: buildControl(),
  },
} satisfies Meta<typeof FormControlLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── LabelPlacement axis ────────────────────────────────────────────────────

export const End: Story = { args: { labelPlacement: 'end' } };
export const Start: Story = { args: { labelPlacement: 'start' } };
export const Top: Story = { args: { labelPlacement: 'top' } };
export const Bottom: Story = { args: { labelPlacement: 'bottom' } };

// ─── State axis (statically renderable subset) ──────────────────────────────

export const Disabled: Story = {
  args: {
    disabled: true,
    control: buildControl({ checked: false }),
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    control: buildControl({ checked: true }),
  },
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 120,
  textTransform: 'none',
};

const placementCell: React.CSSProperties = {
  width: 120,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

export const PlacementMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>placement \ value</span>
        {VALUE_COMBOS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 120 }}>
            {label}
          </span>
        ))}
      </Stack>
      {PLACEMENTS.map((placement) => (
        <Stack
          key={placement}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{placement}</span>
          {VALUE_COMBOS.map(({ label, checked }) => (
            <div key={label} style={placementCell}>
              <FormControlLabel
                labelPlacement={placement}
                label="Label"
                control={buildControl({ checked })}
              />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const ColorMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ value</span>
        {VALUE_COMBOS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 120 }}>
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
            <div key={label} style={placementCell}>
              <FormControlLabel
                labelPlacement="end"
                label="Label"
                control={buildControl({ color: mui, checked })}
              />
            </div>
          ))}
        </Stack>
      ))}
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
          <span key={label} style={{ ...cellLabel, width: 120 }}>
            {label}
          </span>
        ))}
      </Stack>
      {SIZES.map((size) => (
        <Stack key={size} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{size}</span>
          {VALUE_COMBOS.map(({ label, checked }) => (
            <div key={label} style={placementCell}>
              <FormControlLabel
                labelPlacement="end"
                label="Label"
                control={buildControl({ size, checked })}
              />
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

export const StateMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>state \ value</span>
        {VALUE_COMBOS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 120 }}>
            {label}
          </span>
        ))}
      </Stack>
      {STATES.map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{label}</span>
          {VALUE_COMBOS.map(({ label: valueLabel, checked }) => (
            <div key={valueLabel} style={placementCell}>
              <FormControlLabel
                {...extra}
                labelPlacement="end"
                label="Label"
                control={buildControl({ checked })}
              />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        {'Hovered / Focused / Pressed are not published in this set. Drop a bare `<Radio>` and compose the label manually if those states are needed.'}
      </span>
    </Stack>
  ),
};
