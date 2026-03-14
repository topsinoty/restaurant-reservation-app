"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
	CalendarDays,
	Clock3,
	Mail,
	MapPin,
	NotebookPen,
	Users,
	UserRound,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { object, string, z } from "zod";
import { LOCATION_LABELS } from "@/lib/table-labels";
import { ReservationSearchFilters } from "@/types/reservation";
import { PositionedTable } from "@/types/table";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "../ui/input-group";

const bookingGuestSchema = object({
	guestName: string().min(1, { error: "Enter your name" }),
});

type BookingDialogValues = z.infer<typeof bookingGuestSchema>;

const defaultValues: BookingDialogValues = {
	guestName: "",
};

export type BookingDialogPayload = {
	name: string;
};

type BookingDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	filters: ReservationSearchFilters | null;
	selectedTable: PositionedTable | null;
	isBooking: boolean;
	onConfirm: (payload: BookingDialogPayload) => Promise<boolean>;
};

export function BookingDialog({
	open,
	onOpenChange,
	filters,
	selectedTable,
	isBooking,
	onConfirm,
}: Readonly<BookingDialogProps>) {
	const form = useForm<BookingDialogValues>({
		resolver: standardSchemaResolver(bookingGuestSchema),
		defaultValues,
	});

	async function handleSubmit(values: BookingDialogValues) {
		const wasBooked = await onConfirm({
			name: values.guestName,
		});

		if (!wasBooked) {
			return;
		}

		form.reset(defaultValues);
		onOpenChange(false);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) {
					form.reset(defaultValues);
				}
				onOpenChange(nextOpen);
			}}
		>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>Complete your booking</DialogTitle>
					<DialogDescription>
						Add the guest details that the backend will later use for the
						reservation receipt and iCal invite.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm sm:grid-cols-2">
					<div className="flex items-start gap-2">
						<CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
						<div>
							<p className="font-medium">Date</p>
							<p className="text-muted-foreground">{filters?.date ?? "-"}</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<Clock3 className="mt-0.5 size-4 text-muted-foreground" />
						<div>
							<p className="font-medium">Time</p>
							<p className="text-muted-foreground">{filters?.time ?? "-"}</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<Users className="mt-0.5 size-4 text-muted-foreground" />
						<div>
							<p className="font-medium">Party size</p>
							<p className="text-muted-foreground">{filters?.people ?? "-"}</p>
						</div>
					</div>
					<div className="flex items-start gap-2">
						<MapPin className="mt-0.5 size-4 text-muted-foreground" />
						<div>
							<p className="font-medium">Table</p>
							<p className="text-muted-foreground">
								{selectedTable
									? `#${selectedTable.id} • ${LOCATION_LABELS[selectedTable.location]}`
									: "-"}
							</p>
						</div>
					</div>
				</div>

				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="flex flex-col gap-4"
				>
					<Controller
						control={form.control}
						name="guestName"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>
									<UserRound className="size-4 text-muted-foreground" />
									Guest name
								</FieldLabel>
								<InputGroup>
									<InputGroupAddon>
										<InputGroupText>
											<UserRound className="size-4" />
										</InputGroupText>
									</InputGroupAddon>
									<InputGroupInput
										{...field}
										aria-invalid={fieldState.invalid}
										placeholder="Jamie Doe"
									/>
								</InputGroup>
								<FieldError errors={[fieldState.error]} />
							</Field>
						)}
					/>

					<div className="rounded-lg border border-dashed bg-background p-4 text-sm">
						<div className="flex items-start gap-2">
							<NotebookPen className="mt-0.5 size-4 text-muted-foreground" />
							<div>
								<p className="font-medium">Calendar invite</p>
							</div>
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="secondary" disabled={isBooking}>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={!filters || !selectedTable || isBooking}
						>
							{isBooking ? "Booking..." : "Book table"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
