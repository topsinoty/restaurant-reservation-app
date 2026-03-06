import { PositionedTable } from "@/types/tables";

interface TableComponentProps {
	table: PositionedTable;
}

export function Table({ table }: Readonly<TableComponentProps>) {
	return (
		<div
			className="border rounded-lg flex items-center justify-center  bg-white"
			style={{
				gridColumn: table.x,
				gridRow: table.y,
			}}
		>
			{table.x}:{table.y} {table.location}
			<br />
			{table.capacity}
		</div>
	);
}
