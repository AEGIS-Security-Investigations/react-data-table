const INTERACTIVE_SELECTOR = [
	"a[href]",
	"button",
	"input",
	"select",
	"textarea",
	"label",
	"summary",
	"audio[controls]",
	"video[controls]",
	"[contenteditable='true']",
	"[role='button']",
	"[role='checkbox']",
	"[role='combobox']",
	"[role='link']",
	"[role='menuitem']",
	"[role='option']",
	"[role='radio']",
	"[role='switch']",
	"[role='tab']",
].join(",");

export const isRowClickSelectTarget = (target: EventTarget | null): boolean => {
	if (!(target instanceof Element)) {
		return false;
	}

	if (target.closest(INTERACTIVE_SELECTOR)) {
		return false;
	}

	const selection =
		typeof window === "undefined" ? null : window.getSelection?.();
	if (selection && !selection.isCollapsed && selection.toString().length > 0) {
		return false;
	}

	return true;
};
