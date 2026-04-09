import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface DashboardProps {
  user: User | null;
  role: string | null;
}

export default function Dashboard({ user, role }: DashboardProps) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    resolved: 0,
    students: 0
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !role) return;

    const fetchStats = async () => {
      let query = supabase.from('reports').select('*', { count: 'exact' });
      
      if (role === 'siswa') {
        query = query.eq('reporter_uid', user.id);
      }

      const { data, count, error } = await query;
      
      if (data) {
        setStats(prev => ({
          ...prev,
          total: count || 0,
          pending: data.filter(d => d.status === 'pending').length,
          verified: data.filter(d => d.status === 'verified').length,
          resolved: data.filter(d => d.status === 'resolved').length,
        }));
      }
      setLoading(false);
    };

    const fetchRecent = async () => {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (role === 'siswa') {
        query = query.eq('reporter_uid', user.id);
      }

      const { data } = await query;
      if (data) setRecentReports(data);
    };

    const fetchStudentCount = async () => {
      if (role !== 'siswa') {
        const { count } = await supabase.from('students').select('*', { count: 'exact', head: true });
        setStats(prev => ({ ...prev, students: count || 0 }));
      }
    };

    fetchStats();
    fetchRecent();
    fetchStudentCount();

    // Realtime subscription
    const channel = supabase
      .channel('reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        fetchStats();
        fetchRecent();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, role]);

  const cards = [
    { label: 'Total Laporan', value: stats.total, icon: ShieldAlert, color: 'bg-gray-900', text: 'text-white' },
    { label: 'Menunggu Verifikasi', value: stats.pending, icon: Clock, color: 'bg-brand-red', text: 'text-white' },
    { label: 'Telah Diverifikasi', value: stats.verified, icon: AlertTriangle, color: 'bg-brand-gold', text: 'text-white' },
    { label: 'Kasus Selesai', value: stats.resolved, icon: CheckCircle2, color: 'bg-green-600', text: 'text-white' },
  ];

  if (role !== 'siswa') {
    cards.push({ label: 'Total Siswa', value: stats.students, icon: Users, color: 'bg-white', text: 'text-gray-900' });
  }

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500">Ringkasan aktivitas pelaporan bullying di sekolah.</p>
        </div>
        {role === 'siswa' && (
          <Link to="/app/report/new" className="px-6 py-3 bg-brand-red text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Lapor Sekarang
          </Link>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn("p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between h-48", card.color)}
          >
            <div className="flex items-center justify-between">
              <div className={cn("p-3 rounded-2xl", card.color === 'bg-white' ? 'bg-gray-50' : 'bg-white/20')}>
                <card.icon className={cn("w-6 h-6", card.color === 'bg-white' ? 'text-gray-900' : 'text-white')} />
              </div>
              <TrendingUp className={cn("w-5 h-5 opacity-50", card.text)} />
            </div>
            <div>
              <p className={cn("text-sm font-medium opacity-70 mb-1", card.text)}>{card.label}</p>
              <h3 className={cn("text-4xl font-bold tracking-tight", card.text)}>{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Laporan Terbaru</h2>
            <Link to="/app/reports" className="text-sm font-bold text-brand-red hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentReports.length > 0 ? recentReports.map((report) => (
              <div key={report.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md",
                    report.status === 'pending' ? 'bg-brand-red' : report.status === 'verified' ? 'bg-brand-gold' : 'bg-green-600'
                  )}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Korban: {report.victim_name}</h4>
                    <p className="text-sm text-gray-500 truncate max-w-md">{report.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    report.status === 'pending' ? 'bg-red-100 text-brand-red' : report.status === 'verified' ? 'bg-gold-100 text-brand-gold' : 'bg-green-100 text-green-700'
                  )}>
                    {report.status}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {new Date(report.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-gray-400">
                Belum ada laporan masuk.
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-brand-gold rounded-[32px] p-10 text-white shadow-xl shadow-gold-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 leading-tight">Tips Keamanan Sekolah</h3>
            <ul className="space-y-4 text-gold-50 text-sm font-medium">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                Selalu waspada terhadap lingkungan sekitar.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                Jangan takut untuk melapor jika melihat bullying.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                Dukung teman yang menjadi korban.
              </li>
            </ul>
          </div>
          <div className="mt-10 pt-8 border-t border-white/20 relative z-10">
            <p className="text-xs text-gold-100 italic">"Keamanan sekolah adalah tanggung jawab kita bersama."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
