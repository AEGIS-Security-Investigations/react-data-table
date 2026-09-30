import { TableCell } from "./ui/table.js";
import { cn } from "./cn.js";
import type { TableColumn } from "./types.js";
import { getNestedValue } from "./utils.js";

interface TableCellProps<T> {
	column: TableColumn<T>;
	row: T;
}

export const DataTableCell = <T,>({ column, row }: TableCellProps<T>) => {
	const value = getNestedValue(row, column.key as string);

	return (
		<TableCell
			className={cn("text-gray-600 dark:text-gray-300", column.className)}
			style={
				column.width
					? {
							width:
								typeof column.width === "number"
									? `${column.width}px`
									: column.width,
							minWidth:
								typeof column.width === "number"
									? `${column.width}px`
									: column.width,
							maxWidth:
								typeof column.width === "number"
									? `${column.width}px`
									: column.width,
						}
					: undefined
			}
		>
			{column.render ? column.render(value, row) : String(value ?? "")}
		</TableCell>
	);
};
