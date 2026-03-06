import { PositionedTable } from "@/types/table";
import { CSSProperties } from "react";

const FEATURE_COLORS = {
	GREAT_VIEW: [34, 197, 94],
	KIDS_AREA: [234, 179, 8],
	QUIET: [100, 116, 139],
	ROMANTIC: [236, 72, 153],
	BUSY: [147, 51, 234],
	WINDOW_SIDE: [59, 130, 246],
} as const;

function mixPastel(rgb: [number, number, number]) {
	const PASTEL = 0.6;

	return rgb.map((c) => Math.round(c + (255 - c) * PASTEL)) as [
		number,
		number,
		number,
	];
}

export function getBgColor(
	input: Readonly<PositionedTable["features"]>,
): CSSProperties["backgroundColor"] {
	if (input.length === 0) {
		return "rgb(240,255,230)";
	}

	let r = 0;
	let g = 0;
	let b = 0;

	for (const f of input) {
		const [fr, fg, fb] = FEATURE_COLORS[f];
		r += fr;
		g += fg;
		b += fb;
	}

	r /= input.length;
	g /= input.length;
	b /= input.length;

	const [pr, pg, pb] = mixPastel([r, g, b]);

	return `rgb(${pr}, ${pg}, ${pb})`;
}
