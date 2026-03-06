import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Section, Button } from '../components/Generic';
import { X, GraduationCap, ClipboardCheck, ArrowRight } from 'lucide-react';

const SelectionModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Pilih Jalur Simulasi</h2>
                        <p className="text-gray-500">Tentukan jalur masuk universitas yang ingin kamu cek peluangnya.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SNBP Option */}
                        <button
                            onClick={() => {
                                navigate('/snbp');
                                onClose();
                            }}
                            className="group p-8 bg-blue-50 border-2 border-transparent hover:border-blue-700 rounded-3xl text-left transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-700 mb-6 shadow-sm group-hover:bg-blue-700 group-hover:text-white transition-colors">
                                <GraduationCap size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Jalur SNBP</h3>
                            <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">Simulasi berdasarkan nilai rapor dan portofolio akademik sekolah.</p>
                            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                                <span>Mulai Cek</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        {/* SNBT Option */}
                        <button
                            className="group p-8 bg-white border-2 border-gray-100 hover:border-blue-700 rounded-3xl text-left transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 mb-6 shadow-sm group-hover:bg-blue-700 group-hover:text-white transition-colors">
                                <ClipboardCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Jalur SNBT</h3>
                            <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">Simulasi berdasarkan skor UTBK dan perbandingan ambang batas nasional.</p>
                            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                                <span className="opacity-50">Coming Soon</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 px-8 py-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Pilih salah satu untuk melanjutkan</p>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ title, description, icon }) => (
    <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-700">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
);

