"use client";
import DataTable from '@/app/components/table/DataTable';
import { useReactTable, getCoreRowModel, getFilteredRowModel, FilterFn, getPaginationRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Loading from '../Loading';
import { HiMiniUserGroup, HiMinus } from "react-icons/hi2";
import { FiEye } from 'react-icons/fi';
import { BiEditAlt } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { BASE_API_URL } from '@/app/utils/constant';

interface PracticeProps {
    _id: string;
    prcName: string;
    prcImg: string;
    prcLang: string;
    prcDays: [string];
    prcStartsAt: string;
    prcEndsAt: string;
    prcLink: string;
    prcWhatLink: string;
}

const Practice: React.FC = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [prcData, setPrcData] = useState<PracticeProps[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        async function fetchPracticeData() {
            try {
                const res = await fetch(`${BASE_API_URL}/api/course-practice`, { cache: "no-store" });
                const practiceData = await res.json();
                const updatedPrcList = practiceData?.prcList?.map((item: any) => {
                    return {
                        ...item,
                        prcName: item.prcName.coNick
                    }
                })
                setPrcData(updatedPrcList);
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPracticeData();
    }, []);

    const data = React.useMemo(() => prcData, [prcData]);

    const columns = React.useMemo(() => [
        { header: 'Course', accessorKey: 'prcName' },
        { header: 'Starts At', accessorKey: 'prcStartsAt' },
        { header: 'Ends At', accessorKey: 'prcEndsAt' },
        { header: 'Language', accessorKey: 'prcLang' },
        {
            header: 'Class',
            accessorKey: 'prcLink',
            cell: ({ row }: { row: any }) => {
                const { prcStartsAt, prcEndsAt, prcDays, prcLink } = row.original;
                const currentTimeOnly = currentTime.toLocaleTimeString('en-US', { hour12: false });

                if (prcLink && prcDays.includes(currentTime.toLocaleDateString('en-US', { weekday: 'short' })) && currentTimeOnly >= prcStartsAt && currentTimeOnly <= prcEndsAt) {
                    return (
                        <div className='flex items-center gap-3'>
                            <button
                                type='button'
                                title='Join'
                                onClick={() => window.open(prcLink, '_blank')}
                                className='bg-orange-600 py-1 px-2 font-semibold rounded-sm text-white text-sm'
                            >
                                JOIN
                            </button>
                        </div>
                    );
                } else {
                    return <div className='flex items-center gap-3'>N/A</div>;
                }
            },
        },
        {
            header: 'Action',
            accessorKey: 'prcAction',
            cell: ({ row }: { row: any }) => (
                <div className='flex items-center gap-3'>
                    <button type='button' title='View' onClick={() => router.push(`/account/course-practice/${row.original._id}/view-practice-class`)} className='text-green-500 border-[1.5px] border-green-700 p-1 rounded-full hover:border-black'><FiEye size={12} /></button>
                    <button type='button' title='Edit' onClick={() => router.push(`/account/course-practice/${row.original._id}/edit-practice-class`)} className='text-orange-500 border-[1.5px] border-orange-700 p-1 rounded-full hover:border-black'><BiEditAlt size={12} /></button>
                    <button type='button' title='Disable' onClick={() => router.push(`/account/course-practice/${row.original._id}/disable-practice-class`)} className='text-pink-500 border-[1.5px] border-pink-700 p-1 rounded-full hover:border-black'><HiMinus size={12} /></button>
                    <button type='button' title='Delete' onClick={() => router.push(`/account/course-practice/${row.original._id}/delete-practice-class`)} className='text-red-500 border-[1.5px] border-red-700 p-1 rounded-full hover:border-black'><RxCross2 size={12} /></button>
                </div>
            ),
        },
    ], [currentTime, router]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageInput, setPageInput] = React.useState(1);
    const [filtered, setFiltered] = useState('');

    const globalFilterFn: FilterFn<any> = (row, columnId: string, filterValue) =>
        String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase());

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn,
        state: {
            sorting,
            globalFilter: filtered,
            pagination: { pageIndex: pageInput - 1, pageSize: 100 }
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltered,
    });

    if (isLoading) return <Loading />;

    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <Link href="/account/add-new-practice" className='btnLeft'><HiMiniUserGroup size={24} /></Link>
                <input type='text' className='inputBox w-[300px]' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)} />
            </div>
            <div className='overflow-auto max-h-[412px]'>
                <DataTable table={table} />
            </div>
        </div>
    );
}

export default Practice;