"use client";
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Loading from '@/app/account/Loading';
import { BASE_API_URL } from '@/app/utils/constant';


interface SideMenuProps {
  menuName: string;
  menuIcon: string;
  menuUrl: string;
  isParent: boolean;
  isChild: boolean;
  parentId: string;
  updatedBy?: string;
}

interface SideMenuListProps {
  _id: string;
  menuName: string;
}

interface ISideMenuParams {
    params:Promise<{
        SideId: string;
    }>
}

const ViewSideMenu : React.FC<ISideMenuParams> = ({params}) => {
  
  const router = useRouter();
  const { SideId } = use(params);
  const [sideMenuList, setSideMenuList] = useState<SideMenuListProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [parent, setParent] = useState<boolean>(false);
  const [child, setChild] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<SideMenuProps>({
    menuName: '',
    menuIcon: '',
    menuUrl: '',
    isParent: false,
    isChild: false,
    parentId: '',
    updatedBy: '',
  });

  const [loggedInUser, setLoggedInUser] = useState({
    result: {
      _id: "",
      usrName: "",
      usrRole: "",
    },
  });
  
  useEffect(() => {
    try {
      const userId = Cookies.get("loggedInUserId") || "";
      const userName = Cookies.get("loggedInUserName") || "";
      const userRole = Cookies.get("loggedInUserRole") || "";
      setLoggedInUser({
        result: {
          _id: userId,
          usrName: userName,
          usrRole: userRole,
        },
      });
    } catch (error) {
      console.error("Error fetching loggedInUserData.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleParent = () => {
    setParent(!parent);
  }

  const handleChild = () => {
    setChild(!child);
  }

  useEffect(() => {
    async function fetchSideMenuList(){
      try {
        const response = await fetch('/api/sidemenu-list');
        const data = await response.json();
        setSideMenuList(data?.menuList);
      } catch (error) {
        console.error("Error fetching side menu list:", error);
      } finally {
        setIsLoading(false);
      }
    };
  fetchSideMenuList();
  },[]);

  useEffect(() => {
    async function fetchSideMenuById() {
      try {
        const response = await fetch(`${BASE_API_URL}/api/sidemenu-list/${SideId}/view-sidemenu`);
        const data = await response.json();
        setData(data?.sideMenuById);
      } catch (error) {
        console.error("Error fetching side menu data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSideMenuById();
  }, []);

  if (isLoading) {
    return <div>
      <Loading />
    </div>
  };

  return (
    <div className='flex justify-center items-center py-10'>
      <form  className="formStyle w-[600px]">
          <div className='flex flex-col gap-2'>
              <label>Menu Name:</label>
              <input type="text" name="menuName" value={data.menuName} onChange={handleChange} required className="inputBox uppercase" />
          </div>
          <div className='grid grid-cols-2 gap-1'>
            <div className='flex gap-2'> 
              <input type="checkbox" name="isChild"  onChange={handleChild} />
              <label>Is Child</label>
            </div>
            <div className='flex gap-2'>    
                <input type="checkbox" name="isParent"  onChange={handleParent} />
                <label>Is Parent</label>
            </div>
          </div>
          {
            child === false && (
            <div className='flex flex-col gap-2'>
              <label>Menu Icon:</label>
              <input type="text" name="menuIcon" value={data.menuIcon} onChange={handleChange} required className="inputBox" />
            </div>
            )
          }
          {
            parent === false && (
            <div className='flex flex-col gap-2'>
              <label>Menu URL:</label>
              <input type="text" name="menuUrl" value={data.menuUrl} onChange={handleChange} required className="inputBox" />
            </div>
            )
          }
          {
            child === true && (
            <div className='flex flex-col gap-2'>
              <label>Parent ID:</label>
              <select  name="parentId" value={data.parentId} onChange={handleChange} className="inputBox text-center uppercase" required>
                <option value="">--- Select Parent ID ---</option>
                {sideMenuList?.map((menu) => (
                  <option key={menu._id} value={menu._id} className='uppercase'>
                    {menu.menuName}
                  </option>
                ))}
              </select>
            </div>
            )
          }
          <div className='grid grid-cols-2 gap-1'>
          <button type="submit" className="btnLeft" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="btnRight" onClick={()=> router.push('/account/sidemenu-list')}>
              Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewSideMenu;
