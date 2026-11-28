"use client";

import { cossTableStyles } from "./cossTableStyles.js";
import { useCossTableAppearance } from "./tableAppearance.js";
import { cn } from "../cn.js";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const coss = useCossTableAppearance();
	return (
		<div
			className={cn(
				coss ? cossTableStyles.skeleton : "animate-pulse rounded-md bg-muted",
				className,
			)}
			data-slot={coss ? "skeleton" : undefined}
			{...props}
		/>
	);
}

export { Skeleton };
