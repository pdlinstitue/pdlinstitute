"use client";
import DataTable from '@/app/components/table/DataTable';
import { BASE_API_URL } from '@/app/utils/constant';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import { format } from 'date-fns';
import { BiLayerPlus } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import { BiEditAlt } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import Loading from '../Loading';
import { HiMinus } from 'react-icons/hi';

interface BatchListProps {
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
  bthBank: string,
  bthQr: string,
}

const BatchList : React.FC = () => {

  const router = useRouter();
  const [batchData, setBatchData] = useState<BatchListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const data = React.useMemo(() => batchData ?? [], [batchData]);
  const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\'th\', yyyy'); };
  const columns = React.useMemo(() => [
    { header: 'Batch', accessorKey: 'bthName'},
    { header: 'Shift', accessorKey: 'bthTime'},
    { header: 'Start Date', 
      accessorKey: 'bthStart',
      cell: ({ row }: { row: any }) => formatDate(row.original.bthStart),
    },
    { header: 'End Date', 
      accessorKey: 'bthEnd',
      cell: ({ row }: { row: any }) => formatDate(row.original.bthEnd),
    },
    { header: 'Course', accessorKey: 'corId'},
    { header: 'Mode', accessorKey: 'bthMode'},
    { header: 'Lang', accessorKey: 'bthLang'},
    { header: 'Volunteer', accessorKey: 'bthVtr'},
    // { header: 'WhatsApp', accessorKey: 'bthWhatGrp'},
    // { header: 'Telegram', accessorKey: 'bthTeleGrp'},   
    // { header: 'Location', accessorKey: 'bthLoc'},
    // { header: 'Bank', accessorKey: 'bthBank'},
    // { header: 'Meeting Link', accessorKey: 'bthLink'},
    { header: 'Action', accessorKey: 'coAction', 
      cell: ({ row }: { row: any }) => ( 
        <div className='flex items-center gap-3'> 
          <button type='button' title='View' onClick={()=> router.push(`/account/batch-list/${row.original._id}/view-batch`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
          <button type='button' title='Edit' onClick={()=> router.push(`/account/batch-list/${row.original._id}/edit-batch`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><BiEditAlt size={12}/></button>
          <button type='button' title='Disable' onClick={()=> router.push(`/account/batch-list/${row.original._id}/disable-batch`)} className='text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full  hover:border-black'><HiMinus size={12}/></button>   
          <button type='button' title='Delete' onClick={()=> router.push(`/account/batch-list/${row.original._id}/delete-batch`)} className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full  hover:border-black'><RxCross2 size={12}/></button>
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
  async function fetchBatchData() {
    try {
      const res = await fetch(`${BASE_API_URL}/api/batches`, { cache: "no-store" });
      const batchData = await res.json();
      const updatedBatchList = batchData.bthList.map((item:any) => { 
        return { ...item, corId: item.corId.coNick };
      });
      setBatchData(updatedBatchList);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }  finally {
      setIsLoading(false);
    }
  }
  fetchBatchData();
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
    return <div>
      <Loading/>
    </div>
  };

  return (
    <div>
      <div>
        <div className='flex mb-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <select className='inputBox w-[300px]'>--- Select Course ---</select>
            <select className='inputBox w-[300px]'>--- Select Batch ---</select>
          </div>
          <div className='flex gap-2 items-center'>
            <Link href="/account/add-new-batch" className='btnLeft'><BiLayerPlus size={24}/></Link>
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

export default BatchList;
