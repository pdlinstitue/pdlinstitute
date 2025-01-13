import React from 'react'

const CommDetails = () => {

  return (
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-rows-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Permanent Address:*</label>
            <textarea rows={4} name='' className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Communication Address:*</label>
            <textarea rows={4} name='' className='inputBox' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommDetails;
