"use client";
import React from "react";
import { flexRender } from "@tanstack/react-table";

interface DataTableProps {
  table: any;
}

const DataTable: React.FC<DataTableProps> = ({ table }) => {
  
  const rows = table?.getRowModel().rows;

  return (
    <div>
      <table className="table-auto w-full">
        <thead className="text-left bg-gray-300 sticky top-0">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th key={header.id} className="p-3">
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.columnDef.accessorKey !== "action" && !header.column.columnDef.disableFilter && (
                        <div>
                          <input
                            type="text"
                            placeholder="Filter..."
                            className="mt-1 p-1 border rounded w-full"
                            value={header.column.getFilterValue() || ""}
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-left">
          {rows.length > 0 ? (
            rows.map((row: any) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 border-b-[1.5px] border-gray-200"
              >
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} className="py-2 px-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={table.getAllColumns().length} className="text-center py-4">
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
