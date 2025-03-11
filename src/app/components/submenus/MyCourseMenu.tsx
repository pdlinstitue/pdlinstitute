import Link from 'next/link'
import React from 'react'
import Cookies from 'js-cookie'

const MyCourseMenu : React.FC = () => {

    const loggedInUser = {
        result:{
          _id:Cookies.get("loggedInUserId"), 
          usrName:Cookies.get("loggedInUserName"),
          usrRole:Cookies.get("loggedInUserRole"),
        }
    }; 

  return (
    <div>
      <div className='flex flex-col w-auto'>    
        <Link href="/account/my-courses/elg-courses" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- ELEGIBLE</Link>      
        <Link href="/account/my-courses/done-courses" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- COMPLETED</Link>
        <Link href="/account/my-courses/all-courses" className='text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm'>- ALL COURSES</Link> 
      </div>
    </div>
  )
}

export default MyCourseMenu;
