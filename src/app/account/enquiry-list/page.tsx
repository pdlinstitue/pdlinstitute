"use client";
import DataTable from '@/app/components/table/DataTable';
import { BASE_API_URL } from '@/app/utils/constant';
 import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
 import React, { useEffect, useState } from 'react';
 import { HiOutlineMail } from "react-icons/hi";
 import Loading from '../Loading';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';


interface EnquiryListProps {
    eqrName:string,
    eqrSub:string,
    eqrEmail:string,
    eqrPhone:string
    eqrMessage:string,
}

const EnquiryList : React.FC = () => {

  const router = useRouter();
  const [enquiryData, setEnquiryData] = useState<EnquiryListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\'th\', yyyy')};
  const data = React.useMemo(() => enquiryData ?? [], [enquiryData]);
  const columns = React.useMemo(() => [ 
    { header: 'Name', accessorKey: 'eqrName'},
    { 
      header: 'Phone', 
      accessorKey: 'eqrPhone', 
      cell: ({ row }: { row: any }) => (
        <Link href={`tel:${row.original.eqrPhone}`} className='text-blue-700'>
          {row.original.eqrPhone}
        </Link>
      ),
    },
    { 
      header: 'Email', 
      accessorKey: 'eqrEmail', 
      cell: ({ row }: { row: any }) => (
        <Link href={`mailto:${row.original.eqrEmail}`} className='text-blue-700'>
          {row.original.eqrEmail}
        </Link>
      ),
    },
    { header: 'Subject', accessorKey: 'eqrSub'},
    { header: 'Enquiry Date', accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
    },
    { header: 'Action', accessorKey: 'action', 
      cell: ({ row }: { row: any }) => ( 
        <div className='flex items-center gap-3 justify-center'> 
          <button type='button' title='Message' onClick={()=> router.push(`/account/enquiry-list/${row.original._id}/view-enquiry`)} className='text-green-500 border-[1.5px] border-green-800 p-1 rounded-full hover:border-black'><HiOutlineMail size={12}/></button>         
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
                           
    useEffect(() => {
      async function fetchEnquiryData() {
        try {
          const res = await fetch(`${BASE_API_URL}/api/enquiries`, { cache: "no-store" });
          const eqrData = await res.json();
          setEnquiryData(eqrData?.eqrList);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
      }
      fetchEnquiryData();
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
      return<div>
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

export default EnquiryList;
