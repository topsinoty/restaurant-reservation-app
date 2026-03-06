import { FloorPlan } from "@/components/layout/floor-plan";
import { ReservationForm } from "@/components/layout/table";

export default function Home() {
	return (
		<section>
			<h1 className="text-4xl mb-6">Booking Service</h1>
			<div className="w-full h-full flex flex-col">
				<span className="text-xl mb-4">Please select a table</span>
				<div className="w-full h-full flex flex-col lg:flex-row gap-8">
					<FloorPlan />
					<ReservationForm />
				</div>
			</div>
		</section>
	);
}
