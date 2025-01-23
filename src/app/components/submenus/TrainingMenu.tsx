import Link from 'next/link'
import React from 'react'

const TrainingMenu : React.FC = () => {

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/category-list" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Category</Link> 
        <Link href="/account/course-list" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Courses</Link> 
        <Link href="/account/complete-course" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Complete</Link>
        <Link href="/account/course-practice" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Practice</Link>       
        <Link href="/account/coupon-list" className='text-white text-xs uppercase font-bold rounded-sm pl-2 pr-3 hover:text-black hover:bg-orange-400 py-1'>- Coupons</Link>
      </div>
    </div>
  )
}

export default TrainingMenu;
