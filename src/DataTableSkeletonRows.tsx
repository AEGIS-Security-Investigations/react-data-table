import { Skeleton } from "./ui/skeleton.js";
import { TableCell, TableRow } from "./ui/table.js";
import { cn } from "./cn.js";
import type { TableColumn } from "./types.js";

type DataTableSkeletonRowsProps<T> = {
	columns: TableColumn<T>[];
	rowCount: number;

	utilityColumnsCount: number;
};

const DEFAULT_SKELETON_WIDTHS = ["w-24", "w-32", "w-20", "w-28", "w-16"];

export const DataTableSkeletonRows = <T,>({
	columns,
	rowCount,
	utilityColumnsCount,
}: DataTableSkeletonRowsProps<T>) => {
	return (
		<>
			{Array.from({ length: rowCount }, (_, rowIndex) => (
				<TableRow key={`skeleton-row-${rowIndex}`} aria-hidden="true">
					{Array.from({ length: utilityColumnsCount }, (_, cellIndex) => (
						<TableCell key={`skeleton-util-${cellIndex}`} className="w-10">
							<Skeleton className="h-4 w-4" />
						</TableCell>
					))}
					{columns.map((column, columnIndex) => (
						<TableCell key={String(column.key)} className={column.className}>
							<Skeleton
								className={cn(
									"h-4",
									column.skeletonClassName ??
										DEFAULT_SKELETON_WIDTHS[
											columnIndex % DEFAULT_SKELETON_WIDTHS.length
										],
								)}
							/>
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
};
