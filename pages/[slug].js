import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getIssueBySlug, getAllIssues } from '../data/issues'
import { getNeighbors, getRelatedIssues, SITE_URL } from '../data/helpers'
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
  // Previous / next follow the DATE order of published issues (not issue numbers).
  const { prev, next } = getNeighbors(issue)
  const related = getRelatedIssues(issue, 3)
  return { props: { issue, prev, next, related }, revalidate: 3600 }
}

function renderBody(bodyText) {
  if (!bodyText) return null
  return bodyText.trim().split(/\n\n+/).map((para, i) => {
    const parts = []
    let key = 0
    const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
    let lastIndex = 0
    let match
    while ((match = pattern.exec(para)) !== null) {
      if (match.index > lastIndex) parts.push(<span key={key++}>{para.slice(lastIndex, match.index)}</span>)
      if (match[2]) parts.push(<strong key={key++}>{match[2]}</strong>)
      else if (match[3]) parts.push(<em key={key++}>{match[3]}</em>)
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < para.length) parts.push(<span key={key++}>{para.slice(lastIndex)}</span>)
    return (
      <p key={i} className="pick__body" style={{ color: 'rgba(245,240,232,0.85)' }}>
        {parts}
      </p>
    )
  })
}

export default function SlugIssuePage({ issue, prev, next, related }) {
  const audioRef = useRef(null)
  const [squeaked, setSqueaked] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    audioRef.current = new Audio('/assets/squeak.wav')
    audioRef.current.preload = 'auto'
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.1 })
    els.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 0.07}s`; obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const handleClick = useCallback((e) => {
    if (!muted && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
    setSqueaked(true)
    setTimeout(() => setSqueaked(false), 600)
  }, [muted])

  const ogImage = issue.site.screenshot
    ? `${SITE_URL}${issue.site.screenshot}`
    : `${SITE_URL}/assets/og-image.jpg`
  const pageUrl = `${SITE_URL}/${issue.slug}`

  const formattedDate = new Date(issue.date + 'T00:00:00').toLocaleDateString(
    'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <>
      <Head>
        <title>{issue.site.name} — Rubberneck.ai</title>
        <meta name="description" content={issue.meta_description || `${issue.subheadline} — Rubberneck.ai: Websites that grab you by the eyeballs. You won't look away.`} />
        <meta property="og:title" content={`${issue.headline} — Rubberneck.ai`} />
        <meta property="og:description" content={issue.meta_description || `${issue.subheadline} — Rubberneck.ai: Websites that grab you by the eyeballs. You won't look away.`} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta property="fb:app_id" content="2161573901462001" />
        <link rel="icon" href="/assets/favicon.png" />
      </Head>

      <Navbar />

      {/* HERO */}
      <section className="hero" style={{ background: 'var(--yellow)' }}>
        <div className="hero__lockup">
          <a href="/">
            <Image
              className="hero__logo" src="/assets/logo.png"
              alt="Rubberneck.ai — Websites that grab you by the eyeballs. You won't look away."
              width={900} height={400} priority
              style={{ width: 'clamp(280px, 72vw, 900px)', height: 'auto' }}
            />
          </a>
        </div>
      </section>

      {/* DATE STRIP */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.75rem 1.5rem' }}>
          <span style={{ fontFamily: 'var(--font-cond)', fontSize: '0.8rem', color: 'var(--yellow)', letterSpacing: '0.15em' }}>
            ISSUE #{issue.id} — {formattedDate.toUpperCase()}
          </span>
        </div>
      </div>

      {/* MAIN — two-column pick layout */}
      <section className="pick" style={{ background: 'var(--navy)' }}>
        <div className="pick__inner">
          <div className="pick__header">
            <h1 className="pick__headline" style={{ color: 'var(--white)' }}>
              {issue.headline}
            </h1>
          </div>

          <div className="pick__left reveal">
            <div className="pick__browser">
              <div className="pick__browser-bar">
                <span className="pick__browser-dot pick__browser-dot--red" />
                <span className="pick__browser-dot pick__browser-dot--yellow" />
                <span className="pick__browser-dot pick__browser-dot--green" />
              </div>
              <img
                className="pick__screenshot"
                src={issue.site.screenshot || `https://api.microlink.io/?url=${encodeURIComponent(issue.site.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                alt={`Screenshot of ${issue.site.name}`}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          </div>

          <div className="pick__right reveal">
            {renderBody(issue.body)}
            <hr className="pick__rule" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <p className="pick__ready" style={{ color: 'var(--red)', margin: 0 }}>READY? HERE IT IS.</p>
              <a href="/archive" onClick={handleClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', opacity: 0.85 }}>
                <img src="/assets/favicon.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontStyle: 'italic', color: 'rgba(245,240,232,0.55)' }}>
                  oh, one more thing before you go — word on the street is you missed past Rubbernecks and you&apos;re falling behind. <span style={{ color: 'var(--yellow)', textDecoration: 'underline', fontStyle: 'normal' }}>The archive.</span>
                </span>
              </a>
            </div>
            <a className="pick__cta" href={issue.site.url} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
              {squeaked ? '🐔 GOING THERE →' : 'GO THERE →'}
            </a>
            <p className="pick__disclaimer" style={{ color: 'rgba(245,240,232,0.4)' }}>
              <em>If you click and buy something, we may earn a small cut. If it&apos;s boring, we don&apos;t feature it.</em>
            </p>
            {issue.tags && issue.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
                {issue.tags.map((tag) => (
                  <Link key={tag} href={`/archive?q=${encodeURIComponent(tag)}`} style={{
                    background: 'rgba(255,255,255,0.06)', color: 'rgba(245,240,232,0.6)',
                    fontFamily: 'var(--font-cond)', fontSize: '0.72rem', letterSpacing: '0.08em',
                    padding: '0.25rem 0.7rem', borderRadius: '999px', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.12)', textTransform: 'uppercase',
                  }}>{tag}</Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EMAIL SIGNUP */}
      <section className="bottom-cta">
        <Image className="bottom-cta__logo" src="/assets/logo.png" alt="Rubberneck.ai" width={380} height={170} style={{ width: 'clamp(180px, 30vw, 380px)', height: 'auto' }} aria-hidden="true" />
        <div className="bottom-cta__copy">
          <h2 className="bottom-cta__headline">GET TOMORROW&apos;S<br />JAW-DROPPER.</h2>
          <p className="bottom-cta__sub">One site. Every day. Free. In your inbox. No garbage. Unsubscribe whenever.</p>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const email = e.target.email.value
            await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
            e.target.email.value = "✓ You're in — see you tomorrow"
            e.target.email.disabled = true
            e.target.querySelector('button').style.display = 'none'
            handleClick(e)
          }} style={{ display: 'flex' }}>
            <input type="email" name="email" required placeholder="your@email.com" className="bottom-cta__email" />
            <button type="submit" className="bottom-cta__btn">I&apos;M IN →</button>
          </form>
        </div>
      </section>

      {/* PREV / NEXT — by date, published issues only */}
      <div style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          {prev ? (
            <Link href={`/${prev.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.15rem', maxWidth: '40%' }}>
              <span style={{ fontFamily: 'var(--font-cond)', color: 'var(--yellow)', letterSpacing: '0.1em', fontSize: '0.8rem' }}>← PREVIOUS</span>
              <span style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.7)', fontSize: '0.9rem' }}>{prev.site.name}</span>
            </Link>
          ) : <span />}
          <Link href="/archive" style={{ fontFamily: 'var(--font-body)', color: '#555', textDecoration: 'underline', fontSize: '0.9rem' }}>All Issues</Link>
          {next ? (
            <Link href={`/${next.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.15rem', alignItems: 'flex-end', textAlign: 'right', maxWidth: '40%' }}>
              <span style={{ fontFamily: 'var(--font-cond)', color: 'var(--yellow)', letterSpacing: '0.1em', fontSize: '0.8rem' }}>NEXT →</span>
              <span style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.7)', fontSize: '0.9rem' }}>{next.site.name}</span>
            </Link>
          ) : <span />}
        </div>
      </div>

      {/* MORE LIKE THIS */}
      {related && related.length > 0 && (
        <section style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '2.5rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-cond)', fontSize: '0.8rem', letterSpacing: '0.18em', color: 'var(--yellow)', marginBottom: '1rem' }}>MORE LIKE THIS</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/${r.slug}`} style={{
                  background: '#12152a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px',
                  padding: '1rem 1.2rem', textDecoration: 'none', display: 'block',
                }}>
                  <div style={{ fontFamily: 'var(--font-cond)', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(245,197,24,0.6)' }}>{(r.site.category || '').toUpperCase()}</div>
                  <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.15rem', color: '#F5F0E8', lineHeight: 1.1, margin: '0.3rem 0' }}>{r.headline}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(245,240,232,0.5)' }}>{r.site.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ARCHIVE CTA */}
      <section style={{ background: 'var(--navy)', borderTop: '3px solid var(--yellow)', padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-cond)', fontSize: '0.8rem', letterSpacing: '0.18em', color: 'var(--yellow)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>🐔 YOU THINK THIS IS THE ONLY ONE?</p>
        <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', lineHeight: 1, marginBottom: '1rem' }}>THERE ARE HIDDEN GEMS<br />YOU HAVEN&apos;T SEEN YET.</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 2rem' }}>A new jaw-dropper every day. Go dig through the archive — there&apos;s something in there that will wreck you.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/archive" style={{ fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.14em', padding: '0.85rem 2rem', background: 'var(--yellow)', color: 'var(--black)', textDecoration: 'none', whiteSpace: 'nowrap' }}>BROWSE THE ARCHIVE →</Link>
          <Link href="/" style={{ fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.14em', padding: '0.85rem 2rem', background: 'transparent', color: 'var(--yellow)', textDecoration: 'none', border: '1px solid rgba(245,197,24,0.4)', whiteSpace: 'nowrap' }}>TODAY&apos;S PICK →</Link>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Rubberneck.ai</span>
        <Link href="/archive">Archive</Link>
        <Link href="/help">Get Help</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/unsubscribe">Unsubscribe</Link>
      </footer>
    </>
  )
}
