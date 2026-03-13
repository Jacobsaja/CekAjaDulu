/**
 * SNBT Database Generator for Cekadu (Cek Aja Dulu)
 * 
 * Fetches SNBT data from the official SNPMB data source and generates
 * per-university JavaScript database files.
 * 
 * Usage: node scripts/generate_snbt_database.js
 * 
 * Safety: Sequential requests with 500ms delay to avoid overloading the server.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ─── Configuration ───────────────────────────────────────────────────────────

const BASE_URL = 'https://sidatagrun-public-1076756628210.asia-southeast2.run.app';
const DELAY_MS = 500; // Delay between requests to be respectful

const CATEGORY_URLS = [
  { url: `${BASE_URL}/ptn_sb.php`, category: 'akademik' },
  { url: `${BASE_URL}/ptn_sb.php?ptn=-2`, category: 'vokasi' },
  { url: `${BASE_URL}/ptn_sb.php?ptn=-3`, category: 'pt_kin' },
];

const OUTPUT_DIR = path.join(PROJECT_ROOT, 'data', 'snbt');

// ─── Jenjang mapping ─────────────────────────────────────────────────────────

const JENJANG_MAP = {
  'sarjana': 'S1',
  'magister': 'S2',
  'doktor': 'S3',
  'diploma empat': 'D4',
  'diploma tiga': 'D3',
  'diploma dua': 'D2',
  'diploma satu': 'D1',
  'sarjana terapan': 'D4',
  'profesi': 'Profesi',
  'spesialis': 'Spesialis',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a clean short ID from a university name.
 * e.g. "UNIVERSITAS SUMATERA UTARA" → "usu"
 *      "INSTITUT TEKNOLOGI BANDUNG" → "itb"
 *      "UNIVERSITAS GADJAH MADA" → "ugm"
 */
