import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { RxAvatar } from 'react-icons/rx';
import { RiProfileLine } from "react-icons/ri";
import { MdSettingsBrightness } from "react-icons/md";
import { PiFolderLockFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";





const ProfMenu = () => {
  

  

  return (
    <div className="flex p-4 items-center gap-3 w-auto">
      <div className="w-auto">
        <p>User Name</p>
      </div>
      <div className="relative group transition-all"> 
        <RxAvatar size={44} className="text-orange-500 cursor-pointer" />
        <div className="absolute z-50 group-hover:flex right-0 top-10 hidden w-[230px] flex-col transition-all py-3 px-3 bg-white rounded-md shadow-xl">
            <Link href="/account/profile-setting/1" className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">
              <RiProfileLine size={24} />
              <span >Profile Setting</span>
            </Link>
            <Link href="/account/account-setting/1" className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">
              <MdSettingsBrightness size={24} />
              <span >Account Setting</span>
            </Link>
            <Link href="/account/change-password/1" className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">
              <PiFolderLockFill size={24} />
              <span >Change Password</span>
            </Link>
            <Link href="/" className="flex text-black hover:text-white gap-2 px-4 py-2 hover:bg-orange-500">
              <MdLogout size={24} />
              <span >Logout</span>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfMenu;
