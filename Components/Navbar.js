// components/Navbar.js
// ONE navbar. Same layout on every page. Never touch again.
// LEFT: TODAY'S PICK → /
// CENTER: RUBBERNECK.AI (dim)
// RIGHT: MUTE · ARCHIVE

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

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
    setMuted(m => !m)
  }

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

      {/* LEFT */}
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

      {/* CENTER */}
      <div style={{
        fontFamily: 'var(--font-cond)',
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        color: 'rgba(255,255,255,0.25)',
        textAlign: 'center',
        flex: 1,
      }}>
        RUBBERNECK.AI
      </div>

      {/* RIGHT — always: MUTE then ARCHIVE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
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
