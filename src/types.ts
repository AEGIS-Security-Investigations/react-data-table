import type * as React from "react";
import type { DropResult } from "@hello-pangea/dnd";
import type { TableColumn } from "./columnTypes.js";
import type { DataTableSelectionOptions } from "./selectionTypes.js";
export type {
	TableColumn,
	SortCellValue,
	ExportCellValue,
	NestedKeyOf,
} from "./columnTypes.js";
export type { DataTableSelectionOptions } from "./selectionTypes.js";
export type ExpandableRowsOptions<T> = {
	renderExpandedContent: (row: T) => React.ReactNode;

	isRowExpandable?: (row: T) => boolean;

	expandedRowClassName?: string;

	getToggleAriaLabel?: (row: T, isExpanded: boolean) => string;

	getToggleDataTestId?: (row: T) => string | undefined;

	expandedRowIds?: Set<string>;
	onToggleExpandedRowId?: (rowId: string) => void;
};

export interface DataTableProps<T> {
	columns: TableColumn<T>[];
	data: T[];
	sort?: { field: string | null; order: "asc" | "desc" | null };
	selection?: DataTableSelectionOptions<T>;
	draggable?: {
		enabled: boolean;
		onDragEnd: (result: DropResult) => void;
		dragHandleClassName?: string;
		getRowDragHandleLabel?: (row: T) => string;
	};
	expandableRows?: ExpandableRowsOptions<T>;
	tableClassName?: string;
	scrollAreaLabel?: string;
	rowClassName?: (row: T) => string;
	getRowDataTestId?: (row: T) => string | undefined;
	onRowClick?: (row: T) => void;
	onRowMouseEnter?: (row: T) => void;
	onRowMouseLeave?: () => void;
	footer?: {
		cells: { key: string; content: React.ReactNode; className?: string }[];
		className?: string;
	};
	emptyState?: React.ReactNode;
}
