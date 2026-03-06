import { FloorPlanManager } from "./floor-plan-manager";
import { Table } from "./table";

export const FloorPlan = async () => {
	const planner = new FloorPlanManager();
	const tables = await planner.init();
	const CELL_SIZE = 100;

	return (
		<div
			className="relative border bg-gray-100"
			style={{
				width: CELL_SIZE * 8,
				height: CELL_SIZE * 6,
			}}
		>
			{tables.map((t) => (
				<Table key={t.id} {...t} cellSize={CELL_SIZE} />
			))}
		</div>
	);
};
