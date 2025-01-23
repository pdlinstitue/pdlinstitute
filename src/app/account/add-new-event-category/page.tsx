"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { BASE_API_URL } from "@/app/utils/constant";

interface NewEventCategoryProps {
  eveCatName: string;
}

const AddNewEventCategory: React.FC = () => {

    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [data, setData] = useState<NewEventCategoryProps>({eveCatName: ''});

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };   
    
    const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault();
        setErrorMessage(''); // Clear the previous error
        let errMsg: string[] = [];
        
        if (!data.eveCatName.trim()) {
            errMsg.push('Category name is required.');
        }
        
        if (errMsg.length > 0) {
            setErrorMessage(errMsg.join(' || '));
            return;
        }
    
    try 
    {
        const response = await fetch(`${BASE_API_URL}/api/event-category`, {
          method: 'POST',
          body: JSON.stringify({ eveCatName: data.eveCatName }),
        });
    
        const post = await response.json();
        console.log(post);
    
        if (post.success === false) {
            toast.error(post.msg);
        } else {
            toast.success(post.msg);
            router.push('/account/event-category-list');
         }
    } catch (error) {
        toast.error('Error creating category.');
    } 
  };      

  return (
    <div className="flex justify-center items-center my-24">
      <form onSubmit={handleSubmit}  className="formStyle w-[350px]">
        <div className="flex flex-col gap-2">
          <label className="text-lg">Category Name:</label>
          <input type="text" className="inputBox" name="eveCatName" value={data.eveCatName} onChange={handleChange}  />
        </div>
        {errorMessage && <p className='text-red-600 italic text-xs'>{errorMessage}</p>}
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full" >
            Save
          </button>
          <button type="button" className="btnRight w-full" onClick={() => router.push("/account/event-category-list")}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewEventCategory;
