import Link from 'next/link'
import React from 'react'

const ClassMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-full'>    
        <Link href="/account/batchlist" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Batches</Link>       
        <Link href="/account/classlist" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Classes</Link>
      </div>
    </div>
  )
}

export default ClassMenu;
