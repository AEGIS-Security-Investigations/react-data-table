"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "../cn.js";

import {
	isHorizontallyScrollable,
	resolveTableScrollRegionAttributes,
} from "./tableScrollRegion.js";

interface TableScrollRegionProps {
	label?: string;
	className?: string;
	children: ReactNode;
}

export const TableScrollRegion = ({
	label,
	className,
	children,
}: TableScrollRegionProps) => {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const [isScrollable, setIsScrollable] = useState(false);

	useEffect(() => {
		const node = scrollRef.current;
		if (!node) {
			return;
		}

		const measure = () => {
			setIsScrollable(isHorizontallyScrollable(node));
		};

		measure();

		if (typeof ResizeObserver === "undefined") {
			return;
		}

		const observer = new ResizeObserver(measure);
		observer.observe(node);
		for (const child of Array.from(node.children)) {
			observer.observe(child);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={scrollRef}
			className={cn(
				"relative w-full overflow-auto",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
				className,
			)}
			data-testid="table-scroll-region"
			data-scrollable={isScrollable ? "true" : "false"}
			{...resolveTableScrollRegionAttributes({ label, isScrollable })}
		>
			{children}
		</div>
	);
};
TableScrollRegion.displayName = "TableScrollRegion";
