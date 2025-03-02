"use client";
import Image from 'next/image';
import React from 'react'

interface UpcomingEventsProps {
    eventsData: any
  }

const UpcomingEvents : React.FC<UpcomingEventsProps> = ({eventsData}) => {

  return (
    <div>
      <div className='grid grid-cols-4 gap-9 my-9'>
        {eventsData.map((event:any) => (
          <div key={event._id} className='flex flex-col bg-white rounded-md shadow-xl p-9 gap-3 border-[1.5px] border-orange-600'>
            <Image src="/images/sadhak.jpg" alt="eventImage" width={300} height={220}/>
            <h2 className='text-lg font-bold bg-gray-100 p-2 text-center'>{event.eveName}</h2>
            <p className='text-sm'>{event.eveShort}</p>
            <p className='text-sm'>{new Date(event.eveDate).toLocaleString()}</p>
            <p className='text-sm'>{event.eveLoc}</p>
            <button type='button'  className='btnLeft'>Register</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingEvents;
