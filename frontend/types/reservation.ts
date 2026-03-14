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

export type ReservationCalendarRequest = {
	tableId: number;
	date: string;
	time: string;
	people: number;
};

export type ReservationCalendarResponse = {
	fileName: string;
	contentType: string;
	content: string;
	summary: string;
	location: string;
	date: string;
	time: string;
	endTime: string;
};

export type ReservationBookingRequest = {
	tableId: number;
	date: string;
	time: string;
	people: number;
	guestName: string;
};

export type ReservationBookingResponse = {
	id: number;
	date: string;
	time: string;
	people: number;
	table: number;
	guestName: string;
};
