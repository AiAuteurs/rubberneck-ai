// pages/api/subscribe.js
// Sends new signups straight to Beehiiv (publication: Rubberneck.ai).
// Requires two env vars in Vercel: BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body || {}
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' })
  }

  const API_KEY = process.env.BEEHIIV_API_KEY
  const PUB_ID = process.env.BEEHIIV_PUBLICATION_ID

  if (!API_KEY || !PUB_ID) {
    console.error('subscribe: missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID')
    return res.status(500).json({ error: 'Server not configured' })
  }

  try {
    const resp = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,   // re-subscribe someone who left
          send_welcome_email: true,    // fire your Beehiiv welcome email
          utm_source: 'rubberneck.ai',
          referring_site: 'rubberneck.ai',
        }),
      }
    )

    if (resp.ok) {
      return res.status(200).json({ ok: true })
    }

    // Beehiiv returns 400 for things like "already subscribed" — treat that as
    // a success for the user, but log everything so you can see real failures.
    const detail = await resp.text()
    console.error('subscribe: beehiiv responded', resp.status, detail)
    if (resp.status === 400) {
      return res.status(200).json({ ok: true, note: 'already_subscribed_or_validation' })
    }
    return res.status(502).json({ error: 'Upstream error' })
  } catch (err) {
    console.error('subscribe: request failed', err)
    return res.status(500).json({ error: 'Subscribe failed' })
  }
}
