import React from 'react';

export const Section = ({ children, className = "", id = "" }) => (
    <section id={id} className={`py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto animate-fade-in-up ${className}`}>
        {children}
    </section>
);

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const variants = {
        primary: "bg-blue-700 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 border border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-gray-50 dark:border-blue-500 dark:shadow-blue-900/50",
        secondary: "bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-0.5 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:border-blue-500 dark:hover:shadow-blue-900/20",
        outline: "border border-blue-700 text-blue-700 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-0.5 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:border-blue-400"
    };

    return (
        <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
