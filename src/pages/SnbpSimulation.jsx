import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Section, Button } from '../components/Generic';
import { ChevronRight, ChevronLeft, User, MapPin, BookOpen, GraduationCap, Award, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import AISnbpConsultant from '../components/AISnbpConsultant';
import { allUniversities } from '../../data/snbt/index.js';

const SEMESTERS = [1, 2, 3, 4, 5];
const MANDATORY_SUBJECTS = ["Matematika", "Bahasa Indonesia", "Bahasa Inggris"];

const SnbpSimulation = () => {
    const [step, setStep] = useState(1);

    // Step 1: Profil Siswa
    const [profile, setProfile] = useState({ name: '', school: '' });

    // Step 2: Target Kampus
    const [targets, setTargets] = useState({
        majors: [],
        cities: [],
        currentMajor: '',
        currentCity: ''
    });

    const addTarget = (type) => {
        if (type === 'major' && targets.currentMajor) {
            setTargets(p => ({ ...p, majors: [...p.majors, p.currentMajor], currentMajor: '' }));
        } else if (type === 'city' && targets.currentCity) {
            setTargets(p => ({ ...p, cities: [...p.cities, p.currentCity], currentCity: '' }));
        }
    };

    const removeTarget = (type, index) => {
        if (type === 'major') {
            setTargets(p => ({ ...p, majors: p.majors.filter((_, i) => i !== index) }));
        } else {
            setTargets(p => ({ ...p, cities: p.cities.filter((_, i) => i !== index) }));
        }
    };

    // Step 3: Latar Akademik
    const [academic, setAcademic] = useState({
        schoolType: 'SMA',
        smaMajor: 'IPA',
        smkMajor: ''
    });

    // Step 4: Nilai Akademik
    const [customSubjects, setCustomSubjects] = useState(['', '', '', '', '']);
    const [grades, setGrades] = useState(() => {
        const init = {};
        MANDATORY_SUBJECTS.forEach(s => init[s] = { 1: '', 2: '', 3: '', 4: '', 5: '' });
        [0, 1, 2, 3, 4].forEach(i => init[`custom_${i}`] = { 1: '', 2: '', 3: '', 4: '', 5: '' });
        return init;
    });

    const handleGradeChange = (subject, sem, value) => {
        if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
            setGrades(p => ({
                ...p,
                [subject]: { ...p[subject], [sem]: value }
            }));
        }
    };

    const handleCustomSubjectName = (index, name) => {
        const newCustom = [...customSubjects];
        newCustom[index] = name;
        setCustomSubjects(newCustom);
    };

    // Step 5: Prestasi
    const [achievements, setAchievements] = useState([]);
    const addAchievement = () => {
        setAchievements([...achievements, { name: '', rank: 'Juara 1', level: 'Sekolah' }]);
    };
    const updateAchievement = (i, field, value) => {
        const newA = [...achievements];
        newA[i][field] = value;
        setAchievements(newA);
    };
    const removeAchievement = (i) => {
        setAchievements(achievements.filter((_, idx) => idx !== i));
    };

    // Results
    const [results, setResults] = useState(null);

    const calculateResults = () => {
        // Calculate average
        let totalSum = 0;
        let totalCount = 0;
        let subjectAverages = {};

        const activeCustomIndices = [0, 1, 2, 3, 4].filter(i => customSubjects[i].trim() !== '');
        const activeSubjects = [
            ...MANDATORY_SUBJECTS,
            ...activeCustomIndices.map(i => `custom_${i}`)
        ];

        activeSubjects.forEach(sub => {
            let subSum = 0;
            let subCount = 0;
            SEMESTERS.forEach(sem => {
                const rawVal = grades[sub][sem];
                if (rawVal !== '' && rawVal != null) {
                    const val = Number(rawVal);
                    subSum += val;
                    subCount++;
                    totalSum += val;
                    totalCount++;
                }
            });
            if (subCount > 0) {
                const name = sub.startsWith('custom_') ? customSubjects[parseInt(sub.split('_')[1])] : sub;
                subjectAverages[name] = subSum / subCount;
            }
        });

        const avgScore = totalCount > 0 ? (totalSum / totalCount) : 0;

        let strongestSubject = "Belum Ada";
        let maxAvg = 0;
        Object.entries(subjectAverages).forEach(([name, avg]) => {
            if (avg > maxAvg) {
                maxAvg = avg;
                strongestSubject = name;
            }
        });

        // Filter Campus
        let matched = [];
        allUniversities.forEach(univ => {
            let cityMatch = targets.cities.some(c => univ.kota?.toLowerCase().includes(c.toLowerCase()));

            univ.jurusan.forEach(major => {
                let majorMatch = targets.majors.some(m => major.nama.toLowerCase().includes(m.toLowerCase()));

                // If any targets are provided, filter by them. If none, include top UI/ITB/UGM majors as fallback
                let isValid = false;
                if (targets.cities.length > 0 && targets.majors.length > 0) isValid = cityMatch || majorMatch;
                else if (targets.cities.length > 0) isValid = cityMatch;
                else if (targets.majors.length > 0) isValid = majorMatch;
                else if (['ui', 'ugm', 'itb'].includes(univ.id)) isValid = true;

                if (isValid) {
                    // Calculate internal score
                    let score = 0;
                    if (cityMatch) score += 3;
                    if (majorMatch) score += 5;
                    score += (avgScore / 20);

                    if (achievements.length > 0) score += 2;
                    if (academic.schoolType === 'SMK' && major.nama.toLowerCase().includes('terapan')) score += 2;

                    const utbkMin = major.nilai_min_utbk || 500;
                    let competitiveness = 'Peluang Terbuka';
                    if (utbkMin > 650) competitiveness = 'Sangat Kompetitif';
                    else if (utbkMin > 580) competitiveness = 'Kompetitif';

                    matched.push({
                        univ: univ.nama,
                        major: major.nama,
                        city: univ.kota,
                        competitiveness,
                        utbkMin,
                        score
                    });
                }
            });
        });

        matched.sort((a, b) => b.score - a.score);
        const finalMatches = matched.slice(0, 10);

        setResults({
            avgScore: avgScore.toFixed(2),
            strongestSubject,
            matches: finalMatches
        });

        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const isStepValid = useMemo(() => {
        if (step === 1) {
            return profile.name.trim() !== '' && profile.school.trim() !== '';
        }
        if (step === 2) {
            return targets.majors.length > 0 && targets.cities.length > 0;
        }
        if (step === 3) {
            if (academic.schoolType === 'SMK') return academic.smkMajor.trim() !== '';
            return true;
        }
        if (step === 4) {
            // Find the highest semester that has at least one grade entered (minimum required is semester 2)
            let highestSem = 2;

            const activeCustomIndices = [0, 1, 2, 3, 4].filter(i => customSubjects[i].trim() !== '');
            const activeSubjects = [
                ...MANDATORY_SUBJECTS,
                ...activeCustomIndices.map(i => `custom_${i}`)
            ];

            // Check if there is any data entered in semester 3, 4, or 5
            for (const sem of [3, 4, 5]) {
                const hasAnyData = activeSubjects.some(sub => grades[sub]?.[sem] !== '' && grades[sub]?.[sem] != null);
                if (hasAnyData) {
                    highestSem = sem;
                }
            }

            // Validate that all semesters from 1 up to highestSem are fully filled for all active subjects
            for (let sem = 1; sem <= highestSem; sem++) {
                for (const sub of activeSubjects) {
                    if (grades[sub]?.[sem] === '' || grades[sub]?.[sem] == null) {
                        return false;
                    }
                }
            }
            return true;
        }
        if (step === 5) {
            for (const ach of achievements) {
                if (ach.name.trim() === '') return false;
            }
            return true;
        }
        return true;
    }, [step, profile, targets, academic, grades, customSubjects, achievements]);

    const nextStep = () => {
        if (isStepValid) setStep(p => Math.min(p + 1, 6));
    };
    const prevStep = () => setStep(p => Math.max(p - 1, 1));

    const steps = [
        { id: 1, name: 'Profil', icon: <User size={18} /> },
        { id: 2, name: 'Target', icon: <MapPin size={18} /> },
        { id: 3, name: 'Akademik', icon: <GraduationCap size={18} /> },
        { id: 4, name: 'Nilai', icon: <BookOpen size={18} /> },
        { id: 5, name: 'Prestasi', icon: <Award size={18} /> }
    ];

    return (
        <Layout>
            <div className="pt-32 pb-12 bg-blue-50/50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                <Section className="py-0">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">🎓 Smart Campus Matchmaker</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                            Sistem AI Cekadu siap membantu kamu menemukan kampus dan jurusan paling cocok berdasarkan profil akademik dan preferensimu.
                        </p>

                        <div className="flex flex-wrap items-center gap-2 md:gap-4">
                            {steps.map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all ${step === s.id ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-400 border border-gray-200 dark:border-slate-700'}`}>
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === s.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'}`}>{s.id}</span>
                                        <span className="hidden sm:inline">{s.name}</span>
                                    </div>
                                    {i < steps.length - 1 && <ChevronRight className="text-gray-300 dark:text-slate-600 hidden sm:block" size={16} />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </Section>
            </div>

            <Section className="py-12">
                <div className={`mx-auto transition-all duration-500 max-w-4xl`}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-blue-900/10 overflow-hidden">
                        <div className="p-8 md:p-12">
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full mb-12 overflow-hidden">
                                <div className="h-full bg-blue-700 transition-all duration-500 ease-out" style={{ width: `${(step / 5) * 100}%` }}></div>
                            </div>

                            <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profil Siswa</h2>
                                            <p className="text-gray-500 text-sm">Mari kita mulai dengan data dirimu.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                                                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Contoh: Budi Santoso" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Nama Sekolah</label>
                                                <input type="text" value={profile.school} onChange={e => setProfile({ ...profile, school: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="Contoh: SMAN 1 Jakarta" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Target Kampus</h2>
                                            <p className="text-gray-500 text-sm">Apa jurusan dan kota impianmu? (Bisa isi lebih dari satu)</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Jurusan Impian</label>
                                                <div className="flex gap-2 mb-3 flex-wrap">
                                                    {targets.majors.map((m, i) => (
                                                        <span key={i} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
                                                            {m} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeTarget('major', i)} />
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <input type="text" value={targets.currentMajor} onChange={e => setTargets({ ...targets, currentMajor: e.target.value })} onKeyPress={e => e.key === 'Enter' && addTarget('major')} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white focus:border-blue-500 outline-none" placeholder="Ketik dan tekan Enter atau +... Contoh: Informatika" />
                                                    <Button onClick={() => addTarget('major')} variant="secondary" className="px-4"><Plus size={20} /></Button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Kota / Provinsi Impian</label>
                                                <div className="flex gap-2 mb-3 flex-wrap">
                                                    {targets.cities.map((c, i) => (
                                                        <span key={i} className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                                                            {c} <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeTarget('city', i)} />
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2">
                                                    <input type="text" value={targets.currentCity} onChange={e => setTargets({ ...targets, currentCity: e.target.value })} onKeyPress={e => e.key === 'Enter' && addTarget('city')} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white focus:border-blue-500 outline-none" placeholder="Ketik dan tekan Enter atau +... Contoh: Bandung" />
                                                    <Button onClick={() => addTarget('city')} variant="secondary" className="px-4"><Plus size={20} /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Latar Akademik</h2>
                                            <p className="text-gray-500 text-sm">Informasi sekolah akan membantu penyesuaian rumpun jurusan.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Jenis Sekolah</label>
                                                <select value={academic.schoolType} onChange={e => setAcademic({ ...academic, schoolType: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none">
                                                    <option value="SMA">SMA</option>
                                                    <option value="SMK">SMK</option>
                                                </select>
                                            </div>

                                            {academic.schoolType === 'SMA' && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Jurusan SMA</label>
                                                    <select value={academic.smaMajor} onChange={e => setAcademic({ ...academic, smaMajor: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none">
                                                        <option value="IPA">IPA / MIPA</option>
                                                        <option value="IPS">IPS</option>
                                                        <option value="Bahasa">Bahasa</option>
                                                    </select>
                                                </div>
                                            )}

                                            {academic.schoolType === 'SMK' && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Jurusan SMK</label>
                                                    <input type="text" value={academic.smkMajor} onChange={e => setAcademic({ ...academic, smkMajor: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:border-blue-500" placeholder="Contoh: Teknik Komputer Jaringan" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nilai Akademik</h2>
                                                <p className="text-gray-500 text-sm">Masukkan nilai 3 mapel wajib dan 5 mapel pilihanmu (Min. Smt 1-2).</p>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm">
                                            <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead>
                                                    <tr className="bg-gray-900 dark:bg-slate-950 text-white">
                                                        <th className="p-4 text-xs font-bold w-48 sticky left-0 z-10 bg-gray-900 dark:bg-slate-950 border-r border-gray-800">Mata Pelajaran</th>
                                                        {SEMESTERS.map(sem => <th key={sem} className="p-4 text-xs font-bold text-center border-r border-gray-800">Sm {sem}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                                                    {MANDATORY_SUBJECTS.map((sub, i) => (
                                                        <tr key={sub} className="bg-blue-50/30 dark:bg-slate-900">
                                                            <td className="p-3 text-sm font-bold text-gray-800 dark:text-gray-200 sticky left-0 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800">{sub} <span className="text-[10px] font-normal text-red-500 ml-1">*Wajib</span></td>
                                                            {SEMESTERS.map(sem => (
                                                                <td key={sem} className="p-1 border-r border-gray-100 dark:border-slate-800">
                                                                    <input type="number" value={grades[sub][sem]} onChange={e => handleGradeChange(sub, sem, e.target.value)} className="w-full p-2 text-center font-bold text-blue-700 dark:text-blue-400 rounded-lg bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 outline-none" placeholder="-" />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    {[0, 1, 2, 3, 4].map(i => (
                                                        <tr key={`custom_${i}`} className="bg-white dark:bg-slate-900">
                                                            <td className="p-2 sticky left-0 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800">
                                                                <input type="text" placeholder={`Mapel Pilihan ${i + 1}`} value={customSubjects[i]} onChange={e => handleCustomSubjectName(i, e.target.value)} className="w-full p-2 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500" />
                                                            </td>
                                                            {SEMESTERS.map(sem => (
                                                                <td key={sem} className="p-1 border-r border-gray-100 dark:border-slate-800">
                                                                    <input type="number" value={grades[`custom_${i}`][sem]} onChange={e => handleGradeChange(`custom_${i}`, sem, e.target.value)} className="w-full p-2 text-center font-bold text-blue-700 dark:text-blue-400 rounded-lg bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 outline-none" placeholder="-" />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {step === 5 && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Prestasi (Opsional)</h2>
                                                <p className="text-gray-500 text-sm">Tambahkan jika ada sertifikat/piagam kejuaraan.</p>
                                            </div>
                                            <Button onClick={addAchievement} variant="secondary" className="text-sm py-2 hidden sm:flex">
                                                <Plus size={16} className="mr-1" /> Tambah
                                            </Button>
                                        </div>

                                        {achievements.length === 0 ? (
                                            <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl">
                                                <Award className="mx-auto text-gray-300 mb-2" size={32} />
                                                <p className="text-gray-500 text-sm mb-4">Belum ada prestasi yang ditambahkan.</p>
                                                <Button onClick={addAchievement} variant="secondary" className="text-sm py-2 mx-auto">
                                                    <Plus size={16} className="mr-1" /> Tambah Prestasi
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {achievements.map((ach, i) => (
                                                    <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 dark:border-slate-700 rounded-xl relative group bg-gray-50/50 dark:bg-slate-800/50">
                                                        <button onClick={() => removeAchievement(i)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                                                        <div className="flex-1">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Nama Prestasi</label>
                                                            <input type="text" value={ach.name} onChange={e => updateAchievement(i, 'name', e.target.value)} className="w-full p-2 border-b border-gray-200 dark:border-slate-600 bg-transparent outline-none dark:text-white focus:border-blue-500" placeholder="Contoh: OSN Matematika" />
                                                        </div>
                                                        <div className="w-full md:w-32">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Ranking</label>
                                                            <select value={ach.rank} onChange={e => updateAchievement(i, 'rank', e.target.value)} className="w-full p-2 border-b border-gray-200 dark:border-slate-600 bg-transparent outline-none dark:text-white focus:border-blue-500">
                                                                {['Juara 1', 'Juara 2', 'Juara 3', 'Finalis', 'Peserta'].map(r => <option key={r} value={r} className="bg-white dark:bg-slate-900">{r}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="w-full md:w-40">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Tingkat</label>
                                                            <select value={ach.level} onChange={e => updateAchievement(i, 'level', e.target.value)} className="w-full p-2 border-b border-gray-200 dark:border-slate-600 bg-transparent outline-none dark:text-white focus:border-blue-500">
                                                                {['Sekolah', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'].map(r => <option key={r} value={r} className="bg-white dark:bg-slate-900">{r}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button onClick={addAchievement} variant="secondary" className="text-sm py-2 w-full mt-4 sm:hidden">
                                                    <Plus size={16} className="mr-1" /> Tambah Prestasi Lain
                                                </Button>
                                            </div>
                                        )}

                                        <div className="pt-12">
                                            <Button disabled={!isStepValid} className={`w-full py-5 text-lg font-bold bg-blue-700 hover:bg-blue-800 shadow-xl shadow-blue-700/30 ${!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={calculateResults}>
                                                Temukan Kampus Cocok
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {step < 5 && (
                                <div className="mt-12 flex justify-between items-center border-t border-gray-100 dark:border-slate-800 pt-8">
                                    <button onClick={prevStep} disabled={step === 1} className={`flex items-center gap-2 font-bold transition-all ${step === 1 ? 'text-gray-300 dark:text-slate-700 cursor-not-allowed' : 'text-gray-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400'}`}>
                                        <ChevronLeft size={20} /> <span className="hidden sm:inline">Kembali</span>
                                    </button>
                                    <Button onClick={nextStep} disabled={!isStepValid} className={`flex items-center gap-2 ${!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        Lanjut <ChevronRight size={20} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Section>

            {results && (
                <div id="results-section" className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <Section className="pb-20">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">📊 Hasil Sistem Cekadu</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Kami telah mencocokkan profil akademik kamu dengan ribuan data kampus.</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 mb-16">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-blue-900/10 border border-gray-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><User size={20} /></div>
                                    Ringkasan Profil
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-800 pb-3">
                                        <span className="text-gray-500 dark:text-slate-400 font-medium">Rata-rata Nilai</span>
                                        <span className="font-black text-blue-700 dark:text-blue-400 text-2xl">{results.avgScore}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-800 pb-3">
                                        <span className="text-gray-500 dark:text-slate-400 font-medium">Mapel Terkuat</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{results.strongestSubject}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 border-b border-gray-50 dark:border-slate-800 pb-3">
                                        <span className="text-gray-500 dark:text-slate-400 font-medium">Jurusan Target</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{targets.majors.length > 0 ? targets.majors.join(', ') : 'Belum Ditentukan'}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 pb-1">
                                        <span className="text-gray-500 dark:text-slate-400 font-medium">Kota Target</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{targets.cities.length > 0 ? targets.cities.join(', ') : 'Belum Ditentukan'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                <h3 className="text-3xl font-black mb-4 relative z-10">Ditemukan {results.matches.length} Kampus</h3>
                                <p className="text-blue-100 leading-relaxed mb-8 relative z-10 text-lg">
                                    Berdasarkan algoritma pencocokan Cekadu, berikut adalah daftar kampus dan jurusan yang paling relevan dengan profilmu.
                                </p>
                                <div className="bg-black/20 p-5 rounded-2xl flex items-start gap-4 relative z-10 border border-white/10">
                                    <AlertCircle size={24} className="text-blue-200 shrink-0" />
                                    <p className="text-sm text-blue-50">
                                        <strong>Catatan:</strong> Tingkat kompetitif didasarkan pada keketatan rata-rata masuk jurusan tersebut secara nasional.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 mb-16">
                            <div className="flex items-center gap-3">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Rekomendasi</h3>
                                <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800"></div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.matches.map((m, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">{i + 1}</div>
                                            <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest
                                                ${m.competitiveness === 'Sangat Kompetitif' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                    m.competitiveness === 'Kompetitif' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                        'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                                                {m.competitiveness}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2 leading-tight">{m.univ}</h4>
                                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">{m.major}</p>
                                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-6 flex items-center gap-1"><MapPin size={14} className="text-gray-400" /> {m.city}</p>

                                    </div>
                                ))}
                                {results.matches.length === 0 && (
                                    <div className="col-span-full p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl">
                                        <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                                        <p className="text-lg font-medium">Tidak ada kampus yang cocok dengan filter yang diberikan.</p>
                                        <p className="text-sm mt-2">Coba perluas preferensi kota atau jurusanmu.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {results.matches.length > 0 && (
                            <AISnbpConsultant
                                profileSummary={{
                                    name: profile.name,
                                    school: profile.school,
                                    schoolType: academic.schoolType,
                                    major: academic.schoolType === 'SMA' ? academic.smaMajor : academic.smkMajor,
                                    strongestSubject: results.strongestSubject,
                                    targetCities: targets.cities
                                }}
                                targetMajors={targets.majors}
                                avgScore={results.avgScore}
                                achievements={achievements}
                                filterResults={results.matches.slice(0, 5)}
                            />
                        )}
                    </Section>
                </div>
            )}
        </Layout>
    );
};

export default SnbpSimulation;
