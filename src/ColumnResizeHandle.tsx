import { cn } from "./cn.js";
import type { ColumnResizeApi } from "./columnResizeTypes.js";
import {
	MAX_COLUMN_WIDTH_PX,
	MIN_COLUMN_WIDTH_PX,
} from "./columnWidthStorage.js";

const KEYBOARD_STEP_PX = 16;
const KEYBOARD_LARGE_STEP_PX = 48;

interface ColumnResizeHandleProps {
	columnKey: string;

	columnHeader: string;

	width: number | undefined;
	columnResize: ColumnResizeApi;
}

export const ColumnResizeHandle = ({
	columnKey,
	columnHeader,
	width,
	columnResize,
}: ColumnResizeHandleProps) => {
	const bounds = columnResize.getColumnBounds?.(columnKey);
	const isResizing = columnResize.resizingColumnKey === columnKey;

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const step = event.shiftKey ? KEYBOARD_LARGE_STEP_PX : KEYBOARD_STEP_PX;

		if (event.key === "ArrowLeft") {
			event.preventDefault();
			columnResize.nudgeWidth(columnKey, -step);
			return;
		}

		if (event.key === "ArrowRight") {
			event.preventDefault();
			columnResize.nudgeWidth(columnKey, step);
			return;
		}

		if (event.key === "Home") {
			event.preventDefault();
			columnResize.resetWidth(columnKey);
		}
	};

	return (
		<div
			role="separator"
			aria-orientation="vertical"
			aria-label={`Resize ${columnHeader} column`}
			aria-valuenow={width}
			aria-valuemin={bounds?.min ?? MIN_COLUMN_WIDTH_PX}
			aria-valuemax={bounds?.max ?? MAX_COLUMN_WIDTH_PX}
			tabIndex={0}
			data-testid={`datatable-column-resize-${columnKey}`}
			data-resizing={isResizing ? "true" : undefined}
			className="group/resize absolute inset-y-0 right-0 z-10 flex w-3 cursor-col-resize touch-none select-none items-center justify-center focus:outline-none"
			onPointerDown={(event) => {
				event.preventDefault();
				event.stopPropagation();
				columnResize.startResize(columnKey, event.clientX);
				try {
					event.currentTarget.setPointerCapture?.(event.pointerId);
				} catch {}
			}}
			onPointerMove={(event) => {
				event.stopPropagation();
				columnResize.updateResize(event.clientX);
			}}
			onPointerUp={(event) => {
				event.stopPropagation();
				event.currentTarget.releasePointerCapture?.(event.pointerId);
				columnResize.endResize();
			}}
			onPointerCancel={() => {
				columnResize.endResize();
			}}
			onClick={(event) => {
				event.stopPropagation();
			}}
			onDoubleClick={(event) => {
				event.stopPropagation();
				columnResize.resetWidth(columnKey);
			}}
			onKeyDown={handleKeyDown}
		>
			<span
				aria-hidden="true"
				className={cn(
					"h-1/2 w-px rounded-full bg-border transition-colors",
					"group-hover/resize:w-0.5 group-hover/resize:bg-primary",
					"group-focus/resize:w-0.5 group-focus/resize:bg-primary",
					isResizing && "w-0.5 bg-primary",
				)}
			/>
		</div>
	);
};
