interface TableProps {
	id: number;
	capacity: number;
	location: "CENTER" | "CORNER" | "OUTDOOR";
	features: (
		| "GREAT_VIEW"
		| "KIDS_AREA"
		| "QUIET"
		| "ROMANTIC"
		| "BUSY"
		| "WINDOW_SIDE"
	)[];
}

export type PositionedTable = TableProps & {
	x: number;
	y: number;
};