function generateId(name) {
  const cleaned = name.trim().toUpperCase();

  // Common full-name to abbreviation overrides
  const OVERRIDES = {
    'UNIVERSITAS INDONESIA': 'ui',
    'INSTITUT TEKNOLOGI BANDUNG': 'itb',
    'UNIVERSITAS GADJAH MADA': 'ugm',
    'INSTITUT PERTANIAN BOGOR': 'ipb',
    'UNIVERSITAS AIRLANGGA': 'unair',
    'UNIVERSITAS DIPONEGORO': 'undip',
    'UNIVERSITAS PADJADJARAN': 'unpad',
    'UNIVERSITAS BRAWIJAYA': 'ub',
    'UNIVERSITAS HASANUDDIN': 'unhas',
    'UNIVERSITAS SEBELAS MARET': 'uns',
    'INSTITUT TEKNOLOGI SEPULUH NOPEMBER': 'its',
    'UNIVERSITAS PENDIDIKAN INDONESIA': 'upi',
    'UNIVERSITAS SUMATERA UTARA': 'usu',
    'UNIVERSITAS NEGERI SEMARANG': 'unnes',
    'UNIVERSITAS NEGERI YOGYAKARTA': 'uny',
    'UNIVERSITAS NEGERI MALANG': 'um',
    'UNIVERSITAS NEGERI SURABAYA': 'unesa',
    'UNIVERSITAS NEGERI JAKARTA': 'unj',
    'UNIVERSITAS NEGERI MEDAN': 'unimed',
    'UNIVERSITAS NEGERI PADANG': 'unp',
    'UNIVERSITAS NEGERI MAKASSAR': 'unm',
    'UNIVERSITAS NEGERI MANADO': 'unima',
    'UNIVERSITAS NEGERI GORONTALO': 'ung',
    'UNIVERSITAS JENDERAL SOEDIRMAN': 'unsoed',
    'UNIVERSITAS LAMPUNG': 'unila',
    'UNIVERSITAS RIAU': 'unri',
    'UNIVERSITAS SRIWIJAYA': 'unsri',
    'UNIVERSITAS ANDALAS': 'unand',
    'UNIVERSITAS UDAYANA': 'unud',
    'UNIVERSITAS MATARAM': 'unram',
    'UNIVERSITAS MULAWARMAN': 'unmul',
    'UNIVERSITAS TANJUNGPURA': 'untan',
    'UNIVERSITAS LAMBUNG MANGKURAT': 'ulm',
    'UNIVERSITAS SYIAH KUALA': 'usk',
    'UNIVERSITAS BENGKULU': 'unib',
    'UNIVERSITAS JAMBI': 'unja',
    'UNIVERSITAS PALANGKA RAYA': 'upr',
    'UNIVERSITAS SAM RATULANGI': 'unsrat',
    'UNIVERSITAS TADULAKO': 'untad',
    'UNIVERSITAS HALU OLEO': 'uho',
    'UNIVERSITAS NUSA CENDANA': 'undana',
    'UNIVERSITAS CENDERAWASIH': 'uncen',
    'UNIVERSITAS PATTIMURA': 'unpatti',
    'UNIVERSITAS KHAIRUN': 'unkhair',
    'UNIVERSITAS PAPUA': 'unipa',
    'UNIVERSITAS JEMBER': 'unej',
    'UNIVERSITAS TRUNOJOYO MADURA': 'utm',
    'UNIVERSITAS SULTAN AGENG TIRTAYASA': 'untirta',
    'UNIVERSITAS TIDAR': 'untidar',
    'UNIVERSITAS SINGAPERBANGSA KARAWANG': 'unsika',
    'UNIVERSITAS MALIKUSSALEH': 'unimal',
    'UNIVERSITAS TEUKU UMAR': 'utu',
    'UNIVERSITAS SAMUDRA': 'unsam',
    'UNIVERSITAS BANGKA BELITUNG': 'ubb',
    'UNIVERSITAS MARITIM RAJA ALI HAJI': 'umrah',
    'UNIVERSITAS BORNEO TARAKAN': 'ubt',
    'UNIVERSITAS TIMOR': 'unimor',
    'UNIVERSITAS SULAWESI BARAT': 'unsulbar',
    'UNIVERSITAS SEMBILANBELAS NOVEMBER KOLAKA': 'usn',
    'UNIVERSITAS MUSAMUS': 'unmus',
    'INSTITUT SENI INDONESIA YOGYAKARTA': 'isi_yogyakarta',
    'INSTITUT SENI INDONESIA SURAKARTA': 'isi_surakarta',
    'ISI BALI': 'isi_bali',
    'ISI PADANG PANJANG': 'isi_padang_panjang',
    'ISBI ACEH': 'isbi_aceh',
    'ISBI BANDUNG': 'isbi_bandung',
    'ISBI TANAH PAPUA': 'isbi_tanah_papua',
    'INSTITUT TEKNOLOGI SUMATERA': 'itera',
    'INSTITUT TEKNOLOGI KALIMANTAN': 'itk',
  };

  if (OVERRIDES[cleaned]) {
    return OVERRIDES[cleaned];
  }

  // Skip common words and build acronym from remaining
  const SKIP_WORDS = new Set(['UNIVERSITAS', 'INSTITUT', 'TEKNOLOGI', 'POLITEKNIK', 'AKADEMI', 'SEKOLAH', 'TINGGI', 'NEGERI', 'DAN']);
  
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  
  // If name contains "UPN" or similar well-known acronyms, use them
  if (cleaned.includes('UPN')) {
    // e.g. UPN "VETERAN" JAKARTA → upn_veteran_jakarta
    return cleaned
      .replace(/"/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  // Generate acronym from significant words
  const significantWords = words.filter(w => !SKIP_WORDS.has(w));
  
  if (significantWords.length === 0) {
    // Fallback: use first letter of each word
    return words.map(w => w[0]).join('').toLowerCase();
  }

  if (significantWords.length === 1 && significantWords[0].length <= 5) {
    // Short name like "RIAU" → build from prefix + significant
    const prefix = words[0] === 'UNIVERSITAS' ? 'un' : words[0] === 'INSTITUT' ? 'i' : '';
    return (prefix + significantWords[0].toLowerCase()).toLowerCase();
  }

  // Use first letter of each significant word
  const acronym = significantWords.map(w => w[0]).join('').toLowerCase();
  
  if (acronym.length >= 2) {
    return acronym;
  }
  
  // Fallback: slugify the full name
  return cleaned
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');
}

/**
 * Convert a university name to title case for display.
 * e.g. "UNIVERSITAS SUMATERA UTARA" → "Universitas Sumatera Utara"
 */
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Map jenjang text from the website to a short code.
 */
function mapJenjang(raw) {
  const key = raw.trim().toLowerCase();
  return JENJANG_MAP[key] || raw.trim();
}

/**
 * Make the variable name JS-safe from the ID.
 */
function toVarName(id) {
  return id.replace(/[^a-z0-9_]/g, '_').replace(/^(\d)/, '_$1');
}

// ─── Scraping Functions ──────────────────────────────────────────────────────

/**
 * Fetch and parse the university list from a category page.
 * Returns array of { kode, nama, kota, ptnId }
 */
async function fetchUniversityList(url) {
  console.log(`  Fetching university list: ${url}`);
  const { data: html } = await axios.get(url, {
    headers: {
      'User-Agent': 'Cekadu-SNBT-Generator/1.0 (educational project)',
    },
    timeout: 30000,
  });
  
  const $ = cheerio.load(html);
  const universities = [];
  
  // The data is in a table inside the page
  const rows = $('table tr');
  
  rows.each((i, row) => {
    const cells = $(row).find('td');
    if (cells.length < 5) return; // Skip header or malformed rows
    
    const kode = $(cells[1]).text().trim();
    const nama = $(cells[2]).text().trim().split('\n')[0].trim(); // Get just the name, not the URL
    const kota = $(cells[3]).text().trim();
    
    // Extract ptn ID from the "Lihat Prodi" link
    const link = $(cells).last().find('a').attr('href') || $(row).find('a[href*="ptn="]').last().attr('href');
    let ptnId = null;
    if (link) {
      const match = link.match(/ptn=(\d+)/);
      if (match) ptnId = match[1];
    }
    
    if (kode && nama && ptnId) {
      // Clean the nama — remove website URLs that might be in the same cell
      const cleanNama = nama.replace(/\(https?:\/\/[^\)]+\)/g, '').replace(/https?:\/\/\S+/g, '').trim();
      
      universities.push({
        kode,
        nama: cleanNama,
        kota,
        ptnId,
      });
    }
  });
  
  console.log(`    Found ${universities.length} universities`);
  return universities;
}

/**
 * Fetch and parse the programs for a single university.
 * Returns array of { kode, nama, jenjang, daya_tampung_2026, peminat_2025 }
 */
async function fetchPrograms(ptnId) {
  const url = `${BASE_URL}/ptn_sb.php?ptn=${ptnId}`;
  const { data: html } = await axios.get(url, {
    headers: {
      'User-Agent': 'Cekadu-SNBT-Generator/1.0 (educational project)',
    },
    timeout: 30000,
  });
  
  const $ = cheerio.load(html);
  const programs = [];
  
  const rows = $('table tr');
  
  rows.each((i, row) => {
    const cells = $(row).find('td');
    if (cells.length < 6) return; // Skip header rows
    
    const no = parseInt($(cells[0]).text().trim(), 10);
    if (isNaN(no)) return; // Skip non-data rows
    
    const kode = $(cells[1]).text().trim();
    const nama = $(cells[2]).text().trim();
    const jenjang = $(cells[3]).text().trim();
    const dayaTampung = parseInt($(cells[4]).text().trim(), 10) || 0;
    const peminat = parseInt($(cells[5]).text().trim(), 10) || 0;
    
    programs.push({
      no,
      kode,
      nama: toTitleCase(nama),
      jenjang: mapJenjang(jenjang),
      daya_tampung_2026: dayaTampung,
      peminat_2025: peminat,
      nilai_min_utbk: null,
    });
  });
  
  return programs;
}

// ─── File Generation ─────────────────────────────────────────────────────────

/**
 * Generate a JavaScript file for a single university.
 */
function generateUniversityFile(uni) {
  const varName = toVarName(uni.id);
  const jurusanStr = uni.jurusan
    .map(j => {
      return `    {
      no: ${j.no},
      kode: "${j.kode}",
      nama: "${j.nama.replace(/"/g, '\\"')}",
      jenjang: "${j.jenjang}",
      daya_tampung_2026: ${j.daya_tampung_2026},
      peminat_2025: ${j.peminat_2025},
      nilai_min_utbk: ${j.nilai_min_utbk === null ? 'null' : j.nilai_min_utbk}
    }`;
    })
    .join(',\n');

  return `export const ${varName} = {
  id: "${uni.id}",
  nama: "${uni.nama.replace(/"/g, '\\"')}",
  kota: "${uni.kota.replace(/"/g, '\\"')}",

  jurusan: [
${jurusanStr}
  ]
};
`;
}

/**
 * Generate the barrel index.js file.
 */
function generateIndexFile(universities) {
  const imports = universities
    .map(u => {
      const varName = toVarName(u.id);
      return `export { ${varName} } from './${u.id}.js';`;
    })
    .join('\n');

  const allArrayEntries = universities
    .map(u => `  ${toVarName(u.id)}`)
    .join(',\n');

  return `${imports}

import { ${universities.map(u => toVarName(u.id)).join(', ')} } from './index.js';

export const allUniversities = [
${allArrayEntries}
];
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     SNBT Database Generator — Cekadu Project     ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Step 1: Fetch all university lists
  console.log('📋 Step 1: Fetching university lists...\n');
  const allUniversities = [];
  const seenPtnIds = new Set(); // Avoid duplicates across categories

  for (const { url, category } of CATEGORY_URLS) {
    try {
      const unis = await fetchUniversityList(url);
      for (const uni of unis) {
        if (!seenPtnIds.has(uni.ptnId)) {
          seenPtnIds.add(uni.ptnId);
          allUniversities.push({ ...uni, category });
        }
      }
      await sleep(DELAY_MS);
    } catch (err) {
      console.error(`  ❌ Error fetching ${category}: ${err.message}`);
    }
  }

  console.log(`\n📊 Total unique universities found: ${allUniversities.length}\n`);

  // Step 2: Fetch programs for each university
  console.log('📚 Step 2: Fetching study programs for each university...\n');
  
  const results = [];
  let totalPrograms = 0;

  for (let i = 0; i < allUniversities.length; i++) {
    const uni = allUniversities[i];
    const progress = `[${i + 1}/${allUniversities.length}]`;
    
    try {
      process.stdout.write(`  ${progress} ${uni.nama}... `);
      const programs = await fetchPrograms(uni.ptnId);
      totalPrograms += programs.length;
      
      const id = generateId(uni.nama);
      
      results.push({
        id,
        nama: toTitleCase(uni.nama),
        kota: uni.kota,
        jurusan: programs,
      });
      
      console.log(`✅ ${programs.length} programs`);
      
      // Delay before next request
      if (i < allUniversities.length - 1) {
        await sleep(DELAY_MS);
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
  }

  // Step 3: Generate JS files
  console.log(`\n📝 Step 3: Generating JavaScript files...\n`);

  // Check for duplicate IDs and resolve them
  const idCounts = {};
  for (const uni of results) {
    idCounts[uni.id] = (idCounts[uni.id] || 0) + 1;
  }

  // Resolve duplicates by appending city info
  const idSeen = {};
  for (const uni of results) {
    if (idCounts[uni.id] > 1) {
      const suffix = uni.kota
        .toLowerCase()
        .replace(/^(kota|kabupaten)\s+/i, '')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      uni.id = `${uni.id}_${suffix}`;
    }
    
    // Final dedup safety
    if (idSeen[uni.id]) {
      uni.id = `${uni.id}_${uni.jurusan.length}`;
    }
    idSeen[uni.id] = true;
  }

  let filesGenerated = 0;
  for (const uni of results) {
    const content = generateUniversityFile(uni);
    const filePath = path.join(OUTPUT_DIR, `${uni.id}.js`);
    fs.writeFileSync(filePath, content, 'utf8');
    filesGenerated++;
  }

  // Generate index file
  const indexContent = generateIndexFile(results);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.js'), indexContent, 'utf8');

  // Summary
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║                    Summary                       ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Universities processed: ${String(results.length).padEnd(24)}║`);
  console.log(`║  Total programs:         ${String(totalPrograms).padEnd(24)}║`);
  console.log(`║  Files generated:        ${String(filesGenerated + 1).padEnd(24)}║`);
  console.log(`║  Output directory:       data/snbt/              ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('\n✅ Database generation complete!');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
