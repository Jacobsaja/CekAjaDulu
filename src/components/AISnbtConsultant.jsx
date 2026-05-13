import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Target, Sparkles, AlertTriangle } from 'lucide-react';
import { generateSnbtAnalysis } from '../services/aiService';
import DonationModal from './DonationModal';

const AISnbtConsultant = ({ activeChoices, utbkScore, getChance, getStatusInfo }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDonationModal, setShowDonationModal] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            // Format data for AI
            const choicesData = activeChoices.map(c => {
                const chance = getChance(c.selectedMajor, utbkScore);
                const status = getStatusInfo(chance).text;
                const ratio = Math.round(c.selectedMajor.peminat_2025 / c.selectedMajor.daya_tampung_2026);
                return {
                    majorName: c.selectedMajor.nama,
                    univName: c.selectedUniv.nama,
                    chance,
                    status,
                    ratio
                };
            });

            const result = await generateSnbtAnalysis(utbkScore, choicesData);
            setAnalysis(result);
            
            // Show donation modal after a short delay
            setTimeout(() => {
                setShowDonationModal(true);
            }, 1500);
        } catch (err) {
            setError(err.message || 'Gagal menghasilkan analisis strategi SNBT.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!analysis && !loading && !error && activeChoices.length > 0) {
            handleGenerate();
        }
    }, [activeChoices, utbkScore]);

    return (
        <>
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 md:p-10 rounded-[3rem] border border-indigo-500/30 shadow-2xl relative overflow-hidden group animate-slide-up-fade">
                {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Target size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase text-white">AI Strategist</h3>
                        <p className="text-indigo-200/70 text-xs font-bold tracking-[0.2em] uppercase">Evaluasi Formasi Jurusan</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center gap-4 text-indigo-200">
                        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        <span className="font-bold animate-pulse">Menyusun strategi formasi...</span>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-900/30 border border-red-500/20 rounded-2xl text-red-200 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle size={24} className="text-red-400" />
                            <span className="font-bold text-lg">
                                {error.includes("quota") || error.includes("429") 
                                    ? "AI tidak tersedia saat ini" 
                                    : "Gagal Menganalisis"}
                            </span>
                        </div>
                        <p className="text-sm text-red-200/70">
                            {error.includes("quota") || error.includes("429")
                                ? "Kuota harian AI telah habis. Silakan coba lagi besok atau gunakan fitur Cekadu lainnya."
                                : error}
                        </p>
                        <button onClick={handleGenerate} className="w-fit px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                            <Sparkles size={14} />
                            Coba Lagi
                        </button>
                    </div>
                ) : analysis ? (
                    <div className="prose prose-invert prose-indigo max-w-none">
                        <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="text-indigo-50/90 leading-relaxed font-medium mb-4" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-indigo-300 font-black" {...props} />,
                                ol: ({node, ...props}) => <ol className="space-y-4 pl-0 list-none mt-6" {...props} />,
                                li: ({node, children, ...props}) => {
                                    // Extract the number and the bold title if available to format nicely
                                    return (
                                        <li className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10" {...props}>
                                            <div className="mt-1">
                                                <Sparkles className="text-indigo-400 w-5 h-5" />
                                            </div>
                                            <div className="flex-1 text-sm md:text-base">{children}</div>
                                        </li>
                                    );
                                }
                            }}
                        >
                            {analysis}
                        </ReactMarkdown>
                    </div>
                ) : null}
            </div>
        </div>
        
        <DonationModal 
            isOpen={showDonationModal} 
            onClose={() => setShowDonationModal(false)} 
        />
        </>
    );
};

export default AISnbtConsultant;
