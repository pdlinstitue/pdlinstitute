"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { format } from 'date-fns';

const NewClass = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courseDuration, setCourseDuration] = useState(0);
  const [batch, setBatch] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [myClassList, setMyClassList] = useState<ClassItem[]>([]);

  useEffect(() => {
    if (startDate && courseDuration > 0) {
      const newEndDate = calculateEndDate(startDate, courseDuration);
      setEndDate(newEndDate);
    }
  }, [startDate, courseDuration]);

  useEffect(() => {
    if (startDate && endDate && batch && meetingLink) {
      generateClassList(startDate, endDate, batch, meetingLink);
    }
  }, [courseDuration, startDate, endDate, batch, meetingLink]);

  interface ClassItem {
    className: string;
    date: string;
    meetingLink: string;
  }

  const calculateEndDate = (start: string, duration: number): string => {
    const startD = new Date(start);
    startD.setDate(startD.getDate() + duration - 1);
    return format(startD, 'yyyy-MM-dd');
  };

  const generateClassList = (start: string, end: string, batchName: string, link: string): void => {
    const startD = new Date(start);
    const endD = new Date(end);
    const classList: ClassItem[] = [];
    let index = 1;

    for (let d = startD; d <= endD; d.setDate(d.getDate() + 1)) {
      const formattedDate = format(d, 'yyyy-MM-dd');
      classList.push({
        className: `${batchName} DAY ${index}`,
        date: formattedDate,
        meetingLink: link,
      });
      index++;
    }

    setMyClassList(classList);
  };

  const handleClassListChange = (index: number, field: keyof ClassItem, value: string) => {
    const updatedClassList = [...myClassList];
    updatedClassList[index][field] = value;
    setMyClassList(updatedClassList);
  };

  return (
    <div>
      <form className='flex flex-col gap-2 p-6 border border-orange-500 rounded-md'>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label>Course:</label>
            <select className='inputBox'>
              <option className='text-center'>--- Select Course ---</option>
              <option value="BSK 1">BSK-1</option>
              <option value="BSK 2">BSK-2</option>
              <option value="GK 1">GK-1</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label>Batch</label>
            <select className='inputBox' onChange={(e) => setBatch(e.target.value)}>
              <option className='text-center'>--- Select Batch ---</option>
              <option value="101">101</option>
              <option value="102">102</option>
              <option value="103">103</option>
            </select>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label>Assignment:</label>
            <select className='inputBox'>
              <option className='text-center'>--- Select Assignment ---</option>
              <option value="BSK 1">BSK-1</option>
              <option value="BSK 2">BSK-2</option>
              <option value="GK 1">GK-1</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label>Study Mat:</label>
            <select className='inputBox'>
              <option className='text-center'>--- Select Study Mat ---</option>
              <option value="101">101</option>
              <option value="102">102</option>
              <option value="103">103</option>
            </select>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label>Starts At:</label>
            <input type='time' className='inputBox' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Ends At:</label>
            <input type='time' className='inputBox' />
          </div>
        </div>
        <div className='grid grid-cols-4 gap-6'>
          <div className='flex flex-col gap-2'>
            <label>Meeting Link:</label>
            <input type='text' className='inputBox' value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Course Duration:</label>
            <input type='number' className='inputBox' value={courseDuration} onChange={(e) => setCourseDuration(Number(e.target.value))} />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Start Date:</label>
            <input type='date' className='inputBox' onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className='flex flex-col gap-2'>
            <label>End Date:</label>
            <input type='date' className='inputBox' value={endDate} readOnly />
          </div>
        </div>
        <div className='w-full p-3 bg-gray-200 rounded-md text-center text-xl font-semibold'>
            <p>List of Classes</p>
        </div>
          {
            myClassList.map((item, index) => (
              <div key={index} className='grid grid-cols-3 gap-2'>      
                  <input type='text' className='inputBox' value={item.className} readOnly />
                  <input type='date' className='inputBox' value={item.date} onChange={(e) => handleClassListChange(index, 'date', e.target.value)} />
                  <input type='text' className='inputBox' value={item.meetingLink} onChange={(e) => handleClassListChange(index, 'meetingLink', e.target.value)} />
              </div>
            ))
          }
          <div className="flex gap-6 w-full mt-3">
            <button type="submit" className="btnRight w-full">
              Save
            </button>
            <button
              type="button"
              className="btnLeft w-full"
              onClick={() => router.push("/account/classlist")}
            >
              Back
            </button>
          </div>
        </form>
      </div>
  );
}

export default NewClass;
