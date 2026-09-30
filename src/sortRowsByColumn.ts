import { SortOrder } from "./sortOrder.js";
import type { SortCellValue, TableColumn } from "./types.js";
import { getNestedValue } from "./utils.js";

type ComparableSortValue = string | number;

const readSortValue = <T>(
	row: T,
	column: TableColumn<T>,
): SortCellValue | ComparableSortValue => {
	const value = column.sortValue
		? column.sortValue(row)
		: getNestedValue(row, String(column.key));

	if (typeof value === "boolean") return value ? 1 : 0;
	if (typeof value === "string" || typeof value === "number") return value;
	return null;
};

const isEmptySortValue = (value: SortCellValue): boolean =>
	value === null || value === undefined || value === "";

const compareSortValues = (
	left: ComparableSortValue,
	right: ComparableSortValue,
): number => {
	if (typeof left === "number" && typeof right === "number") {
		return left - right;
	}
	return String(left).localeCompare(String(right), undefined, {
		sensitivity: "accent",
	});
};

interface SortRowsByColumnParams<T> {
	rows: T[];

	column: TableColumn<T> | undefined;
	order: SortOrder | null;
}

export const sortRowsByColumn = <T>({
	rows,
	column,
	order,
}: SortRowsByColumnParams<T>): T[] => {
	if (!column?.sortable || !order) {
		return rows;
	}

	const direction = order === SortOrder.Desc ? -1 : 1;

	return [...rows].sort((leftRow, rightRow) => {
		const left = readSortValue(leftRow, column);
		const right = readSortValue(rightRow, column);

		const leftEmpty = isEmptySortValue(left);
		const rightEmpty = isEmptySortValue(right);
		if (leftEmpty || rightEmpty) {
			if (leftEmpty && rightEmpty) return 0;
			return leftEmpty ? 1 : -1;
		}

		return (
			direction *
			compareSortValues(
				left as ComparableSortValue,
				right as ComparableSortValue,
			)
		);
	});
};
