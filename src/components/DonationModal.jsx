import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, Check } from 'lucide-react';

const DonationModal = ({ isOpen, onClose }) => {
  const [dontShowToday, setDontShowToday] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Cek preferensi user di localStorage
      const hideUntil = localStorage.getItem('hideCekaduDonationUntil');
      if (hideUntil && new Date().getTime() < parseInt(hideUntil)) {
        // Jangan tampilkan jika belum lewat waktunya, auto close
        onClose();
        return;
      }

      setIsRendered(true);
      // Timeout kecil untuk trigger CSS transition
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Tunggu animasi selesai sebelum unmount
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (dontShowToday) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0); // Set ke jam 00:00 besok
      localStorage.setItem('hideCekaduDonationUntil', tomorrow.getTime().toString());
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isRendered) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 bg-slate-950/60 backdrop-blur-sm' : 'opacity-0 bg-slate-950/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
      aria-labelledby="donation-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`relative w-full max-w-md bg-[#0b1121] border border-blue-900/30 rounded-2xl shadow-2xl shadow-blue-900/20 overflow-hidden transition-all duration-300 ease-out flex flex-col ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Decorative Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl"></div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors z-10"
          aria-label="Tutup popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 relative z-10">
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md animate-pulse"></div>
              <div className="relative bg-slate-900 border border-cyan-500/30 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center mb-6">
            <h2 id="donation-modal-title" className="text-2xl font-bold text-white mb-3">
              Bantu Pengembangan Cekadu 🎓
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Fitur AI Cekadu membutuhkan biaya server agar tetap bisa digunakan gratis untuk pelajar. Kalau fitur ini membantu kamu, dukungan kecil lewat QRIS sangat berarti ❤️
            </p>
          </div>


          {/* QRIS Box */}
          <div className="mb-4 bg-white rounded-xl p-3 sm:p-4 shadow-inner flex flex-col items-center justify-center">
            <img 
              src="/saweria.png" 
              alt="QR Code Saweria Cekadu" 
              className="w-full max-w-[200px] h-auto rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x400/ffffff/0f172a?text=QRIS+Placeholder";
              }}
            />
          </div>
          
          <p className="text-xs text-center text-slate-500 mb-6">
            Donasi bersifat sukarela dan tidak wajib.
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button 
              onClick={handleClose}
              className="py-2.5 px-4 rounded-xl text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              Nanti Saja
            </button>
            <button 
              onClick={handleClose}
              className="py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Sudah Donasi
            </button>
          </div>

          {/* Checkbox Don't Show Today */}
          <div className="flex items-center justify-center">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${dontShowToday ? 'bg-cyan-500 border-cyan-500' : 'bg-slate-900 border-slate-600 group-hover:border-slate-500'}`}>
                {dontShowToday && <Check className="w-3 h-3 text-white" />}
              </div>
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                Jangan tampilkan lagi hari ini
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
