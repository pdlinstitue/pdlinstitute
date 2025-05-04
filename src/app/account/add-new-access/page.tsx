"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Loading from '../Loading';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';


interface AccessMenuProps {
  roleId: string;
  menuId: string[];
  createdBy: string;
}

const CreateMenuAccess : React.FC = () => {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [sideMenuList, setSideMenuList] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<AccessMenuProps>({
    menuId: [''],
    roleId: '',
    createdBy: '',
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

  useEffect(() => {
    async function fetchRoleData() {
      try {
        const res = await fetch('/api/role-list', { cache: "no-store" });
        const roleData = await res.json();
        setRoleList(roleData?.rolList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoleData();
  },[]);

    useEffect(() => {
        async function fetchSideMenuData() {
        try {
            const res = await fetch('/api/sidemenu-list', { cache: "no-store" });
            const menuData = await res.json();
            setSideMenuList(menuData?.menuList);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchSideMenuData();
    }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/menu-access-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuId: data.menuId,
          roleId: data.roleId,
          createdBy: loggedInUser.result._id,
        }),
      });

      const post = await response.json();  
      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/menu-access-list");
      }
    } catch (error) {
      toast.error('An error occurred while saving the menu access.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>
      <Loading />
    </div>
  };

  return (
    <div className='flex justify-center items-center py-14'>
        <form onSubmit={handleSubmit} className="formStyle w-[600px]">
            <div className='flex flex-col gap-2'>
                <label>Role Type:</label>
                <select name="roleId" value={data.roleId} onChange={handleChange} required className="inputBox text-center">
                    <option  value="">--- Select Role --- </option>
                    {roleList?.map((role:any) => (
                        <option key={role._id} value={role._id}>
                            {role.roleType}
                        </option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col gap-2'>
                <label>Sidemenus:</label>
                <select  name="menuId" value={data.menuId} onChange={handleChange} multiple required className="inputBox text-center">
                    <option className='p-2' value="">--- Select Sidemenus --- </option>
                    {sideMenuList?.map((menu:any) => (
                        <option key={menu._id} value={menu._id}>
                            {menu.menuName}
                        </option>
                    ))}
                </select>
            </div>
            <div className='grid grid-cols-2 gap-1'>
                <button type="submit" className="btnLeft" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btnRight" onClick={()=> router.push('/account/menu-access-list')}>
                    Back
                </button>
            </div>
      </form>
    </div>
  );
};

export default CreateMenuAccess;
