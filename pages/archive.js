import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getAllPastIssues } from '../data/issues'

export async function getStaticProps() {
  const issues = getAllPastIssues()
  return { props: { issues }, revalidate: 3600 }
}

export default function ArchivePage({ issues }) {
  const [hovered, setHovered] = useState(null)
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

      {/* CHICKEN */}
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
        gap: '1rem',
      }}>

        {/* LEFT — chicken + TODAY'S PICK */}
        <Link href="/" onClick={squeak} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          textDecoration: 'none', flexShrink: 0,
        }}>
          <img src="/assets/favicon.png" alt="" style={{ height: '32px', width: '32px', objectFit: 'contain' }} />
          <span style={{
            fontFamily: 'var(--font-cond)', fontWeight: 700,
            fontSize: '0.85rem', letterSpacing: '0.1em',
            color: 'var(--yellow)', whiteSpace: 'nowrap',
          }}>
            TODAY'S PICK
          </span>
        </Link>

        {/* CENTER */}
        <div style={{
          fontFamily: 'var(--font-cond)', fontWeight: 700,
          fontSize: '0.75rem', letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.25)', textAlign: 'center', flex: 1,
        }}>
          RUBBERNECK.AI
        </div>

        {/* RIGHT — mute + archive label */}
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
            fontFamily: 'var(--font-cond)', fontWeight: 700,
            fontSize: '0.85rem', letterSpacing: '0.1em',
            color: 'var(--yellow)', border: '1px solid rgba(245,197,24,0.4)',
            padding: '0.3rem 0.75rem', borderRadius: '2px',
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
          <div>
            <img src="/assets/logo.png" alt="Rubberneck.ai"
              style={{ width: '100%', maxWidth: '500px', height: 'auto', display: 'block', cursor: 'pointer' }}
              onMouseEnter={(e) => squeak(e)}
            />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-cond)', fontWeight: 700,
              fontSize: '0.85rem', color: '#444',
              letterSpacing: '0.15em', marginBottom: '0.75rem',
            }}>
              {issues.length} ISSUE{issues.length !== 1 ? 'S' : ''} AND COUNTING
            </div>
            <h1 style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: 'var(--black)', lineHeight: 0.95,
              margin: '0 0 1rem', letterSpacing: '0.02em',
            }}>
              OH, SO YOU<br />JUST CAN'T<br />HELP YOURSELF<br />BEING NOSY, HUH?
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: '#333', lineHeight: 1.6, margin: 0,
            }}>
              Every site we've ever rubbernecked. One per day. Zero filler. Go ahead — dig through them all.
            </p>
          </div>
        </div>
      </div>

      {/* ISSUE LIST */}
      <main style={{ background: 'var(--navy)', minHeight: '60vh' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--pad) 5rem' }}>
          {issues.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', color: '#555', padding: '3rem 0' }}>
              Just launched. Check back tomorrow.
            </p>
          ) : issues.map((issue) => {
            const formattedDate = new Date(issue.date + 'T00:00:00').toLocaleDateString(
              'en-US', { weekday: 'short', month: 'short', day: 'numeric' }
            )
            const isHovered = hovered === issue.id
            return (
              <Link
                key={issue.id}
                href={`/issue/${issue.id}`}
                onMouseEnter={() => setHovered(issue.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid', gridTemplateColumns: '5rem 1fr auto',
                  alignItems: 'center', gap: '1.5rem',
                  padding: '1.75rem 1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                  background: isHovered ? 'rgba(245,197,24,0.06)' : 'transparent',
                  borderLeft: isHovered ? '4px solid var(--yellow)' : '4px solid transparent',
                  transition: 'all 0.15s',
                  marginLeft: '-1rem', marginRight: '-1rem',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-headline)', fontSize: '2.5rem',
                  color: 'var(--yellow)', lineHeight: 1, textAlign: 'center',
                }}>
                  {issue.id}
                </span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                    color: '#F5F5F0', letterSpacing: '0.03em',
                    lineHeight: 1.05, marginBottom: '0.35rem',
                  }}>
                    {issue.site.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-cond)', fontSize: '0.95rem',
                    color: 'rgba(245,240,232,0.65)', letterSpacing: '0.03em',
                  }}>
                    {issue.site.vibe}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-cond)', fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', letterSpacing: '0.05em',
                  }}>
                    {formattedDate}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-cond)', fontWeight: 700,
                    fontSize: '0.85rem',
                    color: isHovered ? 'var(--yellow)' : 'rgba(245,197,24,0.45)',
                    letterSpacing: '0.12em', transition: 'color 0.15s', whiteSpace: 'nowrap',
                  }}>
                    TAKE A NOSER →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      {/* BOTTOM CTA */}
      <div style={{ background: 'var(--yellow)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: 'var(--black)', marginBottom: '0.5rem',
        }}>
          DON'T MISS TOMORROW'S SITE.
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
            flex: 1, padding: '0.75rem 1rem',
            border: '2px solid var(--black)', borderRight: 'none',
            borderRadius: '2px 0 0 2px', fontFamily: 'var(--font-body)', fontSize: '1rem', outline: 'none',
          }} />
          <button type="submit" style={{
            background: 'var(--black)', color: 'var(--yellow)',
            fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '1rem',
            letterSpacing: '0.1em', padding: '0.75rem 1.5rem',
            border: '2px solid var(--black)', borderRadius: '0 2px 2px 0',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            I'M IN →
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
