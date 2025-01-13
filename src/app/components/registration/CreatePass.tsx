import React from 'react'

const CreatePass = () => {

  return (
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-rows-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Create Password:*</label>
            <input type='password' name='' className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Confirm Password:*</label>
            <input type='password' name='' className='inputBox' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePass;
