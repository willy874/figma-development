import type { Meta, StoryObj } from '@storybook/react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  IconButton,
  Snackbar,
  SnackbarContent,
  Stack,
  type AlertColor,
  type SnackbarOrigin,
  type SnackbarProps,
} from '@mui/material';

// MUI Snackbar is a `position: fixed` lifecycle wrapper that renders
// SnackbarContent (the grey default) or any child element (typically <Alert>).
// Since `position: fixed` would let every cell overlap, the matrix stories
// render `SnackbarContent` and `Alert` directly inline; the hero stories
// use a `<Snackbar>` with sx-override to lay out statically.
//
// `anchorOrigin` is intentionally NOT a variant axis — changing it only
// shifts the screen-level fixed-position offsets, the Snackbar body itself
// has no visual delta. The `AnchorOriginMatrix` story below is illustrative
// only.

// Inline 16x16 close glyph — matches MUI CloseIcon (`@mui/icons-material`
// is intentionally not a dependency of this package).
const CloseGlyph = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const SEVERITY_VARIANTS: Array<'default' | AlertColor> = [
  'default',
  'success',
  'info',
  'warning',
  'error',
];

type ActionMode = 'none' | 'button' | 'close';
const ACTION_MODES: ActionMode[] = ['none', 'button', 'close'];

const ANCHORS: SnackbarOrigin[] = [
  { vertical: 'top', horizontal: 'left' },
  { vertical: 'top', horizontal: 'center' },
  { vertical: 'top', horizontal: 'right' },
  { vertical: 'bottom', horizontal: 'left' },
  { vertical: 'bottom', horizontal: 'center' },
  { vertical: 'bottom', horizontal: 'right' },
];

const meta = {
  title: 'Components/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Snackbar>` Figma spec at `.claude/skills/figma-components/Snackbar/figma.spec.md` — 15 variants (5 Variants × 3 Actions). Variant `Default` uses MUI `<SnackbarContent>` (grey emphasized surface); the other 4 use MUI `<Alert variant="filled">` for severity tones. `anchorOrigin` is not a variant axis (only screen-level positioning, no body delta). `open=true` is pinned for static capture.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    anchorOrigin: { control: 'object' },
    message: { control: 'text' },
  },
  args: {
    open: true,
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    message: 'This is a snackbar message',
  },
} satisfies Meta<typeof Snackbar>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Helpers ────────────────────────────────────────────────────────────────

// Override `position: fixed` so the Snackbar lays out inline in stories.
const STATIC_SX: NonNullable<SnackbarProps['sx']> = {
  position: 'static',
  transform: 'none',
  left: 'auto',
  right: 'auto',
  top: 'auto',
  bottom: 'auto',
  display: 'inline-flex',
};

const renderAction = (mode: ActionMode, color?: 'inherit' | 'default') => {
  if (mode === 'none') return undefined;
  if (mode === 'button') {
    return (
      <Button
        color={color === 'default' ? 'primary' : 'inherit'}
        size="small"
        sx={{ pointerEvents: 'none' }}
      >
        UNDO
      </Button>
    );
  }
  return (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      sx={{ pointerEvents: 'none' }}
    >
      <CloseGlyph size={20} />
    </IconButton>
  );
};

