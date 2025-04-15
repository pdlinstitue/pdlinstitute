import Link from 'next/link';
import { RxAvatar } from 'react-icons/rx';





const LogMenu = () => {
  

  

  return (
    <div className="flex p-4 items-center w-auto">
      <div className="relative group transition-all"> 
        <RxAvatar size={44} className="text-orange-500 cursor-pointer" />
        <div className="absolute  border-[1.5px] border-gray-200 divide-y z-50 group-hover:flex right-0 top-10 hidden w-[190px] flex-col transition-all py-2 px-2 bg-white rounded-md shadow-xl">
            <Link href="/login" className="flex text-black text-sm uppercase font-semibold hover:text-white px-4 py-1 hover:bg-orange-500">            
              Admin Login
            </Link>
            <Link href="/sadhak-login" className="flex text-black text-sm uppercase font-semibold hover:text-white px-4 py-1 hover:bg-orange-500">            
              Sadhak Login
            </Link>
            <Link href="/volunteer-login" className="flex text-black text-sm uppercase font-semibold hover:text-white px-4 py-1 hover:bg-orange-500">            
              Volunteer Login
            </Link>
            <Link href="/register" className="flex text-black text-sm uppercase font-semibold hover:text-white px-4 py-1 hover:bg-orange-500">
              Register here
            </Link>
        </div>
      </div>
    </div>
  );
};

export default LogMenu;
