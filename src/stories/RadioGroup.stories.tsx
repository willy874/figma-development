import type { Meta, StoryObj } from '@storybook/react';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  type RadioGroupProps,
  type RadioProps,
} from '@mui/material';

// `<RadioGroup>` is the project's name for the composed pattern MUI ships as
// `<FormControl><FormLabel/><RadioGroup/><FormHelperText/></FormControl>`.
// There is no separate `<RadioGroup>` runtime wrapper — the Storybook story
// is what designers compare the Figma cells against.
//
// MUI's `<RadioGroup>` is a thin container (just `name`, `value`, `row`); the
// surrounding chrome (label, helper text, error tone) lives on the parent
// `<FormControl>` and the sibling `<FormLabel>` / `<FormHelperText>`.

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

const DIRECTIONS: Array<{
  label: string;
  row: NonNullable<RadioGroupProps['row']>;
}> = [
  { label: 'column', row: false },
  { label: 'row', row: true },
];

// Three-option fixture used by every matrix cell. The middle option is the
// selected one, so designers can see the "off / on / off" pattern in a single
// cell.
const OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
] as const;

type GroupExtras = {
  color?: RadioProps['color'];
  size?: RadioProps['size'];
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHelper?: boolean;
};

function RadioGroupCell({ row, extras = {} }: { row: boolean; extras?: GroupExtras }) {
  const {
    color = 'primary',
    size = 'medium',
    disabled = false,
    helperText,
    error = false,
    required = false,
    showLabel = true,
    showHelper = false,
  } = extras;
  return (
    <FormControl component="fieldset" disabled={disabled} error={error} required={required}>
      {showLabel ? <FormLabel component="legend">Label</FormLabel> : null}
      <RadioGroup row={row} name="story-radio-group" defaultValue="b">
        {OPTIONS.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio color={color} size={size} />}
            label={opt.label}
          />
        ))}
      </RadioGroup>
      {showHelper ? <FormHelperText>{helperText ?? 'Helper text'}</FormHelperText> : null}
    </FormControl>
  );
}

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors the `<RadioGroup>` Figma spec at `.claude/skills/figma-components/RadioGroup/figma.spec.md`. Composes `FormControl + FormLabel + RadioGroup + FormHelperText`. Variants axes: Direction (column / row) × Color (7) × Size (3 — Large is Figma-only) × State (Enabled / Disabled / Error). Inner radios mirror the `<Radio>` set; FormLabel + FormHelperText are color-agnostic except in `Error` state.',
      },
    },
  },
  argTypes: {
    row: { control: 'boolean' },
  },
  args: {},
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Direction axis ─────────────────────────────────────────────────────────

export const Column: Story = {
  render: () => <RadioGroupCell row={false} />,
};

export const Row: Story = {
  render: () => <RadioGroupCell row={true} />,
};

// ─── State axis (statically renderable subset) ──────────────────────────────

export const Disabled: Story = {
  render: () => <RadioGroupCell row={false} extras={{ disabled: true }} />,
};

export const ErrorState: Story = {
  name: 'Error',
  render: () => (
    <RadioGroupCell
      row={false}
      extras={{
        error: true,
        showHelper: true,
        helperText: 'Pick one option',
        required: true,
      }}
    />
  ),
};

export const WithHelperText: Story = {
  render: () => <RadioGroupCell row={false} extras={{ showHelper: true }} />,
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 120,
  textTransform: 'none',
};

const matrixCell: React.CSSProperties = {
  width: 220,
  display: 'flex',
  alignItems: 'flex-start',
};

export const DirectionMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>direction \ size</span>
        {SIZES.map((size) => (
          <span key={size} style={{ ...cellLabel, width: 220 }}>
            {size}
          </span>
        ))}
      </Stack>
      {DIRECTIONS.map(({ label, row }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          {SIZES.map((size) => (
            <div key={size} style={matrixCell}>
              <RadioGroupCell row={row} extras={{ size }} />
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
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>color \ direction</span>
        {DIRECTIONS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 220 }}>
            {label}
          </span>
        ))}
      </Stack>
      {MERAK_COLORS.map(({ merak, mui }) => (
        <Stack key={merak} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>
            {merak}
            <span style={{ color: '#aaa' }}> ({mui})</span>
          </span>
          {DIRECTIONS.map(({ label, row }) => (
            <div key={label} style={matrixCell}>
              <RadioGroupCell row={row} extras={{ color: mui }} />
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
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>state \ direction</span>
        {DIRECTIONS.map(({ label }) => (
          <span key={label} style={{ ...cellLabel, width: 220 }}>
            {label}
          </span>
        ))}
      </Stack>
      {[
        { label: 'Enabled', extras: {} },
        { label: 'Disabled', extras: { disabled: true } },
        {
          label: 'Error',
          extras: {
            error: true,
            showHelper: true,
            helperText: 'Pick one option',
            required: true,
          },
        },
      ].map(({ label, extras }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          {DIRECTIONS.map(({ label: dirLabel, row }) => (
            <div key={dirLabel} style={matrixCell}>
              <RadioGroupCell row={row} extras={extras} />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        Hovered / Focused / Pressed are reachable on the inner Radio set; the wrapper publishes
        Enabled / Disabled / Error only.
      </span>
    </Stack>
  ),
};

export const HelperMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>helper \ label</span>
        <span style={{ ...cellLabel, width: 220 }}>label = on</span>
        <span style={{ ...cellLabel, width: 220 }}>label = off</span>
      </Stack>
      {[
        { label: 'no helper', extras: { showHelper: false } },
        {
          label: 'helper',
          extras: { showHelper: true, helperText: 'Helper text' },
        },
        {
          label: 'error helper',
          extras: {
            showHelper: true,
            helperText: 'Pick one option',
            error: true,
          },
        },
      ].map(({ label, extras }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          {[true, false].map((showLabel) => (
            <div key={String(showLabel)} style={matrixCell}>
              <RadioGroupCell row={false} extras={{ ...extras, showLabel }} />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