// SnackbarContent is the visible body for the "Default" Variant. Used inline
// in matrix stories so cells can lay out side-by-side without `position: fixed`
// fighting them.
const DefaultBody = ({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) => <SnackbarContent message={message} action={action} />;

// Alert is the visible body for the Severity Variants. Filled variant matches
// the MUI Snackbar+Alert documented usage (high contrast against the page).
const AlertBody = ({
  severity,
  message,
  action,
}: {
  severity: AlertColor;
  message: string;
  action?: React.ReactNode;
}) => (
  <Alert
    severity={severity}
    variant="filled"
    action={action}
    sx={{ minWidth: 288 }}
  >
    {message}
  </Alert>
);

const renderCell = (
  variant: 'default' | AlertColor,
  action: ActionMode,
  message: string,
) => {
  const actionEl = renderAction(action, variant === 'default' ? 'default' : 'inherit');
  return variant === 'default' ? (
    <DefaultBody message={message} action={actionEl} />
  ) : (
    <AlertBody severity={variant} message={message} action={actionEl} />
  );
};

// ─── Hero stories — single-variant with the real <Snackbar> wrapper ─────────

export const Default: Story = {
  args: { message: 'Note archived' },
  render: (args) => (
    <Snackbar {...args} sx={STATIC_SX} action={renderAction('button', 'default')} />
  ),
};

export const DefaultWithClose: Story = {
  args: { message: 'Note archived' },
  render: (args) => (
    <Snackbar {...args} sx={STATIC_SX} action={renderAction('close', 'default')} />
  ),
};

export const Success: Story = {
  args: { message: 'Saved successfully' },
  render: (args) => (
    <Snackbar {...args} sx={STATIC_SX}>
      <Alert severity="success" variant="filled" sx={{ minWidth: 288 }}>
        {args.message as string}
      </Alert>
    </Snackbar>
  ),
};

export const Info: Story = {
  args: { message: 'New version available' },
  render: (args) => (
    <Snackbar {...args} sx={STATIC_SX}>
      <Alert severity="info" variant="filled" sx={{ minWidth: 288 }}>
        {args.message as string}
      </Alert>
    </Snackbar>
  ),
};

export const Warning: Story = {
  args: { message: 'Action could not be undone' },
  render: (args) => (
    <Snackbar {...args} sx={STATIC_SX}>
      <Alert severity="warning" variant="filled" sx={{ minWidth: 288 }}>
        {args.message as string}
      </Alert>
    </Snackbar>
  ),
};

export const Error: Story = {
  args: { message: 'Failed to save' },
  render: (args) => (
    <Snackbar {...args} sx={STATIC_SX}>
      <Alert
        severity="error"
        variant="filled"
        action={renderAction('close', 'inherit')}
        sx={{ minWidth: 288 }}
      >
        {args.message as string}
      </Alert>
    </Snackbar>
  ),
};

export const WithTitle: Story = {
  args: {},
  render: () => (
    <Box sx={{ display: 'inline-block' }}>
      <Alert severity="success" variant="filled" sx={{ minWidth: 288 }}>
        <AlertTitle>Success</AlertTitle>
        Saved successfully — your changes are live.
      </Alert>
    </Box>
  ),
};

// ─── Matrices ───────────────────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  textTransform: 'none',
};

const COL_WIDTH = 320;

export const VariantMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { message: 'This is a snackbar message' },
  render: (args) => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={{ ...cellLabel, width: 96 }}>variant \ action</span>
        {ACTION_MODES.map((a) => (
          <span key={a} style={{ ...cellLabel, width: COL_WIDTH }}>
            {a}
          </span>
        ))}
      </Stack>
      {SEVERITY_VARIANTS.map((variant) => (
        <Stack
          key={variant}
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >
          <span style={{ ...cellLabel, width: 96 }}>{variant}</span>
          {ACTION_MODES.map((action) => (
            <Box
              key={action}
              sx={{
                width: COL_WIDTH,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              {renderCell(variant, action, args.message as string)}
            </Box>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

// Anchor positioning is documentation-only (no body delta). The matrix
// shows the 6 fixed-position offsets in a viewport-sized container so
// designers can sanity-check screen-level placement.
export const AnchorOriginMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { message: 'Anchor preview', open: true },
  render: (args) => (
    <Stack spacing={3}>
      <span style={{ ...cellLabel, fontSize: 11 }}>
        Each tile is a 480 × 200 viewport mock with the Snackbar pinned via its
        actual `anchorOrigin` (no sx-override). Body visuals are identical
        across the 6 cells — only the screen-level position changes.
      </span>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {ANCHORS.map((anchor) => (
          <Box
            key={`${anchor.vertical}-${anchor.horizontal}`}
            sx={{
              position: 'relative',
              width: 480,
              height: 200,
              border: '1px dashed #ccc',
              boxSizing: 'border-box',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            <span
              style={{
                ...cellLabel,
                position: 'absolute',
                top: 4,
                left: 8,
              }}
            >
              {anchor.vertical}-{anchor.horizontal}
            </span>
            <Snackbar
              open={args.open}
              anchorOrigin={anchor}
              message={args.message as string}
              sx={{
                position: 'absolute',
              }}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  ),
};

// Long content wraps inside the SnackbarContent / Alert body. Useful as a
// Step-2 measurement target for line-height / wrap-width sanity-checks.
export const LongMessage: Story = {
  args: {
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae velit ex. Mauris dapibus risus quis suscipit vulputate.',
  },
  render: (args) => (
    <Stack spacing={2} sx={{ maxWidth: 480 }}>
      <DefaultBody
        message={args.message as string}
        action={renderAction('button', 'default')}
      />
      <AlertBody
        severity="info"
        message={args.message as string}
        action={renderAction('close', 'inherit')}
      />
    </Stack>
  ),
};
