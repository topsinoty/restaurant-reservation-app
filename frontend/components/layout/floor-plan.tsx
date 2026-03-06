import { FloorPlanManager } from "./floor-plan-manager";
import { Table } from "./table";

export const FloorPlan = async () => {
	const planner = new FloorPlanManager();
	const tables = await planner.init();
	const CELL_SIZE = 100;

	return (
		<div className="w-min max-w-full lg:max-w-3/5 border overflow-scroll p-8 rounded-2xl bg-gray-100">
			<div
				className="relative"
				style={{
					width: CELL_SIZE * 8,
					height: CELL_SIZE * 6,
				}}
			>
				{tables.map((t) => (
					<Table key={t.id} {...t} cellSize={CELL_SIZE} />
				))}
				{/* Outside overlay */}
				<div
					className="absolute bg-pink-400 rounded-b-2xl"
					style={{
						width: CELL_SIZE * 2 + 16,
						height: CELL_SIZE * 4 + 16,
						right: -8,
						bottom: CELL_SIZE - 8,
					}}
				/>
				<div
					className="w-full absolute bg-blue-400 z-0 rounded-b-2xl rounded-tl-2xl"
					style={{
						width: CELL_SIZE * 1 + 16,
						height: CELL_SIZE * 5 + 16,
						left: -8,
						bottom: CELL_SIZE - 8,
					}}
				/>
				<div
					className="w-full absolute bg-blue-400 z-0 rounded-tl-2xl rounded-tr-2xl"
					style={{
						width: CELL_SIZE * 8 + 16,
						height: CELL_SIZE * 1 + 16,
						left: -8,
						top: -8,
					}}
				/>
				<div
					className="bg-orange-400 absolute rounded-2xl"
					style={{
						width: CELL_SIZE * 3 + 16,
						height: CELL_SIZE * 3 + 16,
						right: CELL_SIZE * 3 - 8,
						top: CELL_SIZE * 2 - 8,
					}}
				/>
				<div className="bg-" />
			</div>
		</div>
	);
};
