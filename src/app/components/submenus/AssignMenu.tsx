import Link from 'next/link'
import React from 'react'

const AssignMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-full'>    
        <Link href="/account/assignment-sent" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Sent</Link>       
        <Link href="/account/assignment-received" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Received</Link>
      </div>
    </div>
  )
}

export default AssignMenu;
