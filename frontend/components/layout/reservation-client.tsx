"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FloorPlan } from "./floor-plan";
import { ReservationForm } from "./reservation-form";
import {
	bookReservation,
	fetchRestaurantTables,
	searchAvailableTables,
} from "@/lib/reservation-api";
import { FEATURE_LABELS, LOCATION_LABELS } from "@/lib/table-labels";
import { ReservationSearchFilters } from "@/types/reservation";
import { PositionedTable } from "@/types/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

type Notice = {
	type: "success" | "error";
	text: string;
};

function generateRandomOccupiedIds(tables: PositionedTable[]): Set<number> {
	if (tables.length === 0) {
		return new Set();
	}

	const min = Math.max(1, Math.floor(tables.length * 0.2));
	const max = Math.max(min, Math.floor(tables.length * 0.35));
	const target = min + Math.floor(Math.random() * (max - min + 1));
	const ids = [...tables.map((table) => table.id)];

	for (let i = ids.length - 1; i > 0; i -= 1) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[ids[i], ids[randomIndex]] = [ids[randomIndex], ids[i]];
	}

	return new Set(ids.slice(0, target));
}

export function ReservationClient() {
	const [tables, setTables] = useState<PositionedTable[]>([]);
	const [filters, setFilters] = useState<ReservationSearchFilters | null>(null);
	const [availableIds, setAvailableIds] = useState<Set<number>>(new Set());
	const [recommendedIds, setRecommendedIds] = useState<Set<number>>(new Set());
	const [topRecommendedId, setTopRecommendedId] = useState<number | null>(null);
	const [randomOccupiedIds, setRandomOccupiedIds] = useState<Set<number>>(
		new Set(),
	);
	const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
	const [isLoadingTables, setIsLoadingTables] = useState(true);
	const [isSearching, setIsSearching] = useState(false);
	const [isBooking, setIsBooking] = useState(false);
	const [notice, setNotice] = useState<Notice | null>(null);

	const runSearch = useCallback(
		async (activeFilters: ReservationSearchFilters) => {
			setIsSearching(true);

			try {
				const availableTables = await searchAvailableTables(activeFilters);
				const ids = new Set(availableTables.map((table) => table.id));
				setAvailableIds(ids);
				setRecommendedIds(ids);
				setTopRecommendedId(availableTables[0]?.id ?? null);
				setSelectedTableId((current) =>
					current !== null && !ids.has(current) ? null : current,
				);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Availability search failed";
				setAvailableIds(new Set());
				setRecommendedIds(new Set());
				setTopRecommendedId(null);
				setSelectedTableId(null);
				setNotice({ type: "error", text: message });
			} finally {
				setIsSearching(false);
			}
		},
		[],
	);

	useEffect(() => {
		let ignore = false;

		async function loadTables() {
			setIsLoadingTables(true);

			try {
				const response = await fetchRestaurantTables();

				if (ignore) {
					return;
				}

				setTables(response);
				setRandomOccupiedIds(generateRandomOccupiedIds(response));
			} catch (error) {
				if (ignore) {
					return;
				}

				const message =
					error instanceof Error ? error.message : "Floor plan loading failed";
				setNotice({ type: "error", text: message });
			} finally {
				if (!ignore) {
					setIsLoadingTables(false);
				}
			}
		}

		loadTables();

		return () => {
			ignore = true;
		};
	}, []);

	useEffect(() => {
		if (!filters) {
			setAvailableIds(new Set());
			setRecommendedIds(new Set());
			setTopRecommendedId(null);
			setSelectedTableId(null);
			return;
		}

		runSearch(filters);
	}, [filters, runSearch]);

	const selectedTable = useMemo(
		() => tables.find((table) => table.id === selectedTableId) ?? null,
		[selectedTableId, tables],
	);

	const availableCount = filters
		? availableIds.size
		: tables.length - randomOccupiedIds.size;
	const occupiedCount = filters
		? tables.length - availableIds.size
		: randomOccupiedIds.size;

	async function handleBookSelectedTable() {
		if (!filters || !selectedTableId) {
			return;
		}

		setIsBooking(true);
		setNotice(null);

		try {
			const booking = await bookReservation({
				tableId: selectedTableId,
				date: filters.date,
				time: filters.time,
				people: filters.people,
			});

			setNotice({
				type: "success",
				text: `Booking Successful. Booking ID: ${booking.id}.`,
			});

			await runSearch(filters);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Booking Failed";
			setNotice({ type: "error", text: message });
		} finally {
			setIsBooking(false);
		}
	}

	if (isLoadingTables) {
		return (
			<div className="rounded-xl border bg-white p-6 text-sm text-muted-foreground">
				Loading Restaurant floor plan
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-6 lg:flex-row">
			<FloorPlan
				tables={tables}
				hasActiveSearch={Boolean(filters)}
				availableTableIds={availableIds}
				recommendedIds={recommendedIds}
				topRecommendedId={topRecommendedId}
				randomOccupiedIds={randomOccupiedIds}
				selectedTableId={selectedTableId}
				onSelectTable={setSelectedTableId}
				isSearching={isSearching}
			/>

			<div className="flex w-full flex-col gap-6 lg:max-w-[24rem]">
				<ReservationForm
					onSubmit={(data) => {
						setNotice(null);
						setSelectedTableId(null);
						setFilters(data);
					}}
					onClear={() => {
						setNotice(null);
						setFilters(null);
					}}
					isSearching={isSearching}
				/>

				<Card>
					<CardHeader>
						<CardTitle>Booking Summary</CardTitle>
						<CardDescription>
							{filters
								? "Recommendations and selections are based on the applied filters"
								: "No filters selected."}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4 text-sm">
						<div className="grid grid-cols-2 gap-2 rounded-md bg-slate-50 p-3">
							<div>Free tables: {availableCount}</div>
							<div>Occupied tables: {occupiedCount}</div>
							<div>Recommendation: {recommendedIds.size}</div>
							<div>
								Best table: {topRecommendedId ? `#${topRecommendedId}` : "-"}
							</div>
						</div>

						{filters && (
							<div className="rounded-md border p-3">
								<p className="font-medium">Selected filters</p>
								<p>Date: {filters.date}</p>
								<p>Time: {filters.time}</p>
								<p>People: {filters.people}</p>
								<p>
									Zone:
									{filters.location
										? LOCATION_LABELS[filters.location]
										: "All Zones"}
								</p>
								<p>
									Preferences:{" "}
									{filters.preferredFeatures.length > 0
										? filters.preferredFeatures
												.map((feature) => FEATURE_LABELS[feature])
												.join(", ")
										: "None selected"}
								</p>
							</div>
						)}

						<div className="rounded-md border p-3">
							<p className="font-medium">Selected table</p>
							{selectedTable ? (
								<>
									<p>ID: #{selectedTable.id}</p>
									<p>Capacity: {selectedTable.capacity}</p>
									<p>Zone: {LOCATION_LABELS[selectedTable.location]}</p>
								</>
							) : (
								<p className="text-muted-foreground">
									Choose a table from the floor plan.
								</p>
							)}
						</div>

						{notice && (
							<div
								className={`rounded-md border px-3 py-2 ${
									notice.type === "success"
										? "border-emerald-200 bg-emerald-50 text-emerald-700"
										: "border-red-200 bg-red-50 text-red-700"
								}`}
							>
								{notice.text}
							</div>
						)}

						<Button
							type="button"
							onClick={handleBookSelectedTable}
							disabled={
								!filters ||
								!selectedTableId ||
								!availableIds.has(selectedTableId) ||
								isBooking
							}
						>
							{isBooking ? "Booking..." : "Book selected table..."}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
