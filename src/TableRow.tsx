import type { DraggableProvided } from "@hello-pangea/dnd";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TableCell, TableRow as UITableRow } from "./ui/table.js";
import { cn } from "./cn.js";
import { isRowClickSelectTarget } from "./isRowClickSelectTarget.js";
import { DataTableCell } from "./TableCell.js";
import type { DataTableProps, TableColumn } from "./types.js";

interface TableRowProps<T> {
	row: T;
	rowId: string;
	columns: TableColumn<T>[];
	selection?: DataTableProps<T>["selection"];
	draggable?: DataTableProps<T>["draggable"];
	expandableRows?: {
		isRowExpandable: boolean;
		isExpanded: boolean;
		expandedContentId: string;
		onToggleExpand: () => void;
		toggleAriaLabel?: string;
		toggleDataTestId?: string;
	};
	provided?: DraggableProvided;
	rowClassName?: (row: T) => string;
	getRowDataTestId?: (row: T) => string | undefined;
	onRowClick?: DataTableProps<T>["onRowClick"];
	onRowMouseEnter?: (row: T) => void;
	onRowMouseLeave?: () => void;
	onRowSelect: (rowId: string) => void;
}

export const DataTableRow = <T,>({
	row,
	rowId,
	columns,
	selection,
	draggable,
	expandableRows,
	provided,
	rowClassName,
	getRowDataTestId,
	onRowClick,
	onRowMouseEnter,
	onRowMouseLeave,
	onRowSelect,
}: TableRowProps<T>) => {
	const rowSelectable =
		!selection?.isRowSelectable || selection.isRowSelectable(row as T);
	const clickTogglesSelection = Boolean(
		selection?.selectOnRowClick && rowSelectable,
	);
	const clickOpensRow = Boolean(onRowClick) && !clickTogglesSelection;

	const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
		if (!isRowClickSelectTarget(event.target)) {
			return;
		}
		if (clickTogglesSelection) {
			onRowSelect((row as { id: string }).id);
			return;
		}
		onRowClick?.(row);
	};

	return (
		<UITableRow
			ref={provided?.innerRef}
			{...provided?.draggableProps}
			data-testid={getRowDataTestId?.(row as T)}
			className={cn(
				(clickTogglesSelection || clickOpensRow) && "cursor-pointer",
				rowClassName?.(row),
			)}
			onClick={
				clickTogglesSelection || clickOpensRow ? handleRowClick : undefined
			}
			onMouseEnter={() => {
				onRowMouseEnter?.(row);
			}}
			onMouseLeave={() => {
				onRowMouseLeave?.();
			}}
		>
			{selection && (
				<TableCell className="w-10">
					<input
						type="checkbox"
						aria-label={selection.getRowCheckboxAriaLabel?.(row as T)}
						data-testid={selection.getRowCheckboxTestId?.(row as T)}
						checked={
							rowSelectable &&
							selection.selectedIds.includes((row as { id: string }).id)
						}
						disabled={!rowSelectable}
						onChange={() => onRowSelect((row as { id: string }).id)}
						className={
							rowSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
						}
					/>
				</TableCell>
			)}
			{draggable?.enabled && (
				<TableCell className="w-11">
					{}
					<div
						{...(draggable?.enabled ? provided?.dragHandleProps : {})}
						aria-label={
							draggable.getRowDragHandleLabel?.(row as T) ?? "Reorder row"
						}
						className={cn(
							"flex min-h-11 min-w-11 items-center justify-center text-muted-foreground hover:text-foreground",
							draggable?.dragHandleClassName,
						)}
					>
						<DragHandleDots2Icon className="h-4 w-4" aria-hidden />
					</div>
				</TableCell>
			)}
			{expandableRows && (
				<TableCell className="w-10">
					{expandableRows.isRowExpandable && (
						<button
							type="button"
							data-testid={expandableRows.toggleDataTestId}
							aria-expanded={expandableRows.isExpanded}
							aria-controls={expandableRows.expandedContentId}
							onClick={expandableRows.onToggleExpand}
							className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
						>
							<span className="sr-only">
								{expandableRows.toggleAriaLabel ??
									(expandableRows.isExpanded
										? `Collapse row ${rowId}`
										: `Expand row ${rowId}`)}
							</span>
							{expandableRows.isExpanded ? (
								<ChevronDown className="h-4 w-4" aria-hidden="true" />
							) : (
								<ChevronRight className="h-4 w-4" aria-hidden="true" />
							)}
						</button>
					)}
				</TableCell>
			)}
			{columns.map((column) => (
				<DataTableCell key={String(column.key)} column={column} row={row} />
			))}
		</UITableRow>
	);
};
