import React from 'react';

const QuestionCard = ({ question, currentAnswer, currentIndex, totalQuestions, answeredCount, onAnswer, isDirectional = false }) => {
    const scores = [1, 2, 3, 4, 5];
    const labels = ["Sangat Tidak Setuju", "Tidak Setuju", "Ragu-ragu", "Setuju", "Sangat Setuju"];

    return (
        <div key={question.id} className="max-w-2xl w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-gray-50 flex flex-col gap-10" style={{ animation: 'fadeOnly 0.2s ease-out' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">Soal {currentIndex + 1} dari {totalQuestions}</p>
                    <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm">
                    {Math.round((answeredCount / totalQuestions) * 100)}% Selesai
                </div>
            </div>

            {/* Question Text */}
            <div className="min-h-[120px] flex items-center justify-center text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                    {question.text}
                </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
                {isDirectional ? (
                    question.options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onAnswer(question.id, opt.value)}
                            className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 group ${currentAnswer === opt.value
                                ? 'border-blue-600 bg-blue-50/50 shadow-md translate-x-1'
                                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                }`}
                        >
                            <span className={`font-bold ${currentAnswer === opt.value ? 'text-blue-700' : 'text-gray-600'}`}>
                                {opt.label}
                            </span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${currentAnswer === opt.value
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-200 group-hover:border-blue-300'
                                }`}>
                                {currentAnswer === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-2">
                        {scores.map((score, idx) => (
                            <button
                                key={score}
                                onClick={() => onAnswer(question.id, score)}
                                className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 group ${currentAnswer === score
                                    ? 'border-blue-600 bg-blue-50 shadow-lg -translate-y-1'
                                    : 'border-gray-100 hover:border-blue-100 hover:bg-gray-50/50'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black transition-all ${currentAnswer === score
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 rotate-3'
                                    : 'bg-gray-50 text-gray-400 group-hover:text-blue-400'
                                    }`}>
                                    {score}
                                </div>
                                <span className={`text-[10px] font-bold text-center leading-tight transition-all uppercase tracking-tighter ${currentAnswer === score ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-500'
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
