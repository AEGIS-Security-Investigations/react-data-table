export const COLUMN_WIDTH_STORAGE_KEY_PREFIX = "datatable-column-widths:v1";

export const MIN_COLUMN_WIDTH_PX = 64;

export const MAX_COLUMN_WIDTH_PX = 960;

export const DEFAULT_COLUMN_WIDTH_PX = 160;

export const UTILITY_COLUMN_WIDTH_PX = 64;

export type PersistedColumnWidths = Record<string, number>;

export const createColumnWidths = (): PersistedColumnWidths =>
	Object.create(null) as PersistedColumnWidths;

export const buildColumnWidthStorageKey = (tableId: string): string =>
	`${COLUMN_WIDTH_STORAGE_KEY_PREFIX}:${tableId}`;

export const clampColumnWidth = (width: number): number => {
	if (!Number.isFinite(width)) {
		return MIN_COLUMN_WIDTH_PX;
	}

	return Math.min(
		MAX_COLUMN_WIDTH_PX,
		Math.max(MIN_COLUMN_WIDTH_PX, Math.round(width)),
	);
};

export const clampColumnWidthAround = (
	width: number,
	baselineWidth: number,
): number => {
	if (!(Number.isFinite(baselineWidth) && Number.isFinite(width))) {
		return clampColumnWidth(width);
	}

	const baseline = Math.round(baselineWidth);

	return Math.min(
		Math.max(MAX_COLUMN_WIDTH_PX, baseline),
		Math.max(Math.min(MIN_COLUMN_WIDTH_PX, baseline), Math.round(width)),
	);
};

export const resizeColumnWidth = (startWidth: number, deltaX: number): number =>
	clampColumnWidthAround(startWidth + deltaX, startWidth);

export const parsePersistedColumnWidths = (
	rawValue: string | null,
): PersistedColumnWidths | null => {
	if (rawValue === null) {
		return null;
	}

	let parsed: unknown;

	try {
		parsed = JSON.parse(rawValue);
	} catch {
		return null;
	}

	if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
		return null;
	}

	const widths = createColumnWidths();

	for (const [columnKey, width] of Object.entries(parsed)) {
		if (typeof width !== "number" || !Number.isFinite(width) || width <= 0) {
			continue;
		}

		widths[columnKey] = Math.round(width);
	}

	return widths;
};

export const readColumnWidth = (
	widths: PersistedColumnWidths,
	columnKey: string,
): number | undefined => {
	if (!Object.hasOwn(widths, columnKey)) {
		return undefined;
	}

	const width = widths[columnKey];

	return typeof width === "number" && Number.isFinite(width)
		? width
		: undefined;
};
