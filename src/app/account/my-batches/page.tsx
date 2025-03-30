"use client";
import DataTable from '@/app/components/table/DataTable';
import { BASE_API_URL } from '@/app/utils/constant';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { PiChalkboardTeacher } from "react-icons/pi";
import { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import Loading from '../Loading';
import Cookies from 'js-cookie';

interface BatchListProps {
  _id:string,
  bthName: string,
  bthTime: string,
  bthStart: Date,
  bthEnd: Date,
  bthCourse: string,
  bthVtr: string,
  bthWhatGrp: string,
  bthTeleGrp: string,
  bthLang: string,
  bthMode: string,
  bthLink: string,
  bthLoc: string,
}

const MyBatches : React.FC = () => {

  const router = useRouter();
  const [batchData, setBatchData] = useState<BatchListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const data = React.useMemo(() => batchData ?? [], [batchData]);
  const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\'th\', yyyy')};
  const columns = React.useMemo(() => [
    { header: 'Batch', accessorKey: 'bthName'},
    { header: 'Start Date', 
      accessorKey: 'bthStart',
      cell: ({ row }: { row: any }) => formatDate(row.original.bthStart),
    },
    { header: 'End Date', 
      accessorKey: 'bthEnd',
      cell: ({ row }: { row: any }) => formatDate(row.original.bthEnd),
    },
    { header: 'Course', accessorKey: 'coNick'},
    { header: 'Mode', accessorKey: 'bthMode'},
    {
      header: 'WhatsApp',
      accessorKey: 'bthWhatGrp',
      cell: ({ row }) =>
        row.original.bthWhatGrp ? (
          <Link href={row.original.bthWhatGrp} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={20} className="text-green-600" />
          </Link>
        ) : (
          'N/A'
        ),
    },
    {
      header: 'Telegram',
      accessorKey: 'bthTeleGrp',
      cell: ({ row }) =>
        row.original.bthTeleGrp ? (
          <Link href={row.original.bthTeleGrp} target="_blank" rel="noopener noreferrer">
            <FaTelegram size={20} className="text-blue-600" />
          </Link>
        ) : (
          'N/A'
        ),
    },   
    // { header: 'Location', accessorKey: 'bthLoc'},
    // { header: 'Bank', accessorKey: 'bthBank'},
    // { header: 'Meeting Link', accessorKey: 'bthLink'},
    { header: 'Action', accessorKey: 'action', 
      cell: ({ row }: { row: any }) => ( 
        <div className='flex items-center gap-3'> 
          <button type='button' title='View Details' onClick={()=> router.push(`/account/my-batches/${row.original._id}/batch-details`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
          <button type='button' title='My Classes' onClick={()=> router.push(`/account/my-batches/${row.original._id}/view-classes`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><PiChalkboardTeacher size={12}/></button>      
        </div> 
      ), 
    },
  ], []);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtered, setFiltered] = React.useState('');
  const [pageInput, setPageInput] = React.useState(1);

  const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => { 
    return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()); 
  };

  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: '',
      usrName: '',
      usrRole: '',
    },
  });
   
  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || '';
      const userName = Cookies.get("loggedInUserName") || '';
      const userRole = Cookies.get("loggedInUserRole") || '';
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
    async function fetchEnrolledBatchesBySdkId() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/my-batches?sdkId=${Cookies.get("loggedInUserId")}`, { cache: "no-store" });
        const batchData = await res.json();    
        const updatedBatchList = batchData?.enrListBySdkId?.map((item: any) => {
          return {
            ...item,
            _id:item.bthId?._id,
            coNick: item.corId?.coNick || "", // Ensuring corId exists
            bthName: item.bthId?.bthName || "",
            bthShift: item.bthId?.bthShift || "",
            bthStart: item.bthId?.bthStart || "",
            bthEnd: item.bthId?.bthEnd || "",
            bthVtr: item.bthId?.bthVtr?.sdkFstName || "", // Ensuring nested field access
            bthWhatGrp: item.bthId?.bthWhatGrp || "",
            bthTeleGrp: item.bthId?.bthTeleGrp || "",
            bthLang: item.bthId?.bthLang || "",
            bthMode: item.bthId?.bthMode || "",
            bthLink: item.bthId?.bthLink || "",
            bthLoc: item.bthId?.bthLoc || "",
          };
        });  
        setBatchData(updatedBatchList);
      } catch (error) {
        console.error("Error fetching enrolled batches:", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchEnrolledBatchesBySdkId();
  }, []);
  

  const table = useReactTable(
    {
      data, 
      columns, 
      getCoreRowModel: getCoreRowModel(), 
      getPaginationRowModel: getPaginationRowModel(), 
      getSortedRowModel: getSortedRowModel(),
      globalFilterFn: globalFilterFn,
      state: {
        sorting: sorting,
        globalFilter: filtered,
        pagination: { pageIndex: pageInput - 1, pageSize: 100 }
      },
      onSortingChange: setSorting,
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setFiltered
    }
  );

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const page = e.target.value ? Number(e.target.value) - 1 : 0; 
    setPageInput(Number(e.target.value)); 
    table.setPageIndex(page); 
  };

  if(isLoading){
    return <div>
      <Loading/>
    </div>
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <input type='text' className='inputBox w-[300px]' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)}/>
      </div>
      <div className='overflow-auto max-h-[412px]'>
        <DataTable  table={table}/>
      </div> 
      <div>
        <div className='flex mt-4 gap-1'>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput(1); table.setPageIndex(0); }}>{"<<"}</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput((prev) => Math.max(prev - 1, 1)); table.previousPage(); }} disabled={!table.getCanPreviousPage()}>Previous</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput((prev) => Math.min(prev + 1, table.getPageCount())); table.nextPage(); }} disabled={!table.getCanNextPage()}>Next</button>
          <button type='button' className='px-2 py-1 rounded-sm border-[1.5px] border-black text-sm hover:bg-gray-100' onClick={() => { setPageInput(table.getPageCount()); table.setPageIndex(table.getPageCount() - 1); }}>{">>"}</button>
        </div>
        <div className='flex mt-4 items-center justify-between'>
          <div className='flex flex-col'>
            <p className='italic'>Total Pages: &nbsp; {table.getPageCount()}</p>
            <p className='italic'>You are on page: &nbsp; {(table.options.state.pagination?.pageIndex ?? 0) + 1}</p>
          </div>
          <div className='flex gap-1 items-center'>
            <p className='italic'>Jump to page: &nbsp;</p>
            <input type='number' className='px-2 py-1 rounded-lg border-[1.5px] border-black w-[70px] inline' value={pageInput} onChange={handlePageChange} min={1} max={table.getPageCount()}/>
          </div>
        </div>
      </div>  
    </div>
  )
}

export default MyBatches;
