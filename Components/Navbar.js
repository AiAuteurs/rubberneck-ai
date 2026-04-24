// components/Navbar.js
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

function SignupStrip({ onSqueak, muted }) {
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
  }, [value, onSqueak, muted])

  return (
    <div style={{
      background: 'var(--red)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    }}>
      <img src='/assets/chicken.png' alt=''
        style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-cond)',
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '0.18em',
          color: '#fff',
          lineHeight: 1.1,
        }}>JOIN THE FOUNDING FLOCK</div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.65rem',
          color: '#fff',
          letterSpacing: '0.08em',
          marginTop: '0.15rem',
        }}>BE EARLY. THIS THING IS JUST GETTING STARTED.</div>
      </div>
      {status === 'success' ? (
        <div style={{
          fontFamily: 'var(--font-cond)',
          fontWeight: 700,
          fontSize: '0.85rem',
          color: '#fff',
          letterSpacing: '0.1em',
          flexShrink: 0,
        }}>YOU&apos;RE IN! SEE YOU TOMORROW. 🐔</div>
      ) : (
        <div style={{ display: 'flex', flexShrink: 0 }}>
          <input
            type='email'
            placeholder={status === 'error' ? 'Need a real email!' : 'Drop your email, you nosey bird.'}
            value={value}
            onChange={e => { setValue(e.target.value); setStatus('idle') }}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
            onClick={() => { if (!muted && onSqueak) onSqueak() }}
            disabled={status === 'loading'}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              padding: '0.55rem 0.9rem',
              background: 'rgba(255,255,255,0.15)',
              border: status === 'error' ? '1px solid #fff' : '1px solid rgba(255,255,255,0.5)',
              color: '#fff',
              outline: 'none',
              width: '240px',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            style={{
              fontFamily: 'var(--font-cond)',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              padding: '0.55rem 1.2rem',
              background: 'var(--yellow)',
              color: 'var(--black)',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >{status === 'loading' ? '...' : "I'M IN →"}</button>
        </div>
      )}
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
      if (m && squeakRef.current) {
        squeakRef.current.currentTime = 0
        squeakRef.current.play().catch(() => {})
      }
      return !m
    })
    if (onSqueak) onSqueak()
  }

  return (
    <>
      <header style={{
        background: '#0d0d0d',
        borderBottom: '3px solid var(--yellow)',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        height: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '1rem',
      }}>
        <Link href='/' onClick={playSqueak} style={{
          fontFamily: 'var(--font-cond)',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          color: 'var(--yellow)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>TODAY&apos;S PICK</Link>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button onClick={handleMute} style={{
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
          }}>{muted ? '🔇 UNMUTE' : '🔊 MUTE'}</button>

          <Link href='/archive' style={{
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
          }}>ARCHIVE</Link>
        </div>
      </header>
      <SignupStrip onSqueak={playSqueak} muted={muted} />
    </>
  )
}
