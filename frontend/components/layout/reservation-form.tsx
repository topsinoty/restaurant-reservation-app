"use client";

import { iso, number, object, string, array, literal, z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { FEATURE_LABELS, LOCATION_LABELS } from "@/lib/table-labels";
import { ReservationSearchFilters } from "@/types/reservation";
import { TABLE_FEATURES, TABLE_LOCATIONS, TableFeature } from "@/types/table";

const TIME_24H_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const reservationBookingSchema = object({
	date: iso.date(),
	time: string().regex(TIME_24H_REGEX, {
		error: "Kasuta formaati HH:mm",
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

	const today = new Date();
	today.setHours(0, 0, 0, 0);

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
			className="w-full h-min lg:max-w-[24rem]"
		>
			<Card>
				<CardHeader>
					<CardTitle>Leia sobiv laud</CardTitle>
					<CardDescription>
						Vali aeg, seltskonna suurus ja eelistused. Seejarel kuvatakse soovitused saaliplaanil.
					</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-6">
					<Controller
						control={form.control}
						name="date"
						render={({ field }) => (
							<Field>
								<FieldLabel>Date</FieldLabel>

								<Calendar
									mode="single"
									selected={field.value ? new Date(field.value) : undefined}
									disabled={{ before: today }}
									onSelect={(date) => {
										if (!date) return;
										// Keep local date to avoid timezone shifts.
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

					<Controller
						control={form.control}
						name="time"
						render={({ field }) => (
							<Field>
								<FieldLabel>Kellaaeg</FieldLabel>
								<Input type="time" step={60} {...field} />
								<FieldError errors={[form.formState.errors.time]} />
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="people"
						render={({ field }) => (
							<Field>
								<FieldLabel>Inimeste arv</FieldLabel>
								<Input
									type="number"
									min={1}
									max={12}
									value={field.value}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
								<FieldError errors={[form.formState.errors.people]} />
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="location"
						render={({ field }) => (
							<Field>
								<FieldLabel>Tsoon</FieldLabel>
								<select
									value={field.value}
									onChange={(e) => field.onChange(e.target.value)}
									className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
								>
									<option value="">Koik tsoonid</option>
									{TABLE_LOCATIONS.map((location) => (
										<option key={location} value={location}>
											{LOCATION_LABELS[location]}
										</option>
									))}
								</select>
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="preferredFeatures"
						render={({ field }) => (
							<Field>
								<FieldLabel>Eelistused</FieldLabel>

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
													onChange={(event) => {
														const nextFeatures = event.target.checked
															? [...field.value, feature]
															: field.value.filter((item) => item !== feature);

														field.onChange(nextFeatures);
													}}
												/>
												<span>{FEATURE_LABELS[feature]}</span>
											</label>
										);
									})}
								</div>
							</Field>
						)}
					/>

					<div className="flex flex-col gap-2 sm:flex-row">
						<Button type="submit" disabled={isSearching}>
							{isSearching ? "Otsin vabu laudu..." : "Leia vabad lauad"}
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								form.reset(defaultValues);
								onClear?.();
							}}
						>
							Lahtesta
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
