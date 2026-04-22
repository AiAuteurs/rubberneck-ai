import Head from 'next/head'
import Link from 'next/link'
import { getAllPastIssues } from '../data/issues'

export async function getStaticProps() {
  const issues = getAllPastIssues()
  return { props: { issues }, revalidate: 3600 }
}

export default function ArchivePage({ issues }) {
  return (
    <>
      <Head>
        <title>Archive — Rubberneck.ai</title>
        <meta name="description" content="Every jaw-dropping site we've ever found. One per day. Zero filler." />
        <link rel="icon" href="/assets/favicon.png" />
      </Head>

      <header style={{
        background: '#0d0d0d',
        borderBottom: '3px solid var(--yellow)',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="Rubberneck.ai" style={{ height: '36px' }} />
        </Link>
        <Link href="/" style={{
          fontFamily: 'var(--font-cond)',
          fontSize: '0.9rem',
          letterSpacing: '0.1em',
          color: 'var(--yellow)',
          textDecoration: 'none',
        }}>
          ← TODAY'S PICK
        </Link>
      </header>

      <main style={{ background: '#0d0d0d', minHeight: '100vh' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

          <div style={{
            fontFamily: 'var(--font-cond)',
            fontSize: '0.85rem',
            color: 'var(--yellow)',
            letterSpacing: '0.15em',
            marginBottom: '0.5rem',
          }}>
            {issues.length} ISSUES AND COUNTING
          </div>

          <h1 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            color: '#F5F5F0',
            letterSpacing: '0.02em',
            marginBottom: '0.5rem',
          }}>
            THE FULL ARCHIVE
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: '#666',
            marginBottom: '3rem',
          }}>
            Every site we've rubbernecked. One per day. Zero filler.
          </p>

          {issues.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', color: '#555' }}>
              Just launched. Check back tomorrow.
            </p>
          ) : (
            <div>
              {issues.map((issue) => {
                const formattedDate = new Date(issue.date + 'T00:00:00').toLocaleDateString(
                  'en-US', { month: 'short', day: 'numeric', year: 'numeric' }
                )
                return (
                  <Link
                    key={issue.id}
                    href={`/issue/${issue.id}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3rem 1fr auto',
                      alignItems: 'center',
                      gap: '1.25rem',
                      padding: '1.1rem 0.5rem',
                      borderBottom: '1px solid #1a1a1a',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.1rem',
                      color: '#444',
                    }}>
                      #{issue.id}
                    </span>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-cond)',
                        fontSize: '1.1rem',
                        color: '#F5F5F0',
                        fontWeight: 700,
                        marginBottom: '0.2rem',
                      }}>
                        {issue.site.name}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        color: '#555',
                      }}>
                        {issue.headline}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      color: '#444',
                      whiteSpace: 'nowrap',
                    }}>
                      {formattedDate}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Rubberneck.ai</span>
        <Link href="/faq">FAQ</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/unsubscribe">Unsubscribe</Link>
      </footer>
    </>
  )
}
