"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import Loading from '@/app/account/Loading';
import React, { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';
import { format } from 'date-fns';

type ClassItem = {
  _id:string;
  clsDay: string;
  clsStartAt: string;
  clsEndAt: string;
  clsDate: string;
  clsLink: string;
  clsAssignments: string[];
}

interface ClassListProps { 
  clsName: ClassItem[];   
  corId: string; 
  bthId: string; 
  clsMaterials: string[]; 
  usrId: string;   
  _id:string;
}

interface IBthParams  {
  params:Promise<{
    BthId:string
  }>
}

const ViewMyClasses : React.FC<IBthParams> = ({params}) => {

const {BthId} = use(params);
const [classData, setClassData] = useState<ClassListProps[] | null>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\, yyyy')};
const data = React.useMemo(() => classData?.flatMap(cls => cls.clsName.filter((a:any) => a.isActive).map(clsDetail => ({ 
  dayId: clsDetail._id, 
  clsName: clsDetail.clsDay, 
  clsDate: clsDetail.clsDate, 
  clsLink: clsDetail.clsLink, 
  clsStartsAt: clsDetail.clsStartAt, 
  clsEndsAt: clsDetail.clsEndAt, 
  bthId: cls.bthId, 
  corId: cls.corId, 
  clsId:cls._id 
}))) ?? [], [classData]);

const convertDateTime = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr); // Already a valid ISO date
    const formattedTime = timeStr.replace('.', ':');
    const [hours, minutes] = formattedTime.split(':').map(Number);

    // Set hours and minutes safely
    date.setHours(hours, minutes, 0, 0);
    return date;
};

const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

const columns = React.useMemo(() => [ 
  { header: 'Class', accessorKey: 'clsName'},
  { header: 'Starts At', accessorKey: 'clsStartsAt'},
  { header: 'Ends At', accessorKey: 'clsEndsAt'},
  { header: 'Date', 
    accessorKey: 'clsDate',
    cell: ({ row }: { row: any }) => formatDate(row.original.clsDate),
  },
  {
    header: 'Class',
    accessorKey: 'clsLink',
    cell: ({ row }: { row: any }) => {
        const { clsStartsAt, clsEndsAt, clsDate, clsLink } = row.original;
        const startTime = convertDateTime(clsDate, clsStartsAt);
        const endTime = convertDateTime(clsDate, clsEndsAt);

        const diffInMs = startTime.getTime() - currentTime.getTime();
        const diffInMin = diffInMs / (1000 * 60);

        if ((diffInMin <= 15 && currentTime < endTime) || (currentTime >= startTime && currentTime <= endTime)) {
            return (
                <div className='flex items-center gap-3'>
                    <button
                        type='button'
                        title='Join'
                        onClick={() => window.open(clsLink, '_blank')}
                        className='bg-orange-600 py-1 px-2 font-semibold rounded-sm text-white text-sm'
                    >
                        JOIN
                    </button>
                </div>
            );
        } else if (diffInMin > 15) {
            return <span className='text-blue-500 font-medium italic'>Upcoming</span>;
        } else if (currentTime > endTime) {
            return <span className='text-gray-500 italic'>Ended</span>;
        }

        return <span className='text-gray-400'>N/A</span>; 
    },
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
        const res = await fetch(`${BASE_API_URL}/api/my-classes/${BthId}/view-classes`, { cache: "no-store" });
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

export default ViewMyClasses;
