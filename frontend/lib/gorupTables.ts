import { TableProps } from "@/types/tables";

export function groupTables(tables: TableProps[]) {
	return {
		CENTER: tables.filter((t) => t.location === "CENTER"),
		CORNER: tables.filter((t) => t.location === "CORNER"),
		OUTDOOR: tables.filter((t) => t.location === "OUTDOOR"),
	};
}
