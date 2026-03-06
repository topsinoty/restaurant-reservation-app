import { ReservationClient } from "@/components/layout/reservation-client";

export default function Home() {
	return (
		<section className="space-y-6">
			<header className="space-y-2">
				<h1 className="text-3xl font-semibold sm:text-4xl">
					Reservation System
				</h1>
				<p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
					Choose a date, time, preference options and amount of people.
				</p>
			</header>
			<ReservationClient />
		</section>
	);
}
