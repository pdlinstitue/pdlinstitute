import React from 'react'

const UploadDocs = () => {

  return (
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Profile Image:*</label>
            <input type='file' name='' className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>ID Proof:*</label>
            <input type='file' name='' className='inputBox' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadDocs;
