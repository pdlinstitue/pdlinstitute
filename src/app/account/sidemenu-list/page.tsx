"use client";
import DataTable from '@/app/components/table/DataTable';
import { BASE_API_URL } from '@/app/utils/constant';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../Loading';
import Link from 'next/link';
import { FiEye } from 'react-icons/fi';
import { BiEditAlt } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';


interface SideMenuListProps {
    menuName:string,
    menuIcon:string,
    menuUrl:string,
    isChild:boolean,
    isParent:boolean,
    parentId:string,
    parentName:string,
}

const SideMenuList : React.FC = () => {

  const router = useRouter();
  const [sideMenuData, setSideMenuData] = useState<SideMenuListProps[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const data = React.useMemo(() => sideMenuData ?? [], [sideMenuData]);
  const columns = React.useMemo(() => [ 
    {
      header: 'Menu',
      accessorKey: 'menuName',
      cell: ({ getValue }: { getValue: () => any }) => String(getValue()).toUpperCase(),
    },
    { 
      header: 'Icon', 
      accessorKey: 'menuIcon', 
    },
    {
      header: 'Parent Menu',
      accessorKey: 'parentName',
      cell: ({ getValue }: { getValue: () => any }) => {
        const value = String(getValue());
        return value
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    },
    { 
      header: 'Created By', 
      accessorKey: 'createdBy.sdkFstName', 
    },
    { 
      header: 'Update By', 
      accessorKey: 'updatedBy.sdkFstName', 
    },
    { header: 'Action', accessorKey: 'action', 
      cell: ({ row }: { row: any }) => ( 
        <div className='flex items-center gap-3 justify-center'> 
          <button type='button' title='View' onClick={()=> router.push(`/account/sidemenu-list/${row.original._id}/view-sidemenu`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
          <button type='button' title='Edit' onClick={()=> router.push(`/account/sidemenu-list/${row.original._id}/edit-sidemenu`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><BiEditAlt size={12}/></button>
          <button type='button' title='Delete' onClick={()=> router.push(`/account/sidemenu-list/${row.original._id}/delete-sidemenu`)} className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full  hover:border-black'><RxCross2 size={12}/></button>                
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
      async function fetchSideMenuData() {
        try {
          const res = await fetch(`${BASE_API_URL}/api/sidemenu-list`, { cache: "no-store" });
          const sideData = await res.json();
          setSideMenuData(sideData?.menuList);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchSideMenuData();
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
      <div className='flex items-center justify-between mb-4'>
        <Link href="/account/add-new-menu" title='Create Menu' className='btnLeft'>Create Sidemenu</Link>
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

export default SideMenuList;
