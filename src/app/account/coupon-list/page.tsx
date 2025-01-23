"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import Loading from '../Loading';
import { RiCoupon3Line } from "react-icons/ri";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye } from 'react-icons/fi';
import { BiEditAlt } from 'react-icons/bi';
import { HiMinus } from 'react-icons/hi';
import { RxCross2 } from 'react-icons/rx';
import { BASE_API_URL } from '@/app/utils/constant';

interface CouponlistProps {
  cpnName: string,
  cpnUse: number,
  cpnVal:number,
  cpnDisType: string,
  cpnDisc:number,
  cpnCourse: string,
  cpnFor: string,
  cpnSdk: [string],
  usrId: string 
}

const Couponlist : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [couponData, setCouponData] = useState<CouponlistProps[] | null>([]);
  const data = React.useMemo(() => couponData ?? [], [couponData]);
  const columns = React.useMemo(() => [ 
    { header: 'Coupon', accessorKey: 'cpnName'}, 
    { header: 'Uses', accessorKey: 'cpnUse'},   
    { header: 'Months', accessorKey: 'cpnVal'}, 
    { header: 'Course', accessorKey: 'cpnCourse'}, 
    { header: 'Type', accessorKey: 'cpnDisType'},    
    { header: 'Discount', accessorKey: 'cpnDisc'},
    { header: 'Coupon For', accessorKey: 'cpnFor'}, 
    { header: 'Action', accessorKey: 'couponAction', 
      cell: ({ row }: { row: any }) => ( 
        <div className='flex items-center gap-3'> 
          <button type='button' title='View' onClick={()=> router.push(`/account/coupon-list/${row.original._id}/view-coupon`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
          <button type='button' title='Edit' onClick={()=> router.push(`/account/coupon-list/${row.original._id}/edit-coupon`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><BiEditAlt size={12}/></button>
          <button type='button' title='Disable' onClick={()=> router.push(`/account/coupon-list/${row.original._id}/disable-coupon`)} className='text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full  hover:border-black'><HiMinus size={12}/></button>
          <button type='button' title='Delete' onClick={()=> router.push(`/account/coupon-list/${row.original._id}/delete-coupon`)} className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full  hover:border-black'><RxCross2 size={12}/></button>
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
    async function fetchCouponData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/coupons`, { cache: "no-store" });
        const cpnData = await res.json();
        const updatedCpnData = cpnData.cpnList.map((item:any) => { 
          return { ...item, cpnCourse: item.cpnCourse.coName };
        });
        setCouponData(updatedCpnData);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }  finally {
        setIsLoading(false);
      }
    }
    fetchCouponData();
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
          <Link href="/account/add-new-coupon" className='btnLeft'><RiCoupon3Line size={24}/></Link>
          <input type='text' className='inputBox w-[300px]' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)}/>
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

export default Couponlist;
