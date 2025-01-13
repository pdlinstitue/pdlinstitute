import React from 'react'

const ContactDetails = () => {
    
  return (
    <div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-2'>
            <label>Phone:*</label>
            <input type='text' name='' className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>WhatsApp:*</label>
            <input type='text' name='' className='inputBox' />
          </div>
        </div>
        <div className='grid grid-cols-1 mt-2'>
          <div className='flex flex-col gap-2'>
            <label>Email:*</label>
            <input type='email' name='' className='inputBox' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDetails;
