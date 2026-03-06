import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center">
                <Link to="/" className="text-2xl font-bold text-blue-800 tracking-tight mr-8">Cekadu</Link>
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                    <Link to="/" className="hover:text-blue-700 transition-colors">Beranda</Link>
                    <Link to="/snbp" className="hover:text-blue-700 transition-colors">Cek SNBP</Link>
                    <a href="#" className="hover:text-blue-700 transition-colors">Cek SNBT</a>
                    <Link to="/tes-minat" className="hover:text-blue-700 transition-colors">Tes Minat</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
