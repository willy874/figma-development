import type { Meta, StoryObj } from '@storybook/react';
import {
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  type TextFieldProps,
} from '@mui/material';

// Inline 20×20 glyph — `@mui/icons-material` is intentionally not a dependency
// of this package. Swap to a real icon when consuming Select in the host app.
const SearchGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
  </svg>
);

type Option = { label: string; value: string };

const OPTIONS: Option[] = [
  { label: 'Option', value: 'option-1' },
  { label: 'Option', value: 'option-2' },
  { label: 'Option', value: 'option-3' },
  { label: 'Option', value: 'option-4' },
  { label: 'Option', value: 'option-5' },
];

const VARIANTS: Array<NonNullable<TextFieldProps['variant']>> = [
  'standard',
  'filled',
  'outlined',
];

const SIZES: Array<NonNullable<TextFieldProps['size']>> = ['small', 'medium'];

// Statically renderable subset of the MUI runtime states. `Hovered` is the
// `:hover` pseudo-class and requires real interaction (or
// `storybook-addon-pseudo-states`) to render — the matrix omits it.
const STATES = [
  { label: 'Enabled', extra: {} },
  { label: 'Focused', extra: { focused: true } },
  { label: 'Disabled', extra: { disabled: true } },
  { label: 'Error', extra: { error: true } },
] as const;

const renderMultipleValue = (selected: unknown) => (
  <Stack direction="row" spacing={0.5} flexWrap="wrap">
    {(selected as string[]).map((v) => (
      <Chip key={v} label="Option" size="small" />
    ))}
  </Stack>
);

const meta = {
  title: 'Components/Select',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Source for the `<Select>` Figma component set (see `.claude/skills/figma-components/Select/figma.spec.md`) — 120 variants (3 Variants × 2 Sizes × 5 States × 2 Has Value × 2 Multiple). Composes the published `<AutocompleteMenu>` (`534:7976`) when `open=true`. `Hovered` is a `:hover` pseudo-class state — trigger by hovering the rendered field. The matrix stories pre-resolve `Focused` / `Disabled` / `Error` via `focused` / `disabled` / `error` so every Figma cell has a runtime equivalent. The `Multiple` axis swaps the single-line value text for a row of `<Chip>` instances rendered via `renderValue`.',
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
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    focused: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Label',
    defaultValue: OPTIONS[0].value,
    size: 'medium',
    variant: 'outlined',
    select: true,
  },
  render: (args) => (
    <TextField {...args}>
      {OPTIONS.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  ),
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
export const ErrorState: Story = {
  args: { error: true, helperText: 'Helper text' },
};

// ─── Has Value axis ─────────────────────────────────────────────────────────

export const WithValue: Story = { args: { defaultValue: OPTIONS[0].value } };
export const Empty: Story = {
  args: { defaultValue: '', label: 'Label' },
};

// ─── Multiple ───────────────────────────────────────────────────────────────

export const Multiple: Story = {
  args: {
    SelectProps: {
      multiple: true,
      renderValue: renderMultipleValue,
    },
    defaultValue: [OPTIONS[0].value, OPTIONS[1].value],
  },
};

// ─── Open (menu visible) ────────────────────────────────────────────────────

// Render with the menu pre-opened so the listbox is captured next to the
// trigger in the published story. Mirrors `Autocomplete`'s `open` pattern —
// the trigger paint stays on `Focused`, only the chevron flips and the popper
// appears below.
export const Open: Story = {
  args: {
    SelectProps: { open: true, defaultOpen: true },
  },
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

// ─── Helper text ────────────────────────────────────────────────────────────

export const WithHelperText: Story = {
  args: { helperText: 'Helper text' },
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

const renderCell = (
  variant: NonNullable<TextFieldProps['variant']>,
  size: NonNullable<TextFieldProps['size']>,
  rest: Partial<TextFieldProps> = {},
  multiple = false,
) => (
  <TextField
    select
    variant={variant}
    size={size}
    label="Label"
    fullWidth
    SelectProps={
      multiple
        ? { multiple: true, renderValue: renderMultipleValue }
        : undefined
    }
    defaultValue={
      multiple ? [OPTIONS[0].value, OPTIONS[1].value] : OPTIONS[0].value
    }
    {...rest}
  >
    {OPTIONS.map((o) => (
      <MenuItem key={o.value} value={o.value}>
        {o.label}
      </MenuItem>
    ))}
  </TextField>
);

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
          { label: 'true', defaultValue: OPTIONS[0].value },
          { label: 'false', defaultValue: '' },
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
              {renderCell(v, 'medium', { defaultValue })}
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
              {renderCell(v, 'medium', {
                ...extra,
                helperText: label === 'Error' ? 'Helper text' : undefined,
              })}
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
              {renderCell(v, s)}
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
          { label: 'true', defaultValue: OPTIONS[0].value },
          { label: 'false', defaultValue: '' },
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
                {renderCell(v, s, { defaultValue })}
              </div>
            )),
          )}
        </Stack>
      ))}
    </Stack>
  ),
};

export const MultipleMatrix: Story = {
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
                {renderCell(
                  v,
                  s,
                  {
                    ...extra,
                    helperText: label === 'Error' ? 'Helper text' : undefined,
                  },
                  true,
                )}
              </div>
            )),
          )}
        </Stack>
      ))}
    </Stack>
  ),
};

export const MultipleHasValueMatrix: Story = {
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
          { label: 'true', value: [OPTIONS[0].value, OPTIONS[1].value] },
          { label: 'false', value: [] },
        ] as const
      ).map(({ label, value }) => (
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
                  select
                  variant={v}
                  size={s}
                  label="Label"
                  fullWidth
                  SelectProps={{
                    multiple: true,
                    renderValue: renderMultipleValue,
                  }}
                  defaultValue={value}
                >
                  {OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            )),
          )}
        </Stack>
      ))}
    </Stack>
  ),
};
