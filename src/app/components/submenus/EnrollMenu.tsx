import Link from 'next/link'
import React from 'react'

const EnrollMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/enrollment-list" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- ENROLLED</Link> 
        <Link href="/account/re-enrollment-list" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- RE-ENROLL</Link>       
        <Link href="/account/prospects" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- PROSPECTS</Link>
      </div>
    </div>
  )
}

export default EnrollMenu;
