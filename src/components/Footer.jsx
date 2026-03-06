import React from 'react';

const Footer = () => (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Cekadu</h2>
                    <p className="text-gray-600 max-w-sm">
                        Platform konsultasi mandiri untuk siswa Indonesia. Wawasan berbasis data untuk keputusan universitas yang lebih cerdas.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Tautan</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                        <li><a href="#" className="hover:text-blue-700">Tentang</a></li>
                        <li><a href="#" className="hover:text-blue-700">Kebijakan Privasi</a></li>
                        <li><a href="#" className="hover:text-blue-700">Kontak</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-4">Alat</h4>
                    <ul className="space-y-2 text-gray-600 text-sm">
                        <li><a href="/snbp" className="hover:text-blue-700">Cek SNBP</a></li>
                        <li><a href="#" className="hover:text-blue-700">Cek SNBT</a></li>
                        <li><a href="/tes-minat" className="hover:text-blue-700">Tes Minat</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Cekadu. Hak cipta dilindungi undang-undang.</p>
                <div className="flex gap-6">
                    <span className="text-gray-400 text-xs">Dibuat untuk Keunggulan Indonesia</span>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
