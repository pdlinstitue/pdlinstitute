"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import { SiGoogleclassroom } from "react-icons/si";
import Loading from '../Loading';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye } from 'react-icons/fi';
import { BiEditAlt } from 'react-icons/bi';
import { HiMinus } from 'react-icons/hi';
import { RxCross2 } from 'react-icons/rx';
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

const ClassList : React.FC = () => {

const router = useRouter();
const [classData, setClassData] = useState<ClassListProps[] | null>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\, yyyy')};
const data = React.useMemo(() => classData?.flatMap(cls => cls.clsName.filter((a:any) => a.isActive).map(clsDetail => ({ dayId: clsDetail._id, clsName: clsDetail.clsDay, clsDate: clsDetail.clsDate, clsLink: clsDetail.clsLink, clsStartsAt: clsDetail.clsStartAt, clsEndsAt: clsDetail.clsEndAt, bthId: cls.bthId, corId: cls.corId, clsId:cls._id }))) ?? [], [classData]);

const columns = React.useMemo(() => [ 
  { header: 'Class', accessorKey: 'clsName'},
  { header: 'Batch', accessorKey: 'bthId.bthName'},
  { header: 'Course', accessorKey: 'corId.coNick'},
  { header: 'Starts At', accessorKey: 'clsStartsAt'},
  { header: 'Ends At', accessorKey: 'clsEndsAt'},
  { header: 'Date', 
    accessorKey: 'clsDate',
    cell: ({ row }: { row: any }) => formatDate(row.original.clsDate),
  },
  { header: 'Link', accessorKey: 'clsLink',
    cell: ({ row }: { row: any }) => ( 
      <div className='flex items-center gap-3'> 
        <button type='button' title='Join' onClick={()=> router.push(`/account/class-list/${row.original._id}/view-class`)} className='bg-orange-600 py-1 px-2 font-semibold rounded-sm text-white text-sm'>JOIN</button>
      </div> 
    ),
  }, 
  {
    header: 'Action',
    accessorKey: 'action',
    cell: ({ row }: { row: any }) => {
      const clsId = row.original.clsId;
      const dayId = row.original.dayId; // Access the _id inside clsName array
      return (
        <div className='flex items-center gap-3'>
          <button
            type='button'
            title='View'
            onClick={() => router.push(`/account/class-list/${clsId}/${dayId}/view-class`)}
            className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'>
            <FiEye size={12} />
          </button>
          <button
            type='button'
            title='Edit'
            onClick={() => router.push(`/account/class-list/${clsId}/${dayId}/edit-class`)}
            className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full hover:border-black'>
            <BiEditAlt size={12} />
          </button>
          <button
            type='button'
            title='Disable'
            onClick={() => router.push(`/account/class-list/${clsId}/${dayId}/disable-class`)}
            className='text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full hover:border-black'>
            <HiMinus size={12} />
          </button>
          <button
            type='button'
            title='Delete'
            onClick={() => router.push(`/account/class-list/${clsId}/${dayId}/delete-class`)}
            className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full hover:border-black'>
            <RxCross2 size={12} />
          </button>
        </div>
      );
    },
  } 
], []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtered, setFiltered] = React.useState('');
  const [pageInput, setPageInput] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);

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
        pagination: { pageIndex: pageInput - 1, pageSize: 25 }
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
        const res = await fetch(`${BASE_API_URL}/api/classes`, { cache: "no-store" });
        const classList = await res.json();
        setClassData(classList.clsList);
    } catch (error) {
        console.error("Error fetching data:", error);
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
      <div>
        <div className='flex mb-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <select className='inputBox w-[300px]'>--- Select Course ---</select>
            <select className='inputBox w-[300px]'>--- Select Batch ---</select>
          </div>
          <div className='flex gap-2 items-center'>
            <Link href="/account/add-new-class" className='btnLeft'><SiGoogleclassroom size={24}/></Link>
            <input type='text' className='inputBox w-[300px]' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)}/>
          </div>
        </div>
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

export default ClassList;
