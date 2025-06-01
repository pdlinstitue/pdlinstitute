"use client";
import React from 'react';
import SideBar from '../components/SideBar';
import InnerHead from '../components/header/InnerHead';

interface LayoutProps {
  children: React.ReactNode;
}

const InnerLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="order-2 md:order-1 w-auto">
          <SideBar />
        </div>
        <div className="order-1 md:order-2 w-full">
          <InnerHead />
          <main className="max-h-[620px] p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default InnerLayout;
