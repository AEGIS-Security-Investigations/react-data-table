export type DataTableSelectionOptions<T> = {
	selectedIds: string[];
	onSelectionChange: (selectedIds: string[]) => void;

	isRowSelectable?: (row: T) => boolean;

	selectOnRowClick?: boolean;

	selectAllAriaLabel?: string;

	selectAllTestId?: string;

	getRowCheckboxAriaLabel?: (row: T) => string;

	getRowCheckboxTestId?: (row: T) => string | undefined;
};
