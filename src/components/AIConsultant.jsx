import React, { useState, useEffect } from 'react';
import { generateAnalysis, generateAcademicAnalysis } from '../services/aiService';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIConsultant = ({ scores, dominantCluster, top3, mode = 'interest', analysisData = null, interestScores = null }) => {
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            let text = '';
            if (mode === 'interest') {
                text = await generateAnalysis(scores, dominantCluster, top3);
            } else {
                text = await generateAcademicAnalysis(analysisData, interestScores);
            }
            setAnalysis(text);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Auto generate on first load if analysis is empty
    useEffect(() => {
        if (!analysis && !loading && !error) {
            handleGenerate();
        }
    }, []);

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/50 shadow-xl relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all duration-700" />
            
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 animate-pulse">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Consultant Cekadu</h3>
                    </div>
                    {analysis && !loading && (
                        <button 
                            onClick={handleGenerate}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            Regenerate Analysis
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300 animate-pulse">
                            Gemini sedang menganalisis masa depanmu...
                        </p>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-start gap-4 text-red-700 dark:text-red-400">
                        <AlertCircle size={24} className="shrink-0" />
                        <div className="space-y-2">
                            <p className="font-bold text-lg">
                                {error.includes("quota") || error.includes("429") 
                                    ? "AI tidak tersedia saat ini" 
                                    : "Gagal memuat analisis AI"}
                            </p>
                            <p className="text-sm opacity-80 leading-relaxed">
                                {error.includes("quota") || error.includes("429")
                                    ? "Kuota harian AI telah habis. Silakan coba lagi beberapa saat lagi atau besok."
                                    : error}
                            </p>
                            <button 
                                onClick={handleGenerate}
                                className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 leading-relaxed">
                        <ReactMarkdown>
                            {analysis || "Klik tombol untuk memulai analisis AI."}
                        </ReactMarkdown>
                    </div>
                )}

                <div className="pt-4 border-t border-blue-100 dark:border-blue-900/50 flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-blue-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-medium text-gray-400 dark:text-slate-500 italic">
                        Dipercaya oleh ribuan siswa untuk menentukan langkah selanjutnya.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIConsultant;
