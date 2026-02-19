/**
 * verify.js — Shared verification utility
 *
 * HOW TO CONNECT YOUR PYTHON BACKEND:
 * ------------------------------------
 * Your backend dev will give you an API endpoint like:
 *   POST http://localhost:8000/api/pan
 *   POST http://localhost:8000/api/aadhaar
 *   POST http://localhost:8000/api/dl
 *   POST http://localhost:8000/api/gst
 *
 * Each endpoint expects a JSON body with the form fields.
 * The response will be the IDfy JSON (the same format as the .json mock files).
 *
 * To switch from MOCK → REAL backend:
 *   1. Change USE_MOCK to false
 *   2. Set API_BASE to your backend URL
 *
 * That's it. Everything else stays the same.
 */

const USE_MOCK   = true;                    // ← Set to false when backend is ready
const API_BASE   = 'http://localhost:8000'; // ← Your Python backend URL

/**
 * Call verification API or load mock JSON.
 * @param {string} service   - 'pan' | 'aadhaar' | 'dl' | 'gst'
 * @param {object} payload   - form data to send { pan_number, name, dob, ... }
 * @returns {Promise<object>} - IDfy response object
 */
async function callVerifyAPI(service, payload) {
  if (USE_MOCK) {
    // Load mock JSON from local file (simulates real response)
    const res = await fetch(`../${service}/${service}.json`);
    if (!res.ok) throw new Error('Mock JSON not found');
    const data = await res.json();
    await delay(1400); // simulate network delay
    return Array.isArray(data) ? data[0] : data;
  } else {
    // ── REAL BACKEND CALL ──────────────────────────────────────────
    // Your Python backend receives this POST request.
    // It calls IDfy internally and returns the IDfy JSON response.
    const res = await fetch(`${API_BASE}/api/${service}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  }
}

/** Save result to sessionStorage and redirect to result page */
function saveAndRedirect(service, data, input) {
  const payload = { _service: service.toUpperCase(), _input: input, ...data };
  sessionStorage.setItem('verificationResult', JSON.stringify(payload));
  window.location.href = '../result/result.html';
}

/** Small delay helper */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
