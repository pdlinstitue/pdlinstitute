"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import Loading from '../../Loading';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/app/utils/constant';
import { FiEye } from 'react-icons/fi';
import { BiEditAlt } from 'react-icons/bi';
import { HiMinus } from 'react-icons/hi';
import { RxCross2 } from 'react-icons/rx';
import { format } from 'date-fns';
import Cookies from 'js-cookie';

interface DocTypeProps  {
    _id?: string;
    sdkDocOwnr: string;
    sdkUpldDate: Date;
    sdkDocStatus: string;
    sdkAprDate: Date;
    sdkRemarks: string;
    sdkDocRel: string;
    sdkPan: string;
    sdkIdProof: string;
    sdkAddProof: string;
  };

const PanCard : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [panData, setPanData] = useState<DocTypeProps[] | null>([]);
  const data = React.useMemo(() => panData ?? [], [panData]);
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

  //changing the status color as per the status
  const StatusCell = ({ row }: { row: any }) => {
    const statusClass = (value: string) => 
      value === 'Approved' ? 'text-green-500 italic'
      : 
      value === 'Rejected' ? 'text-red-500 italic'
      : 
      value === 'Pending' ? 'text-orange-500 italic' : 'text-black';
      return <span className={statusClass(row.original.sdkDocStatus)}>
            {row.original.sdkDocStatus}
        </span>;
  };

  //changing the date format using date-fns library
  const DateCell = ({ row }: { row: any }) => {
    const sdkAprDate = row.original?.sdkAprDate;
    const formattedDate = sdkAprDate ? format(new Date(sdkAprDate), "MMM do, yyyy") : "N/A"; // Fallback for null/undefined
    return <span>{formattedDate}</span>;
  };
  
  const columns = React.useMemo(() => [
    {header: 'Sadhak', accessorKey: 'sdkFstName'},
    {header: 'Sdk Id', accessorKey: 'sdkRegNo'},
    {header: 'Phone', accessorKey: 'sdkPhone'},
    {header: 'PAN', accessorKey: 'sdkPanNbr'},
    {header: 'Owner', accessorKey: 'sdkDocOwnr'},
    {header: 'Relation', accessorKey: 'sdkDocRel'},
    {header: 'Date: A/R', accessorKey: 'sdkAprDate', cell: DateCell},
    {header: 'Status', accessorKey: 'sdkDocStatus', cell: StatusCell},
    {header: 'Action', accessorKey: 'action', 
      cell: ({ row }: { row: any }) => ( 
        <div className='flex items-center gap-3'> 
          <button type='button' title='View' onClick={()=> router.push(`/account/doc-list/pan-card/${row.original._id}/view-pan-card`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
          <button type='button' title='Edit' onClick={()=> router.push(`/account/doc-list/pan-card/${row.original._id}/edit-pan-card`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full  hover:border-black'><BiEditAlt size={12}/></button>
          <button type='button' title='Disable' onClick={()=> router.push(`/account/doc-list/pan-card/${row.original._id}/disable-pan-card`)} className='text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full  hover:border-black'><HiMinus size={12}/></button>
          <button type='button' title='Delete' onClick={()=> router.push(`/account/doc-list/pan-card/${row.original._id}/delete-pan-card`)} className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full  hover:border-black'><RxCross2 size={12}/></button>
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

    useEffect(() => {
    async function fetchPanData() {
    try 
      {
        const res = await fetch(`${BASE_API_URL}/api/documents?usrId=${loggedInUser.result._id}`, { cache: "no-store" });
        const docData = await res.json();
        const updatedDocList = docData?.panList?.map((item:any) => { 
          return { ...item, 
            sdkFstName: item.createdBy.sdkFstName ? item.createdBy.sdkFstName : 'N/A',
            sdkPhone: item.createdBy.sdkPhone ? item.createdBy.sdkPhone : 'N/A',
            sdkRegNo: item.updatedBy.sdkRegNo ? item.updatedBy.sdkRegNo : 'N/A' 
          };
        });
        setPanData(updatedDocList);
      } catch (error) {
          console.error("Error fetching doc data:", error);
      } finally {
          setIsLoading(false);
      }
    }
    fetchPanData();
    }, []);

    if(isLoading){
      return <div>
        <Loading/>
      </div>
    }

  return (
    <div>
      <div>
        <div className='flex mb-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
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

export default PanCard;
