"use client";
import Image from 'next/image';
import React from 'react'

const MyReceipt = () => {

    const data = {
        receiptNo: "PDL/2025/00123",
        date: "17-Apr-2025",
        student: {
          name: "Rahul Sharma",
          email: "rahul.sharma@example.com",
          phone: "+91-9876543210",
          address: "123, Green Park, New Delhi",
        },
        course: {
          name: "Full Stack Web Development",
          duration: "6 Months",
          startDate: "01-May-2025",
        },
        payment: {
          amount: 35000,
          method: "UPI",
          transactionId: "TXN123456789",
        },
      };
    
    return (
        <div className='flex flex-col items-center justify-center p-6'>
          <div className='formStyle w-[600px] bg-white shadow-xl rounded-xl text-sm text-gray-800 border'>
            {/* Header */}
            <div className='p-3 bg-gray-100 rounded-t-xl relative'>
                <div className='bg-white p-3 rounded relative flex items-center justify-center'>
                    
                    {/* Logo on the left */}
                    <div className="absolute left-3">
                    <Image alt='pdl' src="/images/pdlLogo.jpg" width={60} height={60} />
                    </div>

                    {/* Center title */}
                    <div className="text-center">
                        <h1 className='text-2xl font-bold uppercase'>PDL Institute</h1>
                        <p className="text-xs text-gray-600">Empowering Your Spiritual Journey</p>
                        <p className="text-xs text-gray-500">www.pdlinstitute.com | +91-1234567890</p>
                    </div>
                </div>
            </div>
            {/* Receipt Info */}
            <div className="px-6 pt-4 pb-2 flex justify-between">
              <p><span className="font-semibold">Receipt No:</span> {data.receiptNo}</p>
              <p><span className="font-semibold">Date:</span> {data.date}</p>
            </div>
    
            {/* Student Info */}
            <div className="px-6 py-2">
              <h2 className="font-semibold underline mb-2">Sadhak Details</h2>
              <p><span className="font-semibold">Name:</span> {data.student.name}</p>
              <p><span className="font-semibold">Email:</span> {data.student.email}</p>
              <p><span className="font-semibold">Phone:</span> {data.student.phone}</p>
              <p><span className="font-semibold">Address:</span> {data.student.address}</p>
            </div>
    
            {/* Course Info */}
            <div className="px-6 py-2">
              <h2 className="font-semibold underline mb-2">Course Enrolled</h2>
              <p><span className="font-semibold">Course Name:</span> {data.course.name}</p>
              <p><span className="font-semibold">Duration:</span> {data.course.duration}</p>
              <p><span className="font-semibold">Start Date:</span> {data.course.startDate}</p>
            </div>
    
            {/* Payment Info */}
            <div className="px-6 py-2">
              <h2 className="font-semibold underline mb-2">Payment Summary</h2>
              <p><span className="font-semibold">Amount Paid:</span> ₹{data.payment.amount.toLocaleString()}</p>
              <p><span className="font-semibold">Payment Method:</span> {data.payment.method}</p>
              <p><span className="font-semibold">Transaction ID:</span> {data.payment.transactionId}</p>
            </div>
    
            {/* Footer */}
            <div className="flex justify-between items-end px-6 py-4 mt-4 border-t">
              <p className="text-xs text-gray-500">This is a system-generated receipt.</p>
              <div className="text-center">
                <p className="border-t border-black pt-1 w-40 text-sm">Authorized Signature</p>
              </div>
            </div>
    
          </div>
        </div>
      );    
}

export default MyReceipt;
