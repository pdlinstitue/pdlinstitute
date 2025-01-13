import React from 'react'
import { TiHeadphones } from "react-icons/ti";
import ProfMenu from '../submenus/ProfMenu';

const InnerHead = () => {

  return (
    <div>
      <div className='flex h-[70px] p-3 shadow-xl  justify-between  items-center  w-full'>
        <div className='flex gap-2 items-center p-2'>
            <TiHeadphones size={34} className='text-orange-500'/>
            <p>Help...!</p>
        </div>
        <div>
            <ProfMenu/>
        </div>
      </div>
    </div>
  )
}

export default InnerHead;
