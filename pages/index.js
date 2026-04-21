import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────
// DAILY CONTENT — edit this object each morning, nothing else
// ─────────────────────────────────────────────────────────────
const TODAY = {
  issueNumber: 1,
  headline:    'THE SITE THAT KILLS EVERY PAYWALL. LEGALLY.',
  siteUrl:     'https://archivebuttons.com',
  siteDisplay: 'archivebuttons.com',
  screenshot:  '/assets/todays-pick.jpg',
  body: [
    {
      text: "You click a link. You want to read the article. Instead you get a popup demanding your credit card, your email, your firstborn child, and a lifetime subscription to something you'll forget to cancel.",
      italic: false,
    },
    {
      text: 'One person – nobody knows who – decided that was stupid. No investors. No team. No LinkedIn post about their founder journey. Just a simple tool: every legal way around every paywall, all in one place.',
      bold: true,
      italic: false,
    },
    {
      text: 'Paste link. Click button. Read article. Free. Every time. Hundreds of sites.',
      italic: false,
    },
    {
      text: "374,000 people used it last month. The builder still hasn't told anyone their name. That's either genius, deep humility, or they're hiding from Rupert Murdoch. Probably all three.",
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

// ─────────────────────────────────────────────────────────────
// RUBBERNECK CHICKEN — peeks in from the side near the click
// ─────────────────────────────────────────────────────────────
function RubberneckChicken({ pos }) {
  if (!pos) return null
  return (
    <img
      src="/assets/favicon.png"
      alt=""
      className={`rubberneck rubberneck--from-${pos.side}`}
      style={{
        top:  pos.y - 35,
        left: pos.side === 'left' ? pos.x - 10 : 'auto',
        right: pos.side === 'right' ? window.innerWidth - pos.x - 10 : 'auto',
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// EMAIL FORM
// ─────────────────────────────────────────────────────────────
function EmailForm({ inputClass, btnClass, placeholder, onAnyClick }) {
  const [value,  setValue]  = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = useCallback((e) => {
    if (onAnyClick) onAnyClick(e)
    if (!isValidEmail(value)) { setStatus('error'); return }
    console.log('Subscribe:', value)
    setStatus('success')
    setValue('')
    setTimeout(() => setStatus('idle'), 3500)
  }, [value, onAnyClick])

  return (
    <div className="bottom-cta__form">
      <input
        className={inputClass}
        type="email"
        placeholder={status === 'error' ? 'Need a real email! 👀' : status === 'success' ? "✓ You're in!" : placeholder}
        value={value}
        onChange={e => { setValue(e.target.value); setStatus('idle') }}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e) }}
        disabled={status === 'success'}
        style={status === 'error' ? { borderColor: 'var(--red)' } : {}}
      />
      <button
        className={btnClass}
        onClick={handleSubmit}
        disabled={status === 'success'}
        style={status === 'success' ? { background: '#2a7a2a', borderColor: '#2a7a2a' } : {}}
      >
        {status === 'success' ? "YOU'RE IN" : "I'M IN →"}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function Home() {
  const squeakRef   = useRef(null)
  const [muted,     setMuted]     = useState(false)
  const [chickPos,  setChickPos]  = useState(null)

  useEffect(() => {
    squeakRef.current = new Audio('/assets/squeak.wav')
    squeakRef.current.preload = 'auto'
  }, [])

  const handleAnyClick = useCallback((e) => {
    // Play squeak
    if (!muted && squeakRef.current) {
      squeakRef.current.currentTime = 0
      squeakRef.current.play().catch(() => {})
    }

    // Figure out where the click happened, peek from opposite side
    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2
    const side = x < window.innerWidth / 2 ? 'right' : 'left'

    setChickPos({ x, y, side })
    setTimeout(() => setChickPos(null), 950)
  }, [muted])

  const handleMuteToggle = (e) => {
    setMuted(m => !m)
    handleAnyClick(e)
  }

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'))
      return
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.1 })
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.07}s`
      obs.observe(el)
    })
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

      {/* Rubbernecking chicken — appears near any click */}
      <RubberneckChicken pos={chickPos} />

      {/* ── NAVBAR ── */}
      <header className="navbar">
        <div className="navbar__date">{getTodayString()}</div>

        <button
          className="navbar__mute"
          onClick={handleMuteToggle}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          <span>{muted ? '🔇 UNMUTE' : '🔊 MUTE'}</span>
        </button>

        <div className="navbar__cta">
          <input
            className="navbar__email"
            type="email"
            placeholder="Drop your email. Get tomorrow's Rubberneck."
            aria-label="Email signup"
            onKeyDown={e => {
              if (e.key === 'Enter' && isValidEmail(e.target.value)) {
                handleAnyClick(e)
                console.log('Subscribe:', e.target.value)
                e.target.value = ''
              }
            }}
          />
          <button className="navbar__submit" onClick={handleAnyClick}>I'M IN →</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__lockup">
          <Image
            className="hero__logo"
            src="/assets/logo.png"
            alt="Rubberneck.ai — Websites that grab you by the eyeballs. You won't look away."
            width={900}
            height={400}
            priority
            style={{ width: 'clamp(280px, 72vw, 900px)', height: 'auto' }}
          />
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="intro">
        <div className="intro__left">
          <h2 className="intro__headline">THE SITE THAT<br />KILLS EVERY<br />PAYWALL.</h2>
        </div>
        <div className="intro__right">
          <p className="intro__kicker">SOMEONE BROKE THE INTERNET&apos;S MOST ANNOYING BUSINESS MODEL. ANONYMOUSLY.</p>
          <p className="intro__body">You click a link. You want to read the article. Instead you get a popup. A subscribe wall. A cookie banner the size of a billboard. Rubberneck finds the wild corners of the web where none of that exists — and drops one in your inbox every single day.</p>
        </div>
      </section>

      {/* ── TODAY'S PICK ── */}
      <section className="pick">
        <div className="pick__inner">
          <div className="pick__left reveal">
            <h2 className="pick__headline">{TODAY.headline}</h2>
            <a className="pick__url" href={TODAY.siteUrl} target="_blank" rel="noopener noreferrer" onClick={handleAnyClick}>
              {TODAY.siteDisplay}
            </a>
            <div className="pick__browser">
              <div className="pick__browser-bar">
                <span className="pick__browser-dot pick__browser-dot--red" />
                <span className="pick__browser-dot pick__browser-dot--yellow" />
                <span className="pick__browser-dot pick__browser-dot--green" />
                <span className="pick__browser-address">{TODAY.siteDisplay}</span>
              </div>
              <img className="pick__screenshot" src={TODAY.screenshot} alt={`Screenshot of ${TODAY.siteDisplay}`} />
            </div>
          </div>

          <div className="pick__right reveal">
            {TODAY.body.map((block, i) => (
              <p key={i} className={`pick__body${block.italic ? ' pick__body--italic' : ''}`} style={block.bold ? { fontWeight: 500 } : {}}>
                {block.text}
              </p>
            ))}
            <hr className="pick__rule" />
            <p className="pick__ready">READY? HERE IT IS.</p>
            <a className="pick__cta" href={TODAY.siteUrl} target="_blank" rel="noopener noreferrer" onClick={handleAnyClick}>
              GO THERE →
            </a>
            <p className="pick__disclaimer"><em>If you click and buy something, we may get a cut. If it&apos;s boring, we don&apos;t feature it.</em></p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how">
        <h2 className="how__title">HOW THIS WORKS</h2>
        <div className="how__steps">
          {[
            'Every morning, one website lands in your inbox. No listicles. No sponsored garbage.',
            'Hand-picked by a human with too much time and zero tolerance for boring.',
            'You click. You stare. You lose 45 minutes. You come back tomorrow.',
          ].map((text, i) => (
            <div key={i} className="how__step reveal">
              <span className="how__num">0{i + 1}</span>
              <p className="how__text">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARCHIVE ── */}
      {ARCHIVE.length > 0 && (
        <section className="archive">
          <div className="archive__header">
            <h2 className="archive__title">PAST PICKS</h2>
            <a className="archive__all" href="#">SEE ALL ISSUES →</a>
          </div>
          <div className="archive__grid">
            {ARCHIVE.map((item) => (
              <div key={item.issue} className="archive__card reveal">
                <img src={item.thumb} alt={`Issue ${item.issue}`} className="archive__thumb" />
                <div className="archive__meta">
                  <span className="archive__issue">#{item.issue}</span>
                  <span className="archive__site">{item.site}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── BOTTOM CTA ── */}
      <section className="bottom-cta">
        <Image
          className="bottom-cta__logo"
          src="/assets/logo.png"
          alt="Rubberneck.ai"
          width={380}
          height={170}
          style={{ width: 'clamp(180px, 30vw, 380px)', height: 'auto' }}
          aria-hidden="true"
        />
        <div className="bottom-cta__copy">
          <h2 className="bottom-cta__headline">DON&apos;T MISS<br />TOMORROW&apos;S SITE.</h2>
          <p className="bottom-cta__sub">Free. One email. Unsubscribe whenever. No hard feelings.</p>
          <EmailForm
            inputClass="bottom-cta__email"
            btnClass="bottom-cta__btn"
            placeholder="your@email.com"
            onAnyClick={handleAnyClick}
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span>© {new Date().getFullYear()} Rubberneck.ai</span>
        <span>Made with unhinged energy.</span>
        <a href="#">Privacy</a>
        <a href="#">Unsubscribe</a>
      </footer>
    </>
  )
}
