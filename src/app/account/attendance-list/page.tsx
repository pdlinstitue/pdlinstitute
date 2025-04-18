"use client";
import DataTable from '@/app/components/table/DataTable';
import {useReactTable, getCoreRowModel, getFilteredRowModel,FilterFn, flexRender, getPaginationRowModel, getSortedRowModel, SortingState} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { RiUpload2Fill } from "react-icons/ri";
import React, { useEffect, useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { BASE_API_URL } from '@/app/utils/constant';
import Loading from '../Loading';
import { format } from 'date-fns';

interface AttendanceListProps {
 clsDay:string,
 clsStartAt:string,
 clsEndAt:string,
 clsDate:Date,
 coNick:string,
 bthId:string,
 bthName:string,
 bthJoiners:number
}
interface SelectedCourseProps {
  _id:string,
  coName:string
}
interface SelectedBatchProps {
  _id:string,
  bthName:string
}

const AttendanceList : React.FC = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clsData, setClsData] = useState<AttendanceListProps[] | null>([]);
  const formatDate = (date: string) => { return format(new Date(date), 'MMM dd\, yyyy')};
  const data = React.useMemo(() => clsData ?? [], [clsData]);
  const [selectedDuration, setSelectedDuration]=useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<string>(''); 
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [courseList, setCourseList] = useState<SelectedCourseProps[]>([]);
    const [batchList, setBatchList] = useState<SelectedBatchProps[]>([]);

useEffect(() => {
    async function fetchCourseData() {
      try {
          const res = await fetch(`${BASE_API_URL}/api/courses`, {cache: "no-store"});
          const coData = await res.json();
          setCourseList(coData.coList.sort((a:any, b:any) => a.coName.localeCompare(b.coName)));
        } catch (error) {
          console.error("Error fetching course data:", error);
      } finally {
          setIsLoading(false);
      }
    }
  fetchCourseData();
  }, []);

  useEffect(() => {
    async function fetchBatchesByCorId() {
      if (!selectedCourse) {
        setBatchList([]); // Reset batch list if no course is selected
        return;
      }
      try {
        const res = await fetch(`${BASE_API_URL}/api/batches`, { cache: 'no-store' });
        const batchData = await res.json();
        const filteredBatches = batchData.bthList.filter((batch: any) => batch.corId._id === selectedCourse);
        setBatchList(filteredBatches);
      } catch (error) {
        console.error('Error fetching batch data:', error);
      }
    }
    fetchBatchesByCorId();
  }, [selectedCourse]); 

  // Handle course change
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
    setSelectedBatch(''); // Reset batch selection when course changes
  };

  // Handle batch change
  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBatch(e.target.value);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDuration(Number(e.target.value));
  };

  const columns = React.useMemo(() => [
    { header: 'Course', accessorKey: 'coNick'},
    { header: 'Batch', accessorKey: 'bthName'},
    { header: 'Class', accessorKey: 'clsDay'},
    { header: 'Date', 
      accessorKey: 'clsDate',
      cell: ({ row }: { row: any }) => formatDate(row.original.clsDate),
    },
    { header: 'Starts At', accessorKey: 'clsStartAt'},
    { header: 'Ends At', accessorKey: 'clsEndAt'},
    { header: 'Joiners', accessorKey: 'bthJoiners'},
    { header: 'Present', accessorKey: 'clsPresent'},
    { header: 'Absent', accessorKey: 'clsAbsent'},
    { header: 'Action', accessorKey: 'action', 
        cell: ({ row }: { row: any }) => ( 
          <div className='flex items-center justify-center gap-3'> 
            <button type='button' title='Attendees' onClick={()=> router.push(`/account/attendance-list/${row.original.bthId}/${row.original._id}/attendees`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12}/></button>
            <button type='button' title='Upload Screenshots' onClick={()=> router.push(`/account/attendance-list/${row.original.bthId}/${row.original._id}/attd-images`)} className='text-blue-600 border-[1.5px] border-blue-800 p-1 rounded-full hover:border-black'><RiUpload2Fill size={12}/></button>
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
    async function fetchBatchData() {
      try {
        
        const res = await fetch(`${BASE_API_URL}/api/classes?corId=${selectedCourse}&bthId=${selectedBatch}&dur=${selectedDuration}`, { cache: "no-store" });
        const classData = await res.json();
        
        let updatedClassList: AttendanceListProps[] = classData.clsList.flatMap((item: any) => {
          const coNick = item.corId?.coNick || "";
          const bthId = item.bthId?._id || "";
          const bthName = item.bthId?.bthName || "";
          const joiners=item.joinersCount;
          
          return item.clsName.filter((a:any) => a.isActive).map((clsItem: any) => ({
            _id: clsItem._id,
            bthId:bthId,
            clsDay: clsItem.clsDay || "", 
            clsStartAt: clsItem.clsStartAt || "",
            clsEndAt: clsItem.clsEndAt || "", 
            clsDate: clsItem.clsDate ? new Date(clsItem.clsDate) : new Date(),
            coNick,
            bthName,
            bthJoiners: joiners || 0, 
            clsPresent:clsItem.presentCount,
            clsAbsent:clsItem.absentCount
          }));
        });
    
        setClsData(updatedClassList);
       } catch (error) {
          console.error("Error fetching class data:", error);
      } finally {
          setIsLoading(false);
      }
    }
    fetchBatchData();
    }, [selectedCourse, selectedBatch, selectedDuration]);
  
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
      return <div>
        <Loading/>
      </div>
    }

  return (
    <div>
      <div>
        <div className='flex mb-2 items-center justify-between'>
          <div className='flex gap-2 items-center w-[900px]'>
          <select className="inputBox w-full" name="duration" value={selectedDuration} onChange={handleDurationChange}>              
              <option value="1">Last One Month</option>
              <option value="2">Last Two Month</option>
              <option value="3">Last Three Month</option>
            </select>
            <select className="inputBox w-full" name="corId" value={selectedCourse} onChange={handleCourseChange}>
              <option value="" className='text-center'>--- Select Course ---</option>
              {courseList?.map((item: any) => {
              return (
                <option key={item._id} value={item._id}>
                  {item.coName}
                </option>
              );
             })}
            </select>
            <select className="inputBox w-full" name="corId" value={selectedBatch} onChange={handleBatchChange}>
              <option value="" className='text-center'>--- Select Batch ---</option>
              {batchList?.map((item: any) => {
              return (
                <option key={item._id} value={item._id}>
                  {item.bthName}
                </option>
              );
             })}
            </select>
          </div>
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

export default AttendanceList;
