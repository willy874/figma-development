import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  type TableCellProps,
  type TableProps,
  type TableRowProps,
} from '@mui/material';

// ─── Shared test data ───────────────────────────────────────────────────────
//
// Mirrors the MUI dense table demo so the composed Table sample exercises
// every supported `padding` / `align` / `size` / hover / selected state in
// the same render the per-axis matrices probe.

interface Dessert {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
}

const ROWS: Dessert[] = [
  { name: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
  { name: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
  { name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
  { name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mirrors the `<Table>` Figma spec at `.claude/skills/figma-components/Table/figma.spec.md`. The Figma library publishes two component sets — `<TableCell>` (Variant × Padding × Align × Size × State) and `<TableRow>` (Type × Hover × Selected) — plus a static composed `<Table>` sample. `Hover` is a pseudo-class state (`:hover`); the matrix uses `Mui-hover` / `Mui-selected` classes as static visual stand-ins.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium'] },
    padding: { control: 'inline-radio', options: ['normal', 'checkbox', 'none'] },
    stickyHeader: { control: 'boolean' },
  },
  args: {
    size: 'medium',
    padding: 'normal',
  },
} satisfies Meta<TableProps>;

export default meta;

type Story = StoryObj<typeof meta>;

const cellLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#555',
  width: 96,
  textTransform: 'none',
};

// ─── Composed Table — primary visual reference ──────────────────────────────

export const Default: Story = {
  render: (args) => (
    <TableContainer component={Paper}>
      <Table {...args} aria-label="dessert table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100 g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.name} hover>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const SmallSize: Story = {
  args: { size: 'small' },
  render: Default.render,
};

// Selectable table — exercises `padding="checkbox"` cells + selected row state.
export const SelectableRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const selectedName = 'Eclair';
    return (
      <TableContainer component={Paper}>
        <Table aria-label="selectable dessert table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox indeterminate />
              </TableCell>
              <TableCell>Dessert</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ROWS.map((row) => {
              const selected = row.name === selectedName;
              return (
                <TableRow
                  key={row.name}
                  hover
                  selected={selected}
                  aria-checked={selected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
};

// Sortable header — exercises the `<TableSortLabel>` slot inside the head cell.
export const SortableHeader: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <TableContainer component={Paper}>
      <Table aria-label="sortable dessert table">
        <TableHead>
          <TableRow>
            <TableCell sortDirection="asc">
              <TableSortLabel active direction="asc">
                Dessert
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel>Calories</TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel>Fat&nbsp;(g)</TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ROWS.slice(0, 3).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

// ─── TableCell matrices ─────────────────────────────────────────────────────
//
// Matrix harness wraps each cell in a 1-row table so MUI can apply its
// `<th>` / `<td>` context-dependent styling. Without the parent <table> the
// cell renders without borders / typography.

const CellHarness = ({
  variant,
  size,
  children,
  width = 160,
}: {
  variant: 'head' | 'body';
  size: 'small' | 'medium';
  children: React.ReactNode;
  width?: number;
}) => (
  <TableContainer component={Paper} sx={{ width, display: 'inline-block' }}>
    <Table size={size}>
      {variant === 'head' ? (
        <TableHead>
          <TableRow>{children}</TableRow>
        </TableHead>
      ) : (
        <TableBody>
          <TableRow>{children}</TableRow>
        </TableBody>
      )}
    </Table>
  </TableContainer>
);

const PADDINGS: Array<NonNullable<TableCellProps['padding']>> = ['normal', 'checkbox', 'none'];
const ALIGNS: Array<NonNullable<TableCellProps['align']>> = ['left', 'center', 'right'];
const VARIANTS: Array<NonNullable<TableCellProps['variant']>> = ['head', 'body'];
const SIZES: Array<'small' | 'medium'> = ['medium', 'small'];

// Padding × Align matrix for one (variant × size) pair. The variant axis is
// covered by switching `variant` arg; size by switching the SmallSize story.
export const CellPaddingAlignMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={4}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} spacing={1.5}>
          <Box sx={{ fontSize: 13, fontWeight: 600 }}>variant = {variant}</Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <span style={cellLabel}>padding \ align</span>
            {ALIGNS.map((a) => (
              <span key={a} style={{ ...cellLabel, width: 160 }}>
                {a}
              </span>
            ))}
          </Stack>
          {PADDINGS.map((p) => (
            <Stack key={p} direction="row" spacing={2} alignItems="center">
              <span style={cellLabel}>{p}</span>
              {ALIGNS.map((a) => (
                <CellHarness key={a} variant={variant} size="medium">
                  <TableCell padding={p} align={a}>
                    {p === 'checkbox' ? <Checkbox /> : 'Cell text'}
                  </TableCell>
                </CellHarness>
              ))}
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

// Size axis — Medium vs Small for both variants. Padding fixed at `normal`.
export const CellSizeMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>variant \ size</span>
        {SIZES.map((s) => (
          <span key={s} style={{ ...cellLabel, width: 160 }}>
            {s}
          </span>
        ))}
      </Stack>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{variant}</span>
          {SIZES.map((s) => (
            <CellHarness key={s} variant={variant} size={s}>
              <TableCell>{variant === 'head' ? 'Header' : 'Body'}</TableCell>
            </CellHarness>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};

// State axis — Default / Hover / Selected. Hover and Selected are row-level
// classes; Selected is also visible at the cell level via `Mui-selected`.
// Pseudo `:hover` cannot render statically — use `Mui-hover` class as a
// visual stand-in (matches what Figma needs to author).
const CELL_STATES: Array<{ label: string; rowProps: Partial<TableRowProps>; rowClass?: string }> = [
  { label: 'Default', rowProps: {} },
  { label: 'Hover', rowProps: { hover: true }, rowClass: 'Mui-hover' },
  { label: 'Selected', rowProps: { hover: true, selected: true } },
];

export const CellStateMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <span style={cellLabel}>variant \ state</span>
        {CELL_STATES.map((s) => (
          <span key={s.label} style={{ ...cellLabel, width: 200 }}>
            {s.label}
          </span>
        ))}
      </Stack>
      {VARIANTS.map((variant) => (
        <Stack key={variant} direction="row" spacing={2} alignItems="center">
          <span style={cellLabel}>{variant}</span>
          {CELL_STATES.map((s) => (
            <TableContainer
              key={s.label}
              component={Paper}
              sx={{ width: 200, display: 'inline-block' }}
            >
              <Table>
                {variant === 'head' ? (
                  <TableHead>
                    <TableRow {...s.rowProps} className={s.rowClass}>
                      <TableCell>Header</TableCell>
                    </TableRow>
                  </TableHead>
                ) : (
                  <TableBody>
                    <TableRow {...s.rowProps} className={s.rowClass}>
                      <TableCell>Body cell</TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          ))}
        </Stack>
      ))}
      <span style={{ fontSize: 11, color: '#888' }}>
        `Hover` uses `Mui-hover` className as a static visual stand-in — runtime
        `:hover` requires interaction or `storybook-addon-pseudo-states`.
      </span>
    </Stack>
  ),
};

// ─── TableRow matrices ──────────────────────────────────────────────────────
//
// Row-level state combinations. The row paints differ from the cell-level
// matrix because hover/selected styling lives on `<tr>` selectors.

const ROW_STATES: Array<{ label: string; rowProps: Partial<TableRowProps>; rowClass?: string }> = [
  { label: 'Default', rowProps: {} },
  { label: 'Hover', rowProps: { hover: true }, rowClass: 'Mui-hover' },
  { label: 'Selected', rowProps: { selected: true } },
  { label: 'Hover+Selected', rowProps: { hover: true, selected: true }, rowClass: 'Mui-hover' },
];

export const RowStateMatrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={3}>
      {VARIANTS.map((variant) => (
        <Stack key={variant} spacing={1.5}>
          <Box sx={{ fontSize: 13, fontWeight: 600 }}>variant = {variant}</Box>
          {ROW_STATES.map((s) => (
            <Stack key={s.label} direction="row" spacing={2} alignItems="center">
              <span style={cellLabel}>{s.label}</span>
              <TableContainer component={Paper} sx={{ width: 480 }}>
                <Table>
                  {variant === 'head' ? (
                    <TableHead>
                      <TableRow {...s.rowProps} className={s.rowClass}>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat (g)</TableCell>
                      </TableRow>
                    </TableHead>
                  ) : (
                    <TableBody>
                      <TableRow {...s.rowProps} className={s.rowClass}>
                        <TableCell>Cupcake</TableCell>
                        <TableCell align="right">305</TableCell>
                        <TableCell align="right">3.7</TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
};
