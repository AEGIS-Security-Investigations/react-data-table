export const getColumnWidthStyle = (
	width: string | number | undefined,
): React.CSSProperties | undefined => {
	if (width === undefined) {
		return undefined;
	}

	const cssWidth = typeof width === "number" ? `${width}px` : width;

	return { width: cssWidth, minWidth: cssWidth, maxWidth: cssWidth };
};
