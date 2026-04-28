import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import Navbar from '../Components/Navbar'
import { getTodaysIssue } from '../data/issues'

function getTodayString() {
  const d = new Date()
  const days   = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
  const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
                  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }

function RubberneckChicken({ pos, active }) {
  if (!pos) return null
  const fromLeft = pos.side === 'left'
  return (
    <img src="/assets/favicon.png" alt="" style={{
      position: 'fixed', zIndex: 9999, pointerEvents: 'none',
      width: '80px', height: '80px', objectFit: 'contain',
      filter: 'drop-shadow(3px 4px 8px rgba(0,0,0,0.35))',
      top: pos.y - 40,
      left:  fromLeft ? (active ? '0px' : '-80px') : 'auto',
      right: fromLeft ? 'auto' : (active ? '0px' : '-80px'),
      transform: fromLeft ? 'scaleX(1)' : 'scaleX(-1)',
      transition: active
        ? 'left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), right 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease'
        : 'left 0.35s ease-in, right 0.35s ease-in, opacity 0.25s ease',
      opacity: active ? 1 : 0,
    }} />
  )
}

function EmailForm({ inputClass, btnClass, placeholder, onAnyClick }) {
  const [value,  setValue]  = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = useCallback(async (e) => {
    if (onAnyClick) onAnyClick(e)
    if (!isValidEmail(value)) { setStatus('error'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setValue('')
      if (onAnyClick) onAnyClick({ clientX: window.innerWidth / 2, clientY: 60 })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [value, onAnyClick])

  if (status === 'success') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: '#2a7a2a', color: '#fff',
        padding: '0.4rem 1rem', borderRadius: '2px',
        fontFamily: 'var(--font-cond)', fontWeight: 700,
        fontSize: '0.85rem', letterSpacing: '0.08em', whiteSpace: 'nowrap',
      }}>
        🐔 YOU&apos;RE IN! SEE YOU TOMORROW.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      <input
        className={inputClass} type="email"
        placeholder={
          status === 'error'   ? 'Need a real email! 👀' :
          status === 'loading' ? 'Adding you...' : placeholder
        }
        value={value}
        onChange={e => { setValue(e.target.value); setStatus('idle') }}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e) }}
        disabled={status === 'loading'}
        style={status === 'error' ? { borderColor: 'var(--red)' } : {}}
      />
      <button className={btnClass} onClick={handleSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '...' : "I'M IN →"}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Render markdown-lite body: **bold**, *italic*, newlines → <p>s
