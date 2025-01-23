import Link from 'next/link'
import React from 'react'

const ClassMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/batch-list" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3  hover:text-black hover:bg-orange-400 py-1'>- Batches</Link>       
        <Link href="/account/class-list" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Classes</Link>
      </div>
    </div>
  )
}

export default ClassMenu;
