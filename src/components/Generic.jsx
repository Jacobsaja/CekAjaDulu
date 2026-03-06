import React from 'react';

export const Section = ({ children, className = "", id = "" }) => (
    <section id={id} className={`py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto ${className}`}>
        {children}
    </section>
);

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const variants = {
        primary: "bg-blue-700 hover:bg-blue-800 text-white shadow-md",
        secondary: "bg-white border border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-700",
        outline: "border-2 border-blue-700 text-blue-700 hover:bg-blue-50"
    };

    return (
        <button
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
