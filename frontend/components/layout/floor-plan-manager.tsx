import { TableProps, PositionedTable } from "@/types/tables";

const locations = ["CORNER", "CENTER", "OUTDOOR"] as const;

type Location = (typeof locations)[number];

type Layout = Readonly<Record<Location, readonly { x: number; y: number }[]>>;

export class FloorPlanManager {
	layout: Layout;

	constructor(layout: Layout) {
		this.layout = layout;
	}

	async init(): Promise<PositionedTable[]> {
		const tables = await this.getTables();
		return this.placeTables(tables);
	}

	async getTables(): Promise<TableProps[]> {
		const res = await fetch("http://localhost:8080/api/tables", {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch tables");
		}

		return res.json();
	}

	groupTables(tables: TableProps[]) {
		return {
			CENTER: tables.filter((t) => t.location === "CENTER"),
			CORNER: tables.filter((t) => t.location === "CORNER"),
			OUTDOOR: tables.filter((t) => t.location === "OUTDOOR"),
		};
	}

	placeTables(tables: TableProps[]): PositionedTable[] {
		const grouped = this.groupTables(tables);

		const result: PositionedTable[] = [];

		for (const zone of Object.keys(this.layout) as Location[]) {
			const slots = this.layout[zone];
			const zoneTables = grouped[zone];

			zoneTables.forEach((table, i) => {
				const pos = slots[i % slots.length];
				result.push({ ...table, ...pos });
			});
		}

		return result;
	}
}
