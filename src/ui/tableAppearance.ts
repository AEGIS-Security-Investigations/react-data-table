"use client";

import { createContext, useContext } from "react";

/** Presentation only; state and callbacks are identical in both appearances. */
export type DataTableAppearance = "default" | "coss";

export const TableAppearanceContext =
	createContext<DataTableAppearance>("default");

export const useCossTableAppearance = () =>
	useContext(TableAppearanceContext) === "coss";
