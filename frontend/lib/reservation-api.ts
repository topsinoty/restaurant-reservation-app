import {
	ReservationBookingRequest,
	ReservationBookingResponse,
	ReservationSearchFilters,
	ReservationSearchResponse,
} from "@/types/reservation";
import { PositionedTable } from "@/types/table";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

function normalizeTime(value: string): string {
	if (/^\d{2}:\d{2}$/.test(value)) {
		return `${value}:00`;
	}

	return value;
}

async function parseErrorMessage(response: Response): Promise<string> {
	try {
		const data = await response.json();
		if (typeof data === "string") {
			return data;
		}
		if (data?.message && typeof data.message === "string") {
			return data.message;
		}
	} catch {
		// Ignore JSON parse errors and fall back to text.
	}

	try {
		const text = await response.text();
		if (text.trim().length > 0) {
			return text;
		}
	} catch {
		// Ignore text parse errors and use default.
	}

	return "Unexpected API error";
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
	});

	if (!response.ok) {
		throw new Error(await parseErrorMessage(response));
	}

	return response.json() as Promise<T>;
}

export async function fetchRestaurantTables(): Promise<PositionedTable[]> {
	return apiRequest<PositionedTable[]>("/api/tables", {
		cache: "no-store",
	});
}

export async function searchAvailableTables(
	filters: ReservationSearchFilters,
): Promise<ReservationSearchResponse[]> {
	return apiRequest<ReservationSearchResponse[]>("/api/reservations/available", {
		method: "POST",
		body: JSON.stringify({
			date: filters.date,
			time: normalizeTime(filters.time),
			people: filters.people,
			location: filters.location ?? undefined,
			preferredFeatures:
				filters.preferredFeatures.length > 0
					? filters.preferredFeatures
					: undefined,
		}),
	});
}

export async function bookReservation(
	request: ReservationBookingRequest,
): Promise<ReservationBookingResponse> {
	return apiRequest<ReservationBookingResponse>("/api/reservations/book", {
		method: "POST",
		body: JSON.stringify({
			...request,
			time: normalizeTime(request.time),
		}),
	});
}
