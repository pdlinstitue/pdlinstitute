"use client";
import DataTable from '@/app/components/table/DataTable';
import {
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel,FilterFn,
  getPaginationRowModel, 
  getSortedRowModel, 
  SortingState,
} from '@tanstack/react-table';
import Loading from '../Loading';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye } from 'react-icons/fi';
import { BASE_API_URL } from '@/app/utils/constant';
import { format } from 'date-fns';

interface ReEnrollmentListProps {
  reqBy: string;
  corId: string;
  createdAt: string;
}


const ReEnrollmentList : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reEnrData, setReEnrData] = useState<ReEnrollmentListProps[] | null>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\, yyyy')};
  const [filtered, setFiltered] = React.useState('');
  const [pageInput, setPageInput] = React.useState(1);
  const data = React.useMemo(() => reEnrData ?? [], [reEnrData]);

  //changing the status color as per the status
  const StatusCell = ({ row }: { row: any }) => {
    const statusClass = (value: string) => 
      value === 'Approved' ? 'text-green-500 italic'
      : 
      value === 'Rejected' ? 'text-red-500 italic'
      : 
      value === 'Pending' ? 'text-orange-500 italic' : 'text-black';
      return <span className={statusClass(row.original.reqStatus)}>
            {row.original.reqStatus}
        </span>;
  };

  const columns = React.useMemo(() => [
    { header: 'Sadhak', accessorKey: 'sdkFstName'},
    { header: 'SDK Id', accessorKey: 'sdkRegNo'},
    { header: 'Phone',  accessorKey: 'sdkPhone'},
    { header: 'Course', accessorKey: 'coNick'},
    { header: 'Req Date', 
        accessorKey: 'createdAt',
        cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
      },
    { header: 'Status', accessorKey: 'reqStatus', cell: StatusCell},
    { header: 'Action', accessorKey: 'action', 
      cell: ({ row }: { row: any }) => ( 
        <div className='flex items-center justify-center'> 
          <button type='button' title='View' onClick={()=> router.push(`/account/re-enrollment-list/${row.original._id}/view-request`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
        </div> 
      ), 
    },
  ], []);

  const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => { 
    return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()); 
  };

  useEffect(()=>{
    async function fetchReEnrollmentData(){
      try {
        const res = await fetch(`${BASE_API_URL}/api/request-to-re-enroll`, { cache: "no-store" });
        const reEnrDataList = await res.json();
        const updatedReEnrDataList = reEnrDataList.reqList.map((item:any) => { 
          return { 
            ...item, 
            coNick: item.corId.coNick, 
            sdkFstName: item.reqBy.sdkFstName,
            sdkPhone: item.reqBy.sdkPhone,
            sdkRegNo: item.reqBy.sdkRegNo,
            createdAt: format(new Date(item.createdAt), 'dd MMM, yyyy')   
          };
        });
        setReEnrData(updatedReEnrDataList);
      } catch (error) {
        console.log('error fetching enrData' + error)
      } finally{
        setIsLoading(false);
      }
    }
    fetchReEnrollmentData();
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
        pagination: { pageIndex: pageInput - 1, pageSize: 100 }
      },
      onSortingChange: setSorting,
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setFiltered,   
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
        <input type='text' className='inputBox w-[300px] mb-4' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)}/>
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

export default ReEnrollmentList;
