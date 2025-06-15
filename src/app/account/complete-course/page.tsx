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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@mui/material";
import { BASE_API_URL } from "@/app/utils/constant";
import Loading from "../Loading";
import Select from "react-select";
import Cookies from "js-cookie";
import { BiEditAlt } from "react-icons/bi";

interface SelectedCourseProps {
  _id: string;
  coName: string;
}
interface SelectedBatchProps {
  _id: string;
  bthName: string;
}

interface EnrollmentListProps {
  sdkId: string;
  corId: string;
  bthId: string;
  createdBy?: string;
}

const CompleteCourse: React.FC = () => {
  //changing the status color as per the status
  const StatusCell = ({ row }: { row: any }) => {
    const statusClass = (value: string) =>
      value === "Complete"
        ? "text-green-500 italic"
        : value === "Incomplete"
        ? "text-red-500 italic"
        : value === "Pending"
        ? "text-orange-500 italic"
        : "text-black";
    return (
      <span className={statusClass(row.original.isCompleted)}>
        {row.original.isCompleted}
      </span>
    );
  };

  const router = useRouter();
  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: { table: any }) => (
          <div className="flex items-center gap-1">
            <Checkbox
              checked={table.getIsAllRowsSelected()} // ✅ Correct function
              indeterminate={table.getIsSomeRowsSelected()} // ✅ Shows partial selection
              onChange={(e) => {
                table.toggleAllRowsSelected(e.target.checked); // ✅ Correct function
              }}
            />
            <span>Mark All</span>
          </div>
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
      {
        header: "Sadhak",
        accessorKey: "sdkFstName",
      },
      {
        header: "SDK ID",
        accessorKey: "sdkRegNo",
      },
      {
        header: "Presence(%)",
        accessorKey: "sdkPresent",
      },
      { header: "Status", accessorKey: "isCompleted", cell: StatusCell },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }: { row: any }) => (
          <div className="flex items-center justify-center">
            <button
              type="button"
              title="Edit"
              onClick={() =>
                router.push(
                  `/account/enrollment-list/${row.original._id}/edit-enrollment`
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [enrData, setEnrData] = useState<EnrollmentListProps[] | null>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [courseList, setCourseList] = useState<SelectedCourseProps[]>([]);
  const [batchList, setBatchList] = useState<SelectedBatchProps[]>([]);
  const [pageInput, setPageInput] = React.useState(1);
  const [selectedDuration, setSelectedDuration] = useState<string>("current");
  const data = React.useMemo(() => enrData ?? [], [enrData]);

  const globalFilterFn: FilterFn<any> = (
    row,
    columnId: string,
    filterValue
  ) => {
    return String(row.getValue(columnId))
      .toLowerCase()
      .includes(String(filterValue).toLowerCase());
  };

  async function fetchEnrollmentData() {
    try {
      const res = await fetch(
        `${BASE_API_URL}/api/enrollments?corId=${selectedCourse}&bthId=${selectedBatch}&dur=${selectedDuration}`,
        { cache: "no-store" }
      );
      const enrDataList = await res.json();
      const updatedEnrDataList = enrDataList.enrList.map((item: any) => {
        return {
          ...item,
          sdkFstName: item.sdkId.sdkFstName,
          sdkPresent: item.batchAttendance,
          sdkRegNo: item.sdkId.sdkRegNo,
        };
      });
      setEnrData(updatedEnrDataList);
    } catch (error) {
      console.log("error fetching enrData" + error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEnrollmentData();
  }, [selectedCourse, selectedBatch, selectedDuration]);

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
    async function fetchCourseData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/courses`, {
          cache: "no-store",
        });
        const coData = await res.json();
        setCourseList(coData.coList);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourseData();
  }, []);

  useEffect(() => {
    async function fetchBatchesByCorId() {
      if (!selectedCourse) {
        setBatchList([]); // Reset batch list if no course is selected
        return;
      }
      try {
        const res = await fetch(`${BASE_API_URL}/api/batches`, {
          cache: "no-store",
        });
        const batchData = await res.json();
        const filteredBatches = batchData.bthList?.filter(
          (batch: any) => batch.corId._id === selectedCourse
        );
        setBatchList(filteredBatches);
      } catch (error) {
        console.error("Error fetching batch data:", error);
      }
    }
    fetchBatchesByCorId();
  }, [selectedCourse]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDuration(e.target.value);
  };

  async function handleComplete(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    e.preventDefault;
    setIsSaving(true);

    const selectedRows = table.getSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      alert("Select at least one row to mark as complete.");
      return;
    }

    const selectedIds = selectedRows.map((row) => row.original._id);

    try {
      const response = await fetch(
        `${BASE_API_URL}/api/enrollments/mark-complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enrollmentIds: selectedIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark enrollments as complete.");
      }

      fetchEnrollmentData();
      alert("Selected enrollments marked as complete.");
    } catch (error) {
      console.error("Error marking enrollments as complete:", error);
      alert("An error occurred while marking enrollments as complete.");
    } finally {
      setIsSaving(false);
    }
  }

  const [loggedInUser, setLoggedInUser] = useState({
    id: "",
    usrName: "",
    usrRole: "",
    isAdmin: "",
  });

  useEffect(() => {
  try {
    const cookie = Cookies.get("loggedInUser");
    if (cookie) {
        const parsed = JSON.parse(cookie);
        setLoggedInUser({
        id: parsed.id || "",
        usrName: parsed.usrName || "",
        usrRole: parsed.usrRole || "",
        isAdmin: parsed.isAdmin || "", 
      });
    }
    } catch (error) {
      console.error("Error parsing loggedInUser cookie:", error);
    } finally {
      setIsLoading(false);
    }
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
      <div>
        <div className="flex mb-2 items-center justify-between">
          <div className="flex gap-1 items-center w-auto">
            {loggedInUser.usrRole !== "View-Admin" && (
              <button
                type="button"
                className="btnLeft"
                onClick={handleComplete}
                disabled={isSaving}
              >
                {isSaving ? "Completing" : "Complete"}
              </button>
            )}
            <Select
              className="w-[260px]"
              placeholder="--- Select Course ---"
              options={courseList.map((course) => ({
                label: course.coName,
                value: course._id,
              }))}
              value={
                courseList.find((c) => c._id === selectedCourse)
                  ? {
                      label: courseList.find((c) => c._id === selectedCourse)!
                        .coName,
                      value: selectedCourse,
                    }
                  : null
              }
              onChange={(option) => {
                setSelectedCourse(option?.value || "");
                setSelectedBatch(""); // Reset batch when course changes
              }}
              isSearchable
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  padding: "4px", // ⬅ Matches horizontal padding
                  minHeight: "46px",
                  boxShadow: state.isFocused ? "0 0 0 1.5px #FFA500" : "none", // ⬅ Focus outline
                  backgroundColor: state.isFocused ? "#FFEBCC" : "white",
                  "&:hover": {
                    borderColor: "#ea580c",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 200,
                  overflowY: "auto",
                  zIndex: 5,
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  paddingTop: "4px",
                  paddingBottom: "4px",
                }),
                input: (provided) => ({
                  ...provided,
                  margin: 0,
                  padding: 0,
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#666",
                }),
              }}
            />
            <Select
              className="w-[260px]"
              placeholder="--- Select Batch ---"
              options={batchList?.map((batch) => ({
                label: batch.bthName,
                value: batch._id,
              }))}
              value={
                batchList?.find((b) => b._id === selectedBatch)
                  ? {
                      label: batchList?.find((b) => b._id === selectedBatch)!
                        .bthName,
                      value: selectedBatch,
                    }
                  : null
              }
              onChange={(option) => {
                setSelectedBatch(option?.value || "");
              }}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  padding: "4px", // ⬅ Matches horizontal padding
                  minHeight: "46px",
                  boxShadow: state.isFocused ? "0 0 0 1.5px #FFA500" : "none", // ⬅ Focus outline
                  backgroundColor: state.isFocused ? "#FFEBCC" : "white",
                  "&:hover": {
                    borderColor: "#ea580c",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 200,
                  overflowY: "auto",
                  zIndex: 5,
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  paddingTop: "4px",
                  paddingBottom: "4px",
                }),
                input: (provided) => ({
                  ...provided,
                  margin: 0,
                  padding: 0,
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#666",
                }),
              }}
            />
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="inputBox w-[300px]"
              placeholder="Search anything..."
              onChange={(e) => setFiltered(e.target.value)}
            />
          </div>
        </div>
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

export default CompleteCourse;