export default function Home() {
    const navigate = useNavigate();
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);

    return (
        <Layout>
            <SelectionModal
                isOpen={isSelectionModalOpen}
                onClose={() => setIsSelectionModalOpen(false)}
            />
            {/* Hero Section */}
            <Section className="pt-32 md:pt-48 pb-20 grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-wider uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        Penerimaan Berbasis Data
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                        Ambil Keputusan <span className="text-blue-700">Kuliah</span> Lebih Cerdas dengan Data
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-lg">
                        Analisis peluang kelulusan dan dapatkan rekomendasi jurusan berdasarkan minat, ROI, dan data historis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="primary"
                            className="px-8 py-4 text-lg"
                            onClick={() => setIsSelectionModalOpen(true)}
                        >
                            Cek Peluang Lulus
                        </Button>
                        <Button
                            variant="secondary"
                            className="px-8 py-4 text-lg"
                            onClick={() => navigate('/tes-minat')}
                        >
                            Coba Tes Minat
                        </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                            ))}
                        </div>
                        <span>Sudah digunakan oleh 10.000+ siswa tahun ini</span>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-blue-100/50 rounded-3xl blur-2xl -z-10"></div>
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 overflow-hidden transform hover:rotate-1 transition-transform duration-500">
                        {/* Mockup Content */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="space-y-1">
                                <div className="h-2 w-24 bg-gray-100 rounded"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">85%</div>
                        </div>
                        <div className="flex gap-4 mb-8">
                            <div className="flex-1 h-32 bg-blue-50 rounded-xl relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-blue-600/10 flex items-end gap-1 px-3 pb-2">
                                    {[40, 70, 45, 90, 65, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-blue-600 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-1/3 space-y-3">
                                <div className="h-4 w-full bg-gray-100 rounded"></div>
                                <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                                <div className="h-10 w-full bg-blue-700 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-blue-700 font-bold text-xs">ITB</div>
                                    <div className="text-sm font-bold">Teknik Informatika</div>
                                </div>
                                <div className="text-xs font-bold text-green-600">Kecocokan Tinggi</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-blue-700 font-bold text-xs">UI</div>
                                    <div className="text-sm font-bold">Ilmu Komputer</div>
                                </div>
                                <div className="text-xs font-bold text-blue-600">Pilihan Aman</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Data Currency Info Banner */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8 -mt-8">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Semua data penerimaan dan statistik yang tersedia didasarkan pada periode 1 tahun terakhir.</span>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50/50">
                <Section id="features">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Alat Analisis Terlengkap</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">Semua yang Anda butuhkan untuk merencanakan masa depan perkuliahan dengan percaya diri.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            title="Cek Peluang SNBP"
                            description="Analisis nilai rapor dan profil sekolah Anda dibandingkan dengan data historis penerimaan SNBP."
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                        />
                        <FeatureCard
                            title="Cek Peluang SNBT"
                            description="Bandingkan skor trial UTBK atau hasil asli Anda dengan ambang batas nasional terbaru."
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>}
                        />
                        <FeatureCard
                            title="Tes Minat & Bakat"
                            description="Temukan jurusan yang sesuai dengan kekuatan alami, kepribadian, dan tujuan karier Anda."
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>}
                        />
                        <FeatureCard
                            title="Rekomendasi Utama"
                            description="Dapatkan peringkat gabungan berdasarkan Minat, Peluang, ROI, dan preferensi Lokasi."
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
                        />
                    </div>
                </Section>
            </div>

            {/* How It Works Section */}
            <Section id="how-it-works">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Cara Kerja</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">Tiga langkah sederhana untuk membuka strategi perkuliahan Anda.</p>
                </div>
                <div className="relative flex flex-col md:flex-row justify-between gap-12 items-start">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gray-100 -z-10"></div>

                    {[
                        { step: 1, title: "Masukkan Data", desc: "Input nilai, info sekolah, atau skor ujian Anda ke portal aman kami." },
                        { step: 2, title: "Mesin Kami Menghitung", desc: "Kami memproses profil Anda terhadap jutaan titik data dan tren penerimaan." },
                        { step: 3, title: "Dapatkan Rekomendasi", desc: "Terima daftar jurusan dan universitas yang dipersonalisasi dan diurutkan untuk Anda." }
                    ].map((item) => (
                        <div key={item.step} className="flex-1 flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-blue-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg ring-8 ring-blue-50">
                                {item.step}
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                                <p className="text-gray-600 max-w-xs mx-auto text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Trust / Data Credibility Section */}
            <div className="bg-blue-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
                <Section className="relative z-10 flex flex-col items-center text-center space-y-12">
                    <div className="space-y-4 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dibuat dengan Logika Transparan</h2>
                        <p className="text-blue-200 text-lg leading-relaxed">
                            Kami percaya pada data, bukan tebakan. Platform kami menggunakan analisis historis yang ketat untuk memberikan prediksi seakurat mungkin.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
                        <div className="space-y-3">
                            <div className="text-4xl font-extrabold text-blue-300">Berbasis Data</div>
                            <p className="text-blue-100/70 text-sm">Hasil agregasi dari data penerimaan PTN selama bertahun-tahun.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="text-4xl font-extrabold text-blue-300">Tolak Ukur Historis</div>
                            <p className="text-blue-100/70 text-sm">Perbandingan dunia nyata terhadap profil siswa yang sukses.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="text-4xl font-extrabold text-blue-300">Algoritma Penilaian</div>
                            <p className="text-blue-100/70 text-sm">Bobot seimbang untuk minat, peluang, ROI, dan lokasi.</p>
                        </div>
                    </div>
                </Section>
            </div>

            {/* Call To Action Section */}
            <Section className="my-16">
                <div className="bg-blue-50 rounded-3xl p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-blue-100/50 w-24 h-24 rounded-full -ml-12 -mt-12"></div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Mulai Rencanakan Strategi <br className="hidden md:block" /> Kuliah Anda Hari Ini
                    </h2>
                    <p className="text-gray-600 text-lg max-w-xl mx-auto">
                        Berhenti menebak dan mulailah menganalisis. Bergabunglah dengan ribuan siswa yang telah mengamankan masa depan mereka bersama Cekadu.
                    </p>
                    <div className="flex justify-center">
                        <Button
                            variant="primary"
                            className="px-12 py-5 text-xl"
                            onClick={() => navigate('/tes-minat')}
                        >
                            Mulai Sekarang
                        </Button>
                    </div>
                </div>
            </Section>
        </Layout>
    );
}
