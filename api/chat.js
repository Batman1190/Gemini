module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set' });
    }

    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : null;
    const chatModel = body.model || 'gpt-4o-mini';

    if (!messages) {
      return res.status(400).json({ error: 'messages must be an array' });
    }

    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: chatModel, messages, temperature: 0.7 })
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(502).json({ error: 'OpenAI error', detail: text });
    }

    const data = await upstream.json();
    const reply = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    return res.status(200).json({ reply, raw: data });
  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Failed to generate a response' });
  }
}
