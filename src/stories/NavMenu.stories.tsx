import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  type ListItemButtonProps,
} from '@mui/material';

// ─── Inline 24×24 glyphs ────────────────────────────────────────────────────
//
// `@mui/icons-material` is intentionally not a dependency of this package.
// The chevron mirrors `<Icon> Glyph Source = ChevronRight` (`512:7509`) at
// the 24×24 grid used by Icon.stories.tsx so `currentColor` inheritance
// through ListItemIcon's text paint is preserved.

const ChevronRightGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
);

const PersonGlyph = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const MerakChevron = ({ size = 24 }: { size?: number }) => (
  <Box
    aria-hidden
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      color: 'inherit',
      flexShrink: 0,
      lineHeight: 0,
    }}
  >
    <ChevronRightGlyph />
  </Box>
);

// ─── MerakNavMenuItem story wrapper ─────────────────────────────────────────
//
// The leaf nav row. Composes MUI `<ListItemButton>` + `<ListItemAvatar>` +
// `<ListItemText>` + a trailing chevron. State is driven by MUI props /
// className (Default = none, Selected = `selected`, Disabled = `disabled`,
// Hover / Active are pseudo-class only — the matrix uses the `Mui-focusVisible`
// className as a static stand-in for Hover, matching how Pagination renders).
//
// `nested` indents the row by 32 px (avatar gutter), matching the
// reference Figma `<Navbar>` isOpen=True child rows.

interface NavMenuItemProps extends Omit<ListItemButtonProps, 'children'> {
  label?: string;
  secondary?: string;
  leadingIcon?: boolean;
  trailingIcon?: boolean;
  nested?: boolean;
}

function MerakNavMenuItem({
  label = 'List Item',
  secondary,
  leadingIcon = true,
  trailingIcon = true,
  nested = false,
  selected,
  disabled,
  className,
  ...rest
}: NavMenuItemProps) {
  return (
    <ListItemButton
      {...rest}
      selected={selected}
      disabled={disabled}
      className={className}
      sx={{
        pl: nested ? '40px' : '8px',
        pr: '8px',
        py: '8px',
        borderRadius: '4px',
        gap: '8px',
        '& .MuiListItemAvatar-root': { minWidth: 32 },
        '& .MuiListItemIcon-root': { minWidth: 24 },
      }}
    >
      {leadingIcon && (
        <ListItemAvatar sx={{ minWidth: 32 }}>
          <Avatar sx={{ width: 24, height: 24, bgcolor: 'transparent', color: 'inherit' }}>
            <Box sx={{ width: 24, height: 24, color: 'rgba(0,0,0,0.54)' }}>
              <PersonGlyph />
            </Box>
          </Avatar>
        </ListItemAvatar>
      )}
      <ListItemText
        primary={label}
        secondary={secondary}
        primaryTypographyProps={{
          fontSize: 14,
          lineHeight: '20px',
          fontWeight: 400,
        }}
        secondaryTypographyProps={{
          fontSize: 12,
          lineHeight: '16px',
          color: 'rgba(0,0,0,0.6)',
        }}
      />
      {trailingIcon && (
        <ListItemIcon sx={{ minWidth: 24, color: 'rgba(0,0,0,0.54)' }}>
          <MerakChevron size={24} />
        </ListItemIcon>
      )}
    </ListItemButton>
  );
}

// ─── MerakNavMenu story wrapper ─────────────────────────────────────────────
//
// The collapsible wrapper. Header is a NavMenuItem with `selected` toggling
// open/closed. Children render inside `<Collapse>`. The `isOpen` prop is
// controlled in stories so static matrices can render both states.

