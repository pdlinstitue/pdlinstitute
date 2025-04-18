"use client";
import DataTable from '@/app/components/table/DataTable';
import { useReactTable, getCoreRowModel, getFilteredRowModel, FilterFn, getPaginationRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Loading from '../Loading';
import { BASE_API_URL } from '@/app/utils/constant';
import Cookies from 'js-cookie';

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

const MyPracticeClass: React.FC = () => {

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
        async function fetchPracticeData() {
            try {
                const res = await fetch(`${BASE_API_URL}/api/my-practice-class?sdkId=${Cookies.get("loggedInUserId")}`, { cache: "no-store" });
                const practiceData = await res.json();
                const updatedPrcList = practiceData?.prcList?.map((item: any) => {
                    return {
                        ...item,
                        prcName: item.prcName.coNick
                    }
                })
                setPrcData(updatedPrcList);
                console.log(updatedPrcList);
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
                const { prcStartsAt, prcEndsAt, prcLink, prcDays } = row.original;
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
    ], [currentTime, router]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageInput, setPageInput] = useState(1);
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
                <input type='text' className='inputBox w-[300px]' placeholder='Search anything...' onChange={(e) => setFiltered(e.target.value)} />
            </div>
            <div className='overflow-auto max-h-[412px]'>
                <DataTable table={table} />
            </div>
        </div>
    );
}

export default MyPracticeClass;