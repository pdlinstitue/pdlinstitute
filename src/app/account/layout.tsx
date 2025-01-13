"use client";
import React from 'react';
import SideBar from '../components/SideBar';
import InnerHead from '../components/header/InnerHead';

interface LayoutProps {
  children: React.ReactNode;
}

const InnerLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <div className="flex h-screen">
          <div className="w-auto">
              <SideBar/>
          </div>
          <div className="w-full">
              <InnerHead/>
              <main className="max-h-[620px] p-6 overflow-auto">
                  {children}
              </main>
          </div>
      </div>
    </div>
  );
};

export default InnerLayout;
