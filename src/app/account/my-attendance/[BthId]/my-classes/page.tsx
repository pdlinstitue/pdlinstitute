"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import Loading from '@/app/account/Loading';
import React, { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';
import { format } from 'date-fns';
import { FiEye } from 'react-icons/fi';

type ClassItem = {
  _id: string;
  clsDay: string;
  clsStartAt: string;
  clsEndAt: string;
  clsDate: string;
  clsLink: string;
  clsStatus: string;
  clsRemarks: string;
  attendance: {
    status: string;
    absRemarks: string;
    _id: string;
  };
}

interface IBthParams  {
  params:Promise<{
    BthId:string
  }>
}

const MyClassAttd : React.FC<IBthParams> = ({params}) => {

const {BthId} = use(params);
const router = useRouter();
const [classData, setClassData] = useState<ClassItem[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\, yyyy')};
const data = React.useMemo(
  () =>
    classData.map((clsDetail) => ({
      dayId: clsDetail._id,
      clsName: clsDetail.clsDay,
      clsDate: formatDate(clsDetail.clsDate),
      clsStartsAt: clsDetail.clsStartAt,
      clsEndsAt: clsDetail.clsEndAt,
      clsStatus:clsDetail.attendance?.status,
      clsremarks:clsDetail.attendance?.absRemarks
    })),
  [classData]
);

const columns = React.useMemo(() => [ 
  { header: 'Class', accessorKey: 'clsName'},
  { header: 'Started', accessorKey: 'clsStartsAt'},
  { header: 'Ended', accessorKey: 'clsEndsAt'},
  { header: 'Date', 
    accessorKey: 'clsDate',
    cell: ({ row }: { row: any }) => formatDate(row.original.clsDate),
  },
  { header: 'Status', accessorKey: 'clsStatus'},
  { header: 'Remarks', accessorKey: 'clsRemarks'},
  { header: 'Action', accessorKey: 'action', 
        cell: ({ row }: { row: any }) => ( 
          <div className='flex items-center gap-3 justify-center'> 
            <button type='button' title='Screenshots' onClick={()=> router.push(`/account/my-attendance/${row.original.attendance._id}/my-classes`)} className='text-green-600 border-[1.5px] border-green-800 p-1 rounded-full  hover:border-black'><FiEye size={12}/></button>      
          </div> 
        ),
  },  
], []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtered, setFiltered] = useState('');
  const [pageInput, setPageInput] = useState(1);
 
  const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => { 
    return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()); 
  };
  
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

  useEffect(() => {
  async function fetchClassData() {
    try {
        const res = await fetch(`${BASE_API_URL}/api/my-attendance/${BthId}/my-classes?sdkId=${Cookies.get("loggedInUserId")}`, { cache: "no-store" });
        const classList = await res.json();
        setClassData(classList.clsList);
        console.log(classList.clsList);
    } catch (error) {
        console.error("Error fetching clsData:", error);
    } finally {
      setIsLoading(false);
    }
  }
  fetchClassData();
  }, []);

  if(isLoading){
    return<div>
      <Loading/>
    </div>
  }

  return (
    <div>
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

export default MyClassAttd;
