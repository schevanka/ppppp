import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportFormProps {
  user: User | null;
}

export default function ReportForm({ user }: ReportFormProps) {
  const [formData, setFormData] = useState({
    victim_name: '',
    perpetrator_name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('reports').insert({
        ...formData,
        reporter_uid: user.id,
        reporter_name: user.user_metadata?.full_name || user.email,
        status: 'pending',
        follow_up_notes: '',
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => navigate('/app/reports'), 2000);
    } catch (err: any) {
      console.error(err);
      setError('Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Laporan Terkirim!</h2>
        <p className="text-gray-500 mb-8">Terima kasih telah berani melapor. Identitas Anda aman bersama kami.</p>
        <p className="text-sm text-brand-red font-bold animate-pulse">Mengalihkan ke riwayat laporan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Laporan Bullying</h1>
        <p className="text-gray-500">Berikan detail kejadian dengan jujur dan lengkap.</p>
      </header>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-12 space-y-8"
      >
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-brand-red text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Nama Korban</label>
            <input
              required
              type="text"
              placeholder="Siapa yang menjadi korban?"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
              value={formData.victim_name}
              onChange={(e) => setFormData({ ...formData, victim_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Nama Pelaku (Jika Tahu)</label>
            <input
              required
              type="text"
              placeholder="Siapa pelakunya?"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
              value={formData.perpetrator_name}
              onChange={(e) => setFormData({ ...formData, perpetrator_name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Tanggal Kejadian</label>
          <input
            required
            type="date"
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Deskripsi Kejadian</label>
          <textarea
            required
            rows={5}
            placeholder="Ceritakan apa yang terjadi secara detail..."
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-brand-red text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Kirim Laporan Rahasia
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Laporan Anda akan diproses oleh tim guru BK secara profesional.
          </p>
        </div>
      </motion.form>
    </div>
  );
}
