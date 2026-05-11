// All Gemini API calls go through our secure backend (/api/*).
// The API key is NEVER exposed to the browser/frontend.

export const generateAnalysis = async (scores, dominantCluster, top3) => {
  const res = await fetch('/api/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scores, dominantCluster, top3 }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menghubungi server AI.');
  }
  const data = await res.json();
  return data.text;
};

export const generateAcademicAnalysis = async (analysisData, interestScores) => {
  const res = await fetch('/api/academic-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysisData, interestScores }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menghubungi server AI.');
  }
  const data = await res.json();
  return data.text;
};

export const generateSnbtAnalysis = async (utbkScore, choicesData) => {
  const res = await fetch('/api/snbt-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ utbkScore, choicesData }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menghubungi server AI.');
  }
  const data = await res.json();
  return data.text;
};

export const generateSnbpAnalysis = async (profileData, targetMajor, targetUniv) => {
  const res = await fetch('/api/snbp-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileData, targetMajor, targetUniv }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Gagal menghubungi server AI.');
  }
  const data = await res.json();
  return data.text;
};
