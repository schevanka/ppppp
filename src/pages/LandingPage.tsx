import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
              <ShieldAlert className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">AmanSekolah</span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/login" className="px-6 py-2.5 bg-brand-red text-white font-semibold rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-100">
              Masuk Aplikasi
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-brand-red rounded-full text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Stop Bullying Sekarang
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8">
              Ciptakan Sekolah <span className="text-brand-red">Aman</span> & <span className="text-brand-gold">Nyaman</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
              Platform pelaporan bullying yang aman, rahasia, dan terpercaya. Berani melapor adalah langkah awal menghentikan kekerasan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center gap-2 group shadow-xl shadow-gray-200">
                Lapor Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#edukasi" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-brand-red/10 rounded-full blur-3xl"></div>
            <img 
              src="https://picsum.photos/seed/school/800/600" 
              alt="School Safety" 
              className="rounded-[40px] shadow-2xl relative z-10 border-8 border-white"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Edukasi Section */}
      <section id="edukasi" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Mengenal Bullying</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Bullying bukan sekadar candaan. Ini adalah tindakan serius yang merugikan mental dan fisik.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Dampak Mental", desc: "Menyebabkan depresi, kecemasan, dan penurunan kepercayaan diri pada korban.", color: "bg-red-500" },
              { icon: Users, title: "Dampak Sosial", desc: "Merusak hubungan pertemanan dan menciptakan lingkungan sekolah yang tidak sehat.", color: "bg-brand-gold" },
              { icon: ShieldAlert, title: "Dampak Akademik", desc: "Menurunkan konsentrasi belajar dan motivasi untuk pergi ke sekolah.", color: "bg-gray-800" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg", item.color)}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-brand-red rounded-[48px] p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-red-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 relative z-10">Jangan Diam. Berani Melapor!</h2>
            <p className="text-red-100 text-xl mb-12 max-w-2xl mx-auto relative z-10">
              Identitas Anda akan kami rahasiakan. Mari bersama-sama menjaga keamanan lingkungan sekolah kita.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link to="/login" className="px-10 py-5 bg-white text-brand-red font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl">
                Mulai Melapor
              </Link>
              <div className="flex items-center gap-3 text-red-50 font-semibold">
                <CheckCircle2 className="w-6 h-6" />
                100% Rahasia & Aman
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>&copy; 2026 AmanSekolah. Semua Hak Dilindungi.</p>
      </footer>
    </div>
  );
}
