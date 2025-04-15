
"use client";
import Link from "next/link";

const ServiceUnavailable = () => {

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="formStyle w-[450px]">
        <div className="flex flex-col gap-2 my-24 text-center ">
            <h1 className="text-3xl uppercase font-bold text-red-500">Error:503</h1>
            <p className="text-lg text-center">Service Unavailable</p>
            <p className="text-sm text-center">Please check later.</p>
            <Link href="/" className="text-blue-600 font-semibold hover:underline">HOME PAGE</Link>
        </div>
      </div>
    </div>
  )
}

export default ServiceUnavailable;
