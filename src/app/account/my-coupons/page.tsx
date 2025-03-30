"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import Loading from '../Loading';
import { RiCoupon3Line } from "react-icons/ri";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '@/app/utils/constant';
import { format } from 'date-fns';

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

const MyCoupons : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\'th\', yyyy')};
  const [couponData, setCouponData] = useState<CouponlistProps[] | null>([]);
  const data = React.useMemo(() => couponData ?? [], [couponData]);
  const columns = React.useMemo(() => [ 
    { header: 'Coupon', accessorKey: 'cpnName'},
    { header: 'Issued On', 
      accessorKey: 'createdAt',
      cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
    }, 
    { header: 'Uses', accessorKey: 'cpnUse'},   
    { header: 'Months', accessorKey: 'cpnVal'}, 
    { header: 'Course', accessorKey: 'cpnCourse'}, 
    { header: 'Type', accessorKey: 'cpnDisType'},    
    { header: 'Discount', accessorKey: 'cpnDisc'},  
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
    async function fetchCouponData() {
      try {
        const res = await fetch(`${BASE_API_URL}/api/my-coupons?sdkId=${Cookies.get("loggedInUserId")}`, { cache: "no-store" });
        const cpnData = await res.json();
        const updatedCpnData = cpnData?.cpnList?.map((item:any) => { 
          return { ...item, cpnCourse: item.cpnCourse.coNick };
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

export default MyCoupons;
