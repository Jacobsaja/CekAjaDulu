import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, MAJOR_CLUSTERS } from '../data/questions';
import { Info, Award, Briefcase, RefreshCw, Home, Brain, GraduationCap } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Header Result */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold uppercase tracking-wider">
                    <Award size={18} />
                    Hasil Rekomendasi Karir & Pendidikan
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Klaster Utama: <span className="text-blue-700 dark:text-blue-400">{dominantCluster.name}</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Berdasarkan tes minat, preferensi bidang, dan performa akademik Anda, klaster <span className="font-bold text-gray-800 dark:text-white">{dominantCluster.name}</span> adalah pilihan yang paling konsisten dan realistis.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2 space-y-8">
                    {/* Chart View */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-blue-900/10 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-100 dark:hover:border-blue-500/50 transition-all duration-300">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-gray-800 dark:text-white">
                            <Info className="text-blue-600 dark:text-blue-400" size={20} />
                            Skor RIASEC (Minat Dasar)
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-gray-900 text-white p-3 rounded-xl shadow-2xl border border-gray-800 text-xs">
                                                        <p className="font-bold mb-1">{payload[0].payload.fullName}</p>
                                                        <p className="opacity-70">{payload[0].payload.label}</p>
                                                        <div className="mt-2 text-blue-400 font-extrabold text-lg">
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
                                        radius={[8, 8, 8, 8]}
                                        barSize={40}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={top3.includes(entry.name) ? '#1d4ed8' : '#e5e7eb'}
                                                className="transition-all duration-300"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Cluster Matches */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-blue-900/10 hover:-translate-y-1 hover:border-blue-100 dark:hover:border-blue-500/50 transition-all duration-300 space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Brain className="text-purple-600 dark:text-purple-400" size={20} />
                            Kesesuaian Klaster
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(clusterScores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key, score], i) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold items-end">
                                        <span className={i === 0 ? "text-blue-700 dark:text-blue-400 text-lg" : "text-gray-600 dark:text-slate-400"}>
                                            {MAJOR_CLUSTERS[key].name}
                                        </span>
                                        <span className="text-gray-400 dark:text-slate-500 font-medium">{Math.round(score)}% match</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Interpretation & Majors */}
                <div className="space-y-6">
                    <div className="bg-blue-600 dark:bg-blue-700 text-white p-8 rounded-3xl shadow-xl shadow-blue-500/20 dark:shadow-blue-900/30 relative overflow-hidden">
                        <Briefcase className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32" />
                        <h3 className="text-xl font-bold mb-4 relative z-10">Tipe Kepribadian</h3>
                        <p className="text-blue-100 dark:text-blue-50 text-sm leading-relaxed relative z-10">
                            Minat dominan Anda adalah <span className="font-bold text-white uppercase tracking-wider">{dominantInfo.name}</span>. {dominantInfo.description}
                        </p>
                    </div>

                    <div className="bg-gray-900 dark:bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-800 dark:border-slate-800">
                        <h3 className="text-xl font-bold mb-6 text-blue-400">Rekomendasi Jurusan</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-xs mb-4 uppercase tracking-widest font-bold">Terpilih dari klaster {dominantCluster.name}</p>
                        <ul className="space-y-3">
                            {dominantCluster.majors.slice(0, 5).map((field, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm border-b border-gray-800 dark:border-slate-800 pb-2 last:border-0 group hover:-translate-y-0.5 transition-all opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:scale-150 transition-transform" />
                                    <span className="text-gray-300 dark:text-slate-300 group-hover:text-white transition-colors">{field}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {top3.map((key, index) => (
                    <div key={key} className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 dark:hover:shadow-blue-900/20 hover:-translate-y-2 hover:border-blue-100 dark:hover:border-blue-500/50 transition-all duration-300 flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl transition-colors duration-300 ${index === 0 ? 'bg-blue-600 dark:bg-blue-600 text-white group-hover:bg-blue-700 dark:group-hover:bg-blue-500' : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-slate-700'
                            }`}>
                            {index + 1}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Minat {index + 1}</p>
                            <p className="font-extrabold text-gray-900 dark:text-white">{CATEGORIES[key].name}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{Math.round(scores[key])}% Score</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions & Disclaimer */}
            <div className="flex flex-col items-center gap-8 py-10 border-t border-gray-100 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl px-6">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 px-6 py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-md hover:-translate-y-1 group border border-transparent dark:border-slate-700"
                    >
                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                        Ulangi Tes
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-slate-300 px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-blue-900/20 hover:-translate-y-1 group"
                    >
                        <Home size={18} className="group-hover:scale-110 transition-transform" />
                        Beranda
                    </button>

                    <button
                        onClick={() => navigate('/tes-lanjutan', { state: { scores } })}
                        className="sm:col-span-2 md:col-span-1 flex items-center justify-center gap-2 bg-blue-700 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-blue-700/30 dark:shadow-blue-900/50 hover:shadow-blue-700/50 hover:-translate-y-1 group"
                    >
                        <GraduationCap size={18} className="group-hover:scale-110 transition-transform" />
                        Tes Lanjutan (Rapor)
                    </button>
                </div>

                <p className="text-gray-400 dark:text-slate-500 text-[10px] text-center max-w-sm px-6">
                    Disclaimer: Rekomendasi ini adalah Output Tahap 1 (Minat & Bakat). Gunakan Tes Lanjutan untuk hasil yang lebih presisi dengan data akademik.
                </p>
            </div>
        </div>
    );
};

export default ResultSection;
