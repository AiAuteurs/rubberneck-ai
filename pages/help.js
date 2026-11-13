import Head from 'next/head'
import Link from 'next/link'
import { getAllPastIssues, getIssueBySlug } from '../data/issues'
import { slimIssue, SITE_URL } from '../data/helpers'
import { HELP_GROUPS } from '../data/helpGroups'
import Navbar from '../Components/Navbar'

export async function getStaticProps() {
  const publishedSlugs = new Set(getAllPastIssues().map((i) => i.slug))
  const groups = HELP_GROUPS.map((g) => ({
    title: g.title,
    blurb: g.blurb,
    issues: g.slugs
      .filter((slug) => publishedSlugs.has(slug))
      .map((slug) => getIssueBySlug(slug))
      .filter(Boolean)
      .map(slimIssue),
  })).filter((g) => g.issues.length > 0)
  return { props: { groups }, revalidate: 3600 }
}

export default function HelpPage({ groups }) {
  return (
    <>
      <Head>
        <title>Free Help Guide — Resources for When You&apos;re Stuck | Rubberneck.ai</title>
        <meta name="description" content="Free help with bills, medical debt, short sales, legal aid, pets, prescriptions, and more. The Rubberneck.ai issues that help people in a tough spot." />
        <link rel="canonical" href={`${SITE_URL}/help`} />
        <meta property="og:title" content="Free Help Guide — Resources for When You're Stuck" />
        <meta property="og:description" content="Free help with bills, medical debt, short sales, legal aid, pets, prescriptions, and more." />
        <meta property="og:url" content={`${SITE_URL}/help`} />
        <meta property="og:image" content={`${SITE_URL}/assets/og-image.jpg`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="fb:app_id" content="2161573901462001" />
        <link rel="icon" href="/assets/favicon.png" />
      </Head>

      <style>{`
        .help-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.1rem; }
        .help-card {
          background: #12152a; border: 1px solid rgba(255,255,255,0.07); border-radius: 4px;
          padding: 1.1rem 1.25rem 1.2rem; text-decoration: none; display: flex; flex-direction: column; gap: 0.35rem;
          transition: transform 0.18s ease, border-color 0.18s ease;
        }
        .help-card:hover { transform: translateY(-3px); border-color: var(--yellow); }
        .help-card__cat { font-family: var(--font-cond); font-size: 0.65rem; letter-spacing: 0.15em; color: rgba(245,197,24,0.6); }
        .help-card__head { font-family: var(--font-headline); font-size: 1.2rem; color: #F5F0E8; line-height: 1.1; margin: 0; }
        .help-card__name { font-family: var(--font-body); font-size: 0.85rem; color: rgba(245,240,232,0.5); }
        .help-card__go { font-family: var(--font-cond); font-weight: 700; font-size: 0.75rem; letter-spacing: 0.14em; color: rgba(245,197,24,0.55); margin-top: auto; padding-top: 0.5rem; }
        .help-card:hover .help-card__go { color: var(--yellow); }
      `}</style>

      <Navbar />

      <div style={{ background: 'var(--yellow)', padding: '3rem var(--pad)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.85rem', color: '#444', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            RUBBERNECK&apos;S FREE HELP GUIDE
          </div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--black)', lineHeight: 0.95, margin: '0 0 1rem', letterSpacing: '0.02em' }}>
            STUCK? START HERE.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: '#333', lineHeight: 1.6, margin: 0, maxWidth: '640px' }}>
            The issues we&apos;ve found that help people through a tough spot, from a mortgage in trouble to a lost dog. Each one links to a free or government-backed resource.
          </p>
        </div>
      </div>

      <main style={{ background: 'var(--navy)', padding: '3rem var(--pad) 4rem' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.6, margin: '0 0 0.75rem', maxWidth: '720px' }}>
            Looking for something specific? <Link href="/archive" style={{ color: 'var(--yellow)' }}>Search every issue</Link> with the box at the top of the page.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(245,240,232,0.55)', lineHeight: 1.6, margin: '0 0 2.5rem', maxWidth: '720px' }}>
            This is a guide to outside resources, not legal, medical, or financial advice, and it is not support for Rubberneck.ai (for that, see the <Link href="/faq" style={{ color: 'var(--yellow)' }}>FAQ</Link>). If you or someone else is in immediate danger, contact your local emergency services.
          </p>

          {groups.map((g) => (
            <section key={g.title} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--yellow)', letterSpacing: '0.04em', margin: '0 0 0.4rem' }}>
                {g.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(245,240,232,0.6)', margin: '0 0 1.1rem', maxWidth: '680px' }}>
                {g.blurb}
              </p>
              <div className="help-grid">
                {g.issues.map((issue) => (
                  <Link key={issue.slug} href={`/${issue.slug}`} className="help-card">
                    <span className="help-card__cat">{(issue.site.category || '').toUpperCase()}</span>
                    <h3 className="help-card__head">{issue.headline}</h3>
                    <span className="help-card__name">{issue.site.name}</span>
                    <span className="help-card__go">READ THE ISSUE →</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(245,240,232,0.6)' }}>
            Looking for something specific?{' '}
            <Link href="/archive" style={{ color: 'var(--yellow)' }}>Search the whole archive →</Link>
          </p>
        </div>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Rubberneck.ai</span>
        <Link href="/archive">Archive</Link>
        <Link href="/help">Free Help Guide</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/unsubscribe">Unsubscribe</Link>
      </footer>
    </>
  )
}
