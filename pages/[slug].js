import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getIssueBySlug, getAllIssues } from '../data/issues'
import Navbar from '../Components/Navbar'

export async function getStaticPaths() {
  const all = getAllIssues()
  const paths = all
    .filter((issue) => issue.slug)
    .map((issue) => ({ params: { slug: issue.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const issue = getIssueBySlug(params.slug)
  if (!issue) return { notFound: true }

  const all = getAllIssues()
  const maxId = all.length > 0 ? Math.max(...all.map(i => i.id)) : issue.id

  return { props: { issue, maxId }, revalidate: 3600 }
}

export default function SlugIssuePage({ issue, maxId }) {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [squeaked, setSqueaked] = useState(false)

  useEffect(() => {
    audioRef.current = new Audio('/assets/squeak.wav')
    audioRef.current.preload = 'auto'
  }, [])

  function squeak() {
    if (!muted && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
    setSqueaked(true)
    setTimeout(() => setSqueaked(false), 600)
  }

  function renderBody(text) {
    return text.split('\n\n').map((para, i) => {
      const parts = para.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} style={{ marginBottom: '1.25rem', fontStyle: para.startsWith('*') && para.endsWith('*') ? 'italic' : 'normal' }}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part.replace(/^\*|\*$/g, '')
          )}
        </p>
      )
    })
  }

  const formattedDate = new Date(issue.date + 'T00:00:00').toLocaleDateString(
    'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  )

  const hasPrev = issue.id > 1
  const hasNext = issue.id < maxId

  return (
    <>
      <Head>
        <title>{issue.site.name} — Rubberneck.ai #{issue.id}</title>
        <meta name="description" content={issue.subheadline} />
        <meta property="og:title" content={`${issue.headline} — Rubberneck.ai`} />
        <meta property="og:description" content={issue.subheadline} />
        <meta property="og:image" content={issue.site.screenshot ? `https://rubberneck.ai${issue.site.screenshot}` : 'https://rubberneck.ai/assets/og-image.jpg'} />
        <meta property="og:url" content={`https://rubberneck.ai/${issue.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={issue.site.screenshot ? `https://rubberneck.ai${issue.site.screenshot}` : 'https://rubberneck.ai/assets/og-image.jpg'} />
        <link rel="icon" href="/assets/favicon.png" />
      </Head>

      <Navbar />

      {/* HERO LOGO */}
      <section style={{ background: 'var(--yellow)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2.5rem 1.5rem' }}>
        <a href='/' style={{ display: 'block' }}>
          <img
            src='/assets/logo.png'
            alt="Rubberneck.ai — Websites that grab you by the eyeballs. You won't look away."
            style={{ width: 'clamp(220px, 55vw, 700px)', height: 'auto' }}
          />
        </a>
      </section>

      {/* ISSUE HEADER */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
          <div style={{
            fontFamily: 'var(--font-cond)', fontSize: '0.8rem', color: 'var(--yellow)',
            letterSpacing: '0.15em', marginBottom: '0.75rem',
          }}>
            ISSUE #{issue.id} — {formattedDate.toUpperCase()}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-headline)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#F5F5F0', lineHeight: 1.05, marginBottom: '1rem',
          }}>
            {issue.headline}
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1.1rem',
            color: '#888', lineHeight: 1.5, marginBottom: '1.5rem',
          }}>
            {issue.subheadline}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {issue.tags.map((tag) => (
              <span key={tag} style={{
                background: '#1a1a1a', color: '#666', fontFamily: 'var(--font-cond)',
                fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px',
                border: '1px solid #333', letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main style={{ background: '#0d0d0d', minHeight: '60vh' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

          {/* SITE CARD */}
          <div style={{
            border: '2px solid var(--yellow)', borderRadius: '6px',
            overflow: 'hidden', marginBottom: '2.5rem', background: '#111',
          }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '52.5%', background: '#0a0a0a' }}>
              <img
                src={issue.site.screenshot || `https://api.microlink.io/?url=${encodeURIComponent(issue.site.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                alt={issue.site.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            <div style={{
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.4rem', color: '#F5F5F0' }}>
                  {issue.site.name}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#555', marginTop: '0.2rem' }}>
                  {issue.site.vibe}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <a
                  href={issue.site.url} target="_blank" rel="noopener noreferrer"
                  onClick={squeak}
                  style={{
                    background: 'var(--yellow)', color: '#080808', fontFamily: 'var(--font-cond)',
                    fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em',
                    padding: '0.6rem 1.5rem', borderRadius: '3px', textDecoration: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  {squeaked ? '🐔 GOING THERE →' : 'GO THERE →'}
                </a>
                <a href="/archive" style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                  color: '#555', textDecoration: 'none', letterSpacing: '0.03em',
                }}>
                  Missed some? <span style={{ color: 'var(--yellow)', textDecoration: 'underline' }}>Browse the archive →</span>
                </a>
              </div>
            </div>
          </div>

          {/* BODY */}
          <article style={{
            fontFamily: 'var(--font-body)', fontSize: '1.1rem',
            lineHeight: 1.8, color: '#bbb', marginBottom: '2.5rem',
          }}>
            {renderBody(issue.body)}
          </article>

          {/* AFFILIATE LINKS */}
          {issue.affiliate_links.length > 0 && (
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{
                fontFamily: 'var(--font-cond)', fontSize: '0.8rem', color: 'var(--yellow)',
                letterSpacing: '0.15em', marginBottom: '0.75rem',
              }}>
                🔗 USEFUL LINKS
              </div>
              {issue.affiliate_links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" onClick={squeak}
                  style={{ display: 'block', color: 'var(--yellow)', fontFamily: 'var(--font-body)', fontSize: '1rem', marginBottom: '0.5rem', textDecoration: 'underline' }}>
                  {link.label}
                  {link.note && <span style={{ color: '#555', fontSize: '0.8rem' }}> ({link.note})</span>}
                </a>
              ))}
            </div>
          )}

          {/* EMAIL SIGNUP */}
          <div style={{
            background: 'var(--yellow)', borderRadius: '6px',
            padding: '2rem', textAlign: 'center', marginBottom: '2.5rem',
          }}>
            <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.75rem', color: '#080808', marginBottom: '0.5rem' }}>
              ONE JAW-DROPPING SITE. EVERY MORNING.
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#333', marginBottom: '1rem' }}>
              Free. Join the nosy legends. Unsubscribe whenever.
            </p>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const email = e.target.email.value
              await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
              })
              e.target.email.value = "✓ You're in — see you tomorrow"
              e.target.email.disabled = true
              e.target.querySelector('button').style.display = 'none'
              squeak()
            }} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <input type="email" name="email" required placeholder="your@email.com" style={{
                padding: '0.65rem 1rem', borderRadius: '3px', border: '2px solid #080808',
                fontFamily: 'var(--font-body)', fontSize: '1rem', width: '260px',
              }} />
              <button type="submit" style={{
                background: '#080808', color: 'var(--yellow)', fontFamily: 'var(--font-cond)',
                fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em',
                padding: '0.65rem 1.5rem', border: 'none', borderRadius: '3px', cursor: 'pointer',
              }}>
                I&apos;M NOSY
              </button>
            </form>
          </div>

          {/* PREV / NEXT */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }}>
            {hasPrev ? (
              <Link href={`/issue/${issue.id - 1}`} style={{
                fontFamily: 'var(--font-cond)', color: 'var(--yellow)',
                letterSpacing: '0.1em', textDecoration: 'none',
              }}>
                ← ISSUE #{issue.id - 1}
              </Link>
            ) : <span />}

            <Link href="/archive" style={{
              fontFamily: 'var(--font-body)', color: '#555',
              textDecoration: 'underline', fontSize: '0.9rem',
            }}>
              All Issues
            </Link>

            {hasNext ? (
              <Link href={`/issue/${issue.id + 1}`} style={{
                fontFamily: 'var(--font-cond)', color: 'var(--yellow)',
                letterSpacing: '0.1em', textDecoration: 'none',
              }}>
                ISSUE #{issue.id + 1} →
              </Link>
            ) : <span />}
          </div>
        </div>
      </main>

      {/* COME BACK CTA */}
      <section style={{
        background: 'var(--navy)', borderTop: '3px solid var(--yellow)',
        padding: '3rem 2rem', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-cond)', fontSize: '0.8rem', letterSpacing: '0.18em',
          color: 'var(--yellow)', marginBottom: '0.75rem', textTransform: 'uppercase',
        }}>🐔 YOU THINK THIS IS THE ONLY ONE?</p>
        <h2 style={{
          fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          color: '#fff', lineHeight: 1, marginBottom: '1rem',
        }}>THERE ARE HIDDEN GEMS<br />YOU HAVEN&apos;T SEEN YET.</h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.6)',
          maxWidth: '500px', margin: '0 auto 2rem',
        }}>A new jaw-dropper every day. Go dig through the archive — there&apos;s something in there that will wreck you.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/archive" style={{
            fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.9rem',
            letterSpacing: '0.14em', padding: '0.85rem 2rem',
            background: 'var(--yellow)', color: 'var(--black)', textDecoration: 'none', whiteSpace: 'nowrap',
          }}>BROWSE THE ARCHIVE →</Link>
          <Link href="/" style={{
            fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.9rem',
            letterSpacing: '0.14em', padding: '0.85rem 2rem',
            background: 'transparent', color: 'var(--yellow)', textDecoration: 'none',
            border: '1px solid rgba(245,197,24,0.4)', whiteSpace: 'nowrap',
          }}>TODAY&apos;S PICK →</Link>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Rubberneck.ai</span>
        <Link href="/archive">Archive</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/unsubscribe">Unsubscribe</Link>
      </footer>
    </>
  )
}
