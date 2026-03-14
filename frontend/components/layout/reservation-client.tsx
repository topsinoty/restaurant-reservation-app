"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BookingDialog, BookingDialogPayload } from "./booking-dialog";
import { FloorPlan } from "./floor-plan";
import { ReservationForm } from "./reservation-form";
import {
	bookReservation,
	fetchRestaurantTables,
	prepareReservationCalendar,
	searchAvailableTables,
} from "@/lib/reservation-api";
import { FEATURE_LABELS, LOCATION_LABELS } from "@/lib/table-labels";
import {
	ReservationCalendarResponse,
	ReservationSearchFilters,
} from "@/types/reservation";
import { PositionedTable } from "@/types/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

export function ReservationClient() {
	const [tables, setTables] = useState<PositionedTable[]>([]);
	const [filters, setFilters] = useState<ReservationSearchFilters | null>(null);
	const [availableIds, setAvailableIds] = useState<Set<number>>(new Set());
	const [bestTableId, setBestTableId] = useState<number | null>(null);

	const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
	const [isLoadingTables, setIsLoadingTables] = useState(true);
	const [selectedLocation, setSelectedLocation] =
		useState<ReservationSearchFilters["location"]>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
	const [calendarInvite, setCalendarInvite] =
		useState<ReservationCalendarResponse | null>(null);
	const [isPreparingInvite, setIsPreparingInvite] = useState(false);
	const [isBooking, setIsBooking] = useState(false);

	const searchControllerRef = useRef<AbortController | null>(null);
	const floorRef = useRef<HTMLDivElement>(null);

	const runSearch = useCallback(
		async (activeFilters: ReservationSearchFilters) => {
			searchControllerRef.current?.abort();

			const controller = new AbortController();
			searchControllerRef.current = controller;

			setIsSearching(true);

			try {
				const availableTables = await searchAvailableTables(activeFilters, {
					signal: controller.signal,
				});

				const ids = new Set(availableTables.map((table) => table.id));

				setAvailableIds(ids);
				setBestTableId(availableTables[0]?.id ?? null);

				setSelectedTableId((current) =>
					current !== null && !ids.has(current) ? null : current,
				);

				if (availableTables.length === 0) {
					toast.info("No tables are available for the selected filters.");
				}
			} catch (error) {
				if (controller.signal.aborted) {
					return;
				}

				const message =
					error instanceof Error ? error.message : "Availability search failed";

				setAvailableIds(new Set());
				setBestTableId(null);
				setSelectedTableId(null);

				toast.error(message);
			} finally {
				if (!controller.signal.aborted) {
					setIsSearching(false);
				}
			}
		},
		[],
	);

	useEffect(() => {
		const controller = new AbortController();

		async function loadTables() {
			setIsLoadingTables(true);

			try {
				const response = await fetchRestaurantTables({
					signal: controller.signal,
				});
				setTables(response);
			} catch (error) {
				if (controller.signal.aborted) {
					return;
				}

				const message =
					error instanceof Error ? error.message : "Floor plan loading failed";
				toast.error(message);
			} finally {
				if (!controller.signal.aborted) {
					setIsLoadingTables(false);
				}
			}
		}

		loadTables();

		return () => {
			controller.abort();
		};
	}, []);

	useEffect(() => {
		if (!filters) {
			setAvailableIds(new Set());
			setBestTableId(null);
			setSelectedTableId(null);
			return;
		}

		runSearch(filters);
	}, [filters, runSearch]);

	useEffect(() => {
		if (!filters || !selectedTableId || !availableIds.has(selectedTableId)) {
			setIsBookingDialogOpen(false);
			setCalendarInvite(null);
		}
	}, [availableIds, filters, selectedTableId]);

	const selectedTable = useMemo(
		() => tables.find((table) => table.id === selectedTableId) ?? null,
		[selectedTableId, tables],
	);

	const canBookSelectedTable = Boolean(
		filters && selectedTableId && availableIds.has(selectedTableId),
	);

	function getOccupiedTableCount(
		tables: PositionedTable[],
		availableIds: Set<number>,
		selectedLocation: ReservationSearchFilters["location"],
	): number {
		let occupied = 0;

		for (const table of tables) {
			if (selectedLocation && table.location !== selectedLocation) continue;
			if (!availableIds.has(table.id)) occupied++;
		}

		return occupied;
	}

	const occupiedCount = getOccupiedTableCount(
		tables,
		availableIds,
		selectedLocation,
	);

	function downloadCalendarInvite(invite: ReservationCalendarResponse) {
		const blob = new Blob([invite.content], {
			type: invite.contentType,
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		link.href = url;
		link.download = invite.fileName;
		document.body.append(link);
		link.click();
		link.remove();

		globalThis.setTimeout(() => {
			URL.revokeObjectURL(url);
		}, 0);
	}

	async function handleOpenBookingDialog() {
		if (!filters || !selectedTableId) {
			return;
		}

		setIsPreparingInvite(true);
		setCalendarInvite(null);

		try {
			const invite = await prepareReservationCalendar({
				tableId: selectedTableId,
				date: filters.date,
				time: filters.time,
				people: filters.people,
			});

			setCalendarInvite(invite);
			setIsBookingDialogOpen(true);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Calendar invite preparation failed";
			toast.error(message);
		} finally {
			setIsPreparingInvite(false);
		}
	}

	async function handleBookSelectedTable(payload: BookingDialogPayload) {
		if (!filters || !selectedTableId || !calendarInvite) {
			return false;
		}

		setIsBooking(true);

		try {
			const invite = calendarInvite;
			const bookingResult = await bookReservation({
				tableId: selectedTableId,
				date: filters.date,
				time: filters.time,
				people: filters.people,
				guestName: payload.guestName,
			});

			toast.success(bookingResult.message);
			downloadCalendarInvite(invite);

			setCalendarInvite(null);
			await runSearch(filters);
			return true;
		} catch (error) {
			const message = error instanceof Error ? error.message : "Booking Failed";
			toast.error(message);
			return false;
		} finally {
			setIsBooking(false);
		}
	}

	const handleReservationSubmit = useCallback(
		(data: ReservationSearchFilters) => {
			setSelectedTableId(null);
			setFilters(data);
			setSelectedLocation(data.location);
			setCalendarInvite(null);
			setIsBookingDialogOpen(false);

			floorRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		},
		[],
	);

	if (isLoadingTables) {
		return (
			<div className="rounded-xl border bg-white p-6 text-sm text-muted-foreground">
				Loading Restaurant floor plan
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col-reverse gap-6 lg:flex-row">
			<FloorPlan
				ref={floorRef}
				tables={tables}
				hasActiveSearch={Boolean(filters)}
				availableIds={availableIds}
				bestTableId={bestTableId}
				selectedTableId={selectedTableId}
				onSelectTable={setSelectedTableId}
				isSearching={isSearching}
				selectedLocation={selectedLocation}
			/>

			<div className="flex w-full flex-col gap-6 lg:max-w-2/7">
				<Card>
					<CardHeader>
						<CardTitle>Booking Summary</CardTitle>
						<CardDescription>
							{filters
								? "Availability and the best table are based on the applied filters"
								: "No filters selected."}
						</CardDescription>
					</CardHeader>
					{filters && (
						<CardContent className="flex flex-col gap-4 text-sm">
							<div className="grid grid-cols-2 gap-2 rounded-md bg-slate-50 p-3">
								<div>Occupied tables: {occupiedCount}</div>
								<div>Available tables: {availableIds.size}</div>
								<div>Best table: {bestTableId ? `#${bestTableId}` : "-"}</div>
							</div>
							<div className="rounded-md border p-3">
								<p className="font-medium">Selected filters</p>
								<p>Date: {filters.date}</p>
								<p>Time: {filters.time}</p>
								<p>People: {filters.people}</p>
								<p>
									Zone:{" "}
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
							<Button
								type="button"
								onClick={handleOpenBookingDialog}
								disabled={
									!canBookSelectedTable || isBooking || isPreparingInvite
								}
							>
								{isPreparingInvite
									? "Preparing invite..."
									: isBooking
										? "Booking..."
										: "Continue to booking"}
							</Button>
							<BookingDialog
								open={isBookingDialogOpen}
								onOpenChange={(nextOpen) => {
									setIsBookingDialogOpen(nextOpen);
									if (!nextOpen && !isBooking) {
										setCalendarInvite(null);
									}
								}}
								filters={filters}
								selectedTable={selectedTable}
								calendarInvite={calendarInvite}
								isBooking={isBooking}
								onConfirm={handleBookSelectedTable}
							/>
						</CardContent>
					)}
				</Card>
				<ReservationForm
					onSubmit={handleReservationSubmit}
					onClear={() => {
						setFilters(null);
						setSelectedLocation(null);
						setCalendarInvite(null);
						setIsBookingDialogOpen(false);
					}}
					isSearching={isSearching}
				/>
			</div>
		</div>
	);
}
