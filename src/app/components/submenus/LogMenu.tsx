import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { RxAvatar } from 'react-icons/rx';
import { RiProfileLine } from "react-icons/ri";
import { MdSettingsBrightness } from "react-icons/md";
import { PiFolderLockFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";





const LogMenu = () => {
  

  

  return (
    <div className="flex p-4 items-center w-auto">
      <div className="relative group transition-all"> 
        <RxAvatar size={44} className="text-orange-500 cursor-pointer" />
        <div className="absolute z-50 group-hover:flex right-0 top-10 hidden w-[150px] flex-col transition-all py-3 px-3 bg-white rounded-md shadow-xl">
            <Link href="/login" className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">            
              Login
            </Link>
            <Link href="/register" className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">
              Register
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LogMenu;
