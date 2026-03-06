import { PositionedTable } from "@/types/table";
import { getBgColor } from "./getBgColor";

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
			}}
		>
			{x}:{y} {location}
			<br />
			{capacity}
		</div>
			{windowLocation.left && capacity > 3 && (
				<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-black/40 rounded-r-full" />
			)}

			{windowLocation.top && capacity > 3 && (
				<div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-3/5 bg-black" />
			)}
	);
}
