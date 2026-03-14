import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from '../components/Layout';
import { Section, Button } from '../components/Generic';
import { Search, ChevronDown, CheckCircle2, AlertCircle, BarChart3, TrendingUp, Info, Users, GraduationCap } from 'lucide-react';
import { allUniversities } from '../../data/snbt/index.js';

// Custom hook for count-up animation
const useCountUp = (end, duration = 1000, startTrigger = false) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);

    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        if (!startTrigger) {
            setCount(0);
            countRef.current = 0;
            return;
        }

        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function: easeOutExpo
            const easeOutVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeOutVal * end);
            
            setCount(currentCount);
            countRef.current = currentCount;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [end, duration, startTrigger]);

    return count;
};

const SnbtRationalization = () => {
    // Selection States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUniv, setSelectedUniv] = useState(null);
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [utbkScore, setUtbkScore] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Analysis States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // Close dropdown on outside click / escape
    useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isDropdownOpen]);

    // Filtering universities
    const filteredUnivs = useMemo(() => {
        if (!searchQuery) return allUniversities;
        return allUniversities.filter(u => 
            u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.id.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 10);
    }, [searchQuery]);

    // Analysis steps labels
    const analysisLabels = [
        "Menganalisis data SNBT...",
        "Mengambil statistik jurusan",
        "Menghitung tingkat keketatan",
        "Membandingkan skor"
    ];

    const handleCalculate = () => {
        if (!selectedUniv || !selectedMajor || !utbkScore) {
            alert("Harap lengkapi semua data!");
            return;
        }
        
        setIsAnalyzing(true);
        setShowResults(false);
        setAnalysisStep(0);

        // Sequence animation steps
        const stepInterval = setInterval(() => {
            setAnalysisStep(prev => {
                if (prev >= analysisLabels.length - 1) {
                    clearInterval(stepInterval);
                    setTimeout(() => {
                        setIsAnalyzing(false);
                        setShowResults(true);
                        // Smooth scroll to results
                        setTimeout(() => {
                            document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }, 500);
                    return prev;
                }
                return prev + 1;
            });
        }, 600);
    };

    const chanceVal = useMemo(() => {
        if (!selectedMajor || !utbkScore) return 0;
        const ratio = selectedMajor.peminat_2025 / selectedMajor.daya_tampung_2026;
        const score = parseFloat(utbkScore);

        // Very basic heuristic for demo purposes
        // If score > 700 with high competition, chance might be 60%
        // Adjusting based on ratio (higher ratio = harder)
        let baseChance = (score / 1000) * 100;
        const penalty = Math.min(ratio * 0.5, 30); // Max 30% penalty for high competition
        const finalChance = Math.max(Math.min(baseChance - penalty + 10, 98), 5);

        return Math.round(finalChance);
    }, [selectedMajor, utbkScore]);
    const animatedChance = useCountUp(chanceVal, 1500, showResults);
    const ratioCount = useCountUp(
        selectedMajor ? Math.round(selectedMajor.peminat_2025 / selectedMajor.daya_tampung_2026) : 0,
        1200,
        showResults
    );
    const peminatCount = useCountUp(selectedMajor?.peminat_2025 ?? 0, 1200, showResults);
    const dayaCount = useCountUp(selectedMajor?.daya_tampung_2026 ?? 0, 1200, showResults);
    
    // Alternative majors logic (same major name, different universities; max 3)
    const alternatives = useMemo(() => {
        if (!selectedMajor) return [];
        const targetName = selectedMajor.nama.trim().toLowerCase();
        const targetJenjang = selectedMajor.jenjang?.trim().toLowerCase();
        
        let allMajors = [];
        allUniversities.forEach(u => {
            u.jurusan.forEach(j => {
                const sameName = j.nama?.trim().toLowerCase() === targetName;
                const sameJenjang = targetJenjang ? j.jenjang?.trim().toLowerCase() === targetJenjang : true;

                if (sameName && sameJenjang && j.kode !== selectedMajor.kode) {
                    allMajors.push({ ...j, univName: u.nama });
                }
            });
        });
        
        return allMajors
            .sort((a, b) => (a.peminat_2025 / a.daya_tampung_2026) - (b.peminat_2025 / b.daya_tampung_2026))
            .slice(0, 3);
    }, [selectedMajor]);

    const getStatusColor = (chance) => {
        if (chance >= 75) return { text: "Safe", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", bar: "bg-green-500" };
        if (chance >= 45) return { text: "Competitive", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", bar: "bg-yellow-500" };
        return { text: "Risky", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", bar: "bg-red-500" };
    };

    const status = getStatusColor(chanceVal);

    return (
        <Layout>
            {/* Header */}
            <div className="pt-32 pb-16 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-gray-100 dark:border-slate-800">
                <Section className="py-0">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Rasionalisasi <span className="text-blue-700 dark:text-blue-500">Peluang SNBT</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            Analisis peluang lolos PTN kamu berdasarkan statistik peminat dan daya tampung terbaru menggunakan data asli SNBT.
                        </p>
                    </div>
                </Section>
            </div>

            <Section className="py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Input Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl shadow-blue-900/5 p-8 md:p-10 space-y-6 relative z-20">
                        {/* University Searchable Dropdown */}
                        <div className="space-y-2 relative" ref={dropdownRef}>
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Universitas</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Pilih Universitas"
                                    value={selectedUniv ? selectedUniv.nama : searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (selectedUniv) {
                                            setSelectedUniv(null);
                                            setSelectedMajor(null);
                                        }
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-transparent focus:bg-white dark:focus:bg-slate-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all"
                                />
                                <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                            </div>
                            
                            {isDropdownOpen && !selectedUniv && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {filteredUnivs.length > 0 ? (
                                        filteredUnivs.map(u => (
                                            <button
                                                key={u.id}
                                                onClick={() => {
                                                    setSelectedUniv(u);
                                                    setSearchQuery("");
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-5 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 transition-colors border-b border-gray-50 dark:border-slate-700 last:border-0"
                                            >
                                                {u.nama}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-5 py-4 text-gray-500 dark:text-gray-400 text-sm italic">Universitas tidak ditemukan</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Major Dropdown */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Program Studi / Jurusan</label>
                            <select
                                disabled={!selectedUniv}
                                value={selectedMajor ? selectedMajor.kode : ""}
                                onChange={(e) => {
                                    const major = selectedUniv.jurusan.find(j => j.kode === e.target.value);
                                    setSelectedMajor(major);
                                }}
                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="" disabled>Pilih Jurusan</option>
                                {selectedUniv?.jurusan.map(j => (
                                    <option key={j.kode} value={j.kode}>{j.nama} ({j.jenjang})</option>
                                ))}
                            </select>
                        </div>

                        {/* Score Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Skor Tryout Terakhir</label>
                            <input
                                type="number"
                                placeholder="Masukkan skor tryout UTBK terakhirmu"
                                value={utbkScore}
                                onChange={(e) => setUtbkScore(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-transparent focus:bg-white dark:focus:bg-slate-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                onClick={handleCalculate}
                                disabled={isAnalyzing}
                                className="w-full py-4 text-lg font-bold bg-blue-700 hover:bg-blue-600 shadow-xl shadow-blue-500/20 active:scale-95 transition-all group overflow-hidden relative btn-glow hover:-translate-y-0.5 hover:scale-[1.01]"
                            >
                                {isAnalyzing ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Menganalisis...
                                    </span>
                                ) : (
                                    <>
                                        Rasionalisasi Peluang
                                        <TrendingUp size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Analysis Steps Animation */}
                    {isAnalyzing && (
                        <div className="mt-8 space-y-4 px-6 animate-in fade-in duration-300">
                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500"
                                    style={{ width: `${Math.min(((analysisStep + 1) / analysisLabels.length) * 100, 100)}%` }}
                                />
                            </div>
                            {analysisLabels.map((label, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex items-center gap-3 transition-all duration-500 ${analysisStep >= idx ? 'opacity-100' : 'opacity-0 translate-y-2'}`}
                                >
                                    {analysisStep > idx ? (
                                        <CheckCircle2 size={18} className="text-green-500" />
                                    ) : (
                                        <div className={`w-4.5 h-4.5 rounded-full border-2 ${analysisStep === idx ? 'border-blue-500 border-t-transparent animate-spin' : 'border-gray-200'}`} />
                                    )}
                                    <span className={`text-sm font-medium ${analysisStep === idx ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'}`}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Section>

            {/* Results Section */}
            {showResults && (
                <Section id="result-section" className="py-20 border-t border-gray-50 dark:border-slate-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card 1: Major Stats */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl p-8 md:p-10 animate-slide-up-fade">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <BarChart3 size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Statistik Jurusan</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8">
                                <div className="p-6 rounded-3xl bg-gray-50 dark:bg-slate-800/50 flex items-center justify-between group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-1">Keketatan</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-gray-900 dark:text-white">1 : </span>
                                            <span className="text-3xl font-black text-blue-700 dark:text-blue-400">
                                                {ratioCount}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2">peminat_2025 / daya_tampung_2026</p>
                                    </div>
                                    <Info size={20} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">Peminat 2025</p>
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-gray-400" />
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {peminatCount}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">Daya Tampung 2026</p>
                                        <div className="flex items-center gap-2">
                                            <GraduationCap size={16} className="text-gray-400" />
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {dayaCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Chance Visualization */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl p-8 md:p-10 animate-slide-up-fade delay-100">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <TrendingUp size={20} />
                                    </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Peluang Lolos</h3>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                                    {status.text}
                                </span>
                            </div>

                            <div className="space-y-8">
                                <div className="flex flex-col items-center justify-center py-4">
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-100 dark:text-slate-800" />
                                            <circle 
                                                cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" 
                                                strokeDasharray={440} 
                                                strokeDashoffset={440 - (440 * animatedChance) / 100}
                                                className={`${status.color} transition-all duration-[1500ms] ease-out`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-4xl font-black text-gray-900 dark:text-white">{animatedChance}%</span>
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Estimasi</span>
                                    </div>
                                </div>
                                    <div className="mt-6 w-full max-w-xs">
                                        <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                                            <div
                                                className={`${status.bar} h-full transition-all duration-[1500ms] ease-out`}
                                                style={{ width: `${animatedChance}%` }}
                                            />
                                        </div>
                                        <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            <span>0%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Skor Tryout Kamu</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">{utbkScore}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 relative group">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Rata-rata Skor Diterima</p>
                                        <p className="text-xl font-black text-gray-300 dark:text-slate-700 italic">???</p>
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 dark:bg-slate-800/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 text-center px-2">Data segera hadir!</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex gap-3">
                                    <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700/80 dark:text-blue-400/80 italic leading-relaxed">
                                        Fitur analisis distribusi historis segera hadir. Tetap fokus berlatih ya!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Alternative Majors */}
                    <div className="mt-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl p-8 md:p-10 animate-slide-up-fade delay-200">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Alternatif Jurusan Sejenis</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-500">Jurusan yang sama di universitas lain (maksimal 3)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {alternatives.map((alt) => (
                                <div 
                                    key={alt.kode} 
                                    className="p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1.5 transition-all duration-300 group"
                                >
                                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">{alt.univName}</p>
                                    <h4 className="font-bold text-gray-800 dark:text-white mb-4 line-clamp-1">{alt.nama}</h4>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                            <AlertCircle size={14} className="text-orange-500" />
                                            <span className="text-xs font-bold text-gray-500 dark:text-slate-400">Rasio 1 : {Math.round(alt.peminat_2025 / alt.daya_tampung_2026)}</span>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${Math.round(alt.peminat_2025 / alt.daya_tampung_2026) < 10 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>
            )}
        </Layout>
    );
};

export default SnbtRationalization;
