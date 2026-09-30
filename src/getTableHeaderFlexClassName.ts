import { cn } from "./cn.js";

export const isTableColumnRightAligned = (columnClassName?: string): boolean =>
	(columnClassName?.split(/\s+/) ?? []).includes("text-right");

export const getTableHeaderFlexClassName = (columnClassName?: string) => {
	const classes = columnClassName?.split(/\s+/) ?? [];

	return cn(
		"flex items-center gap-1",
		classes.includes("text-right") && "justify-end",
		classes.includes("text-center") && "justify-center",
	);
};
