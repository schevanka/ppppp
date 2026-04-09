/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { AlertTriangle, Settings } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import ReportList from './pages/ReportList';
import UserManagement from './pages/UserManagement';
import StudentManagement from './pages/StudentManagement';
import Layout from './components/Layout';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check if user previously chose demo mode
      const demoChoice = localStorage.getItem('amansekolah_demo_mode');
      if (demoChoice === 'true') {
        setIsDemoMode(true);
        setRole('admin'); // Default to admin for demo
        setUser({ 
          id: 'demo-user', 
          email: 'demo@example.com',
          user_metadata: { full_name: 'Pengguna Demo' } 
        } as any);
      }
      setLoading(false);
      return;
    }

    // Real Supabase Logic
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchUserRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const startDemo = () => {
    localStorage.setItem('amansekolah_demo_mode', 'true');
    window.location.reload();
  };

  const fetchUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (data) {
        setRole(data.role);
      }
    } catch (err) {
      console.error('Error fetching role:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured && !isDemoMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl p-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Konfigurasi Diperlukan</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Aplikasi memerlukan koneksi Supabase. Anda bisa memasukkan kredensial di <strong>Settings &gt; Secrets</strong> atau mencoba mode demo.
          </p>
          
          <button 
            onClick={startDemo}
            className="w-full py-4 bg-brand-red text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 transition-all mb-8"
          >
            Coba Mode Demo
          </button>

          <div className="space-y-4 text-left bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cara Hubungkan Supabase:</h3>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
              <p className="text-sm text-gray-600">Buka <strong>Settings &gt; Secrets</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
              <p className="text-sm text-gray-600">Tambahkan <code>VITE_SUPABASE_URL</code></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
              <p className="text-sm text-gray-600">Tambahkan <code>VITE_SUPABASE_ANON_KEY</code></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/app" /> : <LoginPage />} />
        
        <Route path="/app" element={user ? <Layout user={user} role={role} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard user={user} role={role} />} />
          <Route path="reports" element={<ReportList user={user} role={role} />} />
          <Route path="report/new" element={<ReportForm user={user} />} />
          
          {/* Admin & Guru specific */}
          {(role === 'admin' || role === 'guru') && (
            <>
              <Route path="students" element={<StudentManagement />} />
            </>
          )}

          {/* Admin only */}
          {role === 'admin' && (
            <>
              <Route path="users" element={<UserManagement />} />
            </>
          )}
        </Route>
      </Routes>
    </Router>
  );
}
