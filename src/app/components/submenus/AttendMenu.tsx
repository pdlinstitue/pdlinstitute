import Link from 'next/link'
import React from 'react'

const AttendMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-full'>    
        <Link href="/account/attendance-list" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- List</Link>       
        <Link href="/account/mark-attendance" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Mark</Link>
      </div>
    </div>
  )
}

export default AttendMenu;
