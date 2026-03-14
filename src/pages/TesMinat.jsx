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
        Object.keys(categoryTotals).forEach(cat => {
            riasecScores[cat] = ((categoryTotals[cat] - 8) / 32) * 100;
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
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 flex flex-col">
            <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/tes-minat')}
                        className="text-gray-500 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1 font-semibold text-sm transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Kembali
                    </button>
                    <div className="text-blue-800 dark:text-blue-400 font-bold text-lg">Cekadu <span className="text-gray-300 dark:text-slate-600 font-normal">|</span> Tes Minat</div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            {[0, 1].map(p => (
                                <div key={p} className={`w-2 h-2 rounded-full ${phase >= p ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}`} />
                            ))}
                        </div>
                        <div className="w-16 md:w-24 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center p-6 mt-16 pb-32">
                <QuestionCard
                    question={currentQuestion}
                    currentAnswer={phase === 0 ? prefAnswers[currentQuestion.id] : answers[currentQuestion.id]}
                    currentIndex={currentIndex}
                    totalQuestions={totalQuestions}
                    answeredCount={answeredCount}
                    onAnswer={handleAnswer}
                    isDirectional={phase === 0}
                />
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 p-6 md:px-12 z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0 && phase === 0}
                        className={`flex items-center gap-2 font-bold transition-all ${currentIndex === 0 && phase === 0 ? 'text-gray-200 dark:text-slate-700 cursor-not-allowed' : 'text-gray-500 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'
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
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-blue-700 dark:bg-blue-600 text-white shadow-xl shadow-blue-700/20 dark:shadow-blue-900/40 transform active:scale-95 transition-all ${!isAllAnswered
                                    ? 'opacity-50 grayscale cursor-not-allowed'
                                    : 'hover:bg-blue-800 dark:hover:bg-blue-500 hover:-translate-y-1'
                                    }`}
                            >
                                <Send size={18} />
                                {isAllAnswered ? 'Lihat Hasil' : `Jawab semua soal dulu (${answeredCount}/${totalQuestions})`}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={phase === 0 && !prefAnswers[currentQuestion.id]}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${phase === 0 && !prefAnswers[currentQuestion.id]
                                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm'
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
