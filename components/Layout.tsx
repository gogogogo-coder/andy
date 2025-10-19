import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-dark-bg">
      <main className="flex-1 overflow-y-auto pb-16 relative">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;