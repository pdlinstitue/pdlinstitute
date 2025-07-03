"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { IoIosArrowDown } from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import * as HiIcons from "react-icons/hi";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import * as GiIcons from "react-icons/gi";
import * as IoIcons from "react-icons/io5";
import * as RiIcons from "react-icons/ri";
import * as PiIcons from "react-icons/pi";
import * as FaIcons from "react-icons/fa";

const SideBar: React.FC = () => {
  const userCookie = Cookies.get("loggedInUser");
  const pathName = usePathname();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>({});
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  let parsed: any = {};
  if (userCookie) {
    parsed = JSON.parse(userCookie);
  }

  useEffect(() => {
    const fetchMenuByRole = async () => {
      try {
        const role = parsed.usrRole;
        const response = await fetch(`/api/menu-by-role?userRole=${role}`);
        const data = await response.json();
        if (data.success) {
          setMenuItems(data.menuByRole[0]?.menuId || []);
        } else {
          console.error("Failed to load menu");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchMenuByRole();
  }, []);

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const userId = parsed.id;
        const response = await fetch(`/api/users/${userId}/view-sadhak`);
        const data = await response.json();
        if (data.success) {
          setUserData(data.sdkById);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchUserById();
  }, []);

  const handleViewChange = (role: string, url: string) => {
    fetch("/api/auth/login", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sdkRole: role }),
    }).then((response) => {
      if (response.ok) {
        window.location.href = url;
      }
    });
  };

  const renderIcon = (iconName: string) => {
    const allIcons = {
      ...MdIcons,
      ...BiIcons,
      ...HiIcons,
      ...SiIcons,
      ...BsIcons,
      ...GiIcons,
      ...IoIcons,
      ...RiIcons,
      ...PiIcons,
      ...FaIcons,
    };

    const trimmedName = iconName?.trim();
    if (!trimmedName || !(trimmedName in allIcons)) return null;

    const IconComponent = allIcons[trimmedName as keyof typeof allIcons];
    return IconComponent ? <IconComponent size={24} /> : null;
  };

  const handleToggle = (parentId: string) => {
    setSelectedParentId(selectedParentId === parentId ? null : parentId);
  };

  const getOrderedMenu = () => {
    const parentsAndNeutrals = menuItems
      .filter((item) => !item.isChild)
      .sort((a, b) => a.menuOrder - b.menuOrder);

    const children = menuItems.filter((item) => item.isChild);
    const result: any[] = [];

    for (const item of parentsAndNeutrals) {
      result.push(item);
      if (item.isParent) {
        const childItems = children
          .filter((child) => child.parentId === item._id)
          .sort((a, b) => a.menuOrder - b.menuOrder);
        result.push(...childItems);
      }
    }
    return result;
  };

  const orderedMenu = getOrderedMenu();

  return (
    <div>
      <div className="flex flex-col h-screen w-[230px] bg-orange-600 p-4">
        <div className="flex gap-2 items-center bg-orange-500 rounded-sm mb-1">
          <Image
            alt="pdlinstitute"
            src="/images/pdlLogo.jpg"
            width={52}
            height={52}
          />
          <p className="text-white font-bold">PDL INSTITUTE</p>
        </div>

        <div className="flex flex-col gap-1">
          {orderedMenu.map((item) => {
            const trimmedUrl = (item.menuUrl || "").trim();
            const isActive = pathName === trimmedUrl;
            const isParent = item.isParent;
            const isNeutral = !item.isParent && !item.isChild;

            const childItems = menuItems.filter(
              (child) => child.isChild && child.parentId === item._id
            );
            const isAnyChildActive = childItems.some(
              (child) => pathName === (child.menuUrl || "").trim()
            );

            if (isNeutral) {
              return (
                <Link
                  key={item._id}
                  href={trimmedUrl}
                  className={`group flex gap-2 p-2 rounded-sm ${
                    isActive
                      ? "bg-white text-black"
                      : "text-white bg-orange-500 hover:bg-white hover:text-black"
                  }`}
                >
                  {renderIcon(item.menuIcon)}
                  <span className="hidden md:block font-semibold">
                    {item.menuName.toUpperCase()}
                  </span>
                </Link>
              );
            }

            if (isParent) {
              const isSelected = selectedParentId === item._id;
              return (
                <div key={item._id}>
                  <button
                    type="button"
                    onClick={() => handleToggle(item._id)}
                    className={`group flex gap-2 p-2 rounded-sm w-full ${
                      isAnyChildActive
                        ? "bg-white text-black"
                        : "text-white bg-orange-500 hover:bg-white hover:text-black"
                    }`}
                  >
                    {renderIcon(item.menuIcon)}
                    <span className="flex font-semibold">
                      {item.menuName.toUpperCase()}
                    </span>
                    <IoIosArrowDown
                      size={24}
                      className={`flex ml-auto ${
                        isSelected ? "rotate-180 duration-500" : ""
                      }`}
                    />
                  </button>
                </div>
              );
            }

            if (item.isChild && selectedParentId === item.parentId) {
              return (
                <div key={item._id} className="flex flex-col w-full px-[35px]">
                  <Link
                    href={trimmedUrl}
                    className={`text-xs uppercase font-bold py-1 pl-2 pr-3 rounded-sm ${
                      isActive
                        ? "bg-orange-400 text-black"
                        : "text-white hover:text-black hover:bg-orange-400"
                    }`}
                  >
                    - {item.menuName.toUpperCase()}
                  </Link>
                </div>
              );
            }

            return null;
          })}

          {(userData.isAdmin === "Yes" || userData.isVolunter === "Yes") && (
            <>
              <div key={"admin-volunter"}>
                <button
                  type="button"
                  onClick={() => handleToggle("admin-volunter")}
                  className={`group flex gap-2 p-2 rounded-sm w-full ${
                    selectedParentId === "admin-volunter"
                      ? "bg-white text-black"
                      : "text-white bg-orange-500 hover:bg-white hover:text-black"
                  }`}
                >
                  {renderIcon("FaEye")}
                  <span className="flex font-semibold">VIEW AS</span>
                  <IoIosArrowDown
                    size={24}
                    className={`flex ml-auto ${
                      selectedParentId === "admin-volunter"
                        ? "rotate-180 duration-500"
                        : ""
                    }`}
                  />
                </button>
              </div>

              {parsed.usrRole !== userData.sdkRole &&
                userData.isAdmin === "Yes" &&
                selectedParentId === "admin-volunter" && (
                  <div
                    key={"admin-volunter-child-1"}
                    className="flex flex-col w-full px-[35px]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleViewChange(
                          userData.sdkRole,
                          "/account/admin-dashboard"
                        )
                      }
                      className="text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm text-left w-full"
                    >
                      - {userData.sdkRole.toUpperCase()}
                    </button>
                  </div>
                )}

              {parsed.usrRole !== "Sadhak" &&
                selectedParentId === "admin-volunter" && (
                  <div
                    key={"admin-volunter-child-2"}
                    className="flex flex-col w-full px-[35px]"
                  >
                    <button
                      onClick={() =>
                        handleViewChange("Sadhak", "/account/sadhak-dashboard")
                      }
                      className="text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm text-left w-full"
                    >
                      - SADHAK
                    </button>
                  </div>
                )}

              {parsed.usrRole !== "Volunteer" &&
                userData.isVolunter === "Yes" &&
                selectedParentId === "admin-volunter" && (
                  <div
                    key={"admin-volunter-child-3"}
                    className="flex flex-col w-full px-[35px]"
                  >
                    <button
                      onClick={() =>
                        handleViewChange("Volunteer", "/account/sadhak-dashboard")
                      }
                      className="text-white text-xs uppercase font-bold hover:text-black hover:bg-orange-400 py-1 pl-2 pr-3 rounded-sm text-left w-full"
                    >
                      - VOLUNTEER
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
