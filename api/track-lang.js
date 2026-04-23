export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { lang } = req.body || {};
  const allowed = ['de', 'en', 'it', 'zh'];
  if (!lang || !allowed.includes(lang)) return res.status(400).json({ error: 'invalid lang' });

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return res.status(500).json({ error: 'KV not configured' });

  await fetch(`${kvUrl}/incr/lang:${lang}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${kvToken}` },
  });

  return res.status(200).json({ ok: true });
}
