import Link from 'next/link'
import React from 'react'

const DocMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/doc-list/pan-card" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- PAN</Link>       
        <Link href="/account/doc-list/id-card" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- ID Proof</Link>
        <Link href="/account/doc-list/ads-card" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- Adss Proof</Link>
      </div>
    </div>
  )
}

export default DocMenu;
