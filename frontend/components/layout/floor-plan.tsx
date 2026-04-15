"use client";

import { Ref, useEffect, useRef, useState } from "react";
import { PositionedTable, TABLE_LOCATIONS } from "@/types/table";
import { Table, TableStatusColors } from "./table";
import { Badge } from "../ui/badge";
import { ReservationSearchFilters } from "@/types/reservation";

type FloorPlanProps = {
    tables: PositionedTable[];
    hasActiveSearch: boolean;
    availableIds: Set<number>;
    bestTableId: number | null;
    selectedTableId: number | null;
    onSelectTable: (id: number) => void;
    isSearching?: boolean;
    selectedLocation?: ReservationSearchFilters["location"];
    minimumSize: number;
};

const MOBILE_BREAKPOINT = 726;
const DESKTOP_CELL_SIZE = 144;
const MOBILE_CELL_SIZE = 88;
const GRID_WIDTH = 8;
const GRID_HEIGHT = 6;

function resolveCellSize(viewportWidth: number): number {
    return viewportWidth < MOBILE_BREAKPOINT
        ? MOBILE_CELL_SIZE
        : DESKTOP_CELL_SIZE;
}

export function FloorPlan({
                              tables,
                              hasActiveSearch,
                              availableIds,
                              bestTableId,
                              selectedTableId,
                              onSelectTable,
                              isSearching,
                              selectedLocation,
                              ref,
                              minimumSize
                          }: Readonly<FloorPlanProps> & {
    ref?: Ref<HTMLDivElement>
}) {
    const [ cellSize, setCellSize ] = useState(DESKTOP_CELL_SIZE);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const tableElementsRef = useRef(new Map<number, HTMLButtonElement>());

    useEffect(() => {
        const updateCellSize = () => {
            setCellSize(resolveCellSize(window.innerWidth));
        };

        updateCellSize();
        window.addEventListener("resize", updateCellSize);

        return () => {
            window.removeEventListener("resize", updateCellSize);
        };
    }, []);

    useEffect(() => {
        if (!hasActiveSearch || isSearching || bestTableId === null) {
            return;
        }

        const scrollContainer = scrollContainerRef.current;
        const bestTable = tableElementsRef.current.get(bestTableId);

        if (!scrollContainer || !bestTable) {
            return;
        }

        const frameId = globalThis.requestAnimationFrame(() => {
            const containerRect = scrollContainer.getBoundingClientRect();
            const tableRect = bestTable.getBoundingClientRect();

            scrollContainer.scrollTo({
                top:
                    scrollContainer.scrollTop +
                    tableRect.top -
                    containerRect.top -
                    (containerRect.height - tableRect.height) / 2,
                left:
                    scrollContainer.scrollLeft +
                    tableRect.left -
                    containerRect.left -
                    (containerRect.width - tableRect.width) / 2,
                behavior: "smooth",
            });
        });

        return () => {
            globalThis.cancelAnimationFrame(frameId);
        };
    }, [ bestTableId, hasActiveSearch, isSearching ]);

    const { component: Legend, legend: colors } = legendMaker({
        Best: "#f59e0b",
        Available: "#A7F3D0",
        Occupied: "#ef4444",
        Neutral: "#c8c8c8",
    });

    const getTableStatus = (table: PositionedTable) => {
        console.log()
        const tooSmall = table.capacity < minimumSize
        const occupied = hasActiveSearch && !tooSmall ?
            !availableIds.has(table.id) :
            false;
        return {
            occupied, tooSmall
        }
    }

    return (
        <div
            className="relative h-min w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 lg:max-w-5/7">
            <div
                ref={(node) => {
                    scrollContainerRef.current = node;

                    if (typeof ref === "function") {
                        ref(node);
                        return;
                    }

                    if (ref) {
                        ref.current = node;
                    }
                }}
                className="max-h-screen w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm px-8"
            >
                {Legend}

                <div
                    className="relative"
                    style={{
                        width: cellSize * GRID_WIDTH,
                        height: cellSize * GRID_HEIGHT,
                    }}
                >
                    {!hasActiveSearch && (
                        <div
                            className="absolute inset-0 z-20 cursor-not-allowed bg-slate-900/15 rounded-2xl"/>
                    )}

                    <div className="absolute inset-0">
                        {tables.map((table) => {
                            const isOccupied = getTableStatus(table).occupied
                            const isTooSmall = getTableStatus(table).tooSmall

                            return (
                                <Table
                                    colors={colors}
                                    key={table.id}
                                    {...table}
                                    cellSize={cellSize}
                                    elementRef={(node) => {
                                        if (node) {
                                            tableElementsRef.current.set(table.id, node);
                                            return;
                                        }

                                        tableElementsRef.current.delete(table.id);
                                    }}
                                    onSelect={onSelectTable}
                                    isOccupied={isOccupied}
                                    isIdle={!hasActiveSearch}
                                    isSelectable={hasActiveSearch && !isOccupied}
                                    isAvailable={hasActiveSearch && availableIds.has(table.id)}
                                    isBestTable={hasActiveSearch && bestTableId === table.id}
                                    isSelected={selectedTableId === table.id}
                                    isFilteredOut={
                                        selectedLocation !== null &&
                                        table.location !== selectedLocation
                                    }
                                    isTooSmall={isTooSmall}
                                />
                            );
                        })}
                    </div>

                    <div
                        title={TABLE_LOCATIONS[1]}
                        className="absolute z-0 rounded-b-xl border border-slate-200 border-dashed bg-slate-50"
                        style={{
                            width: cellSize * 1.2,
                            height: cellSize * 3.95,
                            left: 0,
                            bottom: cellSize,
                        }}
                    />

                    <div
                        title={TABLE_LOCATIONS[1]}
                        className="absolute z-0 rounded-xl border border-slate-200 border-dashed bg-slate-50"
                        style={{
                            width: cellSize * 8,
                            height: cellSize * 1.05,
                            left: 0,
                            top: 0,
                        }}
                    />

                    <div
                        title={TABLE_LOCATIONS[2]}
                        className="absolute z-0 rounded-xl border border-slate-200 border-dashed bg-slate-50"
                        style={{
                            width: cellSize * 2.2,
                            height: cellSize * 3.95,
                            right: 0,
                            bottom: cellSize,
                        }}
                    />

                    <div
                        title={TABLE_LOCATIONS[0]}
                        className="absolute z-0 rounded-xl border border-slate-200 border-dashed bg-slate-50"
                        style={{
                            width: cellSize * 3.2,
                            height: cellSize * 3.2,
                            left: cellSize * 1.95,
                            top: cellSize * 2,
                        }}
                    />

                    {isSearching && (
                        <div
                            className="absolute inset-0 z-30 flex items-center justify-center bg-white/85">
							<span
                                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow">
								Searching for availability...
							</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const legendMaker = (legend: TableStatusColors, className: string = "") => {
    const component = (
        <div
            className="mb-3 flex flex-wrap items-center gap-4 px-2 py-2 pt-4 text-xs font-medium text-slate-800">
            {Object.entries(legend).map(([ key, color ]) => (
                <Badge key={key}
                       className={`flex items-center gap-2 ${className}`}>
					<span
                        className="h-3 w-3 rounded-sm border border-slate-300"
                        style={{ backgroundColor: color }}
                    />
                    <span>{key}</span>
                </Badge>
            ))}
        </div>
    );
    return { legend, component };
};
