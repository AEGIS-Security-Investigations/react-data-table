import { afterEach, expect, mock, test } from "bun:test";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import {
	DataTableCore,
	type DataTableAppearance,
	type DataTableCoreProps,
} from "../src/index";
import { DataTableHeader } from "../src/compat";

afterEach(cleanup);
type Row = { id: string; name: string };
const rows: Row[] = [
	{ id: "a", name: "Alpha" },
	{ id: "b", name: "Beta" },
];
const defaults: DataTableCoreProps<Row> = {
	data: rows,
	columns: [{ key: "name", header: "Name", sortable: true }],
	onSort: () => {},
	onSelectAll: () => {},
	onRowSelect: () => {},
};

test("default, coss, and direct compat rendering can coexist without styling leakage", () => {
	const tell = () => {};
	render(
		<>
			<DataTableCore {...defaults} scrollAreaLabel="Default records" />
			<DataTableCore
				{...defaults}
				appearance="coss"
				scrollAreaLabel="Coss records"
			/>
			<table aria-label="Compat records">
				<DataTableHeader
					columns={defaults.columns}
					allSelected={false}
					onSort={tell}
					onSelectAll={tell}
				/>
			</table>
		</>,
	);
	const original = within(
		screen.getByRole("region", { name: "Default records" }),
	);
	const coss = within(screen.getByRole("region", { name: "Coss records" }));
	const compat = within(screen.getByRole("table", { name: "Compat records" }));
	expect(original.getByRole("table").getAttribute("data-slot")).toBeNull();
	expect(original.getByRole("columnheader").classList.contains("h-12")).toBe(
		true,
	);
	expect(
		original.getByRole("cell", { name: "Alpha" }).classList.contains("p-4"),
	).toBe(true);
	expect(coss.getByRole("table").getAttribute("data-slot")).toBe("table");
	expect(coss.getByRole("columnheader").getAttribute("scope")).toBe("col");
	expect(coss.getByRole("columnheader").classList.contains("h-10")).toBe(true);
	expect(
		coss.getByRole("cell", { name: "Alpha" }).classList.contains("p-2.5"),
	).toBe(true);
	expect(compat.getByRole("columnheader").classList.contains("h-12")).toBe(
		true,
	);
});

test("coss controlled select-all and row selection remain accessible and do not double-toggle", () => {
	const onSelectAll = mock();
	const onRowSelect = mock();
	render(
		<DataTableCore
			{...defaults}
			appearance="coss"
			hasSelectableRows
			allSelected
			onSelectAll={onSelectAll}
			onRowSelect={onRowSelect}
			selection={{
				selectedIds: ["a"],
				selectOnRowClick: true,
				onSelectionChange: () => {},
				selectAllAriaLabel: "Select all records",
				isRowSelectable: (row) => row.id === "a",
				getRowCheckboxAriaLabel: (row) => `Select ${row.name}`,
			}}
		/>,
	);
	const selectAll = screen.getByRole("checkbox", {
		name: "Select all records",
	});
	const selected = screen.getByRole("checkbox", { name: "Select Alpha" });
	const disabled = screen.getByRole("checkbox", { name: "Select Beta" });
	expect(selected.getAttribute("data-slot")).toBe("checkbox");
	expect(selected.getAttribute("aria-checked")).toBe("true");
	expect(selected.closest("tr")?.getAttribute("data-state")).toBe("selected");
	expect(disabled.getAttribute("aria-disabled")).toBe("true");
	fireEvent.click(selectAll);
	fireEvent.click(selected);
	fireEvent.click(disabled);
	expect(onSelectAll).toHaveBeenCalledTimes(1);
	expect(onRowSelect.mock.calls).toEqual([["a"]]);
	// Selection is controlled by the caller, not the skin.
	expect(selected.getAttribute("aria-checked")).toBe("true");
});

test("switching appearances keeps expanded content and controlled sorting", () => {
	const onSort = mock();
	const sample = (appearance: DataTableAppearance) => (
		<DataTableCore
			{...defaults}
			appearance={appearance}
			sort={{ field: "name", order: "asc" }}
			onSort={onSort}
			expandableRows={{ renderExpandedContent: (row) => `Details ${row.name}` }}
		/>
	);
	const { rerender } = render(sample("coss"));
	fireEvent.click(screen.getByRole("button", { name: "Expand row a" }));
	rerender(sample("default"));
	expect(screen.getByText("Details Alpha")).toBeTruthy();
	fireEvent.click(screen.getByRole("button", { name: "Name" }));
	expect(onSort).toHaveBeenCalledWith(defaults.columns[0]);
	expect(
		screen
			.getByRole("columnheader", { name: "Name" })
			.getAttribute("aria-sort"),
	).toBe("ascending");
});

test("coss applies to skeletons, the footer, and lazily rendered draggable rows", async () => {
	const { rerender } = render(
		<DataTableCore
			{...defaults}
			appearance="coss"
			data={[]}
			isTableLoading
			loadingRowCount={2}
		/>,
	);
	const loading = screen.getByTestId("data-table-loading");
	expect(loading.getAttribute("aria-busy")).toBe("true");
	expect(loading.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(2);
	rerender(
		<DataTableCore
			{...defaults}
			appearance="coss"
			draggable={{
				enabled: true,
				onDragEnd: () => {},
				getRowDragHandleLabel: (row) => `Reorder ${row.name}`,
			}}
			footer={{ cells: [{ key: "total", content: "Total" }] }}
		/>,
	);
	const handle = await screen.findByRole("button", { name: "Reorder Alpha" });
	expect(handle.closest("tr")?.getAttribute("data-slot")).toBe("table-row");
	expect(
		screen.getByText("Total").closest("tfoot")?.getAttribute("data-slot"),
	).toBe("table-footer");
});
