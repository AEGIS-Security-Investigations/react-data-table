export const stripImportantWidthClasses = (
	className: string | undefined,
): string | undefined => {
	if (!className) {
		return className;
	}

	const kept = className
		.split(/\s+/)
		.filter(
			(token) =>
				token !== "" && !/^(?:[\w-]+:)*!(?:w|min-w|max-w)-/.test(token),
		);

	return kept.length > 0 ? kept.join(" ") : undefined;
};
