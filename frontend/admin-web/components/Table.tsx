"use client";

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
    SortingState,
    ColumnDef,
} from "@tanstack/react-table";
import React from "react";

export type TableProps<T> = {
    columnDef: ColumnDef<T, any>[];
    data: T[];
};

export default function Table<T>({ columnDef, data }: TableProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const columns = columnDef;

    const table = useReactTable({
        columns: columns,
        data: data,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    });

    const headers = table.getFlatHeaders();
    const rows = table.getRowModel().rows;

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        {headers.map((header) => {
                            const direction = header.column.getIsSorted();

                            const arrow: any = {
                                asc: "🔼",
                                desc: "🔽",
                            };

                            const sort_indicator = direction && arrow[direction];

                            return (
                                <th key={header.id}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer flex gap-4"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {direction && <span>{sort_indicator}</span>}
                                        </div>
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
