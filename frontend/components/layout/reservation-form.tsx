"use client";

import {
	CalendarDays,
	Clock3,
	MapPin,
	SlidersHorizontal,
	Users,
} from "lucide-react";
import { iso, number, object, string, array, literal, z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { TimePicker } from "../ui/time-picker";
import { FEATURE_LABELS, LOCATION_LABELS } from "@/lib/table-labels";
import { ReservationSearchFilters } from "@/types/reservation";
import { TABLE_FEATURES, TABLE_LOCATIONS, TableFeature } from "@/types/table";

const TIME_24H_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const reservationBookingSchema = object({
	date: iso.date(),
	time: string().regex(TIME_24H_REGEX, {
		error: "Use 24-hour format HH:mm",
	}),
	people: number().min(1).max(12),
	location: z.union([literal(""), z.enum(TABLE_LOCATIONS)]),
	preferredFeatures: array(z.enum(TABLE_FEATURES)),
});

type ReservationFormValues = z.infer<typeof reservationBookingSchema>;

const defaultValues: ReservationFormValues = {
	date: "",
	time: "",
	people: 2,
	location: "",
	preferredFeatures: [],
};

const preferenceOptions: TableFeature[] = [
	"QUIET",
	"WINDOW_SIDE",
	"KIDS_AREA",
	"ROMANTIC",
	"GREAT_VIEW",
];

export function ReservationForm({
	onSubmit,
	onClear,
	isSearching,
}: Readonly<{
	onSubmit?: (data: ReservationSearchFilters) => void;
	onClear?: () => void;
	isSearching?: boolean;
}>) {
	const form = useForm<ReservationFormValues>({
		resolver: standardSchemaResolver(reservationBookingSchema),
		defaultValues,
	});

	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0, 0, 0, 0);

	return (
		<form
			onSubmit={form.handleSubmit((data) =>
				onSubmit?.({
					date: data.date,
					time: data.time,
					people: data.people,
					location: data.location || null,
					preferredFeatures: data.preferredFeatures,
				}),
			)}
			className="w-full h-min lg:max-w-full"
		>
			<Card>
				<CardHeader>
					<CardTitle>Select a table</CardTitle>
					<CardDescription>Fill in the details {":)"}</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-6">
					<Controller
						control={form.control}
						name="date"
						render={({ field }) => (
							<Field>
								<Calendar
									mode="single"
									selected={field.value ? new Date(field.value) : undefined}
									disabled={{ before: tomorrow }}
									onSelect={(date) => {
										if (!date) return;
										const year = date.getFullYear();
										const month = String(date.getMonth() + 1).padStart(2, "0");
										const day = String(date.getDate()).padStart(2, "0");
										field.onChange(`${year}-${month}-${day}`);
									}}
								/>

								<FieldError errors={[form.formState.errors.date]} />
							</Field>
						)}
					/>

					<div className="flex flex-wrap gap-4">
						<Controller
							control={form.control}
							name="time"
							render={({ field, fieldState }) => (
								<Field className="min-w-48 md:min-w-12 flex-1">
									<FieldLabel>
										<Clock3 className="size-4 text-muted-foreground" />
										Time
									</FieldLabel>
									<TimePicker
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										aria-invalid={fieldState.invalid}
									/>
									<FieldError errors={[fieldState.error]} />
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name="people"
							render={({ field }) => (
								<Field className="min-w-48 flex-1">
									<FieldLabel>
										<Users className="size-4 text-muted-foreground" />
										People
									</FieldLabel>
									<Select
										value={field.value.toString()}
										onValueChange={field.onChange}
									>
										<SelectTrigger className="w-full">
											<SelectValue></SelectValue>
										</SelectTrigger>
										<SelectContent>
											{Array.from({ length: 11 }, (_, i) => i)
												.slice(2)
												.map((i) => (
													<SelectItem key={i} value={i.toString()}>
														{i}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
									<FieldError errors={[form.formState.errors.people]} />
								</Field>
							)}
						/>
					</div>

					<Controller
						control={form.control}
						name="location"
						render={({ field }) => (
							<Field>
								<FieldLabel>
									<MapPin className="size-4 text-muted-foreground" />
									Zone
								</FieldLabel>
								<Select
									value={field.value || undefined}
									onValueChange={field.onChange}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="-- Select --" />
									</SelectTrigger>
									<SelectContent>
										{TABLE_LOCATIONS.map((location) => (
											<SelectItem key={location} value={location}>
												{LOCATION_LABELS[location]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="preferredFeatures"
						render={({ field }) => {
							const handleFeatureChange = (
								checked: boolean,
								feature: TableFeature,
							) => {
								const nextFeatures = checked
									? [...field.value, feature]
									: field.value.filter((item) => item !== feature);
								field.onChange(nextFeatures);
							};

							return (
								<Field>
									<FieldLabel>
										<SlidersHorizontal className="size-4 text-muted-foreground" />
										Preferences
									</FieldLabel>

									<div className="grid gap-2 sm:grid-cols-2">
										{preferenceOptions.map((feature) => {
											const checked = field.value.includes(feature);

											return (
												<label
													key={feature}
													className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
												>
													<input
														type="checkbox"
														checked={checked}
														onChange={(event) =>
															handleFeatureChange(event.target.checked, feature)
														}
													/>
													<span>{FEATURE_LABELS[feature]}</span>
												</label>
											);
										})}
									</div>
								</Field>
							);
						}}
					/>

					<div className="flex flex-col gap-2 sm:flex-row">
						<Button type="submit" disabled={isSearching}>
							{isSearching ? "Searching..." : "Check table availability"}
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								form.reset(defaultValues);
								onClear?.();
							}}
						>
							Clear
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
