import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  type DialogProps,
} from '@mui/material';

// Inline 20×20 close glyph — `@mui/icons-material` is intentionally not a
// dependency of this package. Swap to a real icon when consuming Dialog.tsx
// in the host app.
const CloseGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// Statically render every Dialog inline (no portal, no backdrop, no focus
// trap) so multiple sample modals can sit side-by-side in the matrix views.
// Production callers leave these props at their defaults.
const STATIC_DIALOG_PROPS = {
  open: true,
  hideBackdrop: true,
  disablePortal: true,
  disableEnforceFocus: true,
  disableAutoFocus: true,
  disableRestoreFocus: true,
  disableScrollLock: true,
  // Detach Dialog's fixed positioning so multiple shells stack in the page
  // flow inside Storybook. The `Paper` slot still owns the shell paint.
  sx: {
    position: 'static',
    '& .MuiDialog-container': { position: 'static', display: 'block' },
    '& .MuiDialog-paper': { position: 'static', m: 0 },
  },
} satisfies Partial<DialogProps>;

const SIZES: Array<NonNullable<DialogProps['maxWidth']>> = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
];

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<Dialog>` Figma spec at `.claude/skills/figma-components/Dialog/figma.spec.md` — 5 shell variants (Size = xs/sm/md/lg/xl) plus 2 `<DialogContent>` variants (Dividers = false/true). `<DialogTitle>` and `<DialogActions>` carry no variant axis. Every sample renders inline via `disablePortal` + `hideBackdrop` so the matrix views can show multiple shells side-by-side; production callers leave Dialog at its defaults (portaled, backdropped, focus-trapped). **Static-render limits:** `:hover` / `:focus-visible` on action `<Button>` instances, the dismiss-on-backdrop interaction, and the open / close transition (Fade) cannot be probed without `storybook-addon-pseudo-states` — see `storybook.render.md` §7 for the full list.',
      },
    },
  },
  argTypes: {
    maxWidth: {
      control: 'inline-radio',
      options: SIZES,
    },
    fullWidth: { control: 'boolean' },
  },
  args: {
    maxWidth: 'xs',
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Shell Size axis ────────────────────────────────────────────────────────

const SampleBody = ({ children }: { children?: React.ReactNode }) => (
  <DialogContentText>
    {children ??
      'Set my maximum width and whether to adapt or not. The sample body content shows how the shell hugs its slot stack.'}
  </DialogContentText>
);

export const SizeXs: Story = {
  args: { maxWidth: 'xs', ...STATIC_DIALOG_PROPS },
  render: (args) => (
    <Dialog {...args}>
      <DialogTitle>Use Google's location service?</DialogTitle>
      <DialogContent>
        <SampleBody>
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </SampleBody>
      </DialogContent>
      <DialogActions>
        <Button>Disagree</Button>
        <Button variant="contained">Agree</Button>
      </DialogActions>
    </Dialog>
  ),
};

export const SizeSm: Story = {
  args: { maxWidth: 'sm', ...STATIC_DIALOG_PROPS },
  render: (args) => (
    <Dialog {...args}>
      <DialogTitle>Invite a teammate</DialogTitle>
      <DialogContent>
        <SampleBody>
          Send an invitation to collaborate on this project. Invitees receive
          an email with a join link valid for 7 days.
        </SampleBody>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">Send invite</Button>
      </DialogActions>
    </Dialog>
  ),
};

export const SizeMd: Story = {
  args: { maxWidth: 'md', ...STATIC_DIALOG_PROPS },
  render: (args) => (
    <Dialog {...args}>
      <DialogTitle>Edit project details</DialogTitle>
      <DialogContent>
        <SampleBody />
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  ),
};

export const SizeLg: Story = {
  args: { maxWidth: 'lg', ...STATIC_DIALOG_PROPS },
  render: (args) => (
    <Dialog {...args}>
      <DialogTitle>Configure deployment</DialogTitle>
      <DialogContent>
        <SampleBody />
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">Deploy</Button>
      </DialogActions>
    </Dialog>
  ),
};

export const SizeXl: Story = {
  args: { maxWidth: 'xl', ...STATIC_DIALOG_PROPS },
  render: (args) => (
    <Dialog {...args}>
      <DialogTitle>Compare environments</DialogTitle>
      <DialogContent>
        <SampleBody />
      </DialogContent>
      <DialogActions>
        <Button>Close</Button>
      </DialogActions>
    </Dialog>
  ),
};

// ─── DialogContent Dividers axis ────────────────────────────────────────────

export const ContentDividersFalse: Story = {
  args: { maxWidth: 'xs', ...STATIC_DIALOG_PROPS },
  parameters: { controls: { disable: true } },
  render: (args) => (
    <Dialog {...args}>
      <DialogTitle>No dividers</DialogTitle>
      <DialogContent dividers={false}>
        <SampleBody>
          Default content treatment. The title's bottom padding supplies the
          gap above the body, and the actions row keeps `padding: 8` below.
        </SampleBody>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  ),
};

export const ContentDividersTrue: Story = {
  args: { maxWidth: 'xs', ...STATIC_DIALOG_PROPS },
  parameters: { controls: { disable: true } },
  render: (args) => (
    <Dialog {...args}>
      <DialogTitle>With dividers</DialogTitle>
      <DialogContent dividers>
        <SampleBody>
          MUI re-introduces top + bottom 1 px borders bound to
          `alias/colors/border-defalt`, and bumps the content padding to
          `16 / 24 / 16 / 24` so the text doesn't clip the strokes.
        </SampleBody>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  ),
};

// ─── Common compositions (documentation matrix) ─────────────────────────────

export const SizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={3} alignItems="flex-start">
      {SIZES.map((size) => (
        <Dialog key={size} {...STATIC_DIALOG_PROPS} maxWidth={size}>
          <DialogTitle>Size = {size}</DialogTitle>
          <DialogContent>
            <SampleBody>
              Shell width follows MUI's default `maxWidth` mapping
              (xs=444 / sm=600 / md=900 / lg=1200 / xl=1536).
            </SampleBody>
          </DialogContent>
          <DialogActions>
            <Button>Cancel</Button>
            <Button variant="contained">Confirm</Button>
          </DialogActions>
        </Dialog>
      ))}
    </Stack>
  ),
};

export const ActionCountMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={3} alignItems="flex-start">
      <Dialog {...STATIC_DIALOG_PROPS} maxWidth="xs">
        <DialogTitle>Acknowledge — 1 action</DialogTitle>
        <DialogContent>
          <SampleBody>The simplest dismissable modal — single primary CTA.</SampleBody>
        </DialogContent>
        <DialogActions>
          <Button variant="contained">OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog {...STATIC_DIALOG_PROPS} maxWidth="xs">
        <DialogTitle>Confirm — 2 actions</DialogTitle>
        <DialogContent>
          <SampleBody>The canonical cancel + primary shape.</SampleBody>
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog {...STATIC_DIALOG_PROPS} maxWidth="xs">
        <DialogTitle>Destructive confirm — Cancel + Danger</DialogTitle>
        <DialogContent>
          <SampleBody>
            Use the Danger Button variant for irreversible actions; keep cancel
            on the left.
          </SampleBody>
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog {...STATIC_DIALOG_PROPS} maxWidth="xs">
        <DialogTitle>Three-button footer — Tertiary + Cancel + Primary</DialogTitle>
        <DialogContent>
          <SampleBody>
            Tertiary action sits left of Cancel per Merak convention
            (`Save as draft / Discard / Publish`).
          </SampleBody>
        </DialogContent>
        <DialogActions>
          <Button>Save as draft</Button>
          <Button>Discard</Button>
          <Button variant="contained">Publish</Button>
        </DialogActions>
      </Dialog>

      <Dialog {...STATIC_DIALOG_PROPS} maxWidth="xs">
        <DialogTitle>Title-only confirmation — no DialogContent</DialogTitle>
        <DialogActions>
          <Button>Cancel</Button>
          <Button variant="contained">OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog {...STATIC_DIALOG_PROPS} maxWidth="xs">
        <DialogTitle>Scrollable content — Dividers=true</DialogTitle>
        <DialogContent dividers>
          <SampleBody>
            Top + bottom 1 px strokes signal scroll affordance. Use this when
            the body is dense or scrolls.
          </SampleBody>
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button variant="contained">OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog {...STATIC_DIALOG_PROPS} maxWidth="sm">
        <DialogTitle>Form dialog — sm width</DialogTitle>
        <DialogContent>
          <SampleBody>
            Slightly wider shell for short forms (login, simple edit). Pair
            with sm body content; promote to md for multi-column layouts.
          </SampleBody>
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button variant="contained">Invite member</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  ),
};

// ─── Title with close affordance (documentation only) ───────────────────────
//
// Currently the Figma `<DialogTitle>` carries no variant axis — close
// affordances are added per-screen by dropping an `<IconButton>` next to the
// title text inside the title's Slot. This story documents the pattern so
// designers can mirror it.

export const TitleWithCloseButton: Story = {
  args: { maxWidth: 'xs', ...STATIC_DIALOG_PROPS },
  parameters: { controls: { disable: true } },
  render: (args) => (
    <Dialog {...args}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <span>Modal title with close</span>
        <IconButton aria-label="Close" size="small" sx={{ color: 'text.secondary' }}>
          <CloseGlyph />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SampleBody>
          {'Drop an `<IconButton>` (or styled minimal Button) inside the title slot for a top-right close affordance. No new component is required.'}
        </SampleBody>
      </DialogContent>
      <DialogActions>
        <Button variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  ),
};
