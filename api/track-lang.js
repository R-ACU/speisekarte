export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { lang, type } = req.body || {};
  if (!lang || typeof lang !== 'string' || lang.length > 20) return res.status(400).json({ error: 'invalid lang' });

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  const prefix = type === 'browser' ? 'browser' : type === 'saved' ? 'saved' : 'selected';
  await fetch(`${url}/incr/${prefix}:${lang}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.status(200).json({ ok: true });
}
