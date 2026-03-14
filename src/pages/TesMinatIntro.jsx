import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ClipboardList, Target, BarChart3, Info, AlertCircle } from 'lucide-react';

const TesMinatIntro = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 py-24 px-6 md:px-12 flex flex-col items-center">
            {/* Simple Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-500 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1 font-semibold text-sm transition-colors"
                    >
                        <ChevronLeft size={20} />
                        Kembali ke Home
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Tes Minat & Bakat <span className="text-blue-700 dark:text-blue-400">Cekadu</span>
                    </h1>
                    <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed">
                        Pahami potensi diri dan temukan jurusan universitas yang paling tepat untuk masa depanmu.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-blue-900/20 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">
                        {/* Section 1: Intro */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Info className="text-blue-600 dark:text-blue-400" size={24} />
                                Apa itu Tes Minat?
                            </h2>
                            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                Tes Minat & Bakat Cekadu adalah tes berbasis preferensi dan kecenderungan pribadi yang dirancang untuk membantu kamu memahami bidang studi yang paling sesuai dengan karakter dan minatmu. Tes ini mengukur enam kategori utama (RIASEC) yang sering digunakan dalam pemetaan karier dan pendidikan tinggi.
                            </p>
                        </div>

                        {/* Section 2: Mechanics */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ClipboardList className="text-blue-600 dark:text-blue-400" size={24} />
                                Mekanisme Tes
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Terdiri dari 48 pertanyaan singkat.",
                                    "Skala 1-5 (Sangat Tidak Setuju hingga Sangat Setuju).",
                                    "Tidak ada jawaban benar atau salah.",
                                    "Waktu pengerjaan sekitar 5-10 menit."
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <p className="text-gray-700 dark:text-slate-300 text-sm font-medium">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Outcomes */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Target className="text-blue-600 dark:text-blue-400" size={24} />
                                Apa yang Kamu Dapatkan?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex gap-4 items-center">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl">
                                        <BarChart3 size={24} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Skor 6 Kategori Minat</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl">
                                        <Target size={24} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-slate-300">3 Tipe Kepribadian Dominan</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl">
                                        <ClipboardList size={24} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Rekomendasi Jurusan Relevan</span>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl flex gap-4">
                            <AlertCircle className="text-orange-500 dark:text-orange-400 shrink-0" size={20} />
                            <p className="text-orange-800 dark:text-orange-200 text-xs leading-relaxed">
                                <strong>Disclaimer:</strong> Semua data dan rekomendasi yang ditampilkan berdasarkan informasi dari 1 tahun terakhir dan bertujuan sebagai bahan pertimbangan awal, bukan keputusan final. Jawablah dengan jujur sesuai dengan diri kamu.
                            </p>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="bg-gray-50 dark:bg-slate-900 p-8 flex flex-col items-center border-t border-gray-100 dark:border-slate-800">
                        <button
                            onClick={() => navigate('/tes-minat/mulai')}
                            className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-extrabold text-xl shadow-xl shadow-blue-700/20 dark:shadow-blue-900/40 transform hover:-translate-y-1 transition-all active:scale-95"
                        >
                            Mulai Tes Sekarang
                        </button>
                        <p className="mt-4 text-gray-400 dark:text-slate-500 text-xs font-medium">Bebas biaya & Tanpa Login</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TesMinatIntro;
