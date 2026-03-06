import { PositionedTable, TableProps } from "@/types/tables";
import { groupTables } from "./gorupTables";
import { layout } from "./layout";

export function placeTables(tables: TableProps[]): PositionedTable[] {
	const grouped = groupTables(tables);

	const result: PositionedTable[] = [];

	for (const zone of Object.keys(layout) as (keyof typeof layout)[]) {
		const slots = layout[zone];
		const zoneTables = grouped[zone];

		zoneTables.forEach((table, i) => {
			const pos = slots[i % slots.length];
			result.push({ ...table, ...pos });
		});
	}

	return result;
}
