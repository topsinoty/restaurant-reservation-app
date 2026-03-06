export interface TableProps {
	id: number;
	capacity: number;
	location: "CENTER" | "CORNER" | "OUTDOOR";
	features: string[];
}

export type PositionedTable = TableProps & {
	x: number;
	y: number;
};
