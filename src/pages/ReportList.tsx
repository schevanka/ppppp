import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  MoreVertical,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportListProps {
  user: User | null;
  role: string | null;
}

export default function ReportList({ user, role }: ReportListProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [followUpText, setFollowUpText] = useState('');

  const fetchReports = async () => {
    if (!user || !role) return;

    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (role === 'siswa') {
      query = query.eq('reporter_uid', user.id);
    }

    const { data, error } = await query;
    if (data) setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel('reports-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, role]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await supabase.from('reports').update({ status }).eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFollowUp = async (id: string) => {
    if (!followUpText.trim()) return;
    try {
      await supabase.from('reports').update({ 
        follow_up_notes: followUpText,
        status: 'resolved'
      }).eq('id', id);
      setFollowUpText('');
      setExpandedId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus laporan ini?')) return;
    try {
      await supabase.from('reports').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-red"></div></div>;
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Laporan</h1>
          <p className="text-gray-500">Kelola dan pantau status laporan bullying.</p>
        </div>
      </header>

      <div className="space-y-4">
        {reports.length > 0 ? reports.map((report) => (
          <motion.div 
            key={report.id}
            layout
            className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden"
          >
            <div 
              className="p-8 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                  report.status === 'pending' ? 'bg-brand-red' : report.status === 'verified' ? 'bg-brand-gold' : 'bg-green-600'
                )}>
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">Korban: {report.victim_name}</h3>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      report.status === 'pending' ? 'bg-red-100 text-brand-red' : report.status === 'verified' ? 'bg-gold-100 text-brand-gold' : 'bg-green-100 text-green-700'
                    )}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" /> Pelaku: {report.perpetrator_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900">Dilaporkan pada</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(report.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                </div>
                {expandedId === report.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedId === report.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-8 pb-8 border-t border-gray-50 pt-8"
                >
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Deskripsi Kejadian</h4>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                          "{report.description}"
                        </p>
                      </div>
                      
                      {report.follow_up_notes && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tindak Lanjut</h4>
                          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex gap-4">
                            <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                            <p className="text-green-800 text-sm font-medium">{report.follow_up_notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-8">
                      {role !== 'siswa' && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aksi Petugas</h4>
                          <div className="flex flex-wrap gap-3">
                            {report.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(report.id, 'verified')}
                                className="px-4 py-2 bg-brand-gold text-white text-xs font-bold rounded-xl hover:bg-gold-600 transition-all shadow-md shadow-gold-100"
                              >
                                Verifikasi Laporan
                              </button>
                            )}
                            {role === 'admin' && (
                              <button 
                                onClick={() => handleDelete(report.id)}
                                className="px-4 py-2 bg-white border border-red-100 text-brand-red text-xs font-bold rounded-xl hover:bg-red-50 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="space-y-3 pt-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Berikan Tindak Lanjut</h4>
                            <textarea
                              placeholder="Tuliskan tindakan yang diambil..."
                              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-red transition-all resize-none"
                              rows={3}
                              value={followUpText}
                              onChange={(e) => setFollowUpText(e.target.value)}
                            />
                            <button 
                              onClick={() => handleAddFollowUp(report.id)}
                              className="w-full py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg"
                            >
                              Selesaikan Kasus
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Informasi Pelapor</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{role === 'siswa' ? 'Anda (Rahasia)' : report.reporter_name}</p>
                            <p className="text-[10px] text-gray-400 font-medium italic">Identitas pelapor dilindungi sistem.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <ShieldAlert className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Belum ada laporan.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
