"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Fragment, type ReactNode } from "react";
import { TableBody } from "./ui/table.js";
import { cn } from "./cn.js";
import { getExpandedContentRowId, getRowId } from "./rowIds.js";
import { DataTableRowIdProvider } from "./rowPickerOpenState.js";
import { DataTableRow } from "./TableRow.js";
import type { DataTableProps, TableColumn } from "./types.js";

export type DataTableDraggableRowsProps<T> = {
	data: T[];
	columns: TableColumn<T>[];
	draggable: NonNullable<DataTableProps<T>["draggable"]>;
	selection?: DataTableProps<T>["selection"];
	expandableRows?: DataTableProps<T>["expandableRows"];
	expandedRowIds: Set<string>;
	onToggleRowExpansion: (rowId: string) => void;
	onRowSelect: (rowId: string) => void;
	tableInstanceId: string;
	isTableLoading: boolean;
	rowClassName?: (row: T) => string;
	getRowDataTestId?: (row: T) => string | undefined;
	onRowClick?: DataTableProps<T>["onRowClick"];
	onRowMouseEnter?: (row: T) => void;
	onRowMouseLeave?: () => void;
	renderExpandedContentRow: (
		row: T,
		expandedContentRowId: string,
		isExpanded: boolean,
		rowCanExpand: boolean,
	) => ReactNode;
};

export const DataTableDraggableRows = <T,>({
	data,
	columns,
	draggable,
	selection,
	expandableRows,
	expandedRowIds,
	onToggleRowExpansion,
	onRowSelect,
	tableInstanceId,
	isTableLoading,
	rowClassName,
	getRowDataTestId,
	onRowClick,
	onRowMouseEnter,
	onRowMouseLeave,
	renderExpandedContentRow,
}: DataTableDraggableRowsProps<T>) => {
	return (
		<DragDropContext onDragEnd={draggable.onDragEnd}>
			<Droppable droppableId="table-body" type="table-row">
				{(provided) => (
					<TableBody
						{...provided.droppableProps}
						ref={provided.innerRef}
						className={cn(
							"transition-opacity duration-200",
							isTableLoading && "opacity-50",
						)}
					>
						{data.map((row, index) => {
							const rowId = getRowId(row, index);
							const rowCanExpand = expandableRows
								? (expandableRows.isRowExpandable?.(row) ?? true)
								: false;
							const isRowExpanded = rowCanExpand && expandedRowIds.has(rowId);
							const expandedContentRowId = getExpandedContentRowId(
								tableInstanceId,
								rowId,
							);

							return (
								<Fragment key={rowId}>
									<DataTableRowIdProvider rowId={rowId}>
										<Draggable draggableId={rowId} index={index}>
											{(draggableProvided) => (
												<DataTableRow
													row={row}
													rowId={rowId}
													columns={columns}
													selection={selection}
													draggable={draggable}
													expandableRows={
														expandableRows
															? {
																	isRowExpandable: rowCanExpand,
																	isExpanded: isRowExpanded,
																	expandedContentId: expandedContentRowId,
																	onToggleExpand: () =>
																		onToggleRowExpansion(rowId),
																	toggleAriaLabel:
																		expandableRows.getToggleAriaLabel?.(
																			row,
																			isRowExpanded,
																		),
																	toggleDataTestId:
																		expandableRows.getToggleDataTestId?.(row),
																}
															: undefined
													}
													provided={draggableProvided}
													rowClassName={rowClassName}
													getRowDataTestId={getRowDataTestId}
													onRowClick={onRowClick}
													onRowMouseEnter={onRowMouseEnter}
													onRowMouseLeave={onRowMouseLeave}
													onRowSelect={onRowSelect}
												/>
											)}
										</Draggable>
										{renderExpandedContentRow(
											row,
											expandedContentRowId,
											isRowExpanded,
											rowCanExpand,
										)}
									</DataTableRowIdProvider>
								</Fragment>
							);
						})}
						{provided.placeholder}
					</TableBody>
				)}
			</Droppable>
		</DragDropContext>
	);
};
