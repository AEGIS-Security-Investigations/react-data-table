"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { HelpCircle } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

export const CossTableTooltipProvider = Tooltip.Provider;

export function CossTableTooltip({ children }: { children: ReactNode }) {
	const tooltipId = useId();
	const [open, setOpen] = useState(false);
	return (
		<Tooltip.Root onOpenChange={setOpen}>
			<Tooltip.Trigger
				data-slot="tooltip-trigger"
				type="button"
				onClick={(event) => event.stopPropagation()}
				className="inline-flex shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
				aria-label="More information"
				aria-describedby={open ? tooltipId : undefined}
			>
				<HelpCircle className="h-3.5 w-3.5" />
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Positioner side="top" sideOffset={4} className="z-50">
					<Tooltip.Popup
						data-slot="tooltip-popup"
						id={tooltipId}
						role="tooltip"
						className="max-w-[var(--available-width)] origin-[var(--transform-origin)] rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none"
					>
						{children}
					</Tooltip.Popup>
				</Tooltip.Positioner>
			</Tooltip.Portal>
		</Tooltip.Root>
	);
}