interface NavMenuProps {
  header: string;
  headerSecondary?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

function MerakNavMenu({
  header,
  headerSecondary,
  isOpen: controlled,
  onToggle,
  children,
  disabled,
}: NavMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlled ?? internalOpen;

  return (
    <List disablePadding sx={{ width: 280 }}>
      <MerakNavMenuItem
        label={header}
        secondary={headerSecondary}
        disabled={disabled}
        onClick={onToggle ?? (() => setInternalOpen((v) => !v))}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>{children}</List>
      </Collapse>
    </List>
  );
}

// ─── Storybook meta ─────────────────────────────────────────────────────────

const meta = {
  title: 'Components/NavMenu',
  component: MerakNavMenuItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors `<NavMenu>` / `<NavMenuItem>` Figma spec at `.claude/skills/figma-components/NavMenu/figma.spec.md`. NavMenuItem carries 5 States (Default / Hover / Active / Selected / Disabled). NavMenu wraps a header + collapsible children with `IsOpen=False/True`. Hovered / Active are pseudo-class states (`:hover`, `:active`) — the matrix uses `Mui-focusVisible` as a visual stand-in for Hover; trigger Active by mouse-down on the rendered row.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    secondary: { control: 'text' },
    leadingIcon: { control: 'boolean' },
    trailingIcon: { control: 'boolean' },
    nested: { control: 'boolean' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'List Item',
    secondary: 'Secondary',
    leadingIcon: true,
    trailingIcon: true,
    nested: false,
  },
} satisfies Meta<typeof MerakNavMenuItem>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── State axis (statically renderable subset) ──────────────────────────────

export const Default: Story = {};

export const Hover: Story = {
  args: { className: 'Mui-focusVisible' },
  parameters: {
    docs: {
      description: {
        story:
          'True `:hover` requires real interaction or `storybook-addon-pseudo-states`. `Mui-focusVisible` paints the same `palette.action.focus` overlay MUI ListItemButton uses for focus — a visual stand-in. The Figma `State=Hover` cell binds to `alias/colors/bg-outline-hover` (4 % black) per spec §6.3.',
      },
    },
  },
};

export const Selected: Story = {
  args: { selected: true },
};

export const Active: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'MUI ListItemButton has no static `:active` paint — the runtime emits a Touch Ripple instead. The Figma `State=Active` cell binds to `alias/colors/bg-filled-hover` (12 % black) per spec §6.3 to give designers a deliberately "pressed" look. Cannot render statically.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// ─── Slot toggles ───────────────────────────────────────────────────────────

export const NoLeadingIcon: Story = {
  args: { leadingIcon: false },
};

export const NoTrailingIcon: Story = {
  args: { trailingIcon: false },
};

export const SinglelineNoSecondary: Story = {
  args: { secondary: undefined },
};

// ─── Matrices (NavMenuItem) ─────────────────────────────────────────────────

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 80,
};

const STATES = [
  { label: 'Default', extra: {} },
  { label: 'Hover', extra: { className: 'Mui-focusVisible' } },
  { label: 'Active', extra: {} }, // pseudo-class :active — cannot render statically
  { label: 'Selected', extra: { selected: true } },
  { label: 'Disabled', extra: { disabled: true } },
] as const;

export const StateMatrix: Story = {
  parameters: { controls: { disable: true } },
  args: { label: 'List Item', secondary: 'Secondary' },
  render: (args) => (
    <Stack spacing={1.5}>
      {STATES.map(({ label, extra }) => (
        <Stack key={label} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{label}</span>
          <Box sx={{ width: 280 }}>
            <MerakNavMenuItem {...args} {...extra} />
          </Box>
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        `Hover` uses `Mui-focusVisible` as a static stand-in. `Active` (pseudo-class
        `:active`) cannot render statically — mouse-down on a row to observe.
      </span>
    </Stack>
  ),
};

// ─── Matrices (NavMenu wrapper) ─────────────────────────────────────────────

export const NavMenuClosed: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => (
    <MerakNavMenu header="List Item" headerSecondary="Secondary" isOpen={false}>
      <MerakNavMenuItem label="List Item" trailingIcon={false} nested />
      <MerakNavMenuItem label="List Item" trailingIcon={false} nested />
      <MerakNavMenuItem label="List Item" trailingIcon={false} nested selected />
      <MerakNavMenuItem label="List Item" trailingIcon={false} nested />
    </MerakNavMenu>
  ),
};

export const NavMenuOpen: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => (
    <MerakNavMenu header="List Item" headerSecondary="Secondary" isOpen>
      <MerakNavMenuItem label="List Item" trailingIcon={false} nested />
      <MerakNavMenuItem label="List Item" trailingIcon={false} nested />
      <MerakNavMenuItem label="List Item" trailingIcon={false} nested selected />
      <MerakNavMenuItem label="List Item" trailingIcon={false} nested />
    </MerakNavMenu>
  ),
};

export const NavMenuOpenStateMatrix: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack direction="row" spacing={3}>
      <Stack spacing={1}>
        <span style={cellLabel}>IsOpen=False</span>
        <MerakNavMenu header="List Item" headerSecondary="Secondary" isOpen={false}>
          <MerakNavMenuItem label="Item 1" trailingIcon={false} nested />
        </MerakNavMenu>
      </Stack>
      <Stack spacing={1}>
        <span style={cellLabel}>IsOpen=True</span>
        <MerakNavMenu header="List Item" headerSecondary="Secondary" isOpen>
          <MerakNavMenuItem label="Item 1" trailingIcon={false} nested />
          <MerakNavMenuItem label="Item 2" trailingIcon={false} nested />
          <MerakNavMenuItem label="Item 3" trailingIcon={false} nested selected />
          <MerakNavMenuItem label="Item 4" trailingIcon={false} nested />
        </MerakNavMenu>
      </Stack>
    </Stack>
  ),
};
