"use client";

import { PositionedTable } from "@/types/table";
import { getBgColor } from "./getBgColor";
import { date, z, iso, number, object, string } from "zod";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Card } from "../ui/card";

type WindowLocation = {
	left: boolean;
	top: boolean;
};

async function bookTable(tableId: number) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	const res = await fetch("http://localhost:8080/api/reservations/book", {
		method: "POST",
		headers,
		body: JSON.stringify({
			tableId,
			date: "2026-04-02",
			time: "20:40",
			people: 4,
		}),
	});
	console.log(await res.json());
}

const reservationBookingSchema = object({
	tableId: number(),
	date: iso.date(),
	time: iso.time(),
	people: number(),
});

export function ReservationForm() {
	const form = useForm<z.infer<typeof reservationBookingSchema>>({
		resolver: standardSchemaResolver(reservationBookingSchema),
	});

	function onSubmit(data: z.infer<typeof reservationBookingSchema>) {
		console.log(data);
	}

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="w-full h-min bg-black"
		>
			<Card />
		</form>
	);
}

export function Table({
	x,
	y,
	location,
	capacity,
	features,
	id,
	cellSize,
}: Readonly<PositionedTable> & { cellSize: number }) {
	const ratio = capacity / 10;
	const size = cellSize * (0.4 + ratio * 0.6);

	const hasWindow = features.includes("WINDOW_SIDE");

	const windowLocation: WindowLocation = {
		left: hasWindow && x === 0,
		top: hasWindow && y === 0,
	};

	return (
		<div
			className="absolute border rounded-xl flex items-center justify-center bg-white text-xs"
			style={{
				left: x * cellSize + cellSize / 2 - size / 2,
				top: y * cellSize + cellSize / 2 - size / 2,
				width: size,
				height: size,
				backgroundColor: getBgColor(features),
				...(capacity <= 3 && { borderRadius: "100%" }),
			}}
		>
			{windowLocation.left && capacity > 3 && (
				<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-black/40 rounded-r-full" />
			)}

			{windowLocation.top && capacity > 3 && (
				<div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-3/5 bg-black" />
			)}
		</button>
	);
}
