"use client";
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
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
  params: Promise<{
    SideId: string;
  }>;
}

const ViewSideMenu: React.FC<ISideMenuParams> = ({ params }) => {
  const router = useRouter();
  const { SideId } = use(params);
  const [sideMenuList, setSideMenuList] = useState<SideMenuListProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'parent' | 'child' | ''>('');
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
    id: "",
    usrName: "",
    usrRole: "",
    isAdmin: "",
  });

  useEffect(() => {
  try {
    const cookie = Cookies.get("loggedInUser");
    if (cookie) {
        const parsed = JSON.parse(cookie);
        setLoggedInUser({
        id: parsed.id || "",
        usrName: parsed.usrName || "",
        usrRole: parsed.usrRole || "",
        isAdmin: parsed.isAdmin || "", 
      });
    }
    } catch (error) {
      console.error("Error parsing loggedInUser cookie:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedType(value as 'parent' | 'child');
  };

  useEffect(() => {
    async function fetchSideMenuList() {
      try {
        const response = await fetch('/api/sidemenu-list');
        const data = await response.json();
        setSideMenuList(data?.menuList);
      } catch (error) {
        console.error("Error fetching side menu list:", error);
      }
    }
    fetchSideMenuList();
  }, []);

  useEffect(() => {
    async function fetchSideMenuById() {
      try {
        const response = await fetch(`${BASE_API_URL}/api/sidemenu-list/${SideId}/view-sidemenu`);
        const data = await response.json();
        setData(data?.sideMenuById);

        // Set selected radio based on database value
        if (data?.sideMenuById?.isParent) {
          setSelectedType('parent');
        } else if (data?.sideMenuById?.isChild) {
          setSelectedType('child');
        }
      } catch (error) {
        console.error("Error fetching side menu data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSideMenuById();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='flex justify-center items-center py-10'>
      <form className="formStyle w-[600px]">
        <div className='flex flex-col gap-2'>
          <label>Menu Name:</label>
          <input
            type="text"
            name="menuName"
            value={data.menuName}
            onChange={handleChange}
            required
            className="inputBox uppercase"
          />
        </div>

        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div className='flex items-center gap-2'>
            <input
              type="radio"
              id="child"
              name="menuType"
              value="child"
              checked={selectedType === 'child'}
              onChange={handleTypeChange}
            />
            <label htmlFor="child">Is Child</label>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type="radio"
              id="parent"
              name="menuType"
              value="parent"
              checked={selectedType === 'parent'}
              onChange={handleTypeChange}
            />
            <label htmlFor="parent">Is Parent</label>
          </div>
        </div>

        {selectedType !== 'child' && (
          <div className='flex flex-col gap-2 mt-4'>
            <label>Menu Icon:</label>
            <input
              type="text"
              name="menuIcon"
              value={data.menuIcon}
              onChange={handleChange}
              required
              className="inputBox"
            />
          </div>
        )}

        {selectedType !== 'parent' && (
          <div className='flex flex-col gap-2 mt-4'>
            <label>Menu URL:</label>
            <input
              type="text"
              name="menuUrl"
              value={data.menuUrl}
              onChange={handleChange}
              required
              className="inputBox"
            />
          </div>
        )}

        {selectedType === 'child' && (
          <div className='flex flex-col gap-2 mt-4'>
            <label>Parent ID:</label>
            <select
              name="parentId"
              value={data.parentId}
              onChange={handleChange}
              className="inputBox text-center uppercase"
              required
            >
              <option value="">--- Select Parent ID ---</option>
              {sideMenuList?.map((menu) => (
                <option key={menu._id} value={menu._id} className='uppercase'>
                  {menu.menuName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className='grid grid-cols-2 gap-1 mt-6'>
          <button type="submit" className="btnLeft" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="btnRight"
            onClick={() => router.push('/account/sidemenu-list')}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewSideMenu;
