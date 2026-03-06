import { TableProps } from "@/types/tables";

export async function getTables(): Promise<TableProps[]> {
	const res = await fetch("http://localhost:8080/api/tables", {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed to fetch tables");
	}

	return res.json();
}
