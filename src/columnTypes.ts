export type NestedKeyOf<T> = T extends object
	? {
			[K in keyof T]: K extends string
				? T[K] extends object
					? K | `${K}.${NestedKeyOf<T[K]>}`
					: K
				: never;
		}[keyof T]
	: never;

export type ExportCellValue = string | number | boolean | null | undefined;

export type SortCellValue = string | number | boolean | null | undefined;

export interface TableColumn<T> {
	key: NestedKeyOf<T> | string;
	header: string;

	headerTooltip?: string;
	/** Dynamic nested cell values preserve the host column renderer contract. */
	render?: (value: any, row: T) => React.ReactNode;
	sortable?: boolean;

	sortValue?: (row: T) => SortCellValue;
	width?: string | number;

	resizable?: boolean;
	className?: string;
	/** Additional header-only classes (for sticky headers or theme overrides). */
	headerClassName?: string;
	/** Accessible sort-button name; defaults to the visible header. */
	sortAriaLabel?: string;

	skeletonClassName?: string;
	/** Metadata consumed by host exporters; this package never exports data. */
	exportValue?: (value: any, row: T) => ExportCellValue;

	excludeFromExport?: boolean;
}
