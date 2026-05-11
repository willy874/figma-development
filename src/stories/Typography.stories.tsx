import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography, type TypographyProps } from '@mui/material';

// MUI v7 Typography variants — see node_modules/@mui/material/styles/createTypography.d.ts
const VARIANTS: Array<NonNullable<TypographyProps['variant']>> = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'button',
  'caption',
  'overline',
];

// MUIColor → MUI Typography color. Typography re-exports MUI directly, so the
// story uses MUI palette/text keys; the `name` column documents the host-app
// design-system value the Figma component variants will be named after.
const MUI_COLORS = [
  { name: 'default', mui: 'textPrimary' as const },
  { name: 'secondary-text', mui: 'textSecondary' as const },
  { name: 'disabled-text', mui: 'textDisabled' as const },
  { name: 'primary', mui: 'primary' as const },
  { name: 'secondary', mui: 'secondary' as const },
  { name: 'danger', mui: 'error' as const },
  { name: 'warning', mui: 'warning' as const },
  { name: 'info', mui: 'info' as const },
  { name: 'success', mui: 'success' as const },
];

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Typography>` Figma spec at `.claude/skills/figma-components/Typography/figma.spec.md` — 13 variants × 9 colors. Typography is non-interactive (no hover/focus/pressed/disabled states), so the matrix is simply Variant × Color. `gutterBottom` and `noWrap` are utility flags surfaced as Figma BOOLEAN properties.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [...VARIANTS, 'inherit'],
    },
    color: {
      control: 'select',
      options: MUI_COLORS.map((c) => c.mui),
      description:
        'MUI palette / text key. MUI mapping: default→textPrimary, secondary-text→textSecondary, disabled-text→textDisabled, primary/secondary/info/warning/success keep their names, danger→error.',
    },
    align: {
      control: 'inline-radio',
      options: ['inherit', 'left', 'center', 'right', 'justify'],
    },
    gutterBottom: { control: 'boolean' },
    noWrap: { control: 'boolean' },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    variant: 'body1',
    color: 'textPrimary',
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Variant axis (one Story per variant value) ─────────────────────────────

export const H1: Story = { args: { variant: 'h1', children: 'h1. Heading' } };
export const H2: Story = { args: { variant: 'h2', children: 'h2. Heading' } };
export const H3: Story = { args: { variant: 'h3', children: 'h3. Heading' } };
export const H4: Story = { args: { variant: 'h4', children: 'h4. Heading' } };
export const H5: Story = { args: { variant: 'h5', children: 'h5. Heading' } };
export const H6: Story = { args: { variant: 'h6', children: 'h6. Heading' } };

export const Subtitle1: Story = {
  args: {
    variant: 'subtitle1',
    children: 'subtitle1. Lorem ipsum dolor sit amet, consectetur',
  },
};
export const Subtitle2: Story = {
  args: {
    variant: 'subtitle2',
    children: 'subtitle2. Lorem ipsum dolor sit amet, consectetur',
  },
};

export const Body1: Story = {
  args: {
    variant: 'body1',
    children:
      'body1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque viverra leo eu felis dapibus.',
  },
};
export const Body2: Story = {
  args: {
    variant: 'body2',
    children:
      'body2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque viverra leo eu felis dapibus.',
  },
};

export const Button: Story = {
  args: { variant: 'button', children: 'button text' },
};
export const Caption: Story = {
  args: { variant: 'caption', children: 'caption text' },
};
export const Overline: Story = {
  args: { variant: 'overline', children: 'overline text' },
};

// ─── Utility props ──────────────────────────────────────────────────────────

export const GutterBottom: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      <Typography variant="body1" gutterBottom>
        Paragraph 1 — gutterBottom adds `0.35 em` margin-bottom (≈5.6 px at
        body1).
      </Typography>
      <Typography variant="body1">
        Paragraph 2 — sits flush against paragraph 1 because no gutter.
      </Typography>
    </Stack>
  ),
};

export const NoWrap: Story = {
  args: {
    variant: 'body1',
    noWrap: true,
    children:
      'noWrap truncates with text-overflow: ellipsis when the parent has a fixed width — try shrinking the canvas to observe.',
  },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 240, border: '1px dashed #ccc', padding: 8 }}>
        <StoryFn />
      </div>
    ),
  ],
};

export const AlignCenter: Story = {
  args: { variant: 'body1', align: 'center' },
};
export const AlignRight: Story = {
  args: { variant: 'body1', align: 'right' },
};
export const AlignJustify: Story = {
  args: {
    variant: 'body1',
    align: 'justify',
    children:
      'Justified text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque viverra leo eu felis dapibus, eget vehicula odio fringilla. Sed vitae nibh nec orci scelerisque mattis.',
  },
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: 12,
  color: '#555',
  width: 96,
};

export const VariantMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      {VARIANTS.map((v) => (
        <Stack key={v} direction="row" spacing={2} alignItems="baseline">
          <span style={cellLabel}>{v}</span>
          <Typography variant={v}>The quick brown fox</Typography>
        </Stack>
      ))}
    </Stack>
  ),
};

export const ColorMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="baseline">
        <span style={cellLabel}>color \ variant</span>
        {(['h6', 'subtitle1', 'body1', 'caption'] as const).map((v) => (
          <span key={v} style={{ ...cellLabel, width: 220 }}>
            {v}
          </span>
        ))}
      </Stack>
      {MUI_COLORS.map(({ name, mui }) => (
        <Stack
          key={name}
          direction="row"
          spacing={2}
          alignItems="baseline"
        >
          <span style={cellLabel}>
            {name}
            <span style={{ color: '#aaa' }}> ({mui})</span>
          </span>
          {(['h6', 'subtitle1', 'body1', 'caption'] as const).map((v) => (
            <div key={v} style={{ width: 220 }}>
              <Typography variant={v} color={mui}>
                Sample text
              </Typography>
            </div>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

export const FullMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <span style={{ fontSize: 11, color: '#888' }}>
        Variant × Color full grid (13 × 9 = 117 cells). Use this story to probe
        any single cell's computed style.
      </span>
      {VARIANTS.map((v) => (
        <Stack key={v} spacing={0.25}>
          <span style={cellLabel}>{v}</span>
          <Stack direction="row" spacing={2} alignItems="baseline" flexWrap="wrap">
            {MUI_COLORS.map(({ name, mui }) => (
              <div key={name} style={{ minWidth: 180 }}>
                <Typography variant={v} color={mui}>
                  {name}
                </Typography>
              </div>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};
