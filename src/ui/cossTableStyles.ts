// Adapted from the coss UI MIT registry's default table and skeleton.
// Use standard Tailwind arbitrary values for v3 and v4 consumers. Keep the
// table's existing overflow semantics and do not expose coss's card variant.
export const cossTableStyles = {
	head: "h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium text-muted-foreground leading-none first:[&:has([role=checkbox])]:pe-0 last:[&:has([role=checkbox])]:ps-0",
	cell: "whitespace-nowrap bg-clip-padding p-2.5 align-middle leading-none first:[&:has([role=checkbox])]:pe-0 last:[&:has([role=checkbox])]:ps-0",
	row: "relative border-b transition-colors hover:bg-[color-mix(in_srgb,var(--background),black_2%)] data-[state=selected]:bg-[color-mix(in_srgb,var(--background),black_4%)] dark:hover:bg-[color-mix(in_srgb,var(--background),white_2%)] dark:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),white_4%)]",
	footer:
		"border-t bg-[color-mix(in_srgb,var(--card,var(--background)),black_2%)] font-medium dark:bg-[color-mix(in_srgb,var(--card,var(--background)),white_2%)] [&>tr]:last:border-b-0 [&_td]:py-3.5",
	skeleton:
		"rounded-sm bg-muted bg-[linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)] [--skeleton-highlight:rgb(255_255_255/64%)] dark:[--skeleton-highlight:rgb(255_255_255/4%)] motion-safe:animate-pulse",
} as const;
