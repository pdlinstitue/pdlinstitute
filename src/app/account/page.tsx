"use client";
import React from 'react';

interface AccountPageProps {
  children: React.ReactNode;
}

const AccountPage: React.FC<AccountPageProps> = ({ children }) => {
  
  return (    
    <>
      {children}
    </>
  );
};

export default AccountPage;