// ─────────────────────────────────────────────────────────────────
function renderBody(bodyText) {
  if (!bodyText) return null
  return bodyText.trim().split(/\n\n+/).map((para, i) => {
    // Parse **bold** and *italic* inline
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

export async function getServerSideProps() {
  const { issue, isLatest } = getTodaysIssue()
  return {
    props: { initialIssue: issue, initialIsLatest: isLatest },
  }
}

export default function Home({ initialIssue, initialIsLatest }) {
  const squeakRef     = useRef(null)
  const [muted,       setMuted]       = useState(false)
  const [chickPos,    setChickPos]    = useState(null)
  const [chickActive, setChickActive] = useState(false)
  const [subCount,    setSubCount]    = useState(null)
  const [issue,       setIssue]       = useState(initialIssue)
  const [isLatest,    setIsLatest]    = useState(initialIsLatest)
  const timerRef = useRef(null)

  useEffect(() => {
    squeakRef.current = new Audio('/assets/squeak.wav')
    squeakRef.current.preload = 'auto'
  }, [])

  useEffect(() => {
    fetch('/api/subscribers')
      .then(r => r.json())
      .then(d => setSubCount(d.count))
      .catch(() => {})
  }, [])

  const handleAnyClick = useCallback((e) => {
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

  const handleMuteToggle = (e) => { setMuted(m => !m); handleAnyClick(e) }

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.1 })
    els.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 0.07}s`; obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>Rubberneck.ai — Websites That Grab You By The Eyeballs.</title>
        <meta name="description" content="One jaw-dropping website, delivered daily. You won't look away." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/favicon.png" /><meta property="og:title" content="Rubberneck.ai — Websites That Grab You By The Eyeballs." /><meta property="og:description" content="One jaw-dropping site, every day. People will stare. You're welcome." /><meta property="og:image" content="https://rubberneck.ai/assets/og-image.jpg" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:url" content="https://rubberneck.ai" /><meta property="og:type" content="website" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://rubberneck.ai/assets/og-image.jpg" />
      </Head>

      <RubberneckChicken pos={chickPos} active={chickActive} />

      <Navbar onSqueak={handleAnyClick} />

      {/* ── HERO — yellow ── */}
      <section className="hero" style={{ background: 'var(--yellow)' }}>
        <div className="hero__lockup">
          <Image
            className="hero__logo" src="/assets/logo.png"
            alt="Rubberneck.ai — Websites that grab you by the eyeballs. You won't look away."
            width={900} height={400} priority
            style={{ width: 'clamp(280px, 72vw, 900px)', height: 'auto' }}
          />
        </div>
      </section>

      {/* ── STALE BANNER — shown when today has no scheduled issue ── */}
      {!isLatest && issue && (
        <div style={{
          background: 'var(--red)', color: '#fff',
          textAlign: 'center', padding: '0.55rem 1rem',
          fontFamily: 'var(--font-cond)', fontSize: '0.8rem',
          letterSpacing: '0.1em',
        }}>
          🐔 TODAY&apos;S ISSUE IS LOADING — SHOWING ISSUE #{issue.id} FOR NOW
        </div>
      )}

      {/* ── TODAY'S PICK ── */}
      <section className="pick" style={{ background: 'var(--navy)' }}>
        <div className="pick__inner">
          <div className="pick__left reveal">
            <h2 className="pick__headline" style={{ color: 'var(--white)' }}>
              {issue ? issue.headline : '\u00A0'}
            </h2>
            <a className="pick__url" href={issue?.site?.url ?? '#'} target="_blank" rel="noopener noreferrer"
              onClick={handleAnyClick}>
              {issue?.site?.url?.replace(/^https?:\/\//, '') ?? ''}
            </a>
            <div className="pick__browser">
              <div className="pick__browser-bar">
                <span className="pick__browser-dot pick__browser-dot--red" />
                <span className="pick__browser-dot pick__browser-dot--yellow" />
                <span className="pick__browser-dot pick__browser-dot--green" />
                <span className="pick__browser-address">
                  {issue?.site?.url?.replace(/^https?:\/\//, '') ?? ''}
                </span>
              </div>
              <a href={issue?.site?.url ?? '#'} target="_blank" rel="noopener noreferrer"
                onClick={handleAnyClick} className="pick__screenshot-link">
                {issue?.site?.url && (
                  <img
                    className="pick__screenshot"
                    src={issue?.site?.screenshot || `https://api.microlink.io/?url=${encodeURIComponent(issue.site.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                    alt={`Screenshot of ${issue.site.name}`}
                  />
                )}
              </a>
            </div>
          </div>

          <div className="pick__right reveal">
            {issue ? renderBody(issue.body) : null}
            <hr className="pick__rule" />
            <p className="pick__ready" style={{ color: 'var(--red)' }}>READY? HERE IT IS.</p>
            <a className="pick__cta" href={issue?.site?.url ?? '#'} target="_blank" rel="noopener noreferrer" onClick={handleAnyClick}>
              GO THERE →
            </a>
            <p className="pick__disclaimer" style={{ color: 'rgba(245,240,232,0.4)' }}>
              <em>If you click and buy something, we may earn a small cut. If it&apos;s boring, we don&apos;t feature it.</em>
            </p>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bottom-cta">
        <Image
          className="bottom-cta__logo" src="/assets/logo.png" alt="Rubberneck.ai"
          width={380} height={170}
          style={{ width: 'clamp(180px, 30vw, 380px)', height: 'auto' }}
          aria-hidden="true"
        />
        <div className="bottom-cta__copy">
          <h2 className="bottom-cta__headline">GET TOMORROW&apos;S<br />JAW-DROPPER.</h2>
          <p className="bottom-cta__sub">One site. Every day. Free. In your inbox. No garbage. Unsubscribe whenever.</p>
          <EmailForm
            inputClass="bottom-cta__email" btnClass="bottom-cta__btn"
            placeholder="your@email.com" onAnyClick={handleAnyClick}
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span>© {new Date().getFullYear()} Rubberneck.ai</span>
        <span>Made with unhinged energy.</span>
        <a href="/archive">Archive</a>
        <a href="/faq">FAQ</a>
        <a href="/privacy">Privacy</a>
        <a href="/unsubscribe">Unsubscribe</a>
      </footer>
    </>
  )
}
