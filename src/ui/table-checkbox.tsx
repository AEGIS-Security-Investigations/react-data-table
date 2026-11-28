"use client";

import { Checkbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";
import { useCossTableAppearance } from "./tableAppearance.js";

type TableCheckboxProps = {
	checked: boolean;
	disabled?: boolean;
	onChange: () => void;
	"aria-label"?: string;
	"data-testid"?: string;
};

/** Keep the existing input for default consumers; coss uses its Base UI control. */
export function TableCheckbox({ onChange, ...props }: TableCheckboxProps) {
	const coss = useCossTableAppearance();
	if (!coss) {
		return (
			<input
				type="checkbox"
				onChange={onChange}
				className={
					props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
				}
				{...props}
			/>
		);
	}

	return (
		<Checkbox.Root
			{...props}
			onCheckedChange={onChange}
			data-slot="checkbox"
			className="relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[.25rem] border border-input bg-background bg-clip-padding align-middle outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:bg-muted"
		>
			<Checkbox.Indicator
				data-slot="checkbox-indicator"
				className="absolute -inset-px flex items-center justify-center rounded-[.25rem] bg-primary text-primary-foreground"
			>
				<Check aria-hidden="true" className="size-3" strokeWidth={3} />
			</Checkbox.Indicator>
		</Checkbox.Root>
	);
}
