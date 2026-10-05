# React Data Table

A controlled React 19 table renderer extracted from AEGIS's shared table. The host owns data fetching, search, filtering, pagination, selection state, preferences, business actions, and exports. No network or storage access is performed by this package.

**MIT licensed.** Source is public; no npm registry release has been published. The package retains `private: true` until npm scope access and publishing rights are verified. Applications can consume a checksum-verified `npm pack` artifact committed under their `vendor/` directory; this requires no registry credentials. Preserve LICENSE and THIRD_PARTY_NOTICES.md when redistributing.

## Usage

```tsx
'use client';
import { DataTableCore, type TableColumn } from '@aegis-security-investigations/react-data-table';

type Item = { id: string; name: string; count: number };
const columns: TableColumn<Item>[] = [
  { key: 'name', header: 'Name' },
  { key: 'count', header: 'Count', className: 'text-right' },
  { key: 'actions', header: 'Actions', render: (_value, row) => <button onClick={() => console.log(row.id)}>Open</button> },
];
export function Example({ rows }: { rows: Item[] }) {
  return <DataTableCore data={rows} columns={columns} scrollAreaLabel="Items"
    onSort={() => {}} onSelectAll={() => {}} onRowSelect={() => {}} />;
}
```

Use stable unique string `id` values for selection, expansion, dragging, and inline pickers. The index fallback is only suitable for static, non-interactive rows.

## Styling and customization

The package uses Tailwind utilities and semantic tokens (`background`, `foreground`, `muted`, `border`, `ring`, `primary`, `popover`). Include its published source in the host's Tailwind scan. For Tailwind 4, add a path relative to the stylesheet:

```css
@source "../../../node_modules/@aegis-security-investigations/react-data-table/src";
```

For Tailwind 3 include `./node_modules/@aegis-security-investigations/react-data-table/src/**/*.{ts,tsx}` in `content`. Supply your existing light/dark theme and animation utilities.

- `columns`: nested keys, custom cell rendering, widths, alignment, header tooltips, `headerClassName` and cell classes.
- `sort` + `onSort`: controlled indicator and callback. The renderer never rearranges rows. `sortRowsByColumn` is an optional immutable client-sort helper.
- `selection`, `allSelected`, `hasSelectableRows`, `onSelectAll`, `onRowSelect`: host-controlled state and eligibility. The host defines selection scope and keeps off-page selections.
- `expandableRows`: controlled or local expansion with accessible toggle labels and panel IDs.
- `columnResize`: a structural `ColumnResizeApi` adapter. The host owns measurement, bounds, storage and persistence. Controls support pointer dragging, arrows (Shift for larger steps), Home and double-click reset.
- `draggable`: opt-in lazy drag-and-drop body and host `onDragEnd`; requires stable IDs. React Suspense replaces the original Next-specific loader.
- `rowClassName`, row hover/click callbacks, test IDs, `footer`, `emptyState`, `isTableLoading`, and `loadingRowCount` cover presentation customization.
- `useDataTableRowPickerOpen`: preserves inline picker state through row refreshes. Import this hook from the same package as the renderer so context identity stays shared.

Keep authentication, GraphQL types, application IDs, export auditing, saved views, responsive facet chrome, pagination and retry UI in the host. Business actions remain cell render functions supplied by the app.

## Development and distribution

```sh
npm ci
npm run build
bun test
npm pack --dry-run
npm run check:package
npm run test:consumer
```

TypeScript emits ESM and declarations. React remains a peer dependency; third-party code is installed as dependencies rather than bundled. The client entry preserves `use client`; relative imports use `.js` for native ESM compatibility.

The build clears old output before compiling. The package audit inspects the real tarball, checks its allowlist, export targets, client boundaries and React peers, and scans for credential patterns, private imports and workstation paths. The consumer check installs that tarball into a temporary application, resolves both entries in native ESM, checks declarations with strict TypeScript settings, server-renders synthetic rows, and generates Tailwind 3 styles from the published source. It uses network access to install public dependencies and removes its temporary files on completion. Neither check publishes anything.

The initial adapters should be reviewed before expanding migration to other tables. No registry publish automation is configured. Registry publication requires verified npm organization access, a final pack audit, and explicit removal of the accidental-publish guard. Never commit registry credentials.
