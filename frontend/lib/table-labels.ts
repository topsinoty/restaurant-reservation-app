import { TableFeature, TableLocation } from "@/types/table";

export const LOCATION_LABELS: Record<TableLocation, string> = {
	CENTER: "Inner Zone",
	CORNER: "Corner Zone",
	OUTDOOR: "Terrace",
};

export const FEATURE_LABELS: Record<TableFeature, string> = {
	GREAT_VIEW: "Great View",
	KIDS_AREA: "Kid's Area",
	QUIET: "Quiet Area",
	ROMANTIC: "Romantic Area",
	BUSY: "Lively/Busy Zone",
	WINDOW_SIDE: "Window-side Seat",
};
