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
    <>
      <style>{`.nb-input::placeholder { color: rgba(255,255,255,0.75); }`}</style>
      <div style={{
        background: 'var(--red)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        height: '72px',
        gap: '0',
      }}>
        {/* CHICKEN — bleeds into strip */}
        <img src='/assets/chicken.png' alt=''
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'contain',
            marginRight: '1rem',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
            position: 'relative',
            top: '-4px',
          }} />

        {/* TEXT + FORM as one block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{
              fontFamily: 'var(--font-cond)',
              fontWeight: 700,
              fontSize: '1.05rem',
              letterSpacing: '0.18em',
              color: '#fff',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}>JOIN THE FOUNDING FLOCK</div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.08em',
              marginTop: '0.2rem',
              textTransform: 'uppercase',
            }}>BE EARLY. THIS THING IS JUST GETTING STARTED.</div>
          </div>

          {/* DIVIDER */}
          <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />

          {/* FORM */}
          {status === 'success' ? (
            <div style={{
              fontFamily: 'var(--font-cond)',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#fff',
              letterSpacing: '0.1em',
            }}>YOU&apos;RE IN! SEE YOU TOMORROW. 🐔</div>
          ) : (
            <div style={{ display: 'flex' }}>
              <input
                className='nb-input'
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
                  padding: '0.6rem 1rem',
                  background: '#0d0d18',
                  border: 'none',
                  color: '#fff',
                  outline: 'none',
                  width: '260px',
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                style={{
                  fontFamily: 'var(--font-cond)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  letterSpacing: '0.14em',
                  padding: '0.6rem 1.4rem',
                  background: 'var(--yellow)',
                  color: 'var(--black)',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >{status === 'loading' ? '...' : "I'M IN \u2192"}</button>
            </div>
          )}
        </div>
      </div>
    </>
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
          }}>{muted ? '\ud83d\udd07 UNMUTE' : '\ud83d\udd0a MUTE'}</button>

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
