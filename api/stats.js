export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  async function getKeys(pattern) {
    const r = await fetch(`${url}/keys/${pattern}`, { headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    return d.result || [];
  }

  async function getCount(key) {
    const r = await fetch(`${url}/get/${key}`, { headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    return parseInt(d.result) || 0;
  }

  const [selectedKeys, browserKeys] = await Promise.all([
    getKeys('selected:*'),
    getKeys('browser:*'),
  ]);

  async function buildRows(keys) {
    const entries = await Promise.all(keys.map(async k => ({ lang: k.split(':')[1], count: await getCount(k) })));
    entries.sort((a, b) => b.count - a.count);
    const total = entries.reduce((s, e) => s + e.count, 0);
    return { entries, total };
  }

  const [sel, bro] = await Promise.all([buildRows(selectedKeys), buildRows(browserKeys)]);

  function renderTable({ entries, total }) {
    if (!entries.length) return '<p>Noch keine Daten</p>';
    return `<table>${entries.map(r => {
      const pct = total ? Math.round((r.count / total) * 100) : 0;
      const bar = '█'.repeat(Math.round(pct / 5)).padEnd(20, '░');
      return `<tr><td>${r.lang.toUpperCase()}</td><td>${bar}</td><td>${pct}%</td><td>${r.count}</td></tr>`;
    }).join('')}</table><p style="opacity:0.5">Total: ${total}</p>`;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Language Stats</title>
<style>body{font-family:monospace;background:#1a1410;color:#f5f0e8;padding:2rem;max-width:600px}
table{border-collapse:collapse}td{padding:5px 14px}h2{color:#b8932a}h3{color:#b8932a;margin-top:2rem}</style>
</head><body>
<h2>Giovanni R — Language Stats</h2>
<h3>Browsersprache der Besucher</h3>
${renderTable(bro)}
<h3>Gewählte Sprache</h3>
${renderTable(sel)}
</body></html>`);
}
