import { getAllPastIssues } from '../../data/issues'

export default function handler(req, res) {
  const issues = getAllPastIssues()
  const latest = issues[issues.length - 1]
  
  if (!latest) {
    res.status(404).end()
    return
  }

  const baseUrl = 'https://www.rubberneck.ai'
  
  // Build HTML body for email
  const bodyHtml = latest.body
    .split('\n\n')
    .map(para => {
      const withBold = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      return `<p style="font-family: Georgia, serif; font-size: 17px; line-height: 1.8; color: #333; margin: 0 0 1.2em 0;">${withBold}</p>`
    })
    .join('\n')

  const screenshotUrl = latest.site.screenshot 
    ? `${baseUrl}${latest.site.screenshot}`
    : null

  const issueUrl = `${baseUrl}/${latest.slug}`

  const itemContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Georgia, serif;">
      <h1 style="font-family: Impact, sans-serif; font-size: 28px; line-height: 1.1; color: #0d1f5c; text-transform: uppercase; margin: 0 0 16px 0;">${latest.headline}</h1>
      <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 20px 0; font-style: italic;">${latest.subheadline}</p>
      ${screenshotUrl ? `<img src="${screenshotUrl}" alt="${latest.site.name}" style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 0 20px 0; border-radius: 6px;" />` : ''}
      ${bodyHtml}
      <div style="margin: 32px 0; text-align: center;">
        <a href="${latest.site.url}" style="display: inline-block; background: #e63946; color: #fff; font-family: Impact, sans-serif; font-size: 20px; letter-spacing: 0.1em; padding: 14px 36px; text-decoration: none; border-radius: 3px;">GO THERE →</a>
      </div>
      <p style="font-size: 13px; color: #999; text-align: center;">
        <a href="${issueUrl}" style="color: #999;">Read online</a> · 
        <a href="${baseUrl}/archive" style="color: #999;">Browse the archive</a>
      </p>
    </div>
  `

  const pubDate = new Date(latest.date + 'T06:00:00-05:00').toUTCString()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Rubberneck.ai</title>
    <link>${baseUrl}</link>
    <description>One extraordinary website, every day.</description>
    <language>en-us</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <item>
      <title>${latest.headline.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
      <link>${issueUrl}</link>
      <guid isPermaLink="true">${issueUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${latest.subheadline.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</description>
      <content:encoded><![CDATA[${itemContent}]]></content:encoded>
    </item>
  </channel>
</rss>`

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.status(200).send(rss)
}
