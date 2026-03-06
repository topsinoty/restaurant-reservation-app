import { TableFeature, TableLocation } from "./table";

export type ReservationSearchFilters = {
	date: string;
	time: string;
	people: number;
	location: TableLocation | null;
	preferredFeatures: TableFeature[];
};

export type ReservationSearchResponse = {
	id: number;
	location: TableLocation;
	features: TableFeature[];
	capacity: number;
};

export type ReservationBookingRequest = {
	tableId: number;
	date: string;
	time: string;
	people: number;
};

export type ReservationBookingResponse = {
	id: number;
	date: string;
	time: string;
	people: number;
	table: number;
};
