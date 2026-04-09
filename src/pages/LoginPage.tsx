import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldAlert, Chrome, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/app'
        }
      });
      
      if (error) throw error;
      
      // Note: The actual profile creation/role assignment should happen via 
      // Supabase Triggers/Functions or on the first landing in /app
    } catch (err: any) {
      console.error(err);
      setError('Gagal masuk. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-gray-200 p-12 border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
            <ShieldAlert className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
          <p className="text-gray-500">Masuk ke AmanSekolah untuk melapor atau memantau kasus.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-brand-red text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 px-6 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-50 hover:border-gray-200 transition-all group disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-gray-300 border-t-brand-red rounded-full animate-spin"></div>
          ) : (
            <>
              <Chrome className="w-6 h-6 text-gray-400 group-hover:text-brand-red transition-colors" />
              <span className="font-bold text-gray-700">Masuk dengan Google</span>
            </>
          )}
        </button>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            Dengan masuk, Anda menyetujui kebijakan privasi kami. Identitas pelapor akan selalu dirahasiakan.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
