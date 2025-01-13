import Link from 'next/link'
import React from 'react'

const TrainingMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-full'>    
        <Link href="/account/categorylist" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Category</Link> 
        <Link href="/account/courselist" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Courses</Link> 
        <Link href="/account/complete-course" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Complete</Link>
        <Link href="/account/practice" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Practice</Link>       
        <Link href="/account/couponlist" className='text-white hover:text-black hover:bg-orange-400 py-1 px-2 w-[150px] rounded-md'>- Coupons</Link>
      </div>
    </div>
  )
}

export default TrainingMenu;
