"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface SideMenuProps {
  menuName: string;
  menuIcon: string;
  menuUrl: string;
  menuOrder: number;
  isParent: boolean;
  isChild: boolean;
  parentId: string;
  createdBy: string;
}

interface SideMenuListProps {
  _id: string;
  menuName: string;
}

const CreateSideMenu: React.FC = () => {
  const router = useRouter();
  const [sideMenuList, setSideMenuList] = useState<SideMenuListProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<"parent" | "child" | "">("");
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<SideMenuProps>({
    menuName: "",
    menuIcon: "",
    menuUrl: "",
    menuOrder: 1,
    isParent: false,
    isChild: false,
    parentId: "",
    createdBy: "",
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
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(e.target.value as "parent" | "child");
  };

  useEffect(() => {
    async function fetchSideMenuList() {
      try {
        const response = await fetch("/api/sidemenu-list");
        const data = await response.json();
        setSideMenuList(data?.menuList);
      } catch (error) {
        console.error("Error fetching side menu list:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSideMenuList();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/sidemenu-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuName: data.menuName,
          menuIcon: data.menuIcon,
          menuUrl: data.menuUrl,
          isParent: selectedType === "parent",
          isChild: selectedType === "child",
          parentId: data.parentId,
          createdBy: loggedInUser.result._id,
        }),
      });

      const post = await response.json();
      if (post.success === false) {
        toast.error(post.msg);
      } else {
        toast.success(post.msg);
        router.push("/account/sidemenu-list");
      }
    } catch (error) {
      toast.error("An error occurred while saving the menu.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center py-10">
      <form onSubmit={handleSubmit} className="formStyle w-[600px]">
        <div className="flex flex-col gap-2">
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

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="child"
              name="menuType"
              value="child"
              checked={selectedType === "child"}
              onChange={handleTypeChange}
            />
            <label htmlFor="child">Is Child</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="parent"
              name="menuType"
              value="parent"
              checked={selectedType === "parent"}
              onChange={handleTypeChange}
            />
            <label htmlFor="parent">Is Parent</label>
          </div>
        </div>

        {selectedType !== "child" && (
          <div className="flex flex-col gap-2 mt-4">
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

        {selectedType !== "parent" && (
          <div className="flex flex-col gap-2 mt-4">
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

        {selectedType === "child" && (
          <div className="flex flex-col gap-2 mt-4">
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
                <option key={menu._id} value={menu._id} className="uppercase">
                  {menu.menuName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          <label>Menu Order:</label>
          <input
            type="number"
            name="menuOrder"
            value={data.menuOrder}
            onChange={handleChange}
            required
            className="inputBox"
          />
        </div>

        <div className="grid grid-cols-2 gap-1 mt-6">
          <button type="submit" className="btnLeft" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btnRight"
            onClick={() => router.push("/account/sidemenu-list")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSideMenu;