import Link from 'next/link'
import React from 'react'

const AssignMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/assignment-sent" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Sent</Link>       
        <Link href="/account/assignment-received" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Received</Link>
      </div>
    </div>
  )
}

export default AssignMenu;
