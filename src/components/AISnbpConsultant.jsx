import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Award, Sparkles, AlertTriangle } from 'lucide-react';
import { generateSnbpAnalysis } from '../services/aiService';
import DonationModal from './DonationModal';

const AISnbpConsultant = ({ profileSummary, targetMajors, avgScore, achievements, filterResults }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDonationModal, setShowDonationModal] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setShowDonationModal(true); // Tampilkan langsung saat klik
        try {
            const payload = { profileSummary, targetMajors, avgScore, achievements, filterResults };
            const result = await generateSnbpAnalysis(payload);
            setAnalysis(result);
        } catch (err) {
            setError(err.message || 'Gagal menghasilkan analisis SNBP.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // user must click 'Mulai Analisis AI' button
    }, []);

    return (
        <>
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-8 md:p-10 rounded-[3rem] border border-teal-500/30 shadow-2xl relative overflow-hidden group animate-slide-up-fade mt-10">
                {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                        <Award size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase text-white">AI SNBP Analyst</h3>
                        <p className="text-teal-200/70 text-xs font-bold tracking-[0.2em] uppercase">Evaluasi Profil Komprehensif</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center gap-4 text-teal-200">
                        <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                        <span className="font-bold animate-pulse">Menganalisis matriks penilaian SNBP...</span>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-900/30 border border-red-500/20 rounded-2xl text-red-200 flex flex-col gap-4 animate-shake">
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
                    <div className="prose prose-invert prose-teal max-w-none">
                        <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="text-teal-50/90 leading-relaxed font-medium mb-4" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-teal-300 font-black" {...props} />,
                                ol: ({node, ...props}) => <ol className="space-y-4 pl-0 list-none mt-6" {...props} />,
                                li: ({node, children, ...props}) => {
                                    return (
                                        <li className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10" {...props}>
                                            <div className="mt-1">
                                                <Sparkles className="text-teal-400 w-5 h-5" />
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Award className="w-12 h-12 text-teal-500/50 mb-4" />
                        <h4 className="text-lg font-bold text-white mb-2">Evaluasi Profil SNBP</h4>
                        <p className="text-sm text-center text-teal-200/70 mb-6 max-w-sm">
                            Dapatkan prediksi peluang lolos dan saran strategi berdasarkan nilai rapor kamu.
                        </p>
                        <button 
                            onClick={handleGenerate}
                            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-1"
                        >
                            <Sparkles size={16} />
                            Mulai Analisis AI
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        <DonationModal 
            isOpen={showDonationModal} 
            onClose={() => setShowDonationModal(false)} 
        />
    </>
    );
};

export default AISnbpConsultant;
