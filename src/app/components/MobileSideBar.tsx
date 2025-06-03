"use client";

import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
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

const MobileSideBar: React.FC = () => {
  const pathName = usePathname();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchMenu = async () => {
      const role = Cookies.get("loggedInUserRole");
      const res = await fetch(`/api/menu-by-role?userRole=${role}`);
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.menuByRole[0]?.menuId || []);
      }
    };
    fetchMenu();
  }, []);

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
    const Icon = allIcons[iconName?.trim() as keyof typeof allIcons];
    return Icon ? <Icon size={20} /> : null;
  };

  const orderedMenu = () => {
    const parents = menuItems
      .filter((i) => !i.isChild)
      .sort((a, b) => a.menuOrder - b.menuOrder);
    const children = menuItems.filter((i) => i.isChild);
    const result: any[] = [];

    for (const item of parents) {
      result.push(item);
      if (item.isParent) {
        const sub = children
          .filter((c) => c.parentId === item._id)
          .sort((a, b) => a.menuOrder - b.menuOrder);
        result.push(...sub);
      }
    }

    return result;
  };

  return (
    <>
      {/* Slide-up Menu */}
      <div
        className={`fixed bottom-[60px] left-0 w-full bg-white border-t transition-transform duration-300 z-40 ${
          isMenuOpen ? "translate-y-0" : "translate-y-full"
        } max-h-[80vh] overflow-auto shadow-lg`}
      >
        <div className="p-4 flex flex-col gap-2">
          {orderedMenu().map((item) => {
            // Skip if no URL and not a parent
            if (!item.menuUrl && !item.isParent) return null;

            // Parent Menu
            if (!item.isChild && item.isParent) {
              return (
                <div key={item._id}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedParentId((prev) =>
                        prev === item._id ? null : item._id
                      )
                    }
                    className={`flex items-center justify-between w-full p-2 rounded-md ${
                      selectedParentId === item._id
                        ? "bg-orange-600 text-white"
                        : "text-black hover:bg-orange-100"
                    }`}
                  >
                    <span className="flex items-center font-semibold gap-2">
                      {renderIcon(item.menuIcon)}
                      <span>{item.menuName.toUpperCase()}</span>
                    </span>
                    <IoIosArrowDown
                      className={`transition-transform ${
                        selectedParentId === item._id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              );
            }

            // Child Menu
            if (item.isChild && selectedParentId === item.parentId) {
              return (
                item.menuUrl && (
                  <Link
                    key={item._id}
                    href={item.menuUrl}
                    onClick={() => setIsMenuOpen(false)}
                    className="ml-6 text-sm text-gray-700 hover:text-orange-600"
                  >
                    - {item.menuName.toUpperCase()}
                  </Link>
                )
              );
            }

            // Neutral Menu
            if (!item.isChild && !item.isParent && item.menuUrl) {
              return (
                <Link
                  key={item._id}
                  href={item.menuUrl}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-2 rounded-md ${
                    pathName === item.menuUrl
                      ? "bg-orange-600 text-white"
                      : "text-black hover:bg-orange-100"
                  }`}
                >
                  {renderIcon(item.menuIcon)}
                  <span className="font-semibold">
                    {item.menuName.toUpperCase()}
                  </span>
                </Link>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-orange-600 text-white p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <MdDashboard size={24} />
        </div>
        <button type="button" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </>
  );
};

export default MobileSideBar;
