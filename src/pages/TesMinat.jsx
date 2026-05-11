import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, Brain, GraduationCap } from 'lucide-react';
import { questions, DIRECTIONAL_QUESTIONS, MAJOR_CLUSTERS, CATEGORIES } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import ResultSection from '../components/ResultSection';

export default function TesMinat() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState(0); // 0: Directional, 1: Interest Test
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prefAnswers, setPrefAnswers] = useState({});
    const [answers, setAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const [results, setResults] = useState(null);

    const currentQuestion = phase === 0 ? DIRECTIONAL_QUESTIONS[currentIndex] : questions[currentIndex];
    const isLastQuestion = phase === 0
        ? currentIndex === DIRECTIONAL_QUESTIONS.length - 1
        : currentIndex === questions.length - 1;

    const answeredCount = phase === 0 ? Object.keys(prefAnswers).length : Object.keys(answers).length;
    const totalQuestions = phase === 0 ? DIRECTIONAL_QUESTIONS.length : questions.length;
    const isAllAnswered = answeredCount === totalQuestions;

    const handleAnswer = (id, value) => {
        if (phase === 0) {
            setPrefAnswers(prev => ({ ...prev, [id]: value }));
            if (!isLastQuestion) {
                setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
            }
        } else {
            setAnswers(prev => ({ ...prev, [id]: value }));
            if (!isLastQuestion) {
                setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
            }
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
        else if (phase > 0) {
            setPhase(prev => prev - 1);
            setCurrentIndex(DIRECTIONAL_QUESTIONS.length - 1);
        }
    };

    const handleNext = () => {
        if (!isLastQuestion) setCurrentIndex(prev => prev + 1);
        else if (phase < 1) {
            setPhase(prev => prev + 1);
            setCurrentIndex(0);
        }
    };

    const calculateResults = () => {
        // 1. Calculate RIASEC Scores (0-100)
        const categoryTotals = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        questions.forEach(q => {
            categoryTotals[q.category] += answers[q.id] || 0;
        });

        const riasecScores = {};
        Object.keys(CATEGORIES).forEach(cat => {
            const catQuestions = questions.filter(q => q.category === cat);
            const count = catQuestions.length;
            if (count > 0) {
                const min = count * 1;
                const max = count * 5;
                riasecScores[cat] = ((categoryTotals[cat] - min) / (max - min)) * 100;
            } else {
                riasecScores[cat] = 0;
            }
        });

        // 2. Calculate Cluster Scores
        const clusterScores = {};
        Object.keys(MAJOR_CLUSTERS).forEach(clusterKey => {
            const cluster = MAJOR_CLUSTERS[clusterKey];

            // InterestTestScore for this cluster (weighted average of its RIASEC types)
            let interestScore = 0;
            Object.entries(cluster.riasecWeights).forEach(([cat, weight]) => {
                interestScore += (riasecScores[cat] || 0) * weight;
            });

            // ClusterPreferenceScore (based on directional questions)
            let prefScore = 0;
            DIRECTIONAL_QUESTIONS.forEach(q => {
                if (prefAnswers[q.id] === clusterKey) {
                    prefScore += (100 / DIRECTIONAL_QUESTIONS.length);
                }
            });

            // AcademicScore is removed from Phase 1 calculation as per user request.
            // Using a 0.6 * Interest + 0.4 * Preference split for initial recommendation.
            clusterScores[clusterKey] = (0.6 * interestScore) + (0.4 * prefScore);
        });

        // 3. Sort clusters to find dominant one
        const sortedClusters = Object.keys(clusterScores).sort((a, b) => clusterScores[b] - clusterScores[a]);
        const dominantClusterKey = sortedClusters[0];
        const dominantCluster = MAJOR_CLUSTERS[dominantClusterKey];

        const resultObj = {
            scores: riasecScores,
            clusterScores,
            dominantCluster: {
                key: dominantClusterKey,
                ...dominantCluster
            },
            top3: Object.keys(riasecScores).sort((a, b) => riasecScores[b] - riasecScores[a]).slice(0, 3)
        };

        setResults(resultObj);
        setIsFinished(true);
        window.scrollTo(0, 0);
    };

    if (isFinished && results) {
        return (
            <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 py-24 px-6">
                <ResultSection {...results} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
            {/* Animated Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <nav className="fixed top-0 left-0 right-0 glass z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/tes-minat')}
                        className="text-gray-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-2 font-black text-sm uppercase tracking-widest transition-all hover:-translate-x-1"
                    >
                        <ChevronLeft size={20} />
                        Keluar
                    </button>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-black text-lg tracking-tighter uppercase">
                            <Brain className="animate-pulse text-blue-600" size={24} />
                            <span>Cekadu <span className="text-gray-300 dark:text-slate-600 font-light mx-1">/</span> Test</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                            {[0, 1].map(p => (
                                <div key={p} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${phase >= p ? 'bg-blue-600 shadow-lg shadow-blue-500/50 scale-110' : 'bg-gray-200 dark:bg-slate-800'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center p-6 mt-20 pb-32">
                <div className="w-full max-w-4xl flex justify-center">
                    <QuestionCard
                        question={currentQuestion}
                        currentAnswer={phase === 0 ? prefAnswers[currentQuestion.id] : answers[currentQuestion.id]}
                        currentIndex={currentIndex}
                        totalQuestions={totalQuestions}
                        answeredCount={answeredCount}
                        onAnswer={handleAnswer}
                        isDirectional={phase === 0}
                    />
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 glass p-6 md:px-12 z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0 && phase === 0}
                        className={`flex items-center gap-2 font-black transition-all uppercase tracking-widest text-xs ${currentIndex === 0 && phase === 0 ? 'text-gray-200 dark:text-slate-800 cursor-not-allowed' : 'text-gray-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400'
                            }`}
                    >
                        <ChevronLeft size={20} />
                        <span className="hidden sm:inline">Sebelumnya</span>
                    </button>

                    <div className="flex gap-4">
                        {isLastQuestion && phase === 1 ? (
                            <button
                                onClick={calculateResults}
                                disabled={!isAllAnswered}
                                className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-600 dark:to-indigo-600 text-white shadow-2xl shadow-blue-500/30 transform active:scale-95 transition-all ${!isAllAnswered
                                    ? 'opacity-50 grayscale cursor-not-allowed'
                                    : 'hover:shadow-blue-500/50 hover:-translate-y-1'
                                    }`}
                            >
                                <Send size={18} />
                                {isAllAnswered ? 'Lihat Hasil' : `Selesaikan (${answeredCount}/${totalQuestions})`}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={phase === 0 && !prefAnswers[currentQuestion.id]}
                                className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all ${phase === 0 && !prefAnswers[currentQuestion.id]
                                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
                                    : 'glass border-2 border-blue-600/20 text-blue-700 dark:text-blue-400 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white shadow-lg'
                                    }`}
                            >
                                <span className="hidden sm:inline">Berikutnya</span>
                                <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
