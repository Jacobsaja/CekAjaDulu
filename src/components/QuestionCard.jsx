import React from 'react';

const QuestionCard = ({ question, currentAnswer, currentIndex, totalQuestions, answeredCount, onAnswer, isDirectional = false }) => {
    const scores = [1, 2, 3, 4, 5];
    const labels = ["Sangat Tidak Setuju", "Tidak Setuju", "Ragu-ragu", "Setuju", "Sangat Setuju"];

    return (
        <div 
            key={question.id} 
            className="max-w-3xl w-full glass rounded-[3rem] p-10 md:p-16 relative overflow-hidden animate-reveal"
        >
            {/* Decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="space-y-2">
                    <p className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.2em]">Pertanyaan {currentIndex + 1} / {totalQuestions}</p>
                    <div className="h-2 w-48 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out shadow-lg shadow-blue-500/20"
                            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-2xl font-black text-sm border border-blue-100 dark:border-blue-900/50">
                    {Math.round((answeredCount / totalQuestions) * 100)}%
                </div>
            </div>

            {/* Question Text */}
            <div className="min-h-[160px] flex items-center justify-center text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-[1.15] tracking-tight">
                    {question.text}
                </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4">
                {isDirectional ? (
                    question.options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onAnswer(question.id, opt.value)}
                            className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 group relative overflow-hidden ${currentAnswer === opt.value
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-xl -translate-y-1'
                                : 'border-gray-100 dark:border-slate-800/50 hover:border-blue-200 dark:hover:border-blue-600/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
                                }`}
                        >
                            <span className={`text-lg font-bold ${currentAnswer === opt.value ? 'text-blue-800 dark:text-blue-200' : 'text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                {opt.label}
                            </span>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${currentAnswer === opt.value
                                ? 'border-blue-600 bg-blue-600 shadow-lg shadow-blue-500/50 scale-110'
                                : 'border-gray-200 dark:border-slate-700 group-hover:border-blue-400 group-hover:scale-105'
                                }`}>
                                {currentAnswer === opt.value && <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />}
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        {scores.map((score, idx) => (
                            <button
                                key={score}
                                onClick={() => onAnswer(question.id, score)}
                                className={`flex-1 flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all duration-500 group relative ${currentAnswer === score
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 shadow-2xl -translate-y-2'
                                    : 'border-gray-100 dark:border-slate-800/50 hover:border-blue-100 dark:hover:border-blue-600/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
                                    }`}
                            >
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black transition-all duration-500 ${currentAnswer === score
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/50 scale-110 rotate-3'
                                    : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105'
                                    }`}>
                                    {score}
                                </div>
                                <span className={`text-[10px] font-black text-center leading-tight transition-all uppercase tracking-[0.15em] ${currentAnswer === score ? 'text-blue-800 dark:text-blue-200' : 'text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                    }`}>
                                    {labels[idx]}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Inject keyframes for the fade-slide animation
if (typeof document !== 'undefined' && !document.getElementById('questioncard-anim')) {
    const style = document.createElement('style');
    style.id = 'questioncard-anim';
    style.textContent = `
        @keyframes fadeOnly {
            0% { opacity: 0.95; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

export default QuestionCard;
