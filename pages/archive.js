import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getAllPastIssues } from '../data/issues'

export async function getStaticProps() {
  const issues = getAllPastIssues()
  return { props: { issues }, revalidate: 3600 }
}

export default function ArchivePage({ issues }) {
  const squeakRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [chickPos, setChickPos] = useState(null)
  const [chickActive, setChickActive] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    squeakRef.current = new Audio('/assets/squeak.wav')
    squeakRef.current.preload = 'auto'
  }, [])

  const squeak = useCallback((e) => {
    if (!muted && squeakRef.current) {
      squeakRef.current.currentTime = 0
      squeakRef.current.play().catch(() => {})
    }
    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2
    const side = x < window.innerWidth / 2 ? 'left' : 'right'
    if (timerRef.current) clearTimeout(timerRef.current)
    setChickPos({ x, y, side })
    setChickActive(true)
    timerRef.current = setTimeout(() => setChickActive(false), 900)
  }, [muted])

  return (
    <>
      <Head>
        <title>Archive — Rubberneck.ai</title>
        <meta name="description" content="Every jaw-dropping site we've ever found. One per day. Zero filler." />
        <link rel="icon" href="/assets/favicon.png" />
      </Head>

      <style>{`
        .archive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.75rem;
          padding: 3rem var(--pad) 5rem;
          max-width: var(--max-w);
          margin: 0 auto;
        }
        .arc-card {
          background: #12152a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          cursor: pointer;
        }
        .arc-card:hover {
          transform: translateY(-5px);
          border-color: var(--yellow);
          box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px var(--yellow);
        }
        .arc-card__chrome {
          background: #1a1d2e;
          padding: 0.45rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .arc-card__dots { display: flex; gap: 4px; flex-shrink: 0; }
        .arc-card__dot { width: 8px; height: 8px; border-radius: 50%; }
        .arc-card__dot--r { background: #ff5f57; }
        .arc-card__dot--y { background: #febc2e; }
        .arc-card__dot--g { background: #28c840; }
        .arc-card__url {
          font-family: var(--font-cond);
          font-size: 0.68rem;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }
        .arc-card__shot-wrap {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
          background: #0a0c1a;
          flex-shrink: 0;
          overflow: hidden;
        }
        .arc-card__shot {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          display: block;
          transition: transform 0.35s ease;
        }
        .arc-card:hover .arc-card__shot { transform: scale(1.03); }
        .arc-card__category {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          background: rgba(0,0,0,0.72);
          color: var(--yellow);
          font-family: var(--font-cond);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
          backdrop-filter: blur(4px);
        }
        .arc-card__body {
          padding: 1rem 1.2rem 1.2rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 0.4rem;
        }
        .arc-card__issue-num {
          font-family: var(--font-cond);
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          color: rgba(245,197,24,0.55);
        }
        .arc-card__headline {
          font-family: var(--font-headline);
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: #F5F0E8;
          line-height: 1.1;
          letter-spacing: 0.02em;
          margin: 0;
        }
        .arc-card__vibe {
          font-family: var(--font-cond);
          font-size: 0.8rem;
          color: rgba(245,240,232,0.45);
          letter-spacing: 0.03em;
          line-height: 1.4;
          flex: 1;
        }
        .arc-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.7rem;
          padding-top: 0.7rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .arc-card__date {
          font-family: var(--font-cond);
          font-size: 0.68rem;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.07em;
        }
        .arc-card__cta {
          font-family: var(--font-cond);
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          color: rgba(245,197,24,0.4);
          transition: color 0.15s;
        }
        .arc-card:hover .arc-card__cta { color: var(--yellow); }

        @media (max-width: 600px) {
          .archive-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
            padding: 2rem 1rem 4rem;
          }
        }
      `}</style>

      {/* ROVING CHICKEN */}
      {chickPos && (
        <img src="/assets/favicon.png" alt="" style={{
          position: 'fixed', zIndex: 9999, pointerEvents: 'none',
          width: '80px', height: '80px', objectFit: 'contain',
          filter: 'drop-shadow(3px 4px 8px rgba(0,0,0,0.35))',
          top: chickPos.y - 40,
          left: chickPos.side === 'left' ? (chickActive ? '0px' : '-80px') : 'auto',
          right: chickPos.side === 'left' ? 'auto' : (chickActive ? '0px' : '-80px'),
          transform: chickPos.side === 'left' ? 'scaleX(1)' : 'scaleX(-1)',
          transition: chickActive
            ? 'left 0.2s cubic-bezier(0.34,1.56,0.64,1), right 0.2s cubic-bezier(0.34,1.56,0.64,1)'
            : 'left 0.35s ease-in, right 0.35s ease-in',
          opacity: chickActive ? 1 : 0,
        }} />
      )}

      {/* NAVBAR */}
      <header style={{
        background: '#0d0d0d', borderBottom: '3px solid var(--yellow)',
        padding: '0 1.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '64px',
        position: 'sticky', top: 0, zIndex: 100, gap: '1rem',
      }}>
        <Link href="/" onClick={squeak} style={{
          fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.85rem',
          letterSpacing: '0.1em', color: 'var(--yellow)', textDecoration: 'none',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          TODAY&apos;S PICK
        </Link>
        <div style={{
          fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.75rem',
          letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', textAlign: 'center', flex: 1,
        }}>
          RUBBERNECK.AI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button onClick={(e) => { setMuted(m => !m); squeak(e) }} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-cond)',
            fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em',
            padding: '0.3rem 0.65rem', borderRadius: '2px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {muted ? '🔇 UNMUTE' : '🔊 MUTE'}
          </button>
          <span style={{
            fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.85rem',
            letterSpacing: '0.1em', color: 'var(--yellow)',
            border: '1px solid rgba(245,197,24,0.4)', padding: '0.3rem 0.75rem', borderRadius: '2px',
          }}>
            ARCHIVE
          </span>
        </div>
      </header>

      {/* YELLOW HERO */}
      <div style={{ background: 'var(--yellow)', padding: '3rem var(--pad)' }}>
        <div style={{
          maxWidth: 'var(--max-w)', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '2rem', alignItems: 'center',
        }}>
          <img src="/assets/logo.png" alt="Rubberneck.ai"
            style={{ width: '100%', maxWidth: '500px', height: 'auto', display: 'block', cursor: 'pointer' }}
            onMouseEnter={squeak}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.85rem',
              color: '#444', letterSpacing: '0.15em', marginBottom: '0.75rem',
            }}>
              {issues.length} ISSUE{issues.length !== 1 ? 'S' : ''} AND COUNTING
            </div>
            <h1 style={{
              fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: 'var(--black)', lineHeight: 0.95, margin: '0 0 1rem', letterSpacing: '0.02em',
            }}>
              OH, SO YOU<br />JUST CAN&apos;T<br />HELP YOURSELF<br />BEING NOSY, HUH?
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#333', lineHeight: 1.6, margin: 0 }}>
              Every site we&apos;ve ever rubbernecked. One per day. Zero filler. Go ahead — dig through them all.
            </p>
          </div>
        </div>
      </div>

      {/* CARD GRID */}
      <main style={{ background: 'var(--navy)', minHeight: '60vh' }}>
        {issues.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', color: '#555', padding: '4rem var(--pad)', textAlign: 'center' }}>
            Just launched. Check back tomorrow.
          </p>
        ) : (
          <div className="archive-grid">
            {issues.map((issue) => {
              const formattedDate = new Date(issue.date + 'T00:00:00').toLocaleDateString(
                'en-US', { weekday: 'short', month: 'short', day: 'numeric' }
              )
              const screenshot = issue.site.screenshot ||
                `https://api.microlink.io/?url=${encodeURIComponent(issue.site.url)}&screenshot=true&meta=false&embed=screenshot.url`
              const displayUrl = issue.site.url?.replace(/^https?:\/\//, '') ?? issue.site.name

              return (
                <Link key={issue.id} href={`/issue/${issue.id}`} className="arc-card">
                  {/* Browser chrome */}
                  <div className="arc-card__chrome">
                    <div className="arc-card__dots">
                      <span className="arc-card__dot arc-card__dot--r" />
                      <span className="arc-card__dot arc-card__dot--y" />
                      <span className="arc-card__dot arc-card__dot--g" />
                    </div>
                    <span className="arc-card__url">{displayUrl}</span>
                  </div>

                  {/* Screenshot */}
                  <div className="arc-card__shot-wrap">
                    <img
                      className="arc-card__shot"
                      src={screenshot}
                      alt={issue.site.name}
                      loading="lazy"
                      onError={(e) => { e.target.style.opacity = '0' }}
                    />
                    {issue.site.category && (
                      <span className="arc-card__category">{issue.site.category.toUpperCase()}</span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="arc-card__body">
                    <div className="arc-card__issue-num">ISSUE #{issue.id}</div>
                    <h2 className="arc-card__headline">{issue.headline}</h2>
                    <p className="arc-card__vibe">{issue.site.vibe}</p>
                    <div className="arc-card__footer">
                      <span className="arc-card__date">{formattedDate}</span>
                      <span className="arc-card__cta">TAKE A NOSER →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* BOTTOM CTA */}
      <div style={{ background: 'var(--yellow)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: 'var(--black)', marginBottom: '0.5rem',
        }}>
          DON&apos;T MISS TOMORROW&apos;S SITE.
        </div>
        <p style={{ fontFamily: 'var(--font-body)', color: '#333', marginBottom: '1.25rem' }}>
          Free. One email. Unsubscribe whenever.
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
        }} style={{ display: 'flex', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <input type="email" name="email" required placeholder="your@email.com" style={{
            flex: 1, padding: '0.75rem 1rem', border: '2px solid var(--black)', borderRight: 'none',
            borderRadius: '2px 0 0 2px', fontFamily: 'var(--font-body)', fontSize: '1rem', outline: 'none',
          }} />
          <button type="submit" style={{
            background: 'var(--black)', color: 'var(--yellow)', fontFamily: 'var(--font-cond)',
            fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', padding: '0.75rem 1.5rem',
            border: '2px solid var(--black)', borderRadius: '0 2px 2px 0', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            I&apos;M IN →
          </button>
        </form>
      </div>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Rubberneck.ai</span>
        <span>Made with unhinged energy.</span>
        <Link href="/faq">FAQ</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/unsubscribe">Unsubscribe</Link>
      </footer>
    </>
  )
}
