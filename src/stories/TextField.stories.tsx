import type { Meta, StoryObj } from '@storybook/react';
import {
  InputAdornment,
  Stack,
  TextField,
  type TextFieldProps,
} from '@mui/material';

// Inline 20×20 glyphs — `@mui/icons-material` is intentionally not a dependency
// of this package. Swap to real icons when consuming TextField in the host app.
const SearchGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
  </svg>
);

const EyeGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </svg>
);

const VARIANTS: Array<NonNullable<TextFieldProps['variant']>> = [
  'standard',
  'filled',
  'outlined',
];

const SIZES: Array<NonNullable<TextFieldProps['size']>> = ['small', 'medium'];

// Statically renderable states. `Hovered` is the `:hover` pseudo-class and
// requires real interaction (or `storybook-addon-pseudo-states`) to render.
const STATES = [
  { label: 'Enabled', extra: {} },
  { label: 'Focused', extra: { focused: true } },
  { label: 'Disabled', extra: { disabled: true } },
  { label: 'Error', extra: { error: true } },
] as const;

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<TextField>` Figma spec at `.claude/skills/figma-components/TextField/figma.spec.md` — 120 variants (3 Variants × 2 Sizes × 5 States × 2 Has Value × 2 Multiline). `Hovered` is a `:hover` pseudo-class state; trigger it by hovering the rendered field. The matrix stories pre-resolve `Focused` / `Disabled` / `Error` via `focused` / `disabled` / `error` props so every Figma cell has a runtime equivalent. Multiline cells fix `minRows={3}` to match the Figma cell height.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: VARIANTS,
    },
    size: {
      control: 'inline-radio',
      options: SIZES,
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    focused: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    defaultValue: 'Value',
    size: 'medium',
    variant: 'outlined',
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Variant axis ───────────────────────────────────────────────────────────

export const Standard: Story = { args: { variant: 'standard' } };
export const Filled: Story = { args: { variant: 'filled' } };
export const Outlined: Story = { args: { variant: 'outlined' } };

// ─── State axis (statically renderable subset) ──────────────────────────────

export const FocusedStandard: Story = {
  args: { variant: 'standard', focused: true },
};
export const Disabled: Story = { args: { disabled: true } };
// `Error` would shadow the global `Error` constructor — use `ErrorState`.
export const ErrorState: Story = { args: { error: true, helperText: 'Helper text' } };

// ─── Has Value axis ─────────────────────────────────────────────────────────

export const WithValue: Story = { args: { defaultValue: 'Value' } };
export const Empty: Story = {
  args: { defaultValue: undefined, placeholder: 'Placeholder' },
};

// ─── Adornments ─────────────────────────────────────────────────────────────

export const WithStartAdornment: Story = {
  args: {
    InputProps: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchGlyph />
        </InputAdornment>
      ),
    },
  },
};

export const WithEndAdornment: Story = {
  args: {
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <EyeGlyph />
        </InputAdornment>
      ),
    },
  },
};

export const WithBothAdornments: Story = {
  args: {
    InputProps: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchGlyph />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <EyeGlyph />
        </InputAdornment>
      ),
    },
  },
};

// ─── Helper text ────────────────────────────────────────────────────────────

export const WithHelperText: Story = {
  args: { helperText: 'Helper text' },
};

// ─── Multiline ──────────────────────────────────────────────────────────────

// Figma fixes `minRows={3}` so the multiline cell has a deterministic height.
// Runtime keeps `maxRows` unset so content can still grow vertically beyond
// 3 rows; the Figma cell only encodes the minimum.
const MULTILINE_MIN_ROWS = 3;

export const Multiline: Story = {
  args: {
    multiline: true,
    minRows: MULTILINE_MIN_ROWS,
    defaultValue: 'Value',
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
  width: 220,
};

export const VariantMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>has value \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 220 }}>
            {v}
          </span>
        ))}
      </Stack>
      {(
        [
          { label: 'true', defaultValue: 'Value' },
          { label: 'false', defaultValue: undefined },
        ] as const
      ).map(({ label, defaultValue }) => (
        <Stack
          key={label}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{label}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={cell}>
              <TextField
                variant={v}
                size="medium"
                label="Label"
                placeholder="Placeholder"
                defaultValue={defaultValue}
                fullWidth
              />
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
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>state \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 220 }}>
            {v}
          </span>
        ))}
      </Stack>
      {STATES.map(({ label, extra }) => (
        <Stack
          key={label}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{label}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={cell}>
              <TextField
                {...extra}
                variant={v}
                size="medium"
                label="Label"
                defaultValue="Value"
                helperText={label === 'Error' ? 'Helper text' : undefined}
                fullWidth
              />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        Hovered is a `:hover` pseudo-class state — hover a field to observe.
        Add `storybook-addon-pseudo-states` to render it statically.
      </span>
    </Stack>
  ),
};

export const SizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>size \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 220 }}>
            {v}
          </span>
        ))}
      </Stack>
      {SIZES.map((s) => (
        <Stack key={s} direction="row" spacing={2} alignItems="flex-start">
          <span style={cellLabel}>{s}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={cell}>
              <TextField
                variant={v}
                size={s}
                label="Label"
                defaultValue="Value"
                fullWidth
              />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const HasValueMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>has value \ variant × size</span>
        {VARIANTS.flatMap((v) =>
          SIZES.map((s) => (
            <span key={`${v}-${s}`} style={{ ...cellLabel, width: 220 }}>
              {v} · {s}
            </span>
          )),
        )}
      </Stack>
      {(
        [
          { label: 'true', defaultValue: 'Value' },
          { label: 'false', defaultValue: undefined },
        ] as const
      ).map(({ label, defaultValue }) => (
        <Stack
          key={label}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{label}</span>
          {VARIANTS.flatMap((v) =>
            SIZES.map((s) => (
              <div key={`${v}-${s}`} style={cell}>
                <TextField
                  variant={v}
                  size={s}
                  label="Label"
                  placeholder="Placeholder"
                  defaultValue={defaultValue}
                  fullWidth
                />
              </div>
            )),
          )}
        </Stack>
      ))}
    </Stack>
  ),
};

export const MultilineMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>state \ variant × size</span>
        {VARIANTS.flatMap((v) =>
          SIZES.map((s) => (
            <span key={`${v}-${s}`} style={{ ...cellLabel, width: 220 }}>
              {v} · {s}
            </span>
          )),
        )}
      </Stack>
      {STATES.map(({ label, extra }) => (
        <Stack
          key={label}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{label}</span>
          {VARIANTS.flatMap((v) =>
            SIZES.map((s) => (
              <div key={`${v}-${s}`} style={cell}>
                <TextField
                  {...extra}
                  variant={v}
                  size={s}
                  multiline
                  minRows={MULTILINE_MIN_ROWS}
                  label="Label"
                  defaultValue="Value"
                  helperText={label === 'Error' ? 'Helper text' : undefined}
                  fullWidth
                />
              </div>
            )),
          )}
        </Stack>
      ))}
    </Stack>
  ),
};

export const MultilineHasValueMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>has value \ variant × size</span>
        {VARIANTS.flatMap((v) =>
          SIZES.map((s) => (
            <span key={`${v}-${s}`} style={{ ...cellLabel, width: 220 }}>
              {v} · {s}
            </span>
          )),
        )}
      </Stack>
      {(
        [
          { label: 'true', defaultValue: 'Value' },
          { label: 'false', defaultValue: undefined },
        ] as const
      ).map(({ label, defaultValue }) => (
        <Stack
          key={label}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{label}</span>
          {VARIANTS.flatMap((v) =>
            SIZES.map((s) => (
              <div key={`${v}-${s}`} style={cell}>
                <TextField
                  variant={v}
                  size={s}
                  multiline
                  minRows={MULTILINE_MIN_ROWS}
                  label="Label"
                  defaultValue={defaultValue}
                  fullWidth
                />
              </div>
            )),
          )}
        </Stack>
      ))}
    </Stack>
  ),
};

export const AdornmentMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>adorn \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 220 }}>
            {v}
          </span>
        ))}
      </Stack>
      {(
        [
          { label: 'start', InputProps: { startAdornment: <InputAdornment position="start"><SearchGlyph /></InputAdornment> } },
          { label: 'end', InputProps: { endAdornment: <InputAdornment position="end"><EyeGlyph /></InputAdornment> } },
          {
            label: 'both',
            InputProps: {
              startAdornment: <InputAdornment position="start"><SearchGlyph /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><EyeGlyph /></InputAdornment>,
            },
          },
        ] as const
      ).map(({ label, InputProps }) => (
        <Stack
          key={label}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{label}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={cell}>
              <TextField
                variant={v}
                size="medium"
                label="Label"
                defaultValue="Value"
                InputProps={InputProps}
                fullWidth
              />
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
