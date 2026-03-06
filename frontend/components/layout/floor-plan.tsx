import { layout } from "@/lib/layout";
import { FloorPlanManager } from "./floor-plan-manager";

export const FloorPlan = async () => {
	const planner = new FloorPlanManager(layout);

	const tables = await planner.init();

	return (
		<section className="bg-accent grid grid-cols-8 grid-rows-6 h-screen gap-8 w-full">
			{tables.map((t) => (
				<div
					className="bg-white border border-black"
					key={t.id}
					style={{
						gridColumn: t.x + 1,
						gridRow: t.y + 1,
					}}
				>
					{t.capacity}
				</div>
			))}
		</section>
	);
};
