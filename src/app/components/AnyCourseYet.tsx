"use client";
import React from 'react'
import { TfiFaceSad } from 'react-icons/tfi';

const AnyCourseYet : React.FC = () => {

  return (
    <div>
        <div className="flex justify-center items-center py-48">
            <div className="flex flex-col gap-4 items-center">
                <TfiFaceSad className="text-orange-600" size={34} />
                <p className="text-lg font-semibold italic text-gray-600">
                    You haven't completed any course yet.
                </p>
            </div>
        </div>
    </div>
  )
}

export default AnyCourseYet;
