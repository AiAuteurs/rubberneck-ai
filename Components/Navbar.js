// components/Navbar.js
// LEFT: TODAY'S PICK
// RIGHT: JOIN THE FOUNDING FLOCK · MUTE · ARCHIVE

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

function NavbarEmailForm({ onSqueak, muted }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = useCallback(async () => {
    if (!muted && onSqueak) onSqueak()
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
  }, [value, onSqueak])

  if (status === 'success') {
    return (
      <div style={{
        fontFamily: 'var(--font-cond)', fontWeight: 700,
        fontSize: '0.75rem', letterSpacing: '0.08em',
        color: '#2a7a2a', whiteSpace: 'nowrap', marginTop: '0.25rem',
      }}>
        🐓 YOU&apos;RE IN!
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
        onClick={() => { if (!muted && onSqueak) onSqueak() }}
        disabled={status === 'loading'}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          padding: '0.3rem 0.6rem',
          background: 'rgba(255,255,255,0.08)',
          border: status === 'error' ? '1px solid var(--red)' : '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          outline: 'none',
          width: '170px',
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
        {status === 'loading' ? '...' : "I'M IN →"}
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

  const handleMute = () => {
    setMuted(m => {
      if (m) {
        // unmuting — play squeak
        if (squeakRef.current) {
          squeakRef.current.currentTime = 0
          squeakRef.current.play().catch(() => {})
        }
      }
      return !m
    })
    if (onSqueak) onSqueak()
  }

  return (
    <header style={{
      background: '#0d0d0d',
      borderBottom: '3px solid var(--yellow)',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      height: '80px',
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

        {/* HORIZONTAL SIGNUP — chicken + text + input + button all in one row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/assets/chicken.png" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-cond)',
              fontWeight: 700,
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              color: 'var(--yellow)',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
            }}>JOIN THE FOUNDING FLOCK</span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.55rem',
              color: 'rgba(255,255,255,0.4)',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
            }}>BE EARLY. THIS THING IS JUST GETTING STARTED.</span>
          </div>
          <NavbarEmailForm onSqueak={playSqueak} muted={muted} />
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
          {muted ? '🔇 UNMUTE' : '🔊 MUTE'}
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
