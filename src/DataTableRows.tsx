import { Fragment, lazy, Suspense, useEffect, useState } from "react";
import { TableBody, TableCell, TableRow } from "./ui/table.js";
import { cn } from "./cn.js";
import type { DataTableDraggableRowsProps } from "./DataTableDraggableRows.js";
import { DataTableSkeletonRows } from "./DataTableSkeletonRows.js";
import { getExpandedContentRowId, getRowId } from "./rowIds.js";
import { DataTableRowIdProvider } from "./rowPickerOpenState.js";
import { DataTableRow } from "./TableRow.js";
import type { DataTableProps, TableColumn } from "./types.js";

const DRAGGABLE_LOADING_COLUMNS: TableColumn<Record<string, never>>[] = [
	{ key: "primary", header: "" },
	{ key: "secondary", header: "" },
	{ key: "tertiary", header: "" },
];
const LazyDraggableRows = lazy(() =>
	import("./DataTableDraggableRows.js").then((m) => ({
		default: m.DataTableDraggableRows,
	})),
) as <T>(props: DataTableDraggableRowsProps<T>) => React.ReactElement;

// Match the original client-only drag body without depending on a framework.
const DataTableDraggableRows = <T,>(props: DataTableDraggableRowsProps<T>) => {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const fallback = (
		<TableBody aria-busy="true" data-testid="data-table-draggable-loading">
			<DataTableSkeletonRows
				columns={DRAGGABLE_LOADING_COLUMNS}
				rowCount={3}
				utilityColumnsCount={1}
			/>
		</TableBody>
	);
	return mounted ? (
		<Suspense fallback={fallback}>
			<LazyDraggableRows {...props} />
		</Suspense>
	) : (
		fallback
	);
};

type DataTableRowsProps<T> = {
	data: T[];
	columns: TableColumn<T>[];
	draggable?: DataTableProps<T>["draggable"];
	selection?: DataTableProps<T>["selection"];
	expandableRows?: DataTableProps<T>["expandableRows"];
	expandedRowIds: Set<string>;
	onToggleRowExpansion: (rowId: string) => void;
	onRowSelect: (rowId: string) => void;
	tableInstanceId: string;
	isTableLoading: boolean;
	loadingRowCount: number;
	emptyState?: DataTableProps<T>["emptyState"];
	rowClassName?: (row: T) => string;
	getRowDataTestId?: (row: T) => string | undefined;
	onRowClick?: DataTableProps<T>["onRowClick"];
	onRowMouseEnter?: (row: T) => void;
	onRowMouseLeave?: () => void;
};

export const DataTableRows = <T,>({
	data,
	columns,
	draggable,
	selection,
	expandableRows,
	expandedRowIds,
	onToggleRowExpansion,
	onRowSelect,
	tableInstanceId,
	isTableLoading,
	loadingRowCount,
	emptyState,
	rowClassName,
	getRowDataTestId,
	onRowClick,
	onRowMouseEnter,
	onRowMouseLeave,
}: DataTableRowsProps<T>) => {
	const utilityColumnsCount =
		(selection ? 1 : 0) +
		(draggable?.enabled ? 1 : 0) +
		(expandableRows ? 1 : 0);
	const expandedContentColSpan = columns.length + utilityColumnsCount;
	if (isTableLoading && data.length === 0) {
		return (
			<TableBody aria-busy="true" data-testid="data-table-loading">
				<DataTableSkeletonRows
					columns={columns}
					rowCount={loadingRowCount}
					utilityColumnsCount={utilityColumnsCount}
				/>
			</TableBody>
		);
	}
	if (data.length === 0) {
		return (
			<TableBody>
				<TableRow
					data-testid="data-table-empty"
					className="hover:bg-transparent"
				>
					<TableCell
						colSpan={expandedContentColSpan}
						className="h-24 text-center text-muted-foreground"
					>
						{emptyState ?? "No results found."}
					</TableCell>
				</TableRow>
			</TableBody>
		);
	}

	const renderExpandedContentRow = (
		row: T,
		expandedContentRowId: string,
		isExpanded: boolean,
		rowCanExpand: boolean,
	) => {
		if (!expandableRows || !rowCanExpand || !isExpanded) {
			return null;
		}

		return (
			<TableRow id={expandedContentRowId} className="hover:bg-transparent">
				<TableCell
					colSpan={expandedContentColSpan}
					className={cn("p-0", expandableRows.expandedRowClassName)}
				>
					{expandableRows.renderExpandedContent(row)}
				</TableCell>
			</TableRow>
		);
	};

	if (draggable?.enabled) {
		return (
			<Suspense
				fallback={
					<TableBody
						aria-busy="true"
						data-testid="data-table-draggable-loading"
					>
						<DataTableSkeletonRows
							columns={DRAGGABLE_LOADING_COLUMNS}
							rowCount={3}
							utilityColumnsCount={1}
						/>
					</TableBody>
				}
			>
				<DataTableDraggableRows
					data={data}
					columns={columns}
					draggable={draggable}
					selection={selection}
					expandableRows={expandableRows}
					expandedRowIds={expandedRowIds}
					onToggleRowExpansion={onToggleRowExpansion}
					onRowSelect={onRowSelect}
					tableInstanceId={tableInstanceId}
					isTableLoading={isTableLoading}
					rowClassName={rowClassName}
					getRowDataTestId={getRowDataTestId}
					onRowClick={onRowClick}
					onRowMouseEnter={onRowMouseEnter}
					onRowMouseLeave={onRowMouseLeave}
					renderExpandedContentRow={renderExpandedContentRow}
				/>
			</Suspense>
		);
	}

	return (
		<TableBody
			className={cn(
				"transition-opacity duration-200",
				isTableLoading && "opacity-50",
			)}
		>
			{data.map((row, index) => {
				const rowId = getRowId(row, index);
				const rowCanExpand = expandableRows
					? (expandableRows.isRowExpandable?.(row) ?? true)
					: false;
				const isRowExpanded = rowCanExpand && expandedRowIds.has(rowId);
				const expandedContentRowId = getExpandedContentRowId(
					tableInstanceId,
					rowId,
				);

				return (
					<Fragment key={rowId}>
						<DataTableRowIdProvider rowId={rowId}>
							<DataTableRow
								row={row}
								rowId={rowId}
								columns={columns}
								selection={selection}
								draggable={draggable}
								expandableRows={
									expandableRows
										? {
												isRowExpandable: rowCanExpand,
												isExpanded: isRowExpanded,
												expandedContentId: expandedContentRowId,
												onToggleExpand: () => onToggleRowExpansion(rowId),
												toggleAriaLabel: expandableRows.getToggleAriaLabel?.(
													row,
													isRowExpanded,
												),
												toggleDataTestId:
													expandableRows.getToggleDataTestId?.(row),
											}
										: undefined
								}
								rowClassName={rowClassName}
								getRowDataTestId={getRowDataTestId}
								onRowClick={onRowClick}
								onRowMouseEnter={onRowMouseEnter}
								onRowMouseLeave={onRowMouseLeave}
								onRowSelect={onRowSelect}
							/>
							{renderExpandedContentRow(
								row,
								expandedContentRowId,
								isRowExpanded,
								rowCanExpand,
							)}
						</DataTableRowIdProvider>
					</Fragment>
				);
			})}
		</TableBody>
	);
};
