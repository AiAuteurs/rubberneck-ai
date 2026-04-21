// pages/api/subscribe.js
// Receives email from our form, sends it to Kit (ConvertKit)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  try {
    const response = await fetch(
      `https://api.kit.com/v4/forms/9351755/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': process.env.KIT_API_KEY,
        },
        body: JSON.stringify({ email_address: email }),
      }
    )

    if (!response.ok) {
      const err = await response.json()
      console.error('Kit error:', err)
      return res.status(500).json({ error: 'Subscription failed' })
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
