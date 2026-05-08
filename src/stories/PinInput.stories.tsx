import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  TextField,
  type TextFieldProps,
} from '@mui/material';

// `<PinInput>` is the project's name for an N-cell single-character entry field
// (one-time codes, PIN entry, MFA). MUI ships no `<PinInput>` of its own, so
// the runtime equivalent is a composition of `<FormLabel>`, N `<TextField
// variant="outlined" size="small">` cells separated by a `-` glyph, and an
// optional `<FormHelperText>`. This file is the runtime contract Figma cells
// are measured against — the composer is intentionally local; consuming apps
// build their own keyboard / autofill behavior on top.

type PinInputProps = {
  length?: 4 | 6;
  values?: ReadonlyArray<string>;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  focusedIndex?: number;
  separator?: React.ReactNode;
  cellWidth?: number;
  cellOverrides?: ReadonlyArray<Partial<TextFieldProps>>;
};

const SEPARATOR_STYLE: React.CSSProperties = {
  fontFamily: 'Roboto, sans-serif',
  fontSize: 16,
  lineHeight: '24px',
  letterSpacing: '0.15px',
  color: 'rgba(0, 0, 0, 0.87)',
};

function PinInput({
  length = 4,
  values,
  label,
  helperText,
  error,
  disabled,
  focusedIndex,
  separator = '-',
  cellWidth = 40,
  cellOverrides,
}: PinInputProps) {
  const cells = Array.from({ length }, (_, i) => values?.[i] ?? '');
  return (
    <FormControl error={error} disabled={disabled} component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        sx={{ py: 0.5 }}
      >
        {cells.map((value, i) => (
          <React.Fragment key={i}>
            <TextField
              variant="outlined"
              size="small"
              value={value}
              error={error}
              disabled={disabled}
              focused={focusedIndex === i || undefined}
              inputProps={{
                maxLength: 1,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                'aria-label': `Pin character ${i + 1}`,
                style: { textAlign: 'center', padding: '8px 0' },
              }}
              sx={{ width: cellWidth }}
              {...cellOverrides?.[i]}
            />
            {i < length - 1 && (
              <span style={SEPARATOR_STYLE} aria-hidden>
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </Stack>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

const LENGTHS = [4, 6] as const satisfies ReadonlyArray<NonNullable<PinInputProps['length']>>;

// Statically renderable states. `Hovered` is the per-cell `:hover` pseudo-class
// — it cannot render without real interaction (or `storybook-addon-pseudo-states`).
const STATES = [
  {
    label: 'Default',
    extra: {} satisfies Partial<PinInputProps>,
  },
  {
    label: 'Filled',
    extra: { values: ['1', '2', '3', '4', '5', '6'] } satisfies Partial<PinInputProps>,
  },
  {
    label: 'Focused',
    extra: { focusedIndex: 0 } satisfies Partial<PinInputProps>,
  },
  {
    label: 'Disabled',
    extra: {
      disabled: true,
      values: ['1', '2', '3', '4', '5', '6'],
    } satisfies Partial<PinInputProps>,
  },
  {
    label: 'Error',
    extra: { error: true, helperText: 'Helper text' } satisfies Partial<PinInputProps>,
  },
] as const;

const meta = {
  title: 'Components/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors the `<PinInput>` Figma spec at `.claude/skills/figma-components/PinInput/figma.spec.md` — 2 published variants (`Character ∈ {4, 6}`) plus boolean component properties `Label` and `Helper`. State (focus / disabled / error) is delegated to the underlying `<TextField>` cells; designers express it by overriding the nested instance state, not via a PinInput-level axis. `Hovered` is a `:hover` pseudo-class on each cell and requires real interaction to render.',
      },
    },
  },
  argTypes: {
    length: { control: 'inline-radio', options: LENGTHS },
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    focusedIndex: { control: 'number' },
  },
  args: {
    length: 4,
    label: 'Label',
    helperText: undefined,
    error: false,
    disabled: false,
  },
} satisfies Meta<typeof PinInput>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Length axis ────────────────────────────────────────────────────────────

export const FourCharacters: Story = { args: { length: 4 } };
export const SixCharacters: Story = { args: { length: 6 } };

// ─── Label / Helper toggles ─────────────────────────────────────────────────

export const WithLabel: Story = { args: { label: 'Label' } };
export const WithoutLabel: Story = { args: { label: undefined } };
export const WithHelper: Story = { args: { helperText: 'Helper text' } };
export const WithoutHelper: Story = { args: { helperText: undefined } };

// ─── State axis (statically renderable subset) ──────────────────────────────

export const Filled: Story = {
  args: { values: ['1', '2', '3', '4'] },
};

export const Focused: Story = { args: { focusedIndex: 0 } };

export const Disabled: Story = {
  args: { disabled: true, values: ['1', '2', '3', '4'] },
};

// `Error` would shadow the global `Error` constructor — use `ErrorState`.
export const ErrorState: Story = {
  args: { error: true, helperText: 'Helper text' },
};

// Real-world partial-entry: three filled + disabled cells, fourth cell
// focused empty, remainder empty. Mirrors the `Use Case > Example 01` row in
// the reference Figma file.
export const PartialEntry: Story = {
  args: {
    length: 6,
    cellOverrides: [
      { value: '1', disabled: true },
      { value: '2', disabled: true },
      { value: '3', disabled: true },
      { focused: true, value: '' },
      { value: '' },
      { value: '' },
    ],
  },
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 96,
  textTransform: 'none',
};

const cell: React.CSSProperties = {
  width: 360,
};

export const CharacterMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>label \ length</span>
        {LENGTHS.map((len) => (
          <span key={len} style={{ ...cellLabel, width: 360 }}>
            {len}
          </span>
        ))}
      </Stack>
      {(
        [
          { label: 'with label', extra: { label: 'Label' } },
          { label: 'no label', extra: { label: undefined } },
        ] as const
      ).map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          {LENGTHS.map((len) => (
            <div key={len} style={cell}>
              <PinInput length={len} {...extra} />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const PropertyMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>helper \ label</span>
        <span style={{ ...cellLabel, width: 360 }}>label = true</span>
        <span style={{ ...cellLabel, width: 360 }}>label = false</span>
      </Stack>
      {(
        [
          { label: 'helper = true', helper: 'Helper text' as React.ReactNode },
          { label: 'helper = false', helper: undefined },
        ] as const
      ).map(({ label, helper }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          <div style={cell}>
            <PinInput length={4} label="Label" helperText={helper} />
          </div>
          <div style={cell}>
            <PinInput length={4} label={undefined} helperText={helper} />
          </div>
        </Stack>
      ))}
    </Stack>
  ),
};

export const StateMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>state \ length</span>
        {LENGTHS.map((len) => (
          <span key={len} style={{ ...cellLabel, width: 360 }}>
            {len}
          </span>
        ))}
      </Stack>
      {STATES.map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{label}</span>
          {LENGTHS.map((len) => (
            <div key={len} style={cell}>
              <PinInput length={len} label="Label" {...extra} />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        {'Hovered is a per-cell `:hover` pseudo-class — hover any cell to observe. Add `storybook-addon-pseudo-states` to render it statically. State is not a PinInput-level Figma axis; designers paint these states by overriding the nested `<TextField>` instance state.'}
      </span>
    </Stack>
  ),
};
