export const TABLE_LOCATIONS = ["CENTER", "CORNER", "OUTDOOR"] as const;
export type TableLocation = (typeof TABLE_LOCATIONS)[number];

export const TABLE_FEATURES = [
	"GREAT_VIEW",
	"KIDS_AREA",
	"QUIET",
	"ROMANTIC",
	"BUSY",
	"WINDOW_SIDE",
] as const;
export type TableFeature = (typeof TABLE_FEATURES)[number];

export type RestaurantTable = {
	id: number;
	capacity: number;
	location: TableLocation;
	features: TableFeature[];
	x: number;
	y: number;
};

export type PositionedTable = RestaurantTable;
