"use client";
import { useId, useState } from "react";
import { Table, TableCell, TableFooter, TableRow } from "./ui/table.js";
import { cn } from "./cn.js";
import type { ColumnResizeApi } from "./columnResizeTypes.js";
import { DataTableRows } from "./DataTableRows.js";
import { RowPickerOpenStateProvider } from "./rowPickerOpenState.js";
import { stripImportantWidthClasses } from "./stripImportantWidthClasses.js";
import { DataTableHeader } from "./TableHeader.js";
import type { DataTableProps, TableColumn } from "./types.js";

export type DataTableTableContentProps<T> = {
	columns: TableColumn<T>[];
	data: DataTableProps<T>["data"];
	sort?: DataTableProps<T>["sort"];
	selection?: DataTableProps<T>["selection"];
	draggable?: DataTableProps<T>["draggable"];
	expandableRows?: DataTableProps<T>["expandableRows"];
	tableClassName?: DataTableProps<T>["tableClassName"];
	scrollAreaLabel?: DataTableProps<T>["scrollAreaLabel"];
	rowClassName?: DataTableProps<T>["rowClassName"];
	getRowDataTestId?: DataTableProps<T>["getRowDataTestId"];
	onRowClick?: DataTableProps<T>["onRowClick"];
	onRowMouseEnter?: DataTableProps<T>["onRowMouseEnter"];
	onRowMouseLeave?: DataTableProps<T>["onRowMouseLeave"];
	footer?: DataTableProps<T>["footer"];
	columnResize?: ColumnResizeApi | null;
	isTableLoading?: boolean;
	loadingRowCount?: number;
	emptyState?: DataTableProps<T>["emptyState"];
	allSelected?: boolean;
	hasSelectableRows?: boolean;
	onSort: (column: TableColumn<T>) => void;
	onSelectAll: () => void;
	onRowSelect: (rowId: string) => void;
};

export const DataTableTableContent = <T,>({
	columns,
	data,
	sort,
	selection,
	draggable,
	expandableRows,
	tableClassName,
	scrollAreaLabel,
	rowClassName,
	getRowDataTestId,
	onRowClick,
	onRowMouseEnter,
	onRowMouseLeave,
	footer,
	columnResize,
	isTableLoading = false,
	loadingRowCount = 8,
	emptyState,
	allSelected = false,
	hasSelectableRows = false,
	onSort,
	onSelectAll,
	onRowSelect,
}: DataTableTableContentProps<T>) => {
	const [uncontrolledExpandedRowIds, setUncontrolledExpandedRowIds] = useState<
		Set<string>
	>(() => new Set());
	const tableInstanceId = useId();

	const controlledExpandedRowIds =
		expandableRows?.onToggleExpandedRowId &&
		expandableRows.expandedRowIds !== undefined
			? expandableRows.expandedRowIds
			: undefined;
	const isExpandControlled = controlledExpandedRowIds !== undefined;
	const expandedRowIds = controlledExpandedRowIds ?? uncontrolledExpandedRowIds;

	const toggleRowExpansion = (rowId: string) => {
		if (expandableRows?.onToggleExpandedRowId && isExpandControlled) {
			expandableRows.onToggleExpandedRowId(rowId);
			return;
		}

		setUncontrolledExpandedRowIds((prev) => {
			const next = new Set(prev);
			if (next.has(rowId)) {
				next.delete(rowId);
			} else {
				next.add(rowId);
			}
			return next;
		});
	};
	const resizeTableStyle =
		columnResize?.isFixedLayout && columnResize.totalWidth !== null
			? {
					tableLayout: "fixed" as const,
					width: `${columnResize.totalWidth}px`,
					minWidth: `${columnResize.totalWidth}px`,
				}
			: undefined;
	const resolvedTableClassName = resizeTableStyle
		? stripImportantWidthClasses(tableClassName)
		: tableClassName;

	return (
		<RowPickerOpenStateProvider>
			<Table
				className={cn(
					resolvedTableClassName,
					columnResize && "[&_td]:overflow-hidden [&_th]:overflow-hidden",
					columnResize?.resizingColumnKey && "select-none",
				)}
				style={resizeTableStyle}
				scrollAreaLabel={scrollAreaLabel}
			>
				<DataTableHeader
					columns={columns}
					sort={sort}
					selection={selection}
					draggable={draggable}
					expandableRows={expandableRows}
					allSelected={allSelected}
					headerCheckboxDisabled={selection ? !hasSelectableRows : false}
					columnResize={columnResize}
					onSort={onSort}
					onSelectAll={onSelectAll}
				/>
				<DataTableRows
					data={data}
					columns={columns}
					draggable={draggable}
					selection={selection}
					expandableRows={expandableRows}
					expandedRowIds={expandedRowIds}
					onToggleRowExpansion={toggleRowExpansion}
					onRowSelect={onRowSelect}
					tableInstanceId={tableInstanceId}
					isTableLoading={isTableLoading}
					loadingRowCount={loadingRowCount}
					emptyState={emptyState}
					rowClassName={rowClassName}
					getRowDataTestId={getRowDataTestId}
					onRowClick={onRowClick}
					onRowMouseEnter={onRowMouseEnter}
					onRowMouseLeave={onRowMouseLeave}
				/>
				{footer && footer.cells.length > 0 && (
					<TableFooter className={footer.className}>
						<TableRow>
							{footer.cells.map((cell) => (
								<TableCell key={cell.key} className={cell.className}>
									{cell.content}
								</TableCell>
							))}
						</TableRow>
					</TableFooter>
				)}
			</Table>
		</RowPickerOpenStateProvider>
	);
};
