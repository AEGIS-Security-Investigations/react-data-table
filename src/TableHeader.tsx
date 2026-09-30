import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import {
	TableHead,
	TableRow,
	TableHeader as UITableHeader,
} from "./ui/table.js";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip.js";
import { SortOrder } from "./sortOrder.js";
import { cn } from "./cn.js";
import { ColumnResizeHandle } from "./ColumnResizeHandle.js";
import type { ColumnResizeApi } from "./columnResizeTypes.js";
import {
	readColumnWidth,
	UTILITY_COLUMN_WIDTH_PX,
} from "./columnWidthStorage.js";
import { getColumnWidthStyle } from "./getColumnWidthStyle.js";
import {
	getTableHeaderFlexClassName,
	isTableColumnRightAligned,
} from "./getTableHeaderFlexClassName.js";
import type { DataTableProps, TableColumn } from "./types.js";

const headerAriaSort = <T,>(
	column: TableColumn<T>,
	sort: DataTableProps<T>["sort"],
): "ascending" | "descending" | "none" | undefined => {
	if (!column.sortable) return undefined;
	if (sort?.field !== column.key) return "none";
	return sort.order === SortOrder.Desc ? "descending" : "ascending";
};

interface TableHeaderProps<T> {
	columns: TableColumn<T>[];
	sort?: DataTableProps<T>["sort"];
	selection?: DataTableProps<T>["selection"];
	draggable?: DataTableProps<T>["draggable"];
	expandableRows?: DataTableProps<T>["expandableRows"];
	allSelected: boolean;
	headerCheckboxDisabled?: boolean;

	columnResize?: ColumnResizeApi | null;
	onSort: (column: TableColumn<T>) => void;
	onSelectAll: () => void;
}

export const DataTableHeader = <T,>({
	columns,
	sort,
	selection,
	draggable,
	expandableRows,
	allSelected,
	headerCheckboxDisabled = false,
	columnResize,
	onSort,
	onSelectAll,
}: TableHeaderProps<T>) => {
	const hasAnyTooltip = columns.some((c) => c.headerTooltip);
	const utilityColumnStyle = columnResize
		? getColumnWidthStyle(UTILITY_COLUMN_WIDTH_PX)
		: undefined;
	const headerCells = (
		<>
			{selection && (
				<TableHead className="w-10" style={utilityColumnStyle}>
					<input
						type="checkbox"
						aria-label={selection.selectAllAriaLabel}
						data-testid={selection.selectAllTestId}
						checked={allSelected}
						disabled={headerCheckboxDisabled}
						onChange={onSelectAll}
						className={
							headerCheckboxDisabled
								? "cursor-not-allowed opacity-50"
								: "cursor-pointer"
						}
					/>
				</TableHead>
			)}
			{draggable?.enabled && (
				<TableHead className="w-10" style={utilityColumnStyle}>
					<span className="sr-only">Reorder rows</span>
				</TableHead>
			)}
			{expandableRows && (
				<TableHead className="w-10" style={utilityColumnStyle} />
			)}
			{columns.map((column) => {
				const columnKey = String(column.key);
				const isRightAligned = isTableColumnRightAligned(column.className);
				const isResizable =
					Boolean(columnResize?.isFixedLayout) && column.resizable !== false;
				const currentWidth = columnResize
					? readColumnWidth(columnResize.widths, columnKey)
					: undefined;
				const pinnedWidth = columnResize?.isFixedLayout
					? currentWidth
					: undefined;
				const styleWidth = pinnedWidth ?? column.width;
				const sortIcon = column.sortable ? (
					<span className="inline-block h-4 w-4 flex-shrink-0">
						{sort?.field === column.key ? (
							sort.order === SortOrder.Asc ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)
						) : (
							<span className="h-4 w-4" />
						)}
					</span>
				) : null;

				const headerLabel = columnResize ? (
					<span className="truncate">{column.header}</span>
				) : (
					column.header
				);
				const headerContent = column.sortable ? (
					<button
						type="button"
						aria-label={column.sortAriaLabel}
						className="inline-flex min-w-0 items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					>
						{isRightAligned ? sortIcon : null}
						{headerLabel}
						{isRightAligned ? null : sortIcon}
					</button>
				) : (
					headerLabel
				);

				return (
					<TableHead
						key={columnKey}
						ref={columnResize?.registerHeaderRef(columnKey)}
						aria-label={columnResize ? column.header : undefined}
						aria-sort={headerAriaSort(column, sort)}
						className={cn(
							"text-gray-900 dark:text-white",
							column.sortable && "cursor-pointer",
							columnResize && "relative",
							column.className,
							column.headerClassName,
						)}
						style={getColumnWidthStyle(styleWidth)}
						onClick={column.sortable ? () => onSort(column) : undefined}
					>
						<div
							className={cn(
								getTableHeaderFlexClassName(column.className),
								columnResize && "min-w-0",
							)}
						>
							{headerContent}
							{column.headerTooltip && (
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											type="button"
											onClick={(e) => e.stopPropagation()}
											className="inline-flex shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
											aria-label="More information"
										>
											<HelpCircle className="h-3.5 w-3.5" />
										</button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{column.headerTooltip}
									</TooltipContent>
								</Tooltip>
							)}
						</div>
						{isResizable && columnResize && (
							<ColumnResizeHandle
								columnKey={columnKey}
								columnHeader={column.header}
								width={currentWidth}
								columnResize={columnResize}
							/>
						)}
					</TableHead>
				);
			})}
		</>
	);

	return (
		<UITableHeader>
			<TableRow className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
				{hasAnyTooltip ? (
					<TooltipProvider>{headerCells}</TooltipProvider>
				) : (
					headerCells
				)}
			</TableRow>
		</UITableHeader>
	);
};
