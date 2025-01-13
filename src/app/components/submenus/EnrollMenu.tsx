import Link from 'next/link'
import React from 'react'

const EnrollMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-full'>    
        <Link href="/account/approve-enrollment" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Approve</Link>       
        <Link href="/account/manage-enrollment" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Manage</Link>
      </div>
    </div>
  )
}

export default EnrollMenu;
