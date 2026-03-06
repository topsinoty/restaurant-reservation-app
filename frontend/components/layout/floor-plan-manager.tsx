import { TableProps, PositionedTable } from "@/types/tables";

const locations = ["CORNER", "CENTER", "OUTDOOR"] as const;

type Location = (typeof locations)[number];

type Layout = Readonly<Record<Location, readonly { x: number; y: number }[]>>;

export class FloorPlanManager {
	async init(): Promise<PositionedTable[]> {
		return this.getTables();
	}

	async getTables(): Promise<PositionedTable[]> {
		const res = await fetch("http://localhost:8080/api/tables", {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch tables");
		}

		return res.json();
	}
}
