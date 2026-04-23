export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { lang } = req.body || {};
  const allowed = ['de', 'en', 'it', 'zh'];
  if (!lang || !allowed.includes(lang)) return res.status(400).json({ error: 'invalid lang' });

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  await fetch(`${url}/incr/lang:${lang}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.status(200).json({ ok: true });
}
