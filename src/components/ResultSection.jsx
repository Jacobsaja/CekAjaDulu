import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, MAJOR_CLUSTERS } from '../data/questions';
import { Info, Award, Briefcase, RefreshCw, Home, Brain, GraduationCap } from 'lucide-react';
import AIConsultant from './AIConsultant';

const ResultSection = ({ scores, clusterScores, dominantCluster, top3 }) => {
    const navigate = useNavigate();
    const chartData = Object.keys(scores).map(key => ({
        name: key,
        fullName: CATEGORIES[key].name,
        label: CATEGORIES[key].label,
        score: Math.round(scores[key])
    }));

    const COLORS = ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

    const dominantInfo = CATEGORIES[top3[0]];

    return (
        <div className="max-w-4xl mx-auto space-y-16 animate-reveal">
            {/* Header Result */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-[0.2em]">
                    <Award size={16} />
                    Analisis Karir & Pendidikan
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                    Klaster Utama: <br />
                    <span className="text-gradient">{dominantCluster.name}</span>
                </h2>
                <p className="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Berdasarkan data minat, preferensi bidang, dan performa akademik, <span className="text-blue-600 dark:text-blue-400 font-bold">{dominantCluster.name}</span> adalah pilihan yang paling strategis untuk masa depanmu.
                </p>
            </div>

            {/* AI Consultant Section (Primary Result) */}
            <AIConsultant scores={scores} dominantCluster={dominantCluster} top3={top3} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                <div className="lg:col-span-2 space-y-10">
                    {/* Chart View */}
                    <div className="glass p-8 md:p-12 rounded-[3rem] shadow-blue-900/5 transition-all duration-500 hover:shadow-blue-500/10">
                        <h3 className="text-2xl font-black mb-10 flex items-center gap-3 text-gray-900 dark:text-white uppercase tracking-tighter">
                            <Brain className="text-blue-600" size={24} />
                            Skor Profil RIASEC
                        </h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={window.matchMedia('(prefers-color-scheme: dark)').matches ? "#1e293b" : "#f1f5f9"} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 14, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-slate-950 text-white p-5 rounded-[1.5rem] shadow-2xl border border-slate-800 text-sm">
                                                        <p className="font-black text-blue-400 uppercase tracking-widest text-[10px] mb-2">{payload[0].payload.fullName}</p>
                                                        <p className="opacity-70 leading-relaxed font-medium mb-3">{payload[0].payload.label}</p>
                                                        <div className="text-3xl font-black tracking-tighter">
                                                            {payload[0].value}%
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="score"
                                        radius={[12, 12, 12, 12]}
                                        barSize={45}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={top3.includes(entry.name) ? '#2563eb' : (window.matchMedia('(prefers-color-scheme: dark)').matches ? '#1e293b' : '#f1f5f9')}
                                                className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Kesesuaian Klaster */}
                    <div className="glass p-10 rounded-[3rem] shadow-blue-900/5 transition-all duration-500 hover:shadow-blue-500/10 space-y-8">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
                            <Brain className="text-purple-500" size={24} />
                            Analisis Klaster
                        </h3>
                        <div className="space-y-6">
                            {Object.entries(clusterScores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key, score], i) => (
                                <div key={key} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className={`font-black tracking-tight ${i === 0 ? "text-blue-700 dark:text-blue-400 text-xl" : "text-gray-600 dark:text-slate-400 text-lg"}`}>
                                            {MAJOR_CLUSTERS[key].name}
                                        </span>
                                        <span className="text-blue-600/50 dark:text-blue-400/50 font-black text-sm">{Math.round(score)}% match</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-[1.5s] ease-out ${i === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30' : 'bg-slate-300 dark:bg-slate-700'}`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Interpretation & Majors */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                        <Briefcase className="absolute -right-6 -bottom-6 text-white/10 w-40 h-40 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />
                        <h3 className="text-2xl font-black mb-6 relative z-10 tracking-tighter uppercase">Profil Karakter</h3>
                        <p className="text-blue-50 dark:text-blue-100 font-medium leading-relaxed relative z-10 text-lg">
                            Tipe dominanmu adalah <span className="text-white font-black underline decoration-blue-400 decoration-4 underline-offset-4">{dominantInfo.name}</span>. {dominantInfo.description}
                        </p>
                    </div>

                    <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
                        <h3 className="text-2xl font-black mb-8 text-blue-400 tracking-tighter uppercase">Saran Jurusan</h3>
                        <p className="text-slate-500 text-[10px] mb-6 uppercase tracking-[0.2em] font-black">Top rekomendasi dari klaster {dominantCluster.name}</p>
                        <ul className="space-y-5">
                            {dominantCluster.majors.slice(0, 5).map((field, i) => (
                                <li key={i} className="flex items-center gap-4 text-lg border-b border-slate-800 pb-4 last:border-0 group cursor-default">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 group-hover:scale-150 transition-transform" />
                                    <span className="text-slate-300 group-hover:text-white transition-colors font-bold tracking-tight">{field}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Ranking Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {top3.map((key, index) => (
                    <div key={key} className="group glass p-8 rounded-[2.5rem] hover:-translate-y-2 transition-all duration-500 flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-all duration-500 ${index === 0 ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/50 rotate-3' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 group-hover:text-blue-600'
                            }`}>
                            {index + 1}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rank {index + 1}</p>
                            <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">{CATEGORIES[key].name}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-black uppercase tracking-tighter">{Math.round(scores[key])}% Score</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions & Disclaimer */}
            <div className="flex flex-col items-center gap-10 py-16 border-t border-slate-100 dark:border-slate-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl px-6">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-3 glass hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 px-8 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-500 hover:-translate-y-1 group border-2 border-transparent"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                        Ulangi
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-3 glass hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 px-8 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-500 hover:-translate-y-1 group border-2 border-transparent"
                    >
                        <Home size={20} className="group-hover:scale-110 transition-transform" />
                        Home
                    </button>

                    <button
                        onClick={() => navigate('/tes-lanjutan', { state: { scores } })}
                        className="sm:col-span-2 md:col-span-1 flex items-center justify-center gap-3 bg-blue-700 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white px-8 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all duration-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 group"
                    >
                        <GraduationCap size={20} className="group-hover:scale-110 transition-transform" />
                        Tes Rapor
                    </button>
                </div>

                <div className="glass px-6 py-3 rounded-full flex items-center gap-3 animate-pulse-slow">
                    <Info size={14} className="text-blue-500" />
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.1em]">
                        Hasil Tahap 1 (Minat). Gunakan Tes Rapor untuk hasil lebih presisi.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultSection;
