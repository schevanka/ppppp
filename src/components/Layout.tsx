import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import Sidebar from './Sidebar';
import { Bell, User as UserIcon, Menu } from 'lucide-react';

interface LayoutProps {
  user: User;
  role: string | null;
}

export default function Layout({ user, role }: LayoutProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const displayName = user.user_metadata?.full_name || user.email;
  const photoURL = user.user_metadata?.avatar_url;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} activePath={location.pathname} isCollapsed={isCollapsed} />
      
      <main className="flex-1 flex flex-col transition-all duration-300">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Selamat datang,</span>
              <span className="text-sm font-semibold text-gray-900">{displayName}</span>
              <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[10px] font-bold rounded-full uppercase tracking-tighter">
                {role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-brand-red transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
