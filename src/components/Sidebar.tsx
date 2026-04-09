import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCog, 
  LogOut, 
  PlusCircle,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface SidebarProps {
  role: string | null;
  activePath: string;
}

export default function Sidebar({ role, activePath }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (localStorage.getItem('amansekolah_demo_mode') === 'true') {
      localStorage.removeItem('amansekolah_demo_mode');
      window.location.reload();
      return;
    }
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app', roles: ['admin', 'guru', 'siswa'] },
    { icon: FileText, label: 'Laporan Bullying', path: '/app/reports', roles: ['admin', 'guru', 'siswa'] },
    { icon: PlusCircle, label: 'Buat Laporan', path: '/app/report/new', roles: ['siswa'] },
    { icon: GraduationCap, label: 'Data Siswa', path: '/app/students', roles: ['admin', 'guru'] },
    { icon: UserCog, label: 'User Management', path: '/app/users', roles: ['admin'] },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
          <ShieldAlert className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 leading-tight">AmanSekolah</h1>
          <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider">Anti-Bullying</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.filter(item => item.roles.includes(role || '')).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activePath === item.path 
                ? "bg-brand-red text-white shadow-md shadow-red-100" 
                : "text-gray-500 hover:bg-red-50 hover:text-brand-red"
            )}
          >
            <item.icon className={cn("w-5 h-5", activePath === item.path ? "text-white" : "text-gray-400 group-hover:text-brand-red")} />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
