import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';

    const saved = localStorage.getItem('cekadu-theme');
    if (saved === 'dark' || saved === 'light') return saved;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('cekadu-theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-3 border-b border-gray-200/70 dark:border-slate-800' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-800 dark:text-blue-400 tracking-tight mr-8">Cekadu</Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-slate-300">
                        <Link to="/" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Beranda</Link>
                        <Link to="/snbp" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Cek SNBP</Link>
                        <Link to="/snbt" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Cek SNBT</Link>
                        <Link to="/tes-minat" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Tes Minat</Link>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="h-10 w-10 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/90 dark:bg-slate-800 text-gray-600 dark:text-slate-300 shadow-sm hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-slate-700 transition-all duration-300 flex items-center justify-center"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
