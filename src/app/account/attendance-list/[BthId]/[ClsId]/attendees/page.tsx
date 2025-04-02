"use client";
import DataTable from "@/app/components/table/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  FilterFn,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { BASE_API_URL } from "@/app/utils/constant";
import { Checkbox } from "@mui/material";
import Loading from "@/app/account/Loading";
import { BiEditAlt } from "react-icons/bi";
import Cookies from "js-cookie";

interface IAtdParams {
  params:Promise<{
    BthId: string;
    ClsId: string;
  }>;
}

interface ClassAttendeesProps {
  _id: string;
  clsId: string;
  sdkId: string;
  sdkFstName: string;
  sdkPhone: string;
  status: string;
  absRemarks: string;
}

const ClassAttendees: React.FC<IAtdParams> = ({ params }) => {
  
  const router = useRouter();
  const { BthId, ClsId } = use(params);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enrollData, setEnrollData] = useState<ClassAttendeesProps[]>([]);
  const [selectedRows, setSelectedRows] = useState<ClassAttendeesProps[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  const StatusCell = ({ row }: { row: any }) => {
    const statusClass = (value: string) =>
      value === "Present"
        ? "text-green-500 italic"
        : value === "Absent"
        ? "text-red-500 italic"
        : value === "Pending"
        ? "text-orange-500 italic"
        : "text-black";
    return <span className={statusClass(row.original.status)}>{row.original.status}</span>;
  };

  const data = React.useMemo(() => enrollData ?? [], [enrollData]);
  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: { table: any }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()} // ✅ Correct function
            indeterminate={table.getIsSomeRowsSelected()} // ✅ Shows partial selection
            onChange={(e) => {
              table.toggleAllRowsSelected(e.target.checked); // ✅ Correct function
            }}
          />
        ),
        cell: ({ row }: { row: any }) => (
          <Checkbox
            checked={row.getIsSelected()} // ✅ Correct function
            onChange={(e) => {
              row.toggleSelected(e.target.checked); // ✅ Correct function
            }}
          />
        ),
      },
      { header: "Sadhak Name", accessorKey: "sdkFstName" },
      { header: "Sadhak Phone", accessorKey: "sdkPhone" },
      { header: "Status", accessorKey: "status", cell: StatusCell },
      { header: "Remarks", accessorKey: "absRemarks" },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }: { row: any }) => (
          <div className="flex items-center gap-4">
            <button
              type="button"
              title="Mark"
              onClick={() =>
                router.push(`/account/attendance-list/${BthId}/${ClsId}/attendees/mark-attendance/${row.original.sdkId}`)
              }
              className="text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black"
            >
              <FiEye size={12} />
            </button>
            <button
              type="button"
              title="Amend"
              onClick={() =>
                router.push(`/account/attendance-list/${BthId}/${ClsId}/attendees/mark-attendance/${row.original.sdkId}/amend-attendance`)
              }
              className="text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full hover:border-black"
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
  const [pageSize] = useState(25);

  const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => {
    return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase());
  };

  useEffect(() => {
    async function fetchBatchData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/enrollment-by-batch-id/${BthId}/${ClsId}`, {
          cache: "no-store",
        });
        const attendData = await res.json();

        const enrollList: ClassAttendeesProps[] = attendData.enrollments?.map((item: any) => ({
          _id: item._id,
          clsId: ClsId,
          sdkFstName: item.createdBy.sdkFstName,
          sdkPhone: item.createdBy.sdkPhone || "",
          sdkId: item.createdBy._id,
          status: item.attendanceStatus,
          absRemarks: item.attendanceRemark,
        }));

        setEnrollData(enrollList);
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBatchData();
  }, [BthId, ClsId]); // ✅ Added dependencies

  const loggedInUser = {
    result:{
      _id:Cookies.get("loggedInUserId"), 
      usrName:Cookies.get("loggedInUserName"),
      usrRole:Cookies.get("loggedInUserRole"),
    }
  };

  const markAsPresent = async () => {
    const selectedData = table.getSelectedRowModel().rows.map((row) => row.original);
  
    if (selectedData.length === 0) {
      alert("No rows selected!");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_API_URL}/api/mark-attendance/${BthId}/${ClsId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sdkIds: selectedData.map((row) => row.sdkId), // ✅ Send correct data
          status: "Present",
          absRemarks:"",
          markedBy:loggedInUser.result._id
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update attendance");
      }
  
      alert("Attendance marked as Present successfully!");
  
      // ✅ Update UI without reloading
      setEnrollData((prevData) =>
        prevData.map((item) =>
          selectedData.some((row) => row.sdkId === item.sdkId)
            ? { ...item, status: "Present", absRemarks:"" }
            : item
        )
      );
  
      table.resetRowSelection(); // ✅ Clear selection in table
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Error updating attendance!");
    }
  };    

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
    state: { sorting, globalFilter: filtered, pagination: { pageIndex: pageInput - 1, pageSize }, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
    onRowSelectionChange: setRowSelection,
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex mb-2 items-center justify-between">
        <button type="button" className="btnLeft" onClick={markAsPresent}>
          Mark Multiple
        </button>
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
    </div>
  );
};

export default ClassAttendees;