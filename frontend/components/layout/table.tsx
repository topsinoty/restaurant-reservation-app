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
	);
}
