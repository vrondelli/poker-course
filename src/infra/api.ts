// export const API_URL = 'http://localhost:3001';

// MOCK API for Vercel / Frontend-only deployment
export const api = {
  async login(name: string) {
    console.log('[MOCK] logging in:', name);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    return { id: 123, name };
    
    /*
    const res = await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Failed to login');
    return res.json();
    */
  },

  async saveSession(userId: number, stats: { correct: number, incorrect: number, avgTimeMs: number }) {
    console.log('[MOCK] saving session:', userId, stats);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    return { success: true };

    /*
    const res = await fetch(`${API_URL}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, stats })
    });
    if (!res.ok) throw new Error('Failed to save session');
    return res.json();
    */
  }
};
