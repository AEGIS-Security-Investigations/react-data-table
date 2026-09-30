export const getRowId = <T>(row: T, index: number): string =>
	(row as { id?: string }).id || `row-${index}`;

export const getExpandedContentRowId = (
	tableInstanceId: string,
	rowId: string,
) =>
	`${tableInstanceId}-expanded-content-${rowId}`.replace(
		/[^a-zA-Z0-9_-]/g,
		"-",
	);
