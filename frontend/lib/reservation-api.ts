import { ApiResult } from "@/types/api-result";
import {
	ReservationBookingRequest,
	ReservationBookingResponse,
	ReservationCalendarRequest,
	ReservationCalendarResponse,
	ReservationSearchFilters,
	ReservationSearchResponse,
} from "@/types/reservation";
import { PositionedTable } from "@/types/table";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

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

async function apiRequest<T>(
	path: string,
	init?: RequestInit,
): Promise<ApiResult<T>> {
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

	const result = (await response.json()) as ApiResult<T>;

	if (!result.success) {
		throw new Error(result.message || "Unexpected API error");
	}

	return result;
}

export async function fetchRestaurantTables(
	config?: RequestInit,
): Promise<PositionedTable[]> {
	const result = await apiRequest<PositionedTable[]>("/api/tables", {
		...config,
		cache: "no-store",
	});

	return result.data;
}

export async function searchAvailableTables(
	filters: ReservationSearchFilters,
	config?: RequestInit,
): Promise<ReservationSearchResponse[]> {
	const result = await apiRequest<ReservationSearchResponse[]>(
		"/api/reservations/available",
		{
			...config,
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
		},
	);

	return result.data;
}

export async function bookReservation(
	request: ReservationBookingRequest,
): Promise<ApiResult<ReservationBookingResponse>> {
	return apiRequest<ReservationBookingResponse>("/api/reservations/book", {
		method: "POST",
		body: JSON.stringify({
			...request,
			time: normalizeTime(request.time),
		}),
	});
}

export async function prepareReservationCalendar(
	request: ReservationCalendarRequest,
): Promise<ReservationCalendarResponse> {
	const result = await apiRequest<ReservationCalendarResponse>(
		"/api/reservations/calendar",
		{
			method: "POST",
			body: JSON.stringify({
				...request,
				time: normalizeTime(request.time),
			}),
		},
	);

	return result.data;
}
