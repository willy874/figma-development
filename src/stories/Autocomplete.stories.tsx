import type { Meta, StoryObj } from '@storybook/react';
import {
  Autocomplete,
  Stack,
  TextField,
  type AutocompleteProps,
  type TextFieldProps,
} from '@mui/material';

// MUI `Autocomplete` is a wrapper that renders a TextField via `renderInput`.
// Stories below adapt MUI's prop surface so the matrices line up with the
// `<TextField>` Figma spec (`.claude/skills/figma-components/TextField/figma.spec.md`)
// — same Variant / Size axes, plus Autocomplete-specific Multiple / Open axes.

type Option = { label: string; year: number };

const TOP_OPTIONS: Option[] = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: 'Schindler\'s List', year: 1993 },
];

const VARIANTS: Array<NonNullable<TextFieldProps['variant']>> = [
  'standard',
  'filled',
  'outlined',
];

const SIZES: Array<NonNullable<TextFieldProps['size']>> = ['small', 'medium'];

// Statically renderable subset of the MUI runtime states. Hovered is
// `:hover` and needs real interaction; we omit it (TextField spec already
// covers the hover paint, Autocomplete inherits).
const STATES = [
  { label: 'Enabled', extra: {} },
  {
    label: 'Focused',
    extra: { open: true } as const,
  },
  { label: 'Disabled', extra: { disabled: true } as const },
  {
    label: 'Error',
    extra: {} as const,
    inputExtra: { error: true, helperText: 'Helper text' } as const,
  },
] as const;

