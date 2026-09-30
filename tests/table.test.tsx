import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
	DataTableCore,
	type DataTableCoreProps,
	type ColumnResizeApi,
	sortRowsByColumn,
} from "../src/index";
import { parsePersistedColumnWidths } from "../src/columnWidthStorage";

afterEach(cleanup);
type Row = { id: string; name: string; amount: number; active: boolean };
const rows: Row[] = [
	{ id: "a", name: "Alpha", amount: 0, active: false },
	{ id: "b", name: "Beta", amount: 2, active: true },
];
const columns = [
	{ key: "name", header: "Name", sortable: true },
	{ key: "amount", header: "Amount" },
	{ key: "active", header: "Active" },
];
const defaults: DataTableCoreProps<Row> = {
	data: rows,
	columns,
	onSort: () => {},
	onSelectAll: () => {},
	onRowSelect: () => {},
};

test("renders zero and false values and named scroll region", () => {
	render(<DataTableCore {...defaults} scrollAreaLabel="Example records" />);
	expect(screen.getByRole("region", { name: "Example records" })).toBeTruthy();
	expect(screen.getByText("0")).toBeTruthy();
	expect(screen.getByText("false")).toBeTruthy();
});
test("sort button delegates and exposes current sort without reordering controlled data", () => {
	const onSort = mock();
	render(
		<DataTableCore
			{...defaults}
			sort={{ field: "name", order: "desc" }}
			onSort={onSort}
		/>,
	);
	fireEvent.click(screen.getByRole("button", { name: "Name" }));
	expect(onSort).toHaveBeenCalledWith(columns[0]);
	expect(
		screen
			.getByRole("columnheader", { name: "Name" })
			.getAttribute("aria-sort"),
	).toBe("descending");
	expect(screen.getAllByRole("row")[1].textContent).toContain("Alpha");
});
test("selection blocks disabled rows and leaves nested controls to the app", () => {
	const onRowSelect = mock();
	const onRowClick = mock();
	const action = mock();
	render(
		<DataTableCore
			{...defaults}
			columns={[
				{
					key: "name",
					header: "Name",
					render: (_, row) => <button onClick={action}>{row.name}</button>,
				},
			]}
			onRowSelect={onRowSelect}
			onRowClick={onRowClick}
			selection={{
				selectedIds: [],
				onSelectionChange: () => {},
				selectOnRowClick: true,
				isRowSelectable: (r) => r.id === "a",
				getRowCheckboxAriaLabel: (r) => `Select ${r.name}`,
			}}
		/>,
	);
	expect(
		(screen.getByRole("checkbox", { name: "Select Beta" }) as HTMLInputElement)
			.disabled,
	).toBe(true);
	fireEvent.click(screen.getByRole("button", { name: "Alpha" }));
	expect(action).toHaveBeenCalledTimes(1);
	expect(onRowSelect).not.toHaveBeenCalled();
	expect(onRowClick).not.toHaveBeenCalled();
	fireEvent.click(screen.getAllByRole("row")[1]);
	expect(onRowSelect).toHaveBeenCalledWith("a");
	expect(onRowClick).not.toHaveBeenCalled();
});
test("uncontrolled expansion connects toggle to expanded content", () => {
	render(
		<DataTableCore
			{...defaults}
			expandableRows={{
				renderExpandedContent: (r) => <div>Details {r.name}</div>,
			}}
		/>,
	);
	const toggle = screen.getByRole("button", { name: "Expand row a" });
	fireEvent.click(toggle);
	expect(screen.getByText("Details Alpha")).toBeTruthy();
	expect(toggle.getAttribute("aria-expanded")).toBe("true");
	expect(
		document.getElementById(toggle.getAttribute("aria-controls")!),
	).toBeTruthy();
});
test("controlled expansion reports action without overriding parent state", () => {
	const onToggle = mock();
	render(
		<DataTableCore
			{...defaults}
			expandableRows={{
				renderExpandedContent: () => "Details",
				expandedRowIds: new Set(),
				onToggleExpandedRowId: onToggle,
			}}
		/>,
	);
	fireEvent.click(screen.getByRole("button", { name: "Expand row a" }));
	expect(onToggle).toHaveBeenCalledWith("a");
	expect(screen.queryByText("Details")).toBeNull();
});
test("initial loading, empty, and refresh states are distinct", () => {
	const { rerender } = render(
		<DataTableCore
			{...defaults}
			data={[]}
			isTableLoading
			loadingRowCount={3}
		/>,
	);
	expect(
		screen.getByTestId("data-table-loading").getAttribute("aria-busy"),
	).toBe("true");
	expect(screen.queryByTestId("data-table-empty")).toBeNull();
	rerender(<DataTableCore {...defaults} data={[]} emptyState="Nothing here" />);
	expect(screen.getByText("Nothing here")).toBeTruthy();
	rerender(<DataTableCore {...defaults} isTableLoading />);
	expect(screen.getByText("Alpha")).toBeTruthy();
});
test("resize handle supports keyboard changes and does not trigger sorting", () => {
	const onSort = mock();
	const nudgeWidth = mock();
	const resetWidth = mock();
	const api: ColumnResizeApi = {
		widths: { name: 160, amount: 160, active: 160 },
		totalWidth: 480,
		isFixedLayout: true,
		resizingColumnKey: null,
		registerHeaderRef: () => () => {},
		startResize: () => {},
		updateResize: () => {},
		endResize: () => {},
		nudgeWidth,
		resetWidth,
	};
	render(<DataTableCore {...defaults} onSort={onSort} columnResize={api} />);
	const handle = screen.getByRole("separator", { name: "Resize Name column" });
	fireEvent.keyDown(handle, { key: "ArrowRight" });
	expect(nudgeWidth).toHaveBeenCalled();
	fireEvent.doubleClick(handle);
	expect(resetWidth).toHaveBeenCalledWith("name");
	expect(onSort).not.toHaveBeenCalled();
});
test("sorting is stable, handles derived values and puts empty values last in both directions", () => {
	const data = [
		{ id: "a", value: null },
		{ id: "b", value: 2 },
		{ id: "c", value: 1 },
		{ id: "d", value: 2 },
	];
	const column = {
		key: "derived",
		header: "Value",
		sortable: true,
		sortValue: (r: (typeof data)[number]) => r.value,
	};
	expect(
		sortRowsByColumn({ rows: data, column, order: "asc" }).map((r) => r.id),
	).toEqual(["c", "b", "d", "a"]);
	expect(
		sortRowsByColumn({ rows: data, column, order: "desc" }).map((r) => r.id),
	).toEqual(["b", "d", "c", "a"]);
	expect(data[0].id).toBe("a");
});
test("width parsing rejects corrupt values and safely handles arbitrary column keys", () => {
	expect(parsePersistedColumnWidths("not json")).toBeNull();
	const widths = parsePersistedColumnWidths('{"__proto__":150,"name":200}');
	expect(widths?.["__proto__"]).toBe(150);
});

