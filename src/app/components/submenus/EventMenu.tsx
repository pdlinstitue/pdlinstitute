import Link from 'next/link'
import React from 'react'

const EventMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-full'>    
        <Link href="/account/event-list" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- List</Link>       
        <Link href="/account/event-members" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Members</Link>
      </div>
    </div>
  )
}

export default EventMenu;
