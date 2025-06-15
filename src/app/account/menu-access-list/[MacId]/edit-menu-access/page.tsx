'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, use, useState, useRef } from 'react';
import Loading from '@/app/account/Loading';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface AccessMenuProps {
  roleId: string;
  menuId: string[];
  updatedBy: string;
}

interface IMenuAccessParams {
  params: Promise<{
    MacId: string;
  }>;
}

const EditMenuAccess: React.FC<IMenuAccessParams> = ({ params }) => {

  const { MacId } = use(params);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [neutralMenus, setNeutralMenus] = useState<any[]>([]);
  const [parentMenus, setParentMenus] = useState<any[]>([]);
  const [childMenus, setChildMenus] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [data, setData] = useState<AccessMenuProps>({
    menuId: [],
    roleId: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMenuCheckboxChange = (id: string) => {
    setData((prev) => {
      const updated = prev.menuId.includes(id)
        ? prev.menuId.filter((mid) => mid !== id)
        : [...prev.menuId, id];
      return { ...prev, menuId: updated };
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [roleRes, menuRes] = await Promise.all([
          fetch('/api/role-list', { cache: 'no-store' }),
          fetch('/api/sidemenu-list', { cache: 'no-store' }),          
        ]);
        const roleData = await roleRes.json();
        const menuData = await menuRes.json();
        setRoleList(roleData?.rolList);

        const allMenus = menuData?.menuList || [];

        setNeutralMenus(allMenus.filter((m: any) => !m.isChild && !m.isParent));
        setParentMenus(allMenus.filter((m: any) => m.isParent));
        setChildMenus(allMenus.filter((m: any) => m.isChild));

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchMenuAccess() {
      try {
        const res = await fetch(`/api/menu-access-list/${MacId}/edit-menu-access`, { cache: 'no-store' });
        const menuAccById = await res.json();
        if (menuAccById?.success) {
          setData({
            menuId: menuAccById.menuAccById.menuId,
            roleId: menuAccById.menuAccById.roleId,
            updatedBy: loggedInUser.id,
          });
        }
      } catch (error) {
        console.error('Error fetching menu access data:', error);
      }
    }
    fetchMenuAccess();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`/api/menu-access-list/${MacId}/edit-menu-access`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuId: data.menuId,
          roleId: data.roleId,
          createdBy: loggedInUser.id,
        }),
      });

      const post = await response.json();
      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push('/account/menu-access-list');
      }
    } catch (error) {
      toast.error('An error occurred while saving the menu access.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex justify-center items-center py-14">
      <form onSubmit={handleSubmit} className="formStyle w-[600px]">
        {/* Role dropdown */}
        <div className="flex flex-col gap-2 mb-4">
          <label>Role Type:</label>
          <select name="roleId" value={data.roleId} onChange={handleChange} disabled className="inputBox text-center">
            <option value="">--- Select Role ---</option>
            {roleList.map((role: any) => (
              <option key={role._id} value={role._id}>
                {role.roleType}
              </option>
            ))}
          </select>
        </div>

        {/* Neutral Menus */}
        <div className="flex flex-col gap-2 mb-4" ref={dropdownRef}>
          <label>Neutral Menus:</label>
          <div className="border rounded px-3 py-2">
            {neutralMenus.map((menu: any) => (
              <label key={menu._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.menuId.includes(menu._id)}
                  onChange={() => handleMenuCheckboxChange(menu._id)}
                />
                <span className='uppercase'>{menu.menuName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Parent/Child Menu Dropdown */}
        <div className="flex flex-col gap-2 mb-4" ref={dropdownRef}>
          <label>Parent & Child Menus:</label>
          <div className="border rounded px-3 py-2">
            {parentMenus.map((menu: any) => (
              <div key={menu._id}>
                <label  className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={data.menuId.includes(menu._id)}
                    onChange={() => handleMenuCheckboxChange(menu._id)}
                  />
                  <span className='uppercase'>{menu.menuName}</span>
                </label>
              <div className="p-4">
              {childMenus.filter((pmenu: any) => pmenu.parentId === menu._id).map((cmenu: any) => (
                <label key={cmenu._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={data.menuId.includes(cmenu._id)}
                    onChange={() => handleMenuCheckboxChange(cmenu._id)}
                  />
                  <span className='uppercase'>{cmenu.menuName}</span>
                </label>
              ))}
            </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-1">
          <button type="submit" className="btnLeft" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="btnRight"
            onClick={() => router.push('/account/menu-access-list')}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMenuAccess;