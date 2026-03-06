export const questions = [
    // INVESTIGATIVE (I)
    { id: 1, category: "I", text: "Saya menikmati menganalisis penyebab suatu fenomena." },
    { id: 2, category: "I", text: "Saya tertarik memahami cara kerja sistem yang kompleks." },
    { id: 3, category: "I", text: "Saya lebih suka menyelesaikan soal logika dibanding presentasi." },
    { id: 4, category: "I", text: "Saya menikmati membaca topik sains atau teknologi." },
    { id: 5, category: "I", text: "Saya senang mencari pola dari data atau informasi." },
    { id: 6, category: "I", text: "Saya tertarik melakukan eksperimen atau penelitian kecil." },
    { id: 7, category: "I", text: "Saya tidak mudah puas sebelum memahami sesuatu secara mendalam." },
    { id: 8, category: "I", text: "Saya menikmati diskusi yang menantang secara intelektual." },

    // REALISTIC (R)
    { id: 9, category: "R", text: "Saya lebih suka praktik langsung dibanding teori panjang." },
    { id: 10, category: "R", text: "Saya tertarik pada mesin, alat, atau sistem fisik." },
    { id: 11, category: "R", text: "Saya merasa puas ketika berhasil memperbaiki sesuatu." },
    { id: 12, category: "R", text: "Saya nyaman bekerja dengan alat atau perangkat." },
    { id: 13, category: "R", text: "Saya menikmati aktivitas teknis dibanding diskusi panjang." },
    { id: 14, category: "R", text: "Saya suka melihat hasil nyata dari pekerjaan saya." },
    { id: 15, category: "R", text: "Saya tertarik pada dunia konstruksi atau teknik terapan." },
    { id: 16, category: "R", text: "Saya lebih suka pekerjaan yang konkret daripada abstrak." },

    // ARTISTIC (A)
    { id: 17, category: "A", text: "Saya menikmati mengekspresikan ide melalui desain atau karya kreatif." },
    { id: 18, category: "A", text: "Saya sering memikirkan cara unik menyelesaikan masalah." },
    { id: 19, category: "A", text: "Saya tertarik pada bidang visual atau media kreatif." },
    { id: 20, category: "A", text: "Saya merasa bosan dengan sistem yang terlalu kaku." },
    { id: 21, category: "A", text: "Saya menikmati membuat sesuatu yang orisinal." },
    { id: 22, category: "A", text: "Saya tertarik pada seni, film, atau konten digital." },
    { id: 23, category: "A", text: "Saya suka mengeksplorasi ide baru tanpa batasan." },
    { id: 24, category: "A", text: "Saya nyaman bekerja dalam lingkungan fleksibel." },

    // SOCIAL (S)
    { id: 25, category: "S", text: "Saya menikmati membantu orang memahami sesuatu." },
    { id: 26, category: "S", text: "Saya tertarik pada psikologi atau perilaku manusia." },
    { id: 27, category: "S", text: "Saya merasa puas ketika bisa memberi dampak ke orang lain." },
    { id: 28, category: "S", text: "Saya nyaman berbicara di depan umum." },
    { id: 29, category: "S", text: "Saya suka bekerja dalam tim." },
    { id: 30, category: "S", text: "Saya peduli terhadap kesejahteraan orang lain." },
    { id: 31, category: "S", text: "Saya tertarik pada bidang pendidikan atau kesehatan." },
    { id: 32, category: "S", text: "Saya merasa energi saya meningkat saat berinteraksi dengan orang lain." },

    // ENTERPRISING (E)
    { id: 33, category: "E", text: "Saya tertarik membangun sesuatu yang menghasilkan keuntungan." },
    { id: 34, category: "E", text: "Saya suka mengambil keputusan penting." },
    { id: 35, category: "E", text: "Saya menikmati memimpin tim." },
    { id: 36, category: "E", text: "Saya nyaman mengambil risiko terukur." },
    { id: 37, category: "E", text: "Saya suka meyakinkan orang lain terhadap suatu ide." },
    { id: 38, category: "E", text: "Saya tertarik pada dunia bisnis atau manajemen." },
    { id: 39, category: "E", text: "Saya memiliki ambisi untuk mencapai posisi tinggi." },
    { id: 40, category: "E", text: "Saya menikmati tantangan kompetitif." },

    // CONVENTIONAL (C)
    { id: 41, category: "C", text: "Saya suka pekerjaan yang terstruktur dan rapi." },
    { id: 42, category: "C", text: "Saya nyaman bekerja dengan angka dan data." },
    { id: 43, category: "C", text: "Saya menikmati membuat sistem lebih efisien." },
    { id: 44, category: "C", text: "Saya teliti terhadap detail kecil." },
    { id: 45, category: "C", text: "Saya suka mengikuti prosedur yang jelas." },
    { id: 46, category: "C", text: "Saya menikmati pekerjaan administratif atau pencatatan." },
    { id: 47, category: "C", text: "Saya merasa nyaman dengan aturan yang jelas." },
    { id: 48, category: "C", text: "Saya suka mengatur dan mengelola informasi." }
];

export const DIRECTIONAL_QUESTIONS = [
    {
        id: "pref_1",
        text: "Bidang apa yang paling menarik bagi Anda?",
        options: [
            { label: "Teknologi & Komputer", value: "technology" },
            { label: "Kedokteran & Kesehatan", value: "health" },
            { label: "Sains Alam", value: "science" },
            { label: "Bisnis & Ekonomi", value: "business" },
            { label: "Sosial & Humaniora", value: "social" },
            { label: "Seni & Kreativitas", value: "creative" }
        ]
    },
    {
        id: "pref_2",
        text: "Apa jenis lingkungan kerja yang Anda idamkan?",
        options: [
            { label: "Di balik layar dengan komputer/data", value: "technology" },
            { label: "Langsung dengan pasien/masyarakat", value: "health" },
            { label: "Di laboratorium atau lapangan penelitian", value: "science" },
            { label: "Di kantor korporat yang dinamis", value: "business" },
            { label: "Di lingkungan pendidikan atau pelayanan publik", value: "social" },
            { label: "Di studio atau ruang kreatif", value: "creative" }
        ]
    }
];

export const MAJOR_CLUSTERS = {
    technology: {
        name: "Computer & Technology",
        riasecWeights: { I: 0.6, R: 0.3, C: 0.1 },
        majors: [
            "Informatika",
            "Ilmu Komputer",
            "Sistem Informasi",
            "Teknik Komputer",
            "Rekayasa Perangkat Lunak",
            "Teknologi Informasi",
            "Keamanan Siber",
            "Sains Data"
        ]
    },
    health: {
        name: "Medical & Health",
        riasecWeights: { I: 0.4, S: 0.4, R: 0.2 },
        majors: [
            "Kedokteran",
            "Kedokteran Gigi",
            "Farmasi",
            "Keperawatan",
            "Kebidanan",
            "Gizi Kesehatan",
            "Kesehatan Masyarakat",
            "Teknologi Laboratorium Medik"
        ]
    },
    science: {
        name: "Natural Sciences & Mathematics",
        riasecWeights: { I: 0.8, C: 0.2 },
        majors: [
            "Matematika",
            "Statistika",
            "Fisika",
            "Kimia",
            "Biologi",
            "Astronomi",
            "Meteorologi",
            "Geofisika",
            "Aktuaria"
        ]
    },
    engineering: {
        name: "Engineering & Applied Technology",
        riasecWeights: { R: 0.7, I: 0.2, E: 0.1 },
        majors: [
            "Teknik Sipil",
            "Teknik Mesin",
            "Teknik Elektro",
            "Teknik Industri",
            "Teknik Pertambangan",
            "Teknik Geologi",
            "Teknik Perkapalan",
            "Teknik Lingkungan"
        ]
    },
    business: {
        name: "Business & Management",
        riasecWeights: { E: 0.6, C: 0.3, S: 0.1 },
        majors: [
            "Manajemen",
            "Akuntansi",
            "Bisnis Digital",
            "Kewirausahaan",
            "Pemasaran",
            "Ekonomi Pembangunan",
            "Administrasi Bisnis",
            "Manajemen Logistik"
        ]
    },
    social: {
        name: "Social Sciences & Education",
        riasecWeights: { S: 0.7, E: 0.2, A: 0.1 },
        majors: [
            "Psikologi",
            "Hukum",
            "Ilmu Politik",
            "Hubungan Internasional",
            "Sosiologi",
            "Ilmu Komunikasi",
            "Pendidikan Guru SD",
            "Administrasi Publik"
        ]
    },
    creative: {
        name: "Creative & Design",
        riasecWeights: { A: 0.8, E: 0.1, S: 0.1 },
        majors: [
            "Desain Komunikasi Visual",
            "Arsitektur",
            "Interior Design",
            "Film & Televisi",
            "Musik",
            "Seni Rupa Murni",
            "Fotografi",
            "Desain Produk"
        ]
    }
};

export const CATEGORIES = {
    R: { name: "Realistic", label: "Praktis & Fisik", description: "Menyukai aktivitas yang melibatkan praktik langsung, penggunaan alat, dan hasil nyata." },
    I: { name: "Investigative", label: "Analitis & Intelektual", description: "Menyukai observasi, pembelajaran, penyelidikan, dan pemecahan masalah yang kompleks." },
    A: { name: "Artistic", label: "Kreatif & Ekspresif", description: "Menyukai aktivitas yang tidak terstruktur, ekspresi diri, orisinalitas, dan seni." },
    S: { name: "Social", label: "Membantu & Mengajar", description: "Menyukai interaksi dengan orang lain, membantu, mengajar, menyembuhkan, dan melayani." },
    E: { name: "Enterprising", label: "Memimpin & Mempengaruhi", description: "Menyukai kepemimpinan, persuasi, ambisi, risiko terukur, dan lingkungan kompetitif." },
    C: { name: "Conventional", label: "Terstruktur & Detail", description: "Menyukai keteraturan, detail, data, prosedur yang jelas, dan efisiensi administratif." }
};

export const ACADEMIC_SUBJECT_GROUPS = {
    science: ["Matematika Lanjut", "Fisika", "Kimia", "Biologi", "Informatika"],
    social: ["Ekonomi", "Sosiologi", "Geografi", "Sejarah", "PKN"],
    humanities: ["Bahasa Indonesia", "Bahasa Inggris", "Bahasa Asing"],
    creative: ["Seni Budaya", "Prakarya"],
    general: ["Agama", "PJOK"]
};

export const ACADEMIC_MAJORS_MAPPING = {
    science: ["Informatika", "Teknik Elektro", "Teknik Industri", "Data Science", "Statistika"],
    social: ["Hukum", "Manajemen", "Ilmu Komunikasi", "Akuntansi", "Hubungan Internasional"],
    humanities: ["Sastra Inggris", "Ilmu Perpustakaan", "Pendidikan Bahasa", "Linguistik", "Sastra Jepang"],
    creative: ["DKV", "Arsitektur", "Interior Design", "Seni Rupa", "Film & Televisi"],
    general: ["Ilmu Keolahragaan", "Pendidikan Agama", "Ilmu Pendidikan", "Manajemen Pendidikan", "Sosiologi Pendidikan"]
};

// FIELD_MAPPING is now replaced by MAJOR_CLUSTERS logic in the scoring system

