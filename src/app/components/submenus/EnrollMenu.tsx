import Link from 'next/link'
import React from 'react'

const EnrollMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/approve-enrollment" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- Approve</Link>       
        <Link href="/account/manage-enrollment" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- Manage</Link>
      </div>
    </div>
  )
}

export default EnrollMenu;
