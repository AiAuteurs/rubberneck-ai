// pages/api/subscribers.js
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
  try {
    const response = await fetch(
      'https://api.convertkit.com/v3/subscribers?api_secret=' + process.env.KIT_API_SECRET,
      { method: 'GET' }
    )
    const data = await response.json()
    const count = data?.total_subscribers ?? 0
    return res.status(200).json({ count })
  } catch (err) {
    console.error('Subscriber count error:', err)
    return res.status(200).json({ count: 0 })
  }
}