// Render-input helper. The Figma `<TextField>` instance carries the variant /
// size / state — Autocomplete forwards `params` (ref, input props, label
// container) and we layer on label / placeholder / per-state visual props.
const renderInput = (
  variant: NonNullable<TextFieldProps['variant']>,
  size: NonNullable<TextFieldProps['size']>,
  inputExtra: Partial<TextFieldProps> = {},
) =>
  ((params: object) => (
    <TextField
      {...(params as TextFieldProps)}
      variant={variant}
      size={size}
      label="Movie"
      placeholder="Pick one"
      {...inputExtra}
    />
  )) satisfies AutocompleteProps<Option, false, false, false>['renderInput'];

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Autocomplete>` Figma spec at `.claude/skills/figma-components/Autocomplete/figma.spec.md` — 12 variants published today (3 Variants × 4 States, Size=Medium, Multiple=False), 48-variant target documented in §3 of the spec. Input row reuses the `<TextField>` Figma component (`1:6266`); the popper / listbox is the companion `<AutocompleteOption>` set (`439:7109`). `Hovered` is a `:hover` pseudo-class state — trigger by hovering. The StateMatrix renders the `Focused` row with `open: true` so the listbox is visible inline (the two states are orthogonal — see spec §3 — but coupling them keeps the matrix legible without a separate "open" axis).',
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    freeSolo: { control: 'boolean' },
    loading: { control: 'boolean' },
    open: { control: 'boolean' },
    disablePortal: { control: 'boolean' },
    disableClearable: { control: 'boolean' },
  },
  args: {
    options: TOP_OPTIONS,
    getOptionLabel: (o: Option | string) =>
      typeof o === 'string' ? o : o.label,
    isOptionEqualToValue: (o: Option, v: Option) => o.label === v.label,
    sx: { width: 280 },
  },
} satisfies Meta<typeof Autocomplete<Option, boolean, boolean, boolean>>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Variant axis ───────────────────────────────────────────────────────────

export const Standard: Story = {
  args: {
    renderInput: renderInput('standard', 'medium'),
  },
};

export const Filled: Story = {
  args: {
    renderInput: renderInput('filled', 'medium'),
  },
};

export const Outlined: Story = {
  args: {
    renderInput: renderInput('outlined', 'medium'),
  },
};

// ─── State axis (statically renderable subset) ──────────────────────────────

export const Disabled: Story = {
  args: {
    disabled: true,
    renderInput: renderInput('outlined', 'medium'),
  },
};

// `Error` would shadow the global `Error` — use `ErrorState`.
export const ErrorState: Story = {
  args: {
    renderInput: renderInput('outlined', 'medium', {
      error: true,
      helperText: 'Helper text',
    }),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    open: true,
    disablePortal: true,
    options: [],
    renderInput: renderInput('outlined', 'medium'),
  },
};

// ─── Has Value axis ─────────────────────────────────────────────────────────

export const Empty: Story = {
  args: {
    renderInput: renderInput('outlined', 'medium'),
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: TOP_OPTIONS[0],
    renderInput: renderInput('outlined', 'medium'),
  },
};

// ─── Multiple axis ──────────────────────────────────────────────────────────

export const MultipleEmpty: Story = {
  args: {
    multiple: true,
    renderInput: renderInput('outlined', 'medium'),
  },
};

export const MultipleWithValues: Story = {
  args: {
    multiple: true,
    defaultValue: [TOP_OPTIONS[0], TOP_OPTIONS[1]],
    renderInput: renderInput('outlined', 'medium'),
  },
};

// ─── Open popper (listbox visible inline via disablePortal) ─────────────────

export const Open: Story = {
  args: {
    open: true,
    disablePortal: true,
    renderInput: renderInput('outlined', 'medium'),
  },
};

export const OpenWithValue: Story = {
  args: {
    open: true,
    disablePortal: true,
    defaultValue: TOP_OPTIONS[0],
    renderInput: renderInput('outlined', 'medium'),
  },
};

// ─── Free solo / no clear ───────────────────────────────────────────────────

export const FreeSolo: Story = {
  args: {
    freeSolo: true,
    renderInput: renderInput('outlined', 'medium'),
  },
};

export const NoClear: Story = {
  args: {
    disableClearable: true,
    defaultValue: TOP_OPTIONS[0],
    renderInput: renderInput('outlined', 'medium'),
  },
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 110,
  textTransform: 'none',
};

const cell: React.CSSProperties = {
  width: 280,
};

export const VariantMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>has value \ variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 280 }}>
            {v}
          </span>
        ))}
      </Stack>
      {(
        [
          { label: 'true', defaultValue: TOP_OPTIONS[0] },
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
              <Autocomplete
                options={TOP_OPTIONS}
                getOptionLabel={(o) =>
                  typeof o === 'string' ? o : o.label
                }
                defaultValue={defaultValue}
                renderInput={renderInput(v, 'medium')}
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
          <span key={v} style={{ ...cellLabel, width: 280 }}>
            {v}
          </span>
        ))}
      </Stack>
      {STATES.map(({ label, extra, inputExtra }) => (
        <Stack
          key={label}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{label}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={cell}>
              <Autocomplete
                {...extra}
                disablePortal
                options={TOP_OPTIONS}
                getOptionLabel={(o) =>
                  typeof o === 'string' ? o : o.label
                }
                defaultValue={TOP_OPTIONS[0]}
                renderInput={renderInput(v, 'medium', inputExtra ?? {})}
                fullWidth
              />
            </div>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        Hovered is a `:hover` pseudo-class state — hover an input to observe.
        `Focused` is rendered with `open` so the listbox is visible inline.
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
          <span key={v} style={{ ...cellLabel, width: 280 }}>
            {v}
          </span>
        ))}
      </Stack>
      {SIZES.map((s) => (
        <Stack
          key={s}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={cellLabel}>{s}</span>
          {VARIANTS.map((v) => (
            <div key={v} style={cell}>
              <Autocomplete
                size={s}
                options={TOP_OPTIONS}
                getOptionLabel={(o) =>
                  typeof o === 'string' ? o : o.label
                }
                defaultValue={TOP_OPTIONS[0]}
                renderInput={renderInput(v, s)}
                fullWidth
              />
            </div>
          ))}
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
        <span style={cellLabel}>has value \ variant × size</span>
        {VARIANTS.flatMap((v) =>
          SIZES.map((s) => (
            <span
              key={`${v}-${s}`}
              style={{ ...cellLabel, width: 280 }}
            >
              {v} · {s}
            </span>
          )),
        )}
      </Stack>
      {(
        [
          {
            label: 'true',
            defaultValue: [TOP_OPTIONS[0], TOP_OPTIONS[1]],
          },
          { label: 'false', defaultValue: [] as Option[] },
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
                <Autocomplete
                  multiple
                  size={s}
                  options={TOP_OPTIONS}
                  getOptionLabel={(o) =>
                    typeof o === 'string' ? o : o.label
                  }
                  defaultValue={defaultValue}
                  renderInput={renderInput(v, s)}
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

// `OpenMatrix` renders the popper inline (`disablePortal` + `open`) so each
// cell shows the dropdown listbox under the input. Used by the runtime
// snapshot pass to measure popper / option-row geometry.
export const OpenMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={4}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>variant</span>
        {VARIANTS.map((v) => (
          <span key={v} style={{ ...cellLabel, width: 280 }}>
            {v}
          </span>
        ))}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>medium · single</span>
        {VARIANTS.map((v) => (
          <div key={v} style={cell}>
            <Autocomplete
              open
              disablePortal
              options={TOP_OPTIONS}
              getOptionLabel={(o) =>
                typeof o === 'string' ? o : o.label
              }
              renderInput={renderInput(v, 'medium')}
              fullWidth
            />
          </div>
        ))}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span style={cellLabel}>medium · multiple</span>
        {VARIANTS.map((v) => (
          <div key={v} style={cell}>
            <Autocomplete
              multiple
              open
              disablePortal
              options={TOP_OPTIONS}
              getOptionLabel={(o) =>
                typeof o === 'string' ? o : o.label
              }
              defaultValue={[TOP_OPTIONS[0]]}
              renderInput={renderInput(v, 'medium')}
              fullWidth
            />
          </div>
        ))}
      </Stack>
    </Stack>
  ),
};
