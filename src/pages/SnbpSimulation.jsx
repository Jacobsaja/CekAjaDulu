import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Section, Button } from '../components/Generic';
import { ChevronRight, ChevronLeft, School, BookOpen, Heart, MapPin, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, BarChart3 as BarChart2, Table } from 'lucide-react';

const SUBJECT_LIST = [
    "Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Matematika Lanjut",
    "Agama", "PKN", "Sejarah", "Bahasa Khas", "Sosiologi", "Ekonomi", "Geografi",
    "Fisika", "Kimia", "Biologi", "Informatika", "PJOK", "Seni Budaya", "Prakarya"
];

const SEMESTERS = [1, 2, 3, 4, 5];

const SnbpSimulation = () => {
    const [step, setStep] = useState(1);
    const [resultsVisible, setResultsVisible] = useState(false);

    // Detailed Grades State
    const [grades, setGrades] = useState(() => {
        const initial = {};
        SUBJECT_LIST.forEach(sub => {
            initial[sub] = {};
            SEMESTERS.forEach(sem => {
                initial[sub][sem] = "";
            });
        });
        return initial;
    });

    const handleGradeChange = (subject, semester, value) => {
        if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
            setGrades(prev => ({
                ...prev,
                [subject]: { ...prev[subject], [semester]: value }
            }));
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleCalculate = () => {
        setResultsVisible(true);
        // Smooth scroll to results
        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const steps = [
        { id: 1, name: 'Profil Akademik', icon: <School size={18} /> },
        { id: 2, name: 'Nilai Rapor', icon: <BookOpen size={18} /> },
        { id: 3, name: 'Preferensi', icon: <Heart size={18} /> },
        { id: 4, name: 'Hasil Simulasi', icon: <CheckCircle2 size={18} /> }
    ];

    return (
        <Layout>
            {/* Page Header */}
            <div className="pt-32 pb-12 bg-blue-50/50 border-b border-gray-100">
                <Section className="py-0">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Cek Peluang SNBP</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Masukkan nilai rapor dan informasi akademik untuk melihat estimasi peluang kamu masuk ke berbagai jurusan PTN.
                        </p>

                        {/* Step Indicator */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-4">
                            {steps.map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${step === s.id ? 'bg-blue-700 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === s.id ? 'bg-white/20' : 'bg-gray-100'}`}>{s.id}</span>
                                        <span className="hidden sm:inline">{s.name}</span>
                                    </div>
                                    {i < steps.length - 1 && <ChevronRight className="text-gray-300" size={16} />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </Section>
            </div>

            <Section className="py-12">
                <div className={`mx-auto transition-all duration-500 ${step === 2 ? 'max-w-6xl' : 'max-w-4xl'}`}>
                    {/* Multi-Step Form Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
                        <div className="p-8 md:p-12">
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-12 overflow-hidden">
                                <div
                                    className="h-full bg-blue-700 transition-all duration-500 ease-out"
                                    style={{ width: `${(step / 4) * 100}%` }}
                                ></div>
                            </div>

                            {/* Form Steps */}
                            <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Akademik</h2>
                                            <p className="text-gray-500 text-sm">Informasi ini membantu kami mengestimasi peluang berdasarkan profil sekolah kamu.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Nama Sekolah</label>
                                                <input type="text" placeholder="Contoh: SMAN 1 Jakarta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Akreditasi Sekolah</label>
                                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none bg-white">
                                                    <option>Pilih Akreditasi</option>
                                                    <option>A</option>
                                                    <option>B</option>
                                                    <option>C</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Ranking Kelas (Optional)</label>
                                                <input type="number" placeholder="Contoh: 5" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Ranking Sekolah (Nasional)</label>
                                                <input type="number" placeholder="Contoh: 120" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 text-blue-700">
                                            <AlertCircle size={20} className="shrink-0" />
                                            <p className="text-sm">Akreditasi dan ranking nasional sekolah memiliki bobot penting dalam seleksi SNBP.</p>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Nilai Rapor Terperinci</h2>
                                                <p className="text-gray-500 text-sm">Masukkan nilai rapor untuk tiap mata pelajaran. Kosongkan semester yang belum ada.</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl text-xs font-bold">
                                                <Table size={14} />
                                                <span>Input Sesuai Rapor</span>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto border border-gray-100 rounded-3xl shadow-sm">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-900 text-white">
                                                        <th className="p-5 text-xs font-bold border-r border-gray-800 sticky left-0 bg-gray-900 z-10 w-48">Mata Pelajaran</th>
                                                        {SEMESTERS.map(sem => (
                                                            <th key={sem} className="p-5 text-xs font-bold text-center border-r border-gray-800 last:border-0 min-w-[100px]">
                                                                Sem {sem}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {SUBJECT_LIST.map((sub, idx) => (
                                                        <tr key={sub} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                                                            <td className="p-4 text-sm font-bold text-gray-700 border-r border-gray-100 sticky left-0 bg-inherit z-10">{sub}</td>
                                                            {SEMESTERS.map(sem => (
                                                                <td key={sem} className="p-2 border-r border-gray-100 last:border-0">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="0"
                                                                        value={grades[sub][sem]}
                                                                        onChange={(e) => handleGradeChange(sub, sem, e.target.value)}
                                                                        className="w-full p-2.5 text-center rounded-xl bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-600 focus:shadow-md outline-none transition-all font-bold text-blue-700 text-sm"
                                                                    />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-2xl flex gap-3 text-orange-800">
                                            <AlertCircle size={20} className="shrink-0" />
                                            <p className="text-xs font-medium leading-relaxed">
                                                Saran: Masukkan setidaknya nilai Matematika, Bahasa Indonesia, dan Bahasa Inggris untuk akurasi dasar.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Minat & Preferensi</h2>
                                            <p className="text-gray-500 text-sm">Pilih bidang yang kamu minati untuk mendapatkan rekomendasi terbaik.</p>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {['Teknologi', 'Bisnis', 'Kesehatan', 'Sosial', 'Seni'].map((interest) => (
                                                <label key={interest} className="group cursor-pointer">
                                                    <input type="checkbox" className="hidden" />
                                                    <div className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-col items-center gap-3 text-center transition-all group-hover:border-blue-300 group-hover:bg-blue-50 group-checked:border-blue-700 group-checked:bg-blue-50">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-white transition-colors">
                                                            <Heart size={20} />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700">{interest}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        <hr className="border-gray-100" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">Preferensi Kota</label>
                                                <input type="text" placeholder="Contoh: Bandung, Jakarta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700">PTN Favorit</label>
                                                <input type="text" placeholder="Contoh: ITB, UI" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="text-center py-12 space-y-6">
                                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50 shadow-xl shadow-green-900/10">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-gray-900">Siap untuk Analisis?</h2>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            Semua data kamu sudah tersimpan. Klik tombol di bawah untuk melihat estimasi peluang kamu di berbagai PTN pilihan.
                                        </p>
                                        <div className="pt-8">
                                            <Button
                                                className="px-12 py-5 text-xl bg-blue-700 hover:bg-blue-800 shadow-2xl shadow-blue-700/30"
                                                onClick={handleCalculate}
                                            >
                                                Hitung Peluang SNBP
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            {step < 4 && (
                                <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-8">
                                    <button
                                        onClick={prevStep}
                                        disabled={step === 1}
                                        className={`flex items-center gap-2 font-bold transition-all ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-blue-700'}`}
                                    >
                                        <ChevronLeft size={20} />
                                        <span>Kembali</span>
                                    </button>
                                    <Button
                                        onClick={nextStep}
                                        className="flex items-center gap-2"
                                    >
                                        <span>Lanjut</span>
                                        <ChevronRight size={20} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Section>

            {/* Results Section */}
            {resultsVisible && (
                <div id="results-section" className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <Section className="pb-8">
                        <div className="mb-12">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Hasil Estimasi Peluang</h2>
                            <p className="text-gray-500">Berdasarkan data yang kamu masukkan, berikut adalah estimasi peluang kamu di berbagai jurusan.</p>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden mb-12">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-5 text-sm font-bold text-gray-700">PTN</th>
                                            <th className="px-8 py-5 text-sm font-bold text-gray-700">Jurusan</th>
                                            <th className="px-8 py-5 text-sm font-bold text-gray-700">Nilai Kamu</th>
                                            <th className="px-8 py-5 text-sm font-bold text-gray-700">Rata-Rata Diterima</th>
                                            <th className="px-8 py-5 text-sm font-bold text-gray-700">Peluang</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { ptn: 'ITB', major: 'Teknik Informatika', mine: '92.5', avg: '94.2', label: 'Mungkin', color: 'bg-yellow-100 text-yellow-700' },
                                            { ptn: 'UI', major: 'Ilmu Komputer', mine: '92.5', avg: '93.5', label: 'Aman', color: 'bg-green-100 text-green-700' },
                                            { ptn: 'UGM', major: 'Kedokteran', mine: '92.5', avg: '95.8', label: 'Beresiko', color: 'bg-orange-100 text-orange-700' },
                                            { ptn: 'UNPAD', major: 'Psikologi', mine: '92.5', avg: '91.0', label: 'Aman', color: 'bg-green-100 text-green-700' },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-8 py-5"><span className="font-bold text-gray-800">{row.ptn}</span></td>
                                                <td className="px-8 py-5 text-gray-600">{row.major}</td>
                                                <td className="px-8 py-5 font-bold text-blue-700">{row.mine}</td>
                                                <td className="px-8 py-5 text-gray-500">{row.avg}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.color}`}>{row.label}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Chart Area Block */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5">
                                <div className="flex items-center gap-2 mb-8">
                                    <BarChart2 className="text-blue-700" size={24} />
                                    <h3 className="text-xl font-bold text-gray-900">Perbandingan Nilai</h3>
                                </div>
                                <div className="h-64 flex items-end gap-6 px-4">
                                    {[
                                        { label: 'Kamu', value: 92, color: 'bg-blue-700' },
                                        { label: 'ITB', value: 94, color: 'bg-gray-200' },
                                        { label: 'UI', value: 93, color: 'bg-gray-200' },
                                        { label: 'UGM', value: 95, color: 'bg-gray-200' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                            <div className="w-full relative">
                                                <div className={`w-full rounded-t-lg transition-all duration-700 group-hover:opacity-80 ${item.color}`} style={{ height: `${item.value}%` }}></div>
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400">{item.value}%</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-blue-700 p-8 rounded-3xl text-white flex flex-col justify-center gap-6 shadow-xl shadow-blue-700/20">
                                <h3 className="text-2xl font-bold leading-tight">Mulai Bersiap Lebih Dini</h3>
                                <p className="text-blue-100 leading-relaxed text-sm">
                                    Peluang kamu di ITB cukup kompetitif. Kami menyarakan kamu untuk fokus meningkatkan portofolio atau sertifikat prestasi untuk poin tambahan.
                                </p>
                                <Button className="bg-white text-blue-700 hover:bg-blue-50 w-fit">Pelajari Strategi SNBP</Button>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Rekomendasi Jurusan PTN</h2>
                                <p className="text-gray-500">Jurusan yang paling sesuai dengan kualifikasi dan minat kamu.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { ptn: 'UI', major: 'Sistem Informasi', chance: 'Tinggi', tags: ['Favorit', 'Masa Depan'] },
                                    { ptn: 'UGM', major: 'Teknologi Informasi', chance: 'Sedang', tags: ['Prestisius'] },
                                    { ptn: 'ITS', major: 'Teknik Informatika', chance: 'Tinggi', tags: ['Terbaik'] },
                                ].map((rec, i) => (
                                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center font-bold text-blue-700">{rec.ptn}</div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-md">Peluang {rec.chance}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">{rec.major}</h4>
                                        <p className="text-sm text-gray-500 mb-6 font-medium">Universitas Indonesia</p>
                                        <div className="flex flex-wrap gap-2">
                                            {rec.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-24 pt-16 border-t border-gray-100 space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-extrabold text-gray-900">Alternatif Universitas Swasta</h2>
                                <p className="text-gray-500 max-w-2xl mx-auto">
                                    Jika peluang di PTN cukup ketat, kamu juga bisa mempertimbangkan universitas swasta berkualitas sebagai alternatif.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { name: 'Telkom University', major: 'S1 Informatika', acc: 'Unggul', cost: '15 - 20 JT/Sem', color: 'bg-red-50 text-red-600' },
                                    { name: 'BINUS University', major: 'Computer Science', acc: 'A', cost: '25 - 35 JT/Sem', color: 'bg-blue-50 text-blue-600' },
                                    { name: 'Multimedia Nusantara', major: 'Informatika', acc: 'A', cost: '18 - 25 JT/Sem', color: 'bg-indigo-50 text-indigo-600' },
                                ].map((univ, i) => (
                                    <div key={i} className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                        <div className="mb-6">
                                            <h4 className="text-xl font-bold text-gray-900 mb-1">{univ.name}</h4>
                                            <p className="text-gray-400 text-sm font-medium">{univ.major}</p>
                                        </div>
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Akreditasi</span>
                                                <span className="font-bold text-gray-900">{univ.acc}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Estimasi Biaya</span>
                                                <span className="font-bold text-blue-700">{univ.cost}</span>
                                            </div>
                                        </div>
                                        <Button variant="secondary" className="w-full text-sm">Lihat Detail Kampus</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>
                </div>
            )}
        </Layout>
    );
};

export default SnbpSimulation;
