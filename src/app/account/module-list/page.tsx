"use client";
import DataTable from "@/app/components/table/DataTable";
import { BASE_API_URL } from "@/app/utils/constant";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  FilterFn,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import Loading from "../Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

const ModuleList: React.FC = () => {
  const router = useRouter();
  const [moduleList, setModuleList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const data = React.useMemo(() => moduleList ?? {}, [moduleList]);
  const columns = React.useMemo(
    () => [
      { header: "Module", accessorKey: "modName" },
      { header: "Created By", accessorKey: "createdBy.sdkFstName" },
      { header: "Updated By", accessorKey: "updatedBy.sdkFstName" },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }: { row: any }) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="View"
              onClick={() =>
                router.push(
                  `/account/module-list/${row.original._id}/view-module`
                )
              }
              className="text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black"
            >
              <FiEye size={12} />
            </button>
            <button
              type="button"
              title="Edit"
              onClick={() =>
                router.push(
                  `/account/module-list/${row.original._id}/edit-module`
                )
              }
              className="text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black"
            >
              <BiEditAlt size={12} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtered, setFiltered] = useState("");
  const [pageInput, setPageInput] = useState(1);

  const globalFilterFn: FilterFn<any> = (
    row,
    columnId: string,
    filterValue
  ) => {
    return String(row.getValue(columnId))
      .toLowerCase()
      .includes(String(filterValue).toLowerCase());
  };

  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: "",
      usrName: "",
      usrRole: "",
    },
  });

  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || "";
      const userName = Cookies.get("loggedInUserName") || "";
      const userRole = Cookies.get("loggedInUserRole") || "";
      setLoggedInUser({
        result: {
          _id: userId,
          usrName: userName,
          usrRole: userRole,
        },
      });
    } catch (error) {
      console.error("Error fetching loggedInUserData.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchModuleData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/modules`, {
          cache: "no-store",
        });
        const moduleData = await res.json();
        setModuleList(moduleData.modules);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchModuleData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalFilterFn,
    state: {
      sorting: sorting,
      globalFilter: filtered,
      pagination: { pageIndex: pageInput - 1, pageSize: 100 },
    },
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setFiltered,
  });

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = e.target.value ? Number(e.target.value) - 1 : 0;
    setPageInput(Number(e.target.value));
    table.setPageIndex(page);
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex mb-2 items-center justify-between">
        {loggedInUser?.result?.usrRole !== "View-Admin" && (
          <Link href="/account/add-new-module" className="btnLeft">
            CREATE MODULE
          </Link>
        )}

        <input
          type="text"
          className="inputBox w-[300px]"
          placeholder="Search anything..."
          onChange={(e) => setFiltered(e.target.value)}
        />
      </div>
      <div className="overflow-auto max-h-[412px]">
        <DataTable table={table} />
      </div>
      <div>
        <div className="flex mt-4 gap-1">
          <button
            type="button"
            className="px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100"
            onClick={() => {
              setPageInput(1);
              table.setPageIndex(0);
            }}
          >
            {"<<"}
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100"
            onClick={() => {
              setPageInput((prev) => Math.max(prev - 1, 1));
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100"
            onClick={() => {
              setPageInput((prev) => Math.min(prev + 1, table.getPageCount()));
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100"
            onClick={() => {
              setPageInput(table.getPageCount());
              table.setPageIndex(table.getPageCount() - 1);
            }}
          >
            {">>"}
          </button>
        </div>
        <div className="flex mt-4 items-center justify-between">
          <div className="flex flex-col">
            <p className="italic">Total Pages: &nbsp; {table.getPageCount()}</p>
            <p className="italic">
              You are on page: &nbsp;{" "}
              {(table.options.state.pagination?.pageIndex ?? 0) + 1}
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <p className="italic">Jump to page: &nbsp;</p>
            <input
              type="number"
              className="px-2 py-1 rounded-lg border-[1.5px] border-black w-[70px] inline"
              value={pageInput}
              onChange={handlePageChange}
              min={1}
              max={table.getPageCount()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleList;