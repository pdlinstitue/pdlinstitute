"use client";
import React, { useEffect, useState } from "react";
import DataTable from "../../../components/table/DataTable";
import { FaUserPlus } from "react-icons/fa6";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  FilterFn,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import { HiMinus } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import Loading from "../../Loading";
import { TbPasswordFingerprint } from "react-icons/tb";
import { BASE_API_URL } from "@/app/utils/constant";
import { format } from "date-fns";

interface SadhakListProps {
  sdkFstName: string;
  sdkMdlName: string;
  sdkLstName: string;
  sdkRegNo: string;
  sdkBthDate: Date;
  sdkGender: string;
  isMedIssue:string,
  sdkMarStts: string;
  sdkSpouce: string;
  sdkPhone: string;
  sdkWhtNbr: string;
  sdkEmail: string;
  sdkComAdds: string;
  sdkParAdds: string;
  sdkImg: string;
  sdkRole: string;
}

const ActiveSadhakList: React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSdk, setActiveSdk] = useState<SadhakListProps[] | null>([]);
  const data = React.useMemo(() => activeSdk ?? [], [activeSdk]);
  const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\, yyyy')};
  const columns = React.useMemo(
    () => [
      { header: "Sadhak", accessorKey: "sdkFstName" },
      { header: "Sdk ID", accessorKey: "sdkRegNo" },
      { header: 'DOR', 
        accessorKey: 'createdAt',
        cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
      },
      { header: "Phone", accessorKey: "sdkPhone",
        cell: ({ row }: { row: any }) => (
          <Link href={`tel:${row.original.sdkPhone}`} className='text-blue-700'>
            {row.original.sdkPhone}
          </Link>
        )
       },
      { header: "WhatsApp", accessorKey: "sdkWhtNbr" },
      { header: "Medical", accessorKey: "isMedIssue" },
      { header: "State", accessorKey: "sdkState" },
      { header: "Country", accessorKey: "sdkCountry" },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }: { row: any }) => (
          <div className="flex items-center gap-3 justify-center">
            <button
              type="button"
              title="View"
              onClick={() =>
                router.push(
                  `/account/sadhak-list/active-sadhak/${row.original._id}/view-sadhak`
                )
              }
              className="text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black"
            >
              <FiEye size={12} />
            </button>
            <button
              type="button"
              title="Re-Generate Password"
              onClick={() =>
                router.push(
                  `/account/sadhak-list/active-sadhak/${row.original._id}/re-generate-pwd`
                )
              }
              className="text-blue-700 border-[1.5px] border-blue-700 p-1 rounded-full  hover:border-black"
            >
              <TbPasswordFingerprint size={12} />
            </button>
            <button
              type="button"
              title="Edit"
              onClick={() =>
                router.push(
                  `/account/sadhak-list/active-sadhak/${row.original._id}/edit-sadhak`
                )
              }
              className="text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black"
            >
              <BiEditAlt size={12} />
            </button>
            <button
              type="button"
              title="Disable"
              onClick={() =>
                router.push(
                  `/account/sadhak-list/active-sadhak/${row.original._id}/disable-sadhak`
                )
              }
              className="text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full  hover:border-black"
            >
              <HiMinus size={12} />
            </button>
            <button
              type="button"
              title="Delete"
              onClick={() =>
                router.push(
                  `/account/sadhak-list/active-sadhak/${row.original._id}/delete-sadhak`
                )
              }
              className="text-red-500 border-[1.5px] border-red-700 p-1 rounded-full  hover:border-black"
            >
              <RxCross2 size={12} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtered, setFiltered] = React.useState("");
  const [pageInput, setPageInput] = React.useState(1);

  const globalFilterFn: FilterFn<any> = (
    row,
    columnId: string,
    filterValue
  ) => {
    return String(row.getValue(columnId))
      .toLowerCase()
      .includes(String(filterValue).toLowerCase());
  };

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

  useEffect(() => {
    async function fetchSadhakData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/users/list`, {
          method: "GET", // Explicitly specify the HTTP method
          cache: "no-store",
        });

        const sadhakData = await res.json();
        setActiveSdk(sadhakData.activeSdkList);

      } catch (error) {
          console.error("Error fetching sadhak data:", error);
      } finally {
          setIsLoading(false);
      }
    }
    fetchSadhakData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className='flex gap-2 items-center justify-between mb-4'>
          <Link href="/account/add-new-sadhak" className='btnLeft'><FaUserPlus size={24}/></Link>
        <input type='text' className='inputBox w-[300px]' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)}/>
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

export default ActiveSadhakList;
