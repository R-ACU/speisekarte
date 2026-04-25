export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { source } = req.body || {};
  if (!source || typeof source !== 'string' || source.length > 50) return res.status(400).json({ error: 'invalid source' });

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  await fetch(`${url}/incr/qr:${source}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.status(200).json({ ok: true });
}
