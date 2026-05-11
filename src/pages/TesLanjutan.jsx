import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronLeft, GraduationCap, Play, Table, BarChart as ChartIcon, Home, RefreshCw, AlertCircle } from 'lucide-react';
import { ACADEMIC_SUBJECT_GROUPS, ACADEMIC_MAJORS_MAPPING, MAJOR_CLUSTERS } from '../data/questions';
import AIConsultant from '../components/AIConsultant';

const SUBJECT_LIST = [
    "Matematika Lanjut", "Agama", "PKN", "Sejarah", "Bahasa Indonesia",
    "Bahasa Inggris", "Bahasa Asing", "Sosiologi", "Ekonomi", "Geografi",
    "Fisika", "Kimia", "Biologi", "Informatika", "PJOK", "Seni Budaya",
    "Prakarya", "Matematika"
];

const SEMESTERS = [1, 2, 3, 4, 5, 6];

export default function TesLanjutan() {
    const location = useLocation();
    const navigate = useNavigate();
    const interestScores = location.state?.scores || null;

    const [step, setStep] = useState('intro'); // intro, form, result
    const [grades, setGrades] = useState(() => {
        const initial = {};
        SUBJECT_LIST.forEach(sub => {
            initial[sub] = {};
            SEMESTERS.forEach(sem => {
                initial[sub][sem] = "";
            });
        });
        return initial;
    });

    const handleInputChange = (subject, semester, value) => {
        if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
            setGrades(prev => ({
                ...prev,
                [subject]: { ...prev[subject], [semester]: value }
            }));
        }
    };

    const validateSemesters = () => {
        let lastFilled = 0;
        for (let sem of SEMESTERS) {
            const hasData = SUBJECT_LIST.some(sub => grades[sub][sem] !== "");
            if (hasData) {
                if (sem > lastFilled + 1) return { valid: false, sem };
                lastFilled = sem;
            }
        }
        if (lastFilled === 0) return { valid: false, error: "Minimal isi 1 semester." };
        return { valid: true, lastFilled };
    };

    const analysis = useMemo(() => {
        if (step !== 'result') return null;

        const validation = validateSemesters();
        const lastSem = validation.lastFilled;
        const availableSems = SEMESTERS.filter(s => s <= lastSem);

        // Group scores by field and semester
        const fieldScoresPerSem = availableSems.map(sem => {
            const scores = { semester: `Sem ${sem}` };
            Object.entries(ACADEMIC_SUBJECT_GROUPS).forEach(([field, subjects]) => {
                let sum = 0;
                let count = 0;
                subjects.forEach(sub => {
                    const val = Number(grades[sub]?.[sem]) || 0;
                    if (val > 0) {
                        sum += val;
                        count++;
                    }
                });
                scores[field] = count > 0 ? sum / count : 0;
            });
            return scores;
        });

        // Calculate average per field
        const fieldAverages = {};
        Object.keys(ACADEMIC_SUBJECT_GROUPS).forEach(field => {
            const validScores = fieldScoresPerSem.map(s => s[field]).filter(v => v > 0);
            fieldAverages[field] = validScores.length > 0
                ? validScores.reduce((a, b) => a + b, 0) / validScores.length
                : 0;
        });

        const sortedFields = Object.entries(fieldAverages).sort((a, b) => b[1] - a[1]);
        const dominantField = sortedFields[0][0];

        // Trend analysis
        const firstSemScores = fieldScoresPerSem[0];
        const lastSemScores = fieldScoresPerSem[fieldScoresPerSem.length - 1];
        const domTrend = lastSemScores[dominantField] - firstSemScores[dominantField];

        let trendLabel = "";
        if (domTrend > 10) trendLabel = "strong improvement";
        else if (domTrend >= 5) trendLabel = "moderate improvement";
        else if (domTrend >= -5) trendLabel = "stable";
        else trendLabel = "decreasing";

        // Combined Recommendations (50% Interest + 50% Academic)
        // Map RIASEC scores to academic groups for comparison
        // RIASEC I/R -> Science, S/E -> Social, A -> Creative/Humanities
        const riasecToFieldWeight = {
            science: (interestScores?.I || 0) * 0.7 + (interestScores?.R || 0) * 0.3,
            social: (interestScores?.S || 0) * 0.6 + (interestScores?.E || 0) * 0.4,
            humanities: (interestScores?.A || 0) * 0.6 + (interestScores?.S || 0) * 0.4,
            creative: (interestScores?.A || 0) * 0.8 + (interestScores?.E || 0) * 0.2,
            general: (interestScores?.S || 0) * 0.5 + (interestScores?.C || 0) * 0.5
        };

        const combinedScores = {};
        Object.keys(riasecToFieldWeight).forEach(field => {
            combinedScores[field] = (riasecToFieldWeight[field] * 0.5) + (fieldAverages[field] * 0.5);
        });

        const sortedCombined = Object.entries(combinedScores).sort((a, b) => b[1] - a[1]);
        const finalDomField = sortedCombined[0][0];

        return {
            fieldScoresPerSem,
            fieldAverages,
            dominantField,
            trendLabel,
            finalDomField,
            riasecMatch: dominantField === (sortedCombined[0][0])
        };
    }, [step, grades, interestScores]);

    if (step === 'intro') {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950">
                <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center space-y-12">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/10 dark:shadow-blue-900/20">
                        <GraduationCap size={40} />
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Tes Lanjutan (Analisis Rapor)</h1>
                        <p className="text-xl text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                            Tes lanjutan ini bertujuan untuk membandingkan hasil Tes Minat dan Bakat dengan performa akademik anda di sekolah.
                            Anda dapat memasukkan nilai raport dari semester 1 hingga semester terakhir yang anda miliki.
                        </p>
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex items-start gap-4 text-left max-w-xl mx-auto">
                            <AlertCircle className="text-orange-500 dark:text-orange-400 shrink-0" size={24} />
                            <p className="text-orange-900 dark:text-orange-200 text-sm">
                                Tidak wajib sampai semester 6. Sistem akan menganalisis perkembangan nilai anda dan memberikan rekomendasi jurusan yang sesuai.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button onClick={() => navigate(-1)} className="px-8 py-4 rounded-2xl font-bold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2">
                            <ChevronLeft size={20} /> Kembali
                        </button>
                        <button onClick={() => setStep('form')} className="px-10 py-4 rounded-2xl font-bold bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            Mulai Analisis <Play size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'form') {
        const handleStartAnalysis = () => {
            const validation = validateSemesters();
            if (!validation.valid) {
                alert(validation.error || "Tolong isi semester secara berurutan. Jangan melompati semester.");
                return;
            }
            setStep('result');
            window.scrollTo(0, 0);
        };

        return (
            <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-32">
                <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 z-50">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <button onClick={() => setStep('intro')} className="text-gray-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1 font-bold text-sm">
                            <ChevronLeft size={20} /> Tutup
                        </button>
                        <div className="text-blue-800 dark:text-blue-400 font-bold text-lg flex items-center gap-2">
                            <Table size={20} /> Input Nilai Rapor
                        </div>
                        <div className="w-20"></div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-6 pt-32 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-900 dark:bg-slate-800 text-white dark:text-slate-100">
                                        <th className="p-5 text-sm font-bold border-r border-gray-800 dark:border-slate-700">Mata Pelajaran</th>
                                        {SEMESTERS.map(sem => (
                                            <th key={sem} className="p-5 text-sm font-bold text-center border-r border-gray-800 dark:border-slate-700 last:border-0">
                                                Sem {sem}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 dark:text-slate-400">
                                    {SUBJECT_LIST.map((sub, idx) => (
                                        <tr key={sub} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/50 dark:bg-slate-800/30'}>
                                            <td className="p-4 font-bold text-gray-900 dark:text-white border-r border-gray-100 dark:border-slate-800">{sub}</td>
                                            {SEMESTERS.map(sem => (
                                                <td key={sem} className="p-2 border-r border-gray-100 dark:border-slate-800 last:border-0">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={grades[sub][sem]}
                                                        onChange={(e) => handleInputChange(sub, sem, e.target.value)}
                                                        className="w-full p-3 text-center rounded-xl bg-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-600 focus:shadow-lg outline-none transition-all font-bold text-blue-700 dark:text-blue-400"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleStartAnalysis}
                            className="px-12 py-5 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-2xl shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-3"
                        >
                            Selesaikan & Lihat Hasil <ChartIcon size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'result' && analysis) {
        return (
            <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 py-20 px-6 space-y-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold uppercase tracking-wider">
                            <ChartIcon size={18} /> Analisis Akademik & Minat
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Hasil Analisis Lanjutan</h2>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl shadow-blue-900/5 dark:shadow-blue-900/20 border border-gray-100 dark:border-slate-800 space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Grafik Perkembangan Nilai</h3>
                            <p className="text-gray-400 dark:text-slate-500 text-sm">Visualisasi kekuatan akademik anda per bidang setiap semester.</p>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analysis.fieldScoresPerSem} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={window.matchMedia('(prefers-color-scheme: dark)').matches ? "#1e293b" : "#f1f5f9"} />
                                    <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 700 }} dy={10} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                    <Legend iconType="circle" />
                                    <Line type="monotone" dataKey="science" name="Science" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb' }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="social" name="Social" stroke="#dc2626" strokeWidth={4} dot={{ r: 6, fill: '#dc2626' }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="humanities" name="Humanities" stroke="#16a34a" strokeWidth={4} dot={{ r: 6, fill: '#16a34a' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Section 1: Academic Only */}
                        <div className="bg-gray-900 dark:bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-800 dark:border-slate-800 space-y-6">
                            <div className="space-y-1">
                                <p className="text-blue-400 dark:text-blue-400 text-xs font-black uppercase tracking-widest">Akademik Dominan</p>
                                <h3 className="text-2xl font-bold">Jurusan Sesuai Nilai Rapor</h3>
                            </div>
                            <ul className="space-y-4">
                                {ACADEMIC_MAJORS_MAPPING[analysis.dominantField].map((m, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                                        <span className="text-gray-300 dark:text-slate-400 font-bold group-hover:text-white transition-all">{m}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Section 2: Combined */}
                        <div className="bg-blue-600 dark:bg-blue-700 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 dark:shadow-blue-900/30 space-y-6">
                            <div className="space-y-1">
                                <p className="text-blue-200 dark:text-blue-200 text-xs font-black uppercase tracking-widest">Rekomendasi Final</p>
                                <h3 className="text-2xl font-bold">Jurusan Sesuai Minat & Nilai</h3>
                            </div>
                            <ul className="space-y-4">
                                {ACADEMIC_MAJORS_MAPPING[analysis.finalDomField].map((m, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-xl bg-white/20 dark:bg-white/10 flex items-center justify-center font-bold text-sm">{i + 1}</div>
                                        <span className="text-white font-bold">{m}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Final Analysis Text */}
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ChartIcon className="text-blue-600 dark:text-blue-400" /> Analisis Kesimpulan
                        </h3>
                        <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl space-y-4">
                            <p className="text-blue-900 dark:text-blue-200 leading-relaxed text-lg">
                                Berdasarkan nilai raport yang anda masukkan, bidang <span className="font-bold uppercase">{analysis.dominantField}</span> menunjukkan <span className="font-bold underline italic">{analysis.trendLabel === 'strong improvement' ? 'peningkatan kuat' : analysis.trendLabel === 'moderate improvement' ? 'peningkatan moderat' : analysis.trendLabel === 'stable' ? 'stabilitas' : 'penurunan'}</span> dari semester awal hingga semester terakhir.
                            </p>
                            <p className="text-blue-900 dark:text-blue-200 leading-relaxed text-lg italic">
                                {interestScores ? (
                                    `Hasil ini ${analysis.riasecMatch ? 'selaras' : 'sedikit berbeda'} dengan profil Tes Minat anda. Rekomendasi final kami telah menyeimbangkan potensi akademik dan dorongan minat internal anda.`
                                ) : (
                                    "Segera lakukan Tes Minat untuk mendapatkan analisis gabungan yang lebih akurat."
                                )}
                            </p>
                        </div>
                    </div>

                    {/* AI Analysis Section */}
                    <AIConsultant 
                        mode="academic" 
                        analysisData={analysis} 
                        interestScores={interestScores} 
                    />

                    <div className="flex flex-col sm:flex-row justify-center gap-6 pt-12">
                        <button onClick={() => navigate('/')} className="px-10 py-5 rounded-3xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold transition-all flex items-center justify-center gap-2">
                            <Home size={20} /> Beranda
                        </button>
                        <button onClick={() => setStep('intro')} className="px-10 py-5 rounded-3xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                            <RefreshCw size={20} /> Ulangi Analisis
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
