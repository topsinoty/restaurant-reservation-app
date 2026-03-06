"use client";

import { PositionedTable } from "@/types/table";
import { Table } from "./table";

type FloorPlanProps = {
	tables: PositionedTable[];
	hasActiveSearch: boolean;
	availableTableIds: Set<number>;
	recommendedIds: Set<number>;
	topRecommendedId: number | null;
	randomOccupiedIds: Set<number>;
	selectedTableId: number | null;
	onSelectTable: (id: number) => void;
	isSearching?: boolean;
};

const CELL_SIZE = 92;
const GRID_WIDTH = 8;
const GRID_HEIGHT = 6;

export function FloorPlan({
	tables,
	hasActiveSearch,
	availableTableIds,
	recommendedIds,
	topRecommendedId,
	randomOccupiedIds,
	selectedTableId,
	onSelectTable,
	isSearching,
}: Readonly<FloorPlanProps>) {
	return (
		<div className="w-full rounded-2xl border bg-slate-50 p-4 sm:p-6 lg:max-w-[65%]">
			<div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
				<span className="rounded-full border border-slate-300 px-2 py-1">Grey: Occupied</span>
				<span className="rounded-full border-2 border-sky-500 px-2 py-1">Blue: Recommended</span>
				<span className="rounded-full border-2 border-amber-400 px-2 py-1">Gold: Best Option</span>
				<span className="rounded-full border-2 border-slate-900 px-2 py-1">Black: Currently Selected Table</span>
			</div>

			<div className="overflow-auto">
				<div
					className="relative rounded-2xl border bg-white"
					style={{
						width: CELL_SIZE * GRID_WIDTH,
						height: CELL_SIZE * GRID_HEIGHT,
					}}
				>
					{tables.map((table) => {
						const isOccupied = hasActiveSearch
							? !availableTableIds.has(table.id)
							: randomOccupiedIds.has(table.id);

						return (
							<Table
								key={table.id}
								{...table}
								cellSize={CELL_SIZE}
								onSelect={onSelectTable}
								isOccupied={isOccupied}
								isSelectable={hasActiveSearch && !isOccupied}
								isRecommended={hasActiveSearch && recommendedIds.has(table.id)}
								isTopRecommended={hasActiveSearch && topRecommendedId === table.id}
								isSelected={selectedTableId === table.id}
							/>
						);
					})}

					<div
						className="absolute rounded-br-xl rounded-tl-xl border border-sky-100 bg-sky-100/70"
						style={{
							width: CELL_SIZE * 1.2,
							height: CELL_SIZE * 5.2,
							left: 0,
							top: 0,
						}}
					/>
					<div
						className="absolute rounded-xl border border-amber-100 bg-amber-100/70"
						style={{
							width: CELL_SIZE * 2.2,
							height: CELL_SIZE * 1.2,
							left: 0,
							top: 0,
						}}
					/>
					<div
						className="absolute rounded-xl border border-emerald-100 bg-emerald-100/70"
						style={{
							width: CELL_SIZE * 2.2,
							height: CELL_SIZE * 4.5,
							right: 0,
							top: CELL_SIZE * 1.3,
						}}
					/>
					<div
						className="pointer-events-none absolute left-4 top-3 rounded bg-sky-700 px-2 py-1 text-[11px] font-medium text-white"
					>
						Corner
					</div>
					<div
						className="pointer-events-none absolute left-40 top-3 rounded bg-amber-700 px-2 py-1 text-[11px] font-medium text-white"
					>
						Inner area
					</div>
					<div
						className="pointer-events-none absolute right-3 top-36 rounded bg-emerald-700 px-2 py-1 text-[11px] font-medium text-white"
					>
						Terrace
					</div>

					{isSearching && (
						<div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/75">
							<span className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700">
								Searching for availability...
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
