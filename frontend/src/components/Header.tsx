import React from 'react';
import {CircleUserRound} from "lucide-react"
import logo from "@/assets/logo.png"
const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full p-4 z-50 border-b border-b-neutral-200">
      <div className="flex justify-between text-black">
        <div className='flex gap-10'>
          <img src={logo} height='35px' width='35px' alt="" />
          <h1 className='text-2xl font-bold'>Dashboard</h1>
        </div>
        <nav className="space-x-6">
          <div><CircleUserRound size={32}/></div>
        </nav>
      </div>
    </header>
  );
};

export default Header;