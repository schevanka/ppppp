import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { 
  Users, 
  UserCog, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert,
  GraduationCap,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('role', { ascending: true });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await supabase.from('profiles').update({ role }).eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus user ini?')) return;
    try {
      // Note: In Supabase, deleting from profiles might not delete from auth.users
      // unless you have a trigger or use the Admin API.
      await supabase.from('profiles').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-500">Kelola peran dan akses pengguna aplikasi.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Cari user..."
            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-red transition-all w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Sekolah</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <select 
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider outline-none border-none cursor-pointer",
                      user.role === 'admin' ? 'bg-gray-900 text-white' : user.role === 'guru' ? 'bg-brand-gold text-white' : 'bg-brand-red text-white'
                    )}
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="guru">Guru</option>
                    <option value="siswa">Siswa</option>
                  </select>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm text-gray-500 font-medium">{user.school_id}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            User tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
