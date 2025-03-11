import Link from 'next/link'
import React from 'react'

const MyDocMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/my-docs/pan-card" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- PAN</Link>       
        <Link href="/account/my-docs/id-card" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- ID Proof</Link>
        <Link href="/account/my-docs/ads-card" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- Adss Proof</Link>
      </div>
    </div>
  )
}

export default MyDocMenu;
