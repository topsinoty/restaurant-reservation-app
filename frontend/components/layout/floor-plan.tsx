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
		<div className="w-full rounded-2xl border bg-slate-50 p-4 sm:p-6 lg:max-w-[65%]">

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
