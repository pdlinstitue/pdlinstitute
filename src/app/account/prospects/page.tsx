"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import Loading from '../Loading';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';
import { format } from 'date-fns';
import { parse } from 'date-fns';

interface ProspectsListProps {
  prosMonth:string,
  prosShift:string,
  corId:string,
  usrId?:string
}

const ProspectsList : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [prosData, setProsData] = useState<ProspectsListProps[] | null>([]);
  const data = React.useMemo(() => prosData ?? [], [prosData]);
  const columns = React.useMemo(() => [
    { header: 'Name', accessorKey: 'sdkFstName'},
    { header: 'SDK Id', accessorKey: 'usrId'},
    { header: 'Phone',  accessorKey: 'sdkPhone'},
    { header: 'Course', accessorKey: 'corId'},
    { header: 'Month',   accessorKey: 'prosMonth'},
    { header: 'Shift',  accessorKey: 'prosShift'},
    { header: 'DOR', accessorKey: 'createdAt'}
    // { header: 'Action', accessorKey: 'prosAction', 
    //     cell: ({ row }: { row: any }) => ( 
    //     <div className='flex items-center gap-3'> 
    //         <button type='button' title='View' onClick={()=> router.push(`/account/enrollment-list/${row.original._id}/view-batch`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
    //         <button type='button' title='Edit' onClick={()=> router.push(`/account/enrollment-list/${row.original._id}/edit-batch`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><BiEditAlt size={12}/></button>
    //     </div> 
    //     ), 
    // },
  ], []);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtered, setFiltered] = React.useState('');
  const [pageInput, setPageInput] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);

  const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => { 
    return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()); 
  };

  useEffect(()=>{
    async function fetchProspectsData(){
      try {
        const res = await fetch(`${BASE_API_URL}/api/prospects`, { cache: "no-store" });
        const prosDataList = await res.json();
        const updatedProsDataList = prosDataList.prosList.map((item:any) => { 
          return { ...item, corId: item.corId.coName};
        });
        setProsData(updatedProsDataList);
      } catch (error) {
        console.log('error fetching prosData' + error)
      } finally{
        setIsLoading(false);
      }
    }
    fetchProspectsData();
  },[])

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
  }

  return (
    <div>
      <div className='flex mb-2 items-center justify-between'>
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

export default ProspectsList;
