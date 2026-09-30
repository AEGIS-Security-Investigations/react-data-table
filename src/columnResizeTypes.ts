import type { PersistedColumnWidths } from "./columnWidthStorage.js";
export type ColumnResizeApi = {
	/** Host-defined bounds announced by resize controls. */
	getColumnBounds?: (columnKey: string) => { min: number; max: number };
	widths: PersistedColumnWidths;

	totalWidth: number | null;

	isFixedLayout: boolean;

	resizingColumnKey: string | null;

	registerHeaderRef: (
		columnKey: string,
	) => (element: HTMLTableCellElement | null) => void;

	startResize: (columnKey: string, clientX: number) => void;

	updateResize: (clientX: number) => void;

	endResize: () => void;

	nudgeWidth: (columnKey: string, deltaX: number) => void;

	resetWidth: (columnKey: string) => void;
};
