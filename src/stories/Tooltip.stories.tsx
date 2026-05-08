import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Stack, Tooltip, type TooltipProps } from '@mui/material';

// MUI Tooltip is a Popper-based component that only renders when its anchor is
// hovered/focused. Stories pin `open={true}` so the tooltip is always visible
// and Chrome DevTools / visual regression tools can measure / capture it.
//
// `disablePortal` is set so the tooltip renders inside its parent box rather
// than the document body — without it the matrix cells can't lay out together
// because each tooltip escapes its grid cell into a single global popper layer.
const PLACEMENTS: Array<NonNullable<TooltipProps['placement']>> = [
  'top-start',
  'top',
  'top-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end',
  'right-start',
  'right',
  'right-end',
];

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Tooltip>` Figma spec at `.claude/skills/figma-components/Tooltip/figma.spec.md` — 24 variants (12 Placements × 2 Arrow). MUI runtime renders Tooltip in a Popper portal; stories pin `open={true}` and use `slotProps.popper.disablePortal` so each cell renders inline for visual capture. The component has no Color / State / Size axes — Tooltip is monochrome (greyscale fill) and stateless (visibility is the only "state" — open vs closed).',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    placement: {
      control: 'select',
      options: PLACEMENTS,
    },
    arrow: { control: 'boolean' },
    open: { control: 'boolean' },
  },
  args: {
    title: 'Tooltip',
    placement: 'bottom',
    arrow: false,
    open: true,
    disableInteractive: true,
    slotProps: {
      popper: {
        disablePortal: true,
        // Force the popper to render even when the anchor isn't hovered.
        modifiers: [{ name: 'flip', enabled: false }],
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

// Anchor used by every cell — wrapped in a Box so the popper has room to render
// around it (Popper coordinates are relative to the anchor's bounding box).
const Anchor = ({ label = 'Anchor' }: { label?: string }) => (
  <Button variant="outlined" size="small" sx={{ pointerEvents: 'none' }}>
    {label}
  </Button>
);

// ─── Single-placement stories ───────────────────────────────────────────────

export const Bottom: Story = {
  args: { placement: 'bottom' },
  decorators: [
    (Story) => (
      <Box sx={{ p: 6, display: 'inline-block' }}>
        <Story />
      </Box>
    ),
  ],
  render: (args) => (
    <Tooltip {...args}>
      <Anchor />
    </Tooltip>
  ),
};

export const Top: Story = {
  args: { placement: 'top' },
  decorators: Bottom.decorators,
  render: Bottom.render,
};

export const Left: Story = {
  args: { placement: 'left' },
  decorators: Bottom.decorators,
  render: Bottom.render,
};

export const Right: Story = {
  args: { placement: 'right' },
  decorators: Bottom.decorators,
  render: Bottom.render,
};

// ─── Arrow toggle ───────────────────────────────────────────────────────────

export const WithArrow: Story = {
  args: { placement: 'bottom', arrow: true },
  decorators: Bottom.decorators,
  render: Bottom.render,
};

// ─── Long content (maxWidth wrap) ───────────────────────────────────────────

export const LongTitle: Story = {
  args: {
    placement: 'bottom',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae velit ex. Mauris dapibus risus quis suscipit vulputate.',
  },
  decorators: Bottom.decorators,
  render: Bottom.render,
};

// ─── Matrices (all combinations) ────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 11,
  color: '#888',
  textTransform: 'none',
};

// Each placement cell needs vertical / horizontal breathing room because the
// Popper renders relative to the anchor — without padding the popped content
// overlaps the next cell.
const CELL_BOX_SX = {
  position: 'relative' as const,
  width: 240,
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px dashed #eee',
  boxSizing: 'border-box' as const,
};

export const PlacementMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { title: 'Tooltip', open: true },
  render: (args) => (
    <Stack spacing={3}>
      {(
        [
          { row: 'Top', cells: ['top-start', 'top', 'top-end'] as const },
          {
            row: 'Bottom',
            cells: ['bottom-start', 'bottom', 'bottom-end'] as const,
          },
          { row: 'Left', cells: ['left-start', 'left', 'left-end'] as const },
          {
            row: 'Right',
            cells: ['right-start', 'right', 'right-end'] as const,
          },
        ] as const
      ).map(({ row, cells }) => (
        <Stack key={row} spacing={1}>
          <span style={{ ...cellLabel, fontWeight: 600 }}>{row}</span>
          <Stack direction="row" spacing={2}>
            {cells.map((p) => (
              <Box key={p} sx={CELL_BOX_SX}>
                <Tooltip {...args} placement={p}>
                  <Anchor label={p} />
                </Tooltip>
              </Box>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

export const ArrowMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { title: 'Tooltip', open: true },
  render: (args) => (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={{ ...cellLabel, width: 96 }}>arrow \ placement</span>
        {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
          <span key={p} style={{ ...cellLabel, width: 240 }}>
            {p}
          </span>
        ))}
      </Stack>
      {(
        [
          { label: 'No arrow', extra: { arrow: false } },
          { label: 'Arrow', extra: { arrow: true } },
        ] as const
      ).map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="center">
          <span style={{ ...cellLabel, width: 96 }}>{label}</span>
          {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
            <Box key={p} sx={CELL_BOX_SX}>
              <Tooltip {...args} {...extra} placement={p}>
                <Anchor />
              </Tooltip>
            </Box>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
