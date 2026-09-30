export const HORIZONTAL_OVERFLOW_TOLERANCE_PX = 1;

export interface HorizontalOverflowBox {
	scrollWidth: number;
	clientWidth: number;
}

export const isHorizontallyScrollable = (
	box: HorizontalOverflowBox | null | undefined,
): boolean =>
	box
		? box.scrollWidth - box.clientWidth > HORIZONTAL_OVERFLOW_TOLERANCE_PX
		: false;

export interface TableScrollRegionAttributes {
	role?: "region";
	"aria-label"?: string;
	tabIndex?: number;
}

export const resolveTableScrollRegionAttributes = ({
	label,
	isScrollable,
}: {
	label?: string;
	isScrollable: boolean;
}): TableScrollRegionAttributes => {
	if (label) {
		return { role: "region", "aria-label": label, tabIndex: 0 };
	}

	return isScrollable ? { tabIndex: 0 } : {};
};
