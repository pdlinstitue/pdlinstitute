"use client";
import DataTable from '@/app/components/table/DataTable';
import { BASE_API_URL } from '@/app/utils/constant';
import { RxCross2 } from "react-icons/rx";
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import { TbCategoryPlus } from "react-icons/tb";
import React, { useEffect, useState } from 'react';
import { FiEye } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import { HiMinus } from "react-icons/hi";
import Loading from '../Loading';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


interface RoleListProps {
  _id:string;
  roleType:string;
}

const RoleList : React.FC = () => {

  const router = useRouter();
  const [roleList, setRoleList] = useState<RoleListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const data = React.useMemo(() => roleList ?? [], [roleList]);
  const columns = React.useMemo(() => [ 
    { header: 'Sadhak Role', accessorKey: 'roleType'},
    { header: 'Created By', accessorKey: 'createdBy'},
    { header: 'Updated By', accessorKey: 'updatedBy'},
    { header: 'Action', accessorKey: 'catAction', 
      cell: ({ row }: { row: any }) => ( 
        <div className='flex items-center gap-3'> 
          <button type='button' title='View' onClick={()=> router.push(`/account/role-list/${row.original._id}/view-role`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
          <button type='button' title='Edit' onClick={()=> router.push(`/account/role-list/${row.original._id}/edit-role`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><BiEditAlt size={12}/></button>
          <button type='button' title='Disable' onClick={()=> router.push(`/account/role-list/${row.original._id}/disable-role`)} className='text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full  hover:border-black'><HiMinus size={12}/></button>
          <button type='button' title='Delete' onClick={()=> router.push(`/account/role-list/${row.original._id}/delete-role`)} className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full  hover:border-black'><RxCross2 size={12}/></button>
        </div> 
      ), 
    }, 
  ], []);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [filtered, setFiltered] = React.useState('');
    const [pageInput, setPageInput] = React.useState(1);

    const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) => { 
      return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase()); 
    };
                           
    useEffect(() => {
      async function fetchRoleData() {
        try {
          const res = await fetch(`${BASE_API_URL}/api/role-list`, { cache: "no-store" });
          const roleData = await res.json();
          const updatedRoleList = roleData.rolList.map((item: any) => {
            return {
              ...item,
              createdBy: item.createdBy ? item.createdBy.sdkFstName : 'N/A',
              updatedBy: item.updatedBy ? item.updatedBy.sdkFstName : 'N/A'
            };
          });
          setRoleList(updatedRoleList);
         } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
      }
      fetchRoleData();
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
          <Link href="/account/add-new-role" className='btnLeft'>Create Role</Link>
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

export default RoleList;
