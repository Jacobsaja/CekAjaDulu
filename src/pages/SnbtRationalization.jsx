import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from '../components/Layout';
import { Section, Button } from '../components/Generic';
import { Search, ChevronDown, CheckCircle2, AlertCircle, BarChart3, TrendingUp, Info, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { allUniversities } from '../../data/snbt/index.js';

// Custom hook for count-up animation
const useCountUp = (end, duration = 1000, startTrigger = false) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);

    useEffect(() => {
        if (!startTrigger) {
            setCount(0);
            countRef.current = 0;
            return;
        }
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeOutVal * end);
            setCount(currentCount);
            countRef.current = currentCount;
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }, [end, duration, startTrigger]);

    return count;
};

// Component for Individual Choice Input
const ChoiceInput = ({ choice, updateChoice, isOpen, setOpenDropdown }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, setOpenDropdown]);

    const filteredUnivs = useMemo(() => {
        if (!choice.searchQuery) return allUniversities;
        return allUniversities.filter(u =>
            u.nama.toLowerCase().includes(choice.searchQuery.toLowerCase()) ||
            u.id.toLowerCase().includes(choice.searchQuery.toLowerCase())
        ).slice(0, 10);
    }, [choice.searchQuery]);

    const zIndexClass = `z-[${50 - choice.id}]`; // Ensure earlier dropdowns overlap later ones

    return (
        <div className={`bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 space-y-4 relative ${zIndexClass}`}>
            <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-widest">{choice.label} • {choice.type}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* University Searchable Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Pilih Universitas"
                            value={choice.selectedUniv ? choice.selectedUniv.nama : choice.searchQuery}
                            onChange={(e) => {
                                updateChoice(choice.id, { searchQuery: e.target.value });
                                if (choice.selectedUniv) {
                                    updateChoice(choice.id, { selectedUniv: null, selectedMajor: null });
                                }
                            }}
                            onFocus={() => setOpenDropdown(choice.id)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 mt-1 focus:ring-blue-500 outline-none transition-all text-sm"
                        />
                        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
                    </div>

                    {isOpen && !choice.selectedUniv && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2">
                            {filteredUnivs.length > 0 ? (
                                filteredUnivs.map(u => (
                                    <button
                                        key={u.id}
                                        onClick={() => {
                                            updateChoice(choice.id, { selectedUniv: u, searchQuery: "" });
                                            setOpenDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-slate-300 transition-colors border-b border-gray-50 dark:border-slate-700 last:border-0"
                                    >
                                        {u.nama}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm italic">Universitas tidak ditemukan</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Major Dropdown */}
                <select
                    disabled={!choice.selectedUniv}
                    value={choice.selectedMajor ? choice.selectedMajor.kode : ""}
                    onChange={(e) => {
                        const major = choice.selectedUniv.jurusan.find(j => j.kode === e.target.value);
                        updateChoice(choice.id, { selectedMajor: major });
                    }}
                    className="w-full px-4 py-3 mt-1 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="" disabled>Pilih Jurusan</option>
                    {choice.selectedUniv?.jurusan.map(j => (
                        <option key={j.kode} value={j.kode}>{j.nama} ({j.jenjang})</option>
                    ))}
                </select>
            </div>
        </div>
    );
};


// Detailed Result Card Component
const DetailedChoiceCard = ({ choice, utbkScore }) => {
    const { selectedUniv, selectedMajor } = choice;
    const chanceVal = useMemo(() => {
        if (!selectedMajor || !utbkScore) return 0;
        const ratio = selectedMajor.peminat_2025 / selectedMajor.daya_tampung_2026;
        const score = parseFloat(utbkScore);

        let baseChance = (score / 1000) * 100;
        const penalty = Math.min(ratio * 0.5, 30);
        return Math.round(Math.max(Math.min(baseChance - penalty + 10, 98), 5));
    }, [selectedMajor, utbkScore]);

    const animatedChance = useCountUp(chanceVal, 1500, true);
    const ratioCount = useCountUp(Math.round(selectedMajor.peminat_2025 / selectedMajor.daya_tampung_2026), 1200, true);
    const peminatCount = useCountUp(selectedMajor.peminat_2025, 1200, true);
    const dayaCount = useCountUp(selectedMajor.daya_tampung_2026, 1200, true);

    const getStatusColor = (chance) => {
        if (chance >= 75) return { text: "Aman", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", bar: "bg-green-500" };
        if (chance >= 45) return { text: "Mungkin", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", bar: "bg-yellow-500" };
        return { text: "Berisiko", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", bar: "bg-red-500" };
    };

    const status = getStatusColor(chanceVal);

    const interpretation = useMemo(() => {
        if (chanceVal >= 75) return "Nilai kamu sangat kompetitif untuk jurusan ini. Peluang lolos sangat besar, namun disarankan tetap mempertahankan belajarmu.";
        if (chanceVal >= 45) return "Nilai kamu berada di batas yang cukup kompetitif. Ada peluang lolos (Mungkin), namun pastikan ada pilihan alternatif untuk berjaga-jaga.";
        return "Skor tryout kamu saat ini tertinggal dari persaingan. Sangat berisiko, disarankan untuk mempertimbangkan jurusan lain atau tingkatkan skormu secara signifikan.";
    }, [chanceVal]);

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

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden animate-slide-up-fade mt-8">
            {/* Detailed Card Header */}
            <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-slate-800 p-8 border-b border-gray-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 uppercase tracking-widest mb-3 inline-block">
                            {choice.label}
                        </span>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{selectedMajor.nama}</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{selectedUniv.nama} • {selectedMajor.jenjang}</p>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl flex items-center justify-center font-bold text-lg ${status.bg} ${status.color}`}>
                        {status.text}
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stats */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <BarChart3 size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Statistik Jurusan</h3>
                    </div>

                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-slate-800/50 flex flex-col gap-2">
                        <p className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">Keketatan</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900 dark:text-white">1 : </span>
                            <span className="text-4xl font-black text-blue-700 dark:text-blue-400">{ratioCount}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <p className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase">Peminat</p>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1 block">{peminatCount}</span>
                        </div>
                        <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700">
                            <p className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase">Daya Tampung</p>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1 block">{dayaCount}</span>
                        </div>
                    </div>
                </div>

                {/* Score & Chance Analysis */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analisis Nilai</h3>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl relative">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-100 dark:text-slate-700" />
                                <circle
                                    cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="10"
                                    strokeDasharray={351}
                                    strokeDashoffset={351 - (351 * animatedChance) / 100}
                                    className={`${status.color} transition-all duration-[1500ms] ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-black text-gray-900 dark:text-white">{animatedChance}%</span>
                            </div>
                        </div>
                        <p className="mt-4 text-center text-sm font-medium text-gray-600 dark:text-gray-300 max-w-sm">
                            {interpretation}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Skormu</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{utbkScore}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 border-dashed text-center">
                            <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase mb-1">Rata-rata Lolos</p>
                            <p className="text-xl font-black text-blue-700 dark:text-blue-300">{selectedMajor.nilai_min_utbk || '???'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            {alternatives.length > 0 && (
                <div className="p-8 border-t border-gray-50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-800/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-orange-500" size={20} />
                        Rekomendasi Alternatif Jurusan Serupa
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {alternatives.map((alt, idx) => (
                            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm transition-all group">
                                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{alt.univName}</p>
                                <h4 className="font-bold text-gray-800 dark:text-white mt-1 mb-3 line-clamp-1">{alt.nama}</h4>
                                <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                    <AlertCircle size={14} className="text-orange-500" />
                                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400">Keketatan 1 : {Math.round(alt.peminat_2025 / alt.daya_tampung_2026)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const SnbtRationalization = () => {
    const [choices, setChoices] = useState([
        { id: 1, label: "Pilihan 1", type: "Sarjana (S1)", searchQuery: "", selectedUniv: null, selectedMajor: null },
        { id: 2, label: "Pilihan 2", type: "Sarjana (S1)", searchQuery: "", selectedUniv: null, selectedMajor: null },
        { id: 3, label: "Pilihan 3", type: "Diploma 4 (D4)", searchQuery: "", selectedUniv: null, selectedMajor: null },
        { id: 4, label: "Pilihan 4", type: "Diploma 3 (D3)", searchQuery: "", selectedUniv: null, selectedMajor: null },
    ]);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [utbkScore, setUtbkScore] = useState("");

    // Analysis States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const updateChoice = (id, updates) => {
        setChoices(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const analysisLabels = [
        "Memvalidasi pilihan jurusan...",
        "Mengumpulkan data keketatan SNBT",
        "Menghitung proyeksi skor",
        "Menyusun analisis akhir"
    ];

    const handleCalculate = () => {
        const hasFilledChoice = choices.some(c => c.selectedUniv && c.selectedMajor);
        if (!hasFilledChoice || !utbkScore) {
            alert("Harap isi nilai UTBK dan minimal 1 pilihan jurusan!");
            return;
        }

        setIsAnalyzing(true);
        setShowResults(false);
        setAnalysisStep(0);

        const stepInterval = setInterval(() => {
            setAnalysisStep(prev => {
                if (prev >= analysisLabels.length - 1) {
                    clearInterval(stepInterval);
                    setTimeout(() => {
                        setIsAnalyzing(false);
                        setShowResults(true);
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

    const activeChoices = showResults ? choices.filter(c => c.selectedUniv && c.selectedMajor) : [];

    const getChance = (major, scoreStr) => {
        if (!major || !scoreStr) return 0;
        const score = parseFloat(scoreStr);
        const ratio = major.peminat_2025 / major.daya_tampung_2026;
        let baseChance = (score / 1000) * 100;
        const penalty = Math.min(ratio * 0.5, 30);
        return Math.round(Math.max(Math.min(baseChance - penalty + 10, 98), 5));
    };

    const getStatusInfo = (chance) => {
        if (chance >= 75) return { text: "Aman", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" };
        if (chance >= 45) return { text: "Mungkin", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
        return { text: "Berisiko", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" };
    };

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
                            Pilih hingga 4 jurusan impianmu. Kami akan menganalisis peluang lolos berdasarkan statistik peminat dan daya tampung terbaru menggunakan data SNBT.
                        </p>
                    </div>
                </Section>
            </div>

            <Section className="py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Input Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-2xl shadow-blue-900/5 p-8 md:p-10 relative z-20">
                        
                        <div className="space-y-2 mb-8 border-b border-gray-100 dark:border-slate-800 pb-8">
                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Skor Tryout UTBK Terakhir</label>
                            <input
                                type="number"
                                placeholder="Masukkan skor tryout (Contoh: 750)"
                                value={utbkScore}
                                onChange={(e) => setUtbkScore(e.target.value)}
                                className="w-full md:max-w-md px-6 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500 outline-none transition-all text-lg font-bold"
                            />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pilihan Jurusan (Maks 4)</h3>
                            <div className="flex flex-col gap-6">
                                {choices.map(choice => (
                                    <ChoiceInput 
                                        key={choice.id} 
                                        choice={choice} 
                                        updateChoice={updateChoice} 
                                        isOpen={openDropdownId === choice.id}
                                        setOpenDropdown={setOpenDropdownId}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8">
                            <Button
                                onClick={handleCalculate}
                                disabled={isAnalyzing}
                                className="w-full py-5 text-xl font-bold bg-blue-700 hover:bg-blue-600 shadow-xl shadow-blue-500/20 active:scale-95 transition-all group overflow-hidden relative btn-glow hover:-translate-y-0.5 hover:scale-[1.01]"
                            >
                                {isAnalyzing ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Menganalisis Pilihan...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Rasionalisasi SNBT
                                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Analysis Steps Animation */}
                    {isAnalyzing && (
                        <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl animate-in fade-in duration-300">
                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden mb-6">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500"
                                    style={{ width: `${Math.min(((analysisStep + 1) / analysisLabels.length) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="space-y-4">
                                {analysisLabels.map((label, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-4 transition-all duration-500 ${analysisStep >= idx ? 'opacity-100' : 'opacity-0 translate-y-2'}`}
                                    >
                                        {analysisStep > idx ? (
                                            <CheckCircle2 size={24} className="text-green-500" />
                                        ) : (
                                            <div className={`w-6 h-6 rounded-full border-2 ${analysisStep === idx ? 'border-blue-500 border-t-transparent animate-spin' : 'border-gray-200 dark:border-slate-700'}`} />
                                        )}
                                        <span className={`font-medium text-lg ${analysisStep === idx ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'}`}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Section>

            {/* Results Section */}
            {showResults && activeChoices.length > 0 && (
                <Section id="result-section" className="py-20 border-t border-gray-50 dark:border-slate-900 bg-gray-50/30 dark:bg-slate-950/50">
                    <div className="max-w-5xl mx-auto space-y-12">
                        
                        {/* Summary Table Section */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center">Hasil Estimasi Peluang SNBT</h2>
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden animate-slide-up-fade">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-700">
                                                <th className="py-5 px-6 font-bold text-gray-500 dark:text-slate-400 uppercase text-xs tracking-wider">Pilihan</th>
                                                <th className="py-5 px-6 font-bold text-gray-500 dark:text-slate-400 uppercase text-xs tracking-wider">Jurusan</th>
                                                <th className="py-5 px-6 font-bold text-gray-500 dark:text-slate-400 uppercase text-xs tracking-wider text-center">Keketatan</th>
                                                <th className="py-5 px-6 font-bold text-gray-500 dark:text-slate-400 uppercase text-xs tracking-wider text-center">Rata-rata UTBK</th>
                                                <th className="py-5 px-6 font-bold text-gray-500 dark:text-slate-400 uppercase text-xs tracking-wider text-center">Peluang Lolos</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                                            {activeChoices.map((c, idx) => {
                                                const chance = getChance(c.selectedMajor, utbkScore);
                                                const status = getStatusInfo(chance);
                                                const ratio = Math.round(c.selectedMajor.peminat_2025 / c.selectedMajor.daya_tampung_2026);
                                                return (
                                                    <tr key={c.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">{c.label}</td>
                                                        <td className="py-4 px-6">
                                                            <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{c.selectedMajor.nama}</p>
                                                            <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1">{c.selectedUniv.nama}</p>
                                                        </td>
                                                        <td className="py-4 px-6 text-center font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">
                                                            1 : {ratio}
                                                        </td>
                                                        <td className="py-4 px-6 text-center font-bold text-gray-700 dark:text-slate-300">
                                                            {c.selectedMajor.nilai_min_utbk || '-'}
                                                        </td>
                                                        <td className="py-4 px-6 text-center">
                                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${status.bg} ${status.color}`}>
                                                                {status.text}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Analysis Section */}
                        <div className="pt-10">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-8">Analisis Detail Per Pilihan</h2>
                            <div className="space-y-12">
                                {activeChoices.map((choice, idx) => (
                                    <div key={choice.id} style={{ animationDelay: `${idx * 150}ms` }} className="animate-slide-up-fade">
                                        <DetailedChoiceCard choice={choice} utbkScore={utbkScore} />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </Section>
            )}
        </Layout>
    );
};

export default SnbtRationalization;
