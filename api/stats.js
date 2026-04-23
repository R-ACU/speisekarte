export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  const langs = ['de', 'en', 'it', 'zh'];
  const results = await Promise.all(
    langs.map(l =>
      fetch(`${url}/get/lang:${l}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()).then(d => ({ lang: l, count: parseInt(d.result) || 0 }))
    )
  );

  const total = results.reduce((s, r) => s + r.count, 0);
  const rows = results
    .sort((a, b) => b.count - a.count)
    .map(r => {
      const pct = total ? Math.round((r.count / total) * 100) : 0;
      const bar = '█'.repeat(Math.round(pct / 5)).padEnd(20, '░');
      return `<tr><td>${r.lang.toUpperCase()}</td><td>${bar}</td><td>${pct}%</td><td>${r.count}</td></tr>`;
    }).join('');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Language Stats</title>
<style>body{font-family:monospace;background:#1a1410;color:#f5f0e8;padding:2rem}
table{border-collapse:collapse}td{padding:6px 16px}
h2{color:#b8932a}</style></head><body>
<h2>Giovanni R — Language Stats</h2>
<p>Total visits: <strong>${total}</strong></p>
<table>${rows}</table></body></html>`);
}
