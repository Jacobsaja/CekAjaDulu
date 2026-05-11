import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Sparkles, CheckCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';

export function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 py-12 lg:py-24 overflow-hidden">
      {/* Left Content */}
      <div className="flex-1 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Penerimaan Berbasis Data
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white"
        >
          Ambil Keputusan <br />
          <span className="text-primary">Kuliah</span> Lebih Cerdas <br />
          dengan Data
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-zinc-400 max-w-lg leading-relaxed font-medium"
        >
          Analisis peluang kelulusan dan dapatkan rekomendasi jurusan berdasarkan minat, ROI, dan data historis.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 pt-4"
        >
          <Button 
            size="lg" 
            onClick={onGetStarted} 
            className="h-14 px-8 text-md font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            Cek Peluang Lulus
          </Button>
          <Button 
            size="lg" 
            variant="secondary" 
            className="h-14 px-8 text-md font-bold rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
          >
            Coba Tes Minat
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4 pt-8"
        >
          <div className="flex -space-x-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-zinc-800" />
             ))}
          </div>
          <span className="text-xs text-zinc-500 font-medium">Sudah digunakan oleh 1 siswa tahun ini</span>
        </motion.div>
      </div>

      {/* Right Visual (The Bento-style Card from Screenshot) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 w-full relative"
      >
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
             <div className="w-12 h-12 rounded-full border-4 border-primary/20 flex items-center justify-center text-primary font-bold text-xs">85%</div>
          </div>
          
          <div className="w-32 h-4 bg-zinc-800 rounded-full mb-8" />
          
          <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-6 mb-6">
             <div className="flex items-end gap-3 h-32">
                <div className="w-full bg-primary/40 rounded-t-lg h-[40%]" />
                <div className="w-full bg-primary rounded-t-lg h-[70%]" />
                <div className="w-full bg-primary/60 rounded-t-lg h-[50%]" />
                <div className="w-full bg-primary/80 rounded-t-lg h-[80%]" />
                <div className="w-full bg-primary/40 rounded-t-lg h-[30%]" />
                <div className="w-full bg-primary rounded-t-lg h-[90%]" />
                <div className="w-full bg-primary/70 rounded-t-lg h-[60%]" />
             </div>
          </div>

          <div className="space-y-3">
             <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 flex justify-between items-center group/item hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">ITB</div>
                  <span className="text-sm font-bold text-zinc-300">Teknik Informatika</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Kecocokan Tinggi</span>
             </div>
             <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 flex justify-between items-center opacity-50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] font-black text-blue-400 border border-blue-400/20">UI</div>
                  <span className="text-sm font-bold text-zinc-300">Ilmu Komputer</span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pilihan Aman</span>
             </div>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
