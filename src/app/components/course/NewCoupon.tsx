"use client";
import React from "react";
import { useRouter } from "next/navigation";

const NewCoupon: React.FC = () => {

  const router = useRouter();
  const [manageBox, setManageBox] = React.useState<number[]>([]);

  const handleBox = (index: number | null, operation: string) => { 
    if (operation === "Add") { 
      setManageBox([...manageBox, manageBox.length]);  
    } else if (operation === "Remove" && index !== null) { 
          setManageBox(manageBox.filter((_, i) => i !== index)); 
      } 
  };

  return (
    <div className="flex justify-center items-center my-4">
      <form className="flex flex-col gap-4 h-auto border-[1.5px] w-[450px] border-orange-500 p-6 rounded-md shadow-xl">
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Coupon Name:</label>
            <input type='text' className='inputBox'/>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Number of Uses:</label>
                <input type='number' className='inputBox'/>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Validity:</label>
                <input type='number' className='inputBox'/>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Discout Type:</label>
                <select className='inputBox'>
                    <option value='Type' className="text-center">---  Select Type  ---</option>
                    <option value='Percentage'>Percentage</option>
                    <option value='Fixed Amount'>Fixed Amount</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className='text-lg'>Discount:</label>
                <input type='number' className='inputBox'/>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Course:</label>
            <select className='inputBox'>
                <option value='Type' className="text-center">---  Select Course  ---</option>
                <option value='Percentage'>Percentage</option>
                <option value='Fixed Amount'>Fixed Amount</option>
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label>Coupon is for :</label>
            <div className="flex gap-24">
                <label className='text-lg'><input type='radio' name='couponFor' value='All' defaultChecked/> All Sadhak</label>
                <label className='text-lg'><input type='radio' name='couponFor' value='Specific'/> Specific Sadhak</label>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <label className='text-lg'>Sadhak ID:</label>
            <div className="flex items-center gap-1">
              <input type='text' className='inputBox w-full'/>
              <button type="button" className='btnLeft' onClick={()=> handleBox(null, "Add")}>+</button>
              <button type="button" className='btnRight' title="Not Allowed">-</button>
            </div>
        </div>
        {
          manageBox.map((_, index)=>(
            <div key={index} className="flex flex-col gap-2"> 
              <div className="flex items-center gap-1">
                <input type='text' className='inputBox w-full'/>
                <button type="button" className='btnLeft' onClick={()=> handleBox(index, "Add")}>+</button>
                <button type="button" className='btnRight' onClick={()=> handleBox(index, "Remove")}>-</button>
              </div>
            </div>  
          ))
        }
        <div className="flex gap-1 w-full">
          <button type="submit" className="btnLeft w-full">
            Save
          </button>
          <button
            type="button"
            className="btnRight w-full"
            onClick={() => router.push("/account/couponlist")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewCoupon;
