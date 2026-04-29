import type { Meta, StoryObj } from '@storybook/react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Stack,
  type CheckboxProps,
  type FormGroupProps,
} from '@mui/material';

// `<CheckboxGroup>` is the project's name for the composed pattern MUI ships as
// `<FormControl><FormLabel/><FormGroup/><FormHelperText/></FormControl>`.
// There is no separate `<CheckboxGroup>` runtime wrapper — the Storybook story
// is what designers compare the Figma cells against. The Checkbox counterpart
// to RadioGroup: same chrome (`FormLabel` / `FormHelperText` / Error tone), but
// each row is a multi-select `<Checkbox>` (so the fixture demos
// unchecked / checked / indeterminate side-by-side instead of single-select).

const MERAK_COLORS: Array<{
  merak: string;
  mui: NonNullable<CheckboxProps['color']>;
}> = [
  { merak: 'default', mui: 'default' },
  { merak: 'primary', mui: 'primary' },
  { merak: 'secondary', mui: 'secondary' },
  { merak: 'danger', mui: 'error' },
  { merak: 'warning', mui: 'warning' },
  { merak: 'info', mui: 'info' },
  { merak: 'success', mui: 'success' },
];

const SIZES: Array<NonNullable<CheckboxProps['size']>> = ['small', 'medium'];

const DIRECTIONS: Array<{
  label: string;
  row: NonNullable<FormGroupProps['row']>;
}> = [
  { label: 'column', row: false },
  { label: 'row', row: true },
];

// Three-option fixture used by every matrix cell. Option A is unchecked,
// Option B is checked, Option C is indeterminate — so designers can see the
// full tri-state surface in a single cell. (Radio's fixture only renders
// off / on / off because radio is single-select.)
const OPTIONS: ReadonlyArray<{
  value: string;
  label: string;
  checked: boolean;
  indeterminate: boolean;
}> = [
  { value: 'a', label: 'Option A', checked: false, indeterminate: false },
  { value: 'b', label: 'Option B', checked: true, indeterminate: false },
  { value: 'c', label: 'Option C', checked: false, indeterminate: true },
];

type GroupExtras = {
  color?: CheckboxProps['color'];
  size?: CheckboxProps['size'];
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  showLabel?: boolean;
  showHelper?: boolean;
};

function CheckboxGroupCell({ row, extras = {} }: { row: boolean; extras?: GroupExtras }) {
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
      <FormGroup row={row}>
        {OPTIONS.map((opt) => (
          <FormControlLabel
            key={opt.value}
            control={
              <Checkbox
                color={color}
                size={size}
                checked={opt.checked}
                indeterminate={opt.indeterminate}
              />
            }
            label={opt.label}
          />
        ))}
      </FormGroup>
      {showHelper ? <FormHelperText>{helperText ?? 'Helper text'}</FormHelperText> : null}
    </FormControl>
  );
}

const meta = {
  title: 'Components/CheckboxGroup',
  component: FormGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors the `<CheckboxGroup>` Figma spec at `.claude/skills/figma-components/CheckboxGroup/figma.spec.md`. Composes `FormControl + FormLabel + FormGroup + FormHelperText`, with each row a `<FormControlLabel control={<Checkbox/>}>`. Variant axes: Direction (column / row) × Color (7) × Size (3 — Large is Figma-only) × State (Enabled / Disabled / Error). Inner checkboxes mirror the `<Checkbox>` set; FormLabel + FormHelperText are color-agnostic except in `Error` state.',
      },
    },
  },
  argTypes: {
    row: { control: 'boolean' },
  },
  args: {},
} satisfies Meta<typeof FormGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Direction axis ─────────────────────────────────────────────────────────

export const Column: Story = {
  render: () => <CheckboxGroupCell row={false} />,
};

export const Row: Story = {
  render: () => <CheckboxGroupCell row={true} />,
};

// ─── State axis (statically renderable subset) ──────────────────────────────

export const Disabled: Story = {
  render: () => <CheckboxGroupCell row={false} extras={{ disabled: true }} />,
};

export const ErrorState: Story = {
  name: 'Error',
  render: () => (
    <CheckboxGroupCell
      row={false}
      extras={{
        error: true,
        showHelper: true,
        helperText: 'Pick at least one option',
        required: true,
      }}
    />
  ),
};

export const WithHelperText: Story = {
  render: () => <CheckboxGroupCell row={false} extras={{ showHelper: true }} />,
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 120,
  textTransform: 'none',
};

const matrixCell: React.CSSProperties = {
  width: 240,
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
          <span key={size} style={{ ...cellLabel, width: 240 }}>
            {size}
          </span>
        ))}
      </Stack>
      {DIRECTIONS.map(({ label, row }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          {SIZES.map((size) => (
            <div key={size} style={matrixCell}>
              <CheckboxGroupCell row={row} extras={{ size }} />
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
          <span key={label} style={{ ...cellLabel, width: 240 }}>
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
              <CheckboxGroupCell row={row} extras={{ color: mui }} />
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
          <span key={label} style={{ ...cellLabel, width: 240 }}>
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
            helperText: 'Pick at least one option',
            required: true,
          },
        },
      ].map(({ label, extras }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          {DIRECTIONS.map(({ label: dirLabel, row }) => (
            <div key={dirLabel} style={matrixCell}>
              <CheckboxGroupCell row={row} extras={extras} />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        Hovered / Focused / Pressed are reachable on the inner Checkbox set; the wrapper publishes
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
        <span style={{ ...cellLabel, width: 240 }}>label = on</span>
        <span style={{ ...cellLabel, width: 240 }}>label = off</span>
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
            helperText: 'Pick at least one option',
            error: true,
          },
        },
      ].map(({ label, extras }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          {[true, false].map((showLabel) => (
            <div key={String(showLabel)} style={matrixCell}>
              <CheckboxGroupCell row={false} extras={{ ...extras, showLabel }} />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
