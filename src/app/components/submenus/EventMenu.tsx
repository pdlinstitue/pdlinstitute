import Link from 'next/link'
import React from 'react'

const EventMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/event-list" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- List</Link>       
        <Link href="/account/event-members" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Members</Link>
        <Link href="/account/event-category-list" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Category</Link>  
      </div>
    </div>
  )
}

export default EventMenu;
