"use client";
import DataTable from '@/app/components/table/DataTable';
import { BASE_API_URL } from '@/app/utils/constant';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import { IoCreateOutline } from "react-icons/io5";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '../Loading';
import { FiEye } from 'react-icons/fi';
import { BiEditAlt } from 'react-icons/bi';
import { HiMinus } from 'react-icons/hi';
import { RxCross2 } from 'react-icons/rx';

interface CourseListProps {
  coName: string, 
  coShort:string, 
  coCat: string,
  coElg: string,
  coImg?: string,
  coType: string,
  coWhatGrp: string,
  coTeleGrp: string,
  coDon:number, 
  durDays:number, 
  durHrs:number, 
  usrId: string
}

interface CategoryProps {
  _id:string,
  catName:string
}

const CourseList : React.FC = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [coData, setCoData] = useState<CourseListProps[]>([]);
    const data = React.useMemo(() => coData ?? [], [coData]);
    const columns = React.useMemo(() => [ 
      { header: 'Course', accessorKey: 'coName'}, 
      { header: 'Category', accessorKey: 'coCat'},   
      { header: 'Type', accessorKey: 'coType'}, 
      { header: 'Elegibility', accessorKey: 'coElg'}, 
      { header: 'Donation', accessorKey: 'coDon'},    
      { header: 'User Id', accessorKey: 'usrId'}, 
      { header: 'Action', accessorKey: 'coAction', 
        cell: ({ row }: { row: any }) => ( 
          <div className='flex items-center gap-3'> 
            <button type='button' title='View' onClick={()=> router.push(`/account/course-list/${row.original._id}/view-course`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
            <button type='button' title='Edit' onClick={()=> router.push(`/account/course-list/${row.original._id}/edit-course`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><BiEditAlt size={12}/></button>
            <button type='button' title='Disable' onClick={()=> router.push(`/account/course-list/${row.original._id}/disable-course`)} className='text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full  hover:border-black'><HiMinus size={12}/></button>
            <button type='button' title='Delete' onClick={()=> router.push(`/account/course-list/${row.original._id}/delete-course`)} className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full  hover:border-black'><RxCross2 size={12}/></button>
          </div> 
        ), 
      }, 
    ], []);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [filtered, setFiltered] = React.useState('');
    const [pageInput, setPageInput] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(25);

    const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => { 
      return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()); 
    };

    useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/courses`, { cache: "no-store" });
        const coData = await res.json();
        const updatedCoList = coData.coList.map((item:any) => { 
          return { ...item, coCat: item.coCat.catName };
        });
        setCoData(updatedCoList);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }  finally {
        setIsLoading(false);
      }
    }
    fetchCourseData();
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
            <Link href="/account/add-new-course" className='btnLeft'><IoCreateOutline size={24}/></Link>
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

export default CourseList;
