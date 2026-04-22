import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import Navbar from '../Components/Navbar'

// ─────────────────────────────────────────────────────────────────
// DAILY CONTENT — update this each day
// ─────────────────────────────────────────────────────────────────
const TODAY = {
  issueNumber: 2,
  headline:    'EVERY GAME YOU LOVED AS A KID. FREE. IN YOUR BROWSER. RIGHT NOW.',
  siteUrl:     'https://classicgamezone.com',
  siteDisplay: 'classicgamezone.com',
  body: [
    {
      text: "You remember the exact moment. The cartridge. The startup sound. The way the controller felt. Super Mario Bros. Contra. Zelda. Street Fighter. Metal Slug. Games you played until your thumbs went numb and your mom yelled at you three times to come to dinner.",
      italic: false,
    },
    {
      text: "They're all here. Free. In your browser. Right now. Classic Game Zone has over 2,000 retro games — NES, SNES, Nintendo 64, PlayStation, Game Boy, Sega Genesis, Arcade, and more. No download. No account. No $70 subscription.",
      bold: true, italic: false,
    },
    {
      text: "Pokémon Emerald. Ocarina of Time. Castlevania. Contra. Metal Slug. Every console you ever owned and a few you couldn't afford.",
      italic: false,
    },
    {
      text: "This is the internet doing exactly what it was supposed to do — preserving something wonderful and giving it to everyone for free. Go lose an afternoon. You've earned it.",
      italic: true,
    },
  ],
}

const ARCHIVE = []

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

export default function Home() {
  const squeakRef     = useRef(null)
  const [muted,       setMuted]       = useState(false)
  const [chickPos,    setChickPos]    = useState(null)
  const [chickActive, setChickActive] = useState(false)
  const [subCount,    setSubCount]    = useState(null)
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
        <link rel="icon" href="/assets/favicon.png" />
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

      {/* ── TODAY'S PICK ── */}
      <section className="pick" style={{ background: 'var(--navy)' }}>
        <div className="pick__inner">
          <div className="pick__left reveal">
            <h2 className="pick__headline" style={{ color: 'var(--white)' }}>{TODAY.headline}</h2>
            <a className="pick__url" href={TODAY.siteUrl} target="_blank" rel="noopener noreferrer"
              onClick={handleAnyClick}>
              {TODAY.siteDisplay}
            </a>
            <div className="pick__browser">
              <div className="pick__browser-bar">
                <span className="pick__browser-dot pick__browser-dot--red" />
                <span className="pick__browser-dot pick__browser-dot--yellow" />
                <span className="pick__browser-dot pick__browser-dot--green" />
                <span className="pick__browser-address">{TODAY.siteDisplay}</span>
              </div>
              <a href={TODAY.siteUrl} target="_blank" rel="noopener noreferrer"
                onClick={handleAnyClick} className="pick__screenshot-link">
                <img
                  className="pick__screenshot"
                  src={`https://api.microlink.io/?url=${encodeURIComponent(TODAY.siteUrl)}&screenshot=true&meta=false&embed=screenshot.url`}
                  alt={`Screenshot of ${TODAY.siteDisplay}`}
                />
              </a>
            </div>
          </div>

          <div className="pick__right reveal">
            {TODAY.body.map((block, i) => (
              <p key={i}
                className={`pick__body${block.italic ? ' pick__body--italic' : ''}`}
                style={{ ...(block.bold ? { fontWeight: 500 } : {}), color: 'rgba(245,240,232,0.85)' }}>
                {block.text}
              </p>
            ))}
            <hr className="pick__rule" />
            <p className="pick__ready" style={{ color: 'var(--red)' }}>READY? HERE IT IS.</p>
            <a className="pick__cta" href={TODAY.siteUrl} target="_blank" rel="noopener noreferrer" onClick={handleAnyClick}>
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
          <h2 className="bottom-cta__headline">DON&apos;T MISS<br />TOMORROW&apos;S SITE.</h2>
          <p className="bottom-cta__sub">Free. One email. Unsubscribe whenever. No hard feelings.</p>
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
