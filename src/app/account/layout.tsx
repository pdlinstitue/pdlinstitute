"use client";
import React from "react";
import SideBar from "../components/SideBar";
import MobileSideBar from "../components/MobileSideBar";
import InnerHead from "../components/header/InnerHead";

interface LayoutProps {
  children: React.ReactNode;
}

const InnerLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Mobile Sidebar (shown on small screens only) */}
      <div className="fixed bottom-0 left-0 w-full md:hidden z-50">
        <MobileSideBar />
      </div>

      {/* Desktop Sidebar (shown on medium+ screens only) */}
      <div className="hidden md:block">
        <SideBar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <InnerHead />
        <main className="flex-1 p-6 overflow-auto max-h-[620px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InnerLayout;