import { getAllPastIssues } from '../data/issues'
import { SITE_URL } from '../data/helpers'

const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// /sitemap.xml: lists every published issue so Google can find and index them.
export async function getServerSideProps({ res }) {
  const issues = getAllPastIssues() // newest first
  const newest = issues[0]?.date

  const pages = [
    { loc: `${SITE_URL}/`, lastmod: newest, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/archive`, lastmod: newest, changefreq: 'daily', priority: '0.8' },
    { loc: `${SITE_URL}/help`, lastmod: newest, changefreq: 'weekly', priority: '0.8' },
    { loc: `${SITE_URL}/faq`, changefreq: 'monthly', priority: '0.3' },
    { loc: `${SITE_URL}/privacy`, changefreq: 'yearly', priority: '0.2' },
  ]
  const issuePages = issues
    .filter((i) => i.slug)
    .map((i) => ({ loc: `${SITE_URL}/${i.slug}`, lastmod: i.date, changefreq: 'monthly', priority: '0.7' }))

  const body = [...pages, ...issuePages]
    .map(
      (p) =>
        `  <url>\n    <loc>${xmlEscape(p.loc)}</loc>\n` +
        (p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>\n` : '') +
        `    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
