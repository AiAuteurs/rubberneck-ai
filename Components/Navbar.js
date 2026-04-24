// components/Navbar.js
// LEFT: TODAY'S PICK
// RIGHT: JOIN THE FOUNDING FLOCK · MUTE · ARCHIVE

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

function NavbarEmailForm() {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = useCallback(async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) { setStatus('error'); return }
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
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [value])

  if (status === 'success') {
    return (
      <div style={{
        fontFamily: 'var(--font-cond)', fontWeight: 700,
        fontSize: '0.75rem', letterSpacing: '0.08em',
        color: '#2a7a2a', whiteSpace: 'nowrap',
      }}>
        🐔 YOU&apos;RE IN!
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', marginTop: '0.25rem' }}>
      <input
        type="email"
        placeholder={status === 'error' ? 'Need a real email!' : 'Drop your email. Get torn.'}
        value={value}
        onChange={e => { setValue(e.target.value); setStatus('idle') }}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
        disabled={status === 'loading'}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          padding: '0.3rem 0.6rem',
          background: 'rgba(255,255,255,0.08)',
          border: status === 'error' ? '1px solid var(--red)' : '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          outline: 'none',
          width: '180px',
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={status === 'loading'}
        style={{
          fontFamily: 'var(--font-cond)',
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: '0.1em',
          padding: '0.3rem 0.75rem',
          background: 'var(--red)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'loading' ? '...' : "I'M IN \u2192"}
      </button>
    </div>
  )
}

export default function Navbar({ onSqueak }) {
  const squeakRef = useRef(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    squeakRef.current = new Audio('/assets/squeak.wav')
    squeakRef.current.preload = 'auto'
  }, [])

  const playSqueak = useCallback(() => {
    if (!muted && squeakRef.current) {
      squeakRef.current.currentTime = 0
      squeakRef.current.play().catch(() => {})
    }
    if (onSqueak) onSqueak()
  }, [muted, onSqueak])

  const handleMute = () => { setMuted(m => !m) }

  return (
    <header style={{
      background: '#0d0d0d',
      borderBottom: '3px solid var(--yellow)',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '1rem',
    }}>

      <Link href="/" onClick={playSqueak} style={{
        fontFamily: 'var(--font-cond)',
        fontWeight: 700,
        fontSize: '0.85rem',
        letterSpacing: '0.1em',
        color: 'var(--yellow)',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        TODAY&apos;S PICK
      </Link>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{
            fontFamily: 'var(--font-cond)',
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            color: 'var(--yellow)',
            whiteSpace: 'nowrap',
          }}>\U0001f413 JOIN THE FOUNDING FLOCK</span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}>BE EARLY. THIS THING IS JUST GETTING STARTED.</span>
          <NavbarEmailForm />
        </div>

        <button
          onClick={handleMute}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'var(--font-cond)',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            padding: '0.3rem 0.65rem',
            borderRadius: '2px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {muted ? '\U0001f507 UNMUTE' : '\U0001f50a MUTE'}
        </button>

        <Link href="/archive" style={{
          fontFamily: 'var(--font-cond)',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          color: 'var(--yellow)',
          textDecoration: 'none',
          border: '1px solid rgba(245,197,24,0.4)',
          padding: '0.3rem 0.75rem',
          borderRadius: '2px',
          whiteSpace: 'nowrap',
        }}>
          ARCHIVE
        </Link>
      </div>
    </header>
  )
}
