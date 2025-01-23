import Link from 'next/link'
import React from 'react'

const AttendMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/attendance-list" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- List</Link>       
        <Link href="/account/mark-attendance" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Mark</Link>
      </div>
    </div>
  )
}

export default AttendMenu;
