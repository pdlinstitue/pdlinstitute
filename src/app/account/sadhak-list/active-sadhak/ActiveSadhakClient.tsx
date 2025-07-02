"use client";
import React, { useState, useTransition } from "react";
import DataTable from "../../../components/table/DataTable";
import { FaUserCircle } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import { HiMinus } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import Loading from "../../Loading";
import { TbPasswordFingerprint } from "react-icons/tb";
import { format } from "date-fns";
import { fetchPaginatedSadhaks } from "./action";

interface SadhakListProps {
  sdkFstName: string;
  sdkMdlName: string;
  sdkLstName: string;
  sdkRegNo: string;
  sdkBthDate: Date;
  sdkGender: string;
  isMedIssue: string;
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

interface ActiveSdk {
  initialList: SadhakListProps[];
  totalPages:number;
  currentPage: number;
  pageSize: number;
  search?: string;
  accessToken?: string;
  refreshToken?: string;
  usrRole?: string;
}

const ActiveSadhakClient: React.FC<ActiveSdk> = ({ initialList, totalPages, currentPage, pageSize, search, accessToken, refreshToken, usrRole }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialList || []);  
  const [isPending, startTransition] = useTransition();  
  const [totalPagesState, setTotalPages] = useState(totalPages);
  const [currentPageState, setCurrentPage] = useState(currentPage);

  const handlePageChange = (newPage: number) => {
    startTransition(async () => {
      setIsLoading(true);
      const result = await fetchPaginatedSadhaks(newPage, pageSize, filtered, accessToken, refreshToken, usrRole);
      setData(result.activeSdkList);
      setPageInput(newPage);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      setIsLoading(false);
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    startTransition(async () => {
      setFiltered(searchTerm);
      setIsLoading(true);
      const result = await fetchPaginatedSadhaks(1, pageSize, searchTerm, accessToken, refreshToken, usrRole);
      setData(result.activeSdkList);
      setPageInput(1);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
      setIsLoading(false);
    });
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };
  const columns = React.useMemo(
    () => [
      {
        header: "Profile",
        accessorKey: "sdkImg",        
        cell: ({ row }: { row: any }) => {
          const { sdkImg, _id } = row.original;
          const profileUrl = `/account/profile-setting/${_id}`;

          return (
            <Link
              href={profileUrl}
              className="flex justify-center items-center"
            >
              {sdkImg ? (
                <img
                  src={`/api/profile-upload?name=${sdkImg}`}
                  alt="Profile"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-400 w-[50px] h-[50px]" />
              )}
            </Link>
          );
        },
      },
      { header: "Sadhak", accessorKey: "sdkFstName" },
      { header: "Sdk ID", accessorKey: "sdkRegNo" },
      {
        header: "DOR",
        accessorKey: "createdAt",
        cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
      },
      {
        header: "Phone",
        accessorKey: "sdkPhone",
        cell: ({ row }: { row: any }) => (
          <Link href={`tel:${row.original.sdkPhone}`} className="text-blue-700">
            {row.original.sdkPhone}
          </Link>
        ),
      },
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

  const [filtered, setFiltered] = React.useState(search);
  const [pageInput, setPageInput] = React.useState(currentPageState);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),    
    manualPagination: true, // 👈 tells table not to paginate internally
    pageCount: -1, // -1 = unknown page count; or set exact if known
    state: {      
      globalFilter: filtered,
    },    
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setFiltered,
  });

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 items-center justify-between mb-4">
        {usrRole !== "View-Admin" && (
          <Link
            href="/account/add-new-sadhak"
            title="Add New Sadhak"
            className="btnLeft"
          >
            <FaUserPlus size={24} />
          </Link>
        )}
        <input
          type="text"
          className="inputBox w-[300px]"
          placeholder="Search anything..."
          onChange={(e) => handleSearchChange(e.target.value)}
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
            onClick={() => handlePageChange(1)}
            disabled={pageInput === 1}
          >
            {"<<"}
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100"
            onClick={() => handlePageChange(Math.max(1, pageInput - 1))}
            disabled={pageInput === 1}
          >
            Previous
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100"
            onClick={() => handlePageChange(pageInput + 1)}
            disabled={data.length < pageSize} // means last page
          >
            Next
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100"
            onClick={() => handlePageChange(totalPagesState)}
            disabled={data.length < pageSize} // means last page
          >
            {">>"}
          </button>
        </div>
        <div className="flex mt-4 items-center justify-between">
          <div className="flex flex-col">
            <p className="italic">Total Pages: &nbsp; {totalPagesState}</p>
            <p className="italic">
              You are on page: &nbsp;{" "}
              {currentPageState} of {totalPagesState}
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <p className="italic">Jump to page: &nbsp;</p>
            <input
              type="number"
              className="px-2 py-1 rounded-lg border-[1.5px] border-black w-[70px] inline"
              value={pageInput}
              onChange={(e) => {
                const newPage = Number(e.target.value);
                setPageInput(newPage);
                if (newPage >= 1) handlePageChange(newPage);
              }}
              disabled={data.length < pageSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSadhakClient;