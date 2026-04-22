// pages/api/subscribe.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  try {
    // 1. Add to Kit
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/9351755/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.KIT_API_KEY,
          email,
        }),
      }
    )

    const data = await response.json()
    console.log('Kit response:', data)

    if (!response.ok) {
      return res.status(500).json({ error: 'Subscription failed', detail: data })
    }

    // 2. Fire notification to rubberneckai@gmail.com via Formspree
    // Does not block or affect the signup if it fails
    fetch('https://formspree.io/f/xzdkojqd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: '🐔 New Rubberneck Subscriber!',
        email: email,
        message: `New subscriber just joined: ${email}`,
      }),
    }).catch(() => {}) // silent fail — never block the signup

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
