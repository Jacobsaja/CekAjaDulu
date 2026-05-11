// All Gemini calls go through our secure backend API.
// The API key is NEVER exposed to the frontend/browser.

export async function getAdmissionPrediction(userData: any) {
  const res = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Prediction request failed.');
  }

  return res.json();
}

export async function chatWithCounselor(
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, message }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Chat request failed.');
  }

  const data = await res.json();
  return data.text;
}
