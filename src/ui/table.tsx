"use client";

import type * as React from "react";

import { cn } from "../cn.js";

import { cossTableStyles } from "./cossTableStyles.js";
import { useCossTableAppearance } from "./tableAppearance.js";
import { TableScrollRegion } from "./table-scroll-region.js";

const Table = ({
	ref,
	className,
	scrollAreaLabel,
	...props
}: React.HTMLAttributes<HTMLTableElement> & {
	ref?: React.Ref<HTMLTableElement>;
	scrollAreaLabel?: string;
}) => {
	const coss = useCossTableAppearance();
	return (
		<TableScrollRegion
			label={scrollAreaLabel}
			data-slot={coss ? "table-container" : undefined}
		>
			<table
				ref={ref}
				className={cn("w-full caption-bottom text-sm", className)}
				data-slot={coss ? "table" : undefined}
				{...props}
			/>
		</TableScrollRegion>
	);
};
Table.displayName = "Table";

const TableHeader = ({
	ref,
	className,
	...props
}: React.HTMLAttributes<HTMLTableSectionElement> & {
	ref?: React.Ref<HTMLTableSectionElement>;
}) => {
	const coss = useCossTableAppearance();
	return (
		<thead
			ref={ref}
			className={cn("[&_tr]:border-b", className)}
			data-slot={coss ? "table-header" : undefined}
			{...props}
		/>
	);
};
TableHeader.displayName = "TableHeader";

const TableBody = ({
	ref,
	className,
	...props
}: React.HTMLAttributes<HTMLTableSectionElement> & {
	ref?: React.Ref<HTMLTableSectionElement>;
}) => {
	const coss = useCossTableAppearance();
	return (
		<tbody
			ref={ref}
			className={cn(
				coss && "relative",
				"[&_tr:last-child]:border-0",
				className,
			)}
			data-slot={coss ? "table-body" : undefined}
			{...props}
		/>
	);
};
TableBody.displayName = "TableBody";

const TableFooter = ({
	ref,
	className,
	...props
}: React.HTMLAttributes<HTMLTableSectionElement> & {
	ref?: React.Ref<HTMLTableSectionElement>;
}) => {
	const coss = useCossTableAppearance();
	return (
		<tfoot
			ref={ref}
			className={cn(
				coss
					? cossTableStyles.footer
					: "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
				className,
			)}
			data-slot={coss ? "table-footer" : undefined}
			{...props}
		/>
	);
};
TableFooter.displayName = "TableFooter";

const TableRow = ({
	ref,
	className,
	...props
}: React.HTMLAttributes<HTMLTableRowElement> & {
	ref?: React.Ref<HTMLTableRowElement>;
}) => {
	const coss = useCossTableAppearance();
	return (
		<tr
			ref={ref}
			className={cn(
				coss
					? cossTableStyles.row
					: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
				className,
			)}
			data-slot={coss ? "table-row" : undefined}
			{...props}
		/>
	);
};
TableRow.displayName = "TableRow";

const TableHead = ({
	ref,
	className,
	scope = "col",
	...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
	ref?: React.Ref<HTMLTableCellElement>;
}) => {
	const coss = useCossTableAppearance();
	return (
		<th
			ref={ref}
			scope={scope}
			className={cn(
				coss
					? cossTableStyles.head
					: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
				className,
			)}
			data-slot={coss ? "table-head" : undefined}
			{...props}
		/>
	);
};
TableHead.displayName = "TableHead";

const TableCell = ({
	ref,
	className,
	...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
	ref?: React.Ref<HTMLTableCellElement>;
}) => {
	const coss = useCossTableAppearance();
	return (
		<td
			ref={ref}
			className={cn(
				coss
					? cossTableStyles.cell
					: "p-4 align-middle [&:has([role=checkbox])]:pr-0",
				className,
			)}
			data-slot={coss ? "table-cell" : undefined}
			{...props}
		/>
	);
};
TableCell.displayName = "TableCell";

const TableCaption = ({
	ref,
	className,
	...props
}: React.HTMLAttributes<HTMLTableCaptionElement> & {
	ref?: React.Ref<HTMLTableCaptionElement>;
}) => {
	const coss = useCossTableAppearance();
	return (
		<caption
			ref={ref}
			className={cn("mt-4 text-sm text-muted-foreground", className)}
			data-slot={coss ? "table-caption" : undefined}
			{...props}
		/>
	);
};
TableCaption.displayName = "TableCaption";

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
