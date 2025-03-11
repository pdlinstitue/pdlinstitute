"use client";
import React from "react";
import { flexRender } from "@tanstack/react-table";

interface DataTableProps {
  table: any;
}

const DataTable: React.FC<DataTableProps> = ({ table }) => {
  return (
    <div>
      <table className="table-auto w-full">
        <thead className="text-left bg-gray-300 sticky top-0">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th
                  key={header.id}
                  className="p-3"
                  onClick={() => header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span>
                          {" "}
                          {header.column.getIsSorted() === "desc"
                            ? " 🔽"
                            : " 🔼"}{" "}
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-left">
          {table
            .getRowModel()
            .rows.map(
              (row: {
                id: string;
                getVisibleCells: () => {
                  id: string;
                  column: { columnDef: { cell: any } };
                  getContext: () => any;
                }[];
              }) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-100 border-b-[1.5px] border-gray-200"
                >
                  {row
                    .getVisibleCells()
                    .map(
                      (cell: {
                        id: string;
                        column: { columnDef: { cell: any } };
                        getContext: () => any;
                      }) => (
                        <td key={cell.id} className="py-2 px-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    )}
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
