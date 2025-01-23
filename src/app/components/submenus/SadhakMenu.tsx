import Link from 'next/link'
import React from 'react'

const SadhakMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/active-sdk" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- Active</Link>       
        <Link href="/account/inactive-sdk" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- In-Active</Link>
      </div>
    </div>
  )
}

export default SadhakMenu;
