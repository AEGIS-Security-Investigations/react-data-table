"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type RowPickerOpenStateValue = {
	openPickerId: string | null;
	setPickerOpen: (pickerId: string, open: boolean) => void;
};

const RowPickerOpenStateContext = createContext<RowPickerOpenStateValue | null>(
	null,
);

const DataTableRowIdContext = createContext<string | null>(null);

export const RowPickerOpenStateProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [openPickerId, setOpenPickerId] = useState<string | null>(null);

	const setPickerOpen = useCallback((pickerId: string, open: boolean) => {
		setOpenPickerId((current) => {
			if (open) {
				return pickerId;
			}
			return current === pickerId ? null : current;
		});
	}, []);

	const value = useMemo(
		() => ({ openPickerId, setPickerOpen }),
		[openPickerId, setPickerOpen],
	);

	return (
		<RowPickerOpenStateContext.Provider value={value}>
			{children}
		</RowPickerOpenStateContext.Provider>
	);
};

export const DataTableRowIdProvider = ({
	rowId,
	children,
}: {
	rowId: string;
	children: ReactNode;
}) => (
	<DataTableRowIdContext.Provider value={rowId}>
		{children}
	</DataTableRowIdContext.Provider>
);

const isHostDisconnected = (hostRef?: {
	readonly current: HTMLElement | null;
}) => Boolean(hostRef?.current && !hostRef.current.isConnected);

export const useDataTableRowPickerOpen = (
	kind: string,
	hostRef?: { readonly current: HTMLElement | null },
) => {
	const rowId = useContext(DataTableRowIdContext);
	const tableState = useContext(RowPickerOpenStateContext);
	const [localOpen, setLocalOpen] = useState(false);

	const pickerId = rowId ? `${kind}:${rowId}` : null;
	const persist = pickerId !== null && tableState !== null;

	const open =
		persist && pickerId && tableState
			? tableState.openPickerId === pickerId
			: localOpen;

	const setOpen = useCallback(
		(next: boolean) => {
			if (persist && pickerId && tableState) {
				if (!next && isHostDisconnected(hostRef)) {
					return;
				}
				tableState.setPickerOpen(pickerId, next);
				return;
			}
			setLocalOpen(next);
		},
		[hostRef, persist, pickerId, tableState],
	);

	return [open, setOpen] as const;
};