test("resize begins even when pointer capture is unavailable", () => {
	const startResize = mock();
	const api: ColumnResizeApi = {
		widths: { name: 160, amount: 160, active: 160 },
		totalWidth: 480,
		isFixedLayout: true,
		resizingColumnKey: null,
		registerHeaderRef: () => () => {},
		startResize,
		updateResize: () => {},
		endResize: () => {},
		nudgeWidth: () => {},
		resetWidth: () => {},
		getColumnBounds: () => ({ min: 100, max: 800 }),
	};
	render(<DataTableCore {...defaults} columnResize={api} />);
	const handle = screen.getByRole("separator", { name: "Resize Name column" });
	handle.setPointerCapture = () => {
		throw new Error("No active pointer");
	};
	fireEvent.pointerDown(handle, { pointerId: 1, clientX: 120 });
	expect(startResize).toHaveBeenCalled();
	expect(handle.getAttribute("aria-valuemin")).toBe("100");
	expect(handle.getAttribute("aria-valuemax")).toBe("800");
});

test("lazy drag body renders accessible handles", async () => {
	render(
		<DataTableCore
			{...defaults}
			draggable={{
				enabled: true,
				onDragEnd: () => {},
				getRowDragHandleLabel: (row) => `Reorder ${row.name}`,
			}}
		/>,
	);
	expect(
		await screen.findByRole("button", { name: "Reorder Alpha" }),
	).toBeTruthy();
});
