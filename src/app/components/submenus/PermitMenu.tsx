import Link from 'next/link';
import React from 'react';

const PermitMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>                 
        <Link href="/account/role-list" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- ROLES</Link>
        <Link href="/account/action-list" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- MODULES</Link> 
        <Link href="/account/permission-list" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- PERMISSIONS</Link> 
      </div>
    </div>
  )
}

export default PermitMenu;
