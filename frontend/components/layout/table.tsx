import { PositionedTable } from "@/types/table";
import { FaPeopleGroup } from "react-icons/fa6";

export type TableStatusColors = Record<
	"Neutral" | "Recommended" | "Best" | "Available" | "Occupied",
	`#${string}`
>;

interface TableProps {
	cellSize: number;
	onSelect?: (id: number) => void;
	isRecommended?: boolean;
	isTopRecommended?: boolean;
	isOccupied?: boolean;
	isIdle?: boolean;
	isSelectable?: boolean;
	isSelected?: boolean;
	colors: TableStatusColors;
	isFilteredOut?: boolean;
}

export function Table({
	x,
	y,
	capacity,
	features,
	id,
	cellSize,
	onSelect,
	isRecommended,
	isTopRecommended,
	isOccupied,
	isIdle,
	isSelectable,
	isSelected,
	colors,
	isFilteredOut,
}: Readonly<PositionedTable> & TableProps) {
	const ratio = capacity / 10;
	const size = cellSize * (0.4 + ratio * 0.6);

	const hasWindow = features.includes("WINDOW_SIDE");

	const windowLocation = {
		left: hasWindow && x === 0,
		top: hasWindow && y === 0,
	};

	function resolveBackgroundColor(): string {
		if (isFilteredOut) return colors.Neutral;
		if (isIdle) return colors.Neutral;
		if (isOccupied) return colors.Occupied;
		if (isTopRecommended) return colors.Best;
		if (isRecommended) return colors.Recommended;
		return colors.Available;
	}

	function borderStyle(): string {
		if (isSelected) return "3px solid rgb(15,23,42)";
		if (isTopRecommended) return `3px solid ${colors.Best}`;
		if (isRecommended) return `2px solid ${colors.Recommended}`;
		if (isOccupied) return "2px solid rgb(156,163,175)";
		return "1px solid rgb(148,163,184)";
	}

	const generateBoxShadow = (topRecommended: string, recommended: string) => {
		if (isTopRecommended) return topRecommended;
		if (isRecommended) return recommended;
	};

	const boxShadow = generateBoxShadow(
		"0 8px 20px rgba(245,158,11,0.35)",
		"0 6px 14px rgba(37,99,235,0.25)",
	);

	const generateOpacity = (
		filteredOutOpacity: number,
		occupiedOpacity: number,
	) => {
		if (isFilteredOut) return filteredOutOpacity;
		if (isOccupied) return occupiedOpacity;
		return 1;
	};

	const opacity = generateOpacity(0.35, 0.75);

	const disabled = !isSelectable || isFilteredOut;

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={() => onSelect?.(id)}
			className="cursor-pointer absolute border rounded-xl flex flex-col items-center justify-center text-sm z-10 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
			style={{
				left: x * cellSize + cellSize / 2 - size / 2,
				top: y * cellSize + cellSize / 2 - size / 2,
				width: size,
				height: size,
				backgroundColor: resolveBackgroundColor(),
				border: borderStyle(),
				boxShadow,
				opacity,
				...(capacity <= 3 && { borderRadius: "100%" }),
			}}
		>
			{windowLocation.left && capacity > 3 && (
				<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-black/40 rounded-r-full" />
			)}

			{windowLocation.top && capacity > 3 && (
				<div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-3/5 bg-black/40 rounded-b-full" />
			)}

			<span className="font-bold">#{id}</span>

			<span className="flex items-center gap-1">
				{capacity} <FaPeopleGroup />
			</span>

			{isOccupied && !isFilteredOut && (
				<span className="absolute -top-2 -right-2 rounded-full bg-slate-700 px-1.5 py-0.5 text-xs text-white">
					Occupied
				</span>
			)}

			{isTopRecommended && !isFilteredOut && (
				<span className="absolute -bottom-2 -left-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-xs text-slate-900">
					Best
				</span>
			)}
		</button>
	);
}
