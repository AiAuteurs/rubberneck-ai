// components/Navbar.js
// Shared navbar used on every page
// Props: showArchive (bool) — shows ARCHIVE link on right when true
//        showTodaysPick (bool) — shows TODAY'S PICK link on right when true

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

export default function Navbar({ showArchive = false, showTodaysPick = false }) {
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

  const handleMute = (e) => {
    setMuted(m => !m)
    squeak(e)
  }

  return (
    <>
      {/* Rubberneck chicken */}
      {chickPos && (
        <img
          src="/assets/favicon.png"
          alt=""
          style={{
            position: 'fixed', zIndex: 9999, pointerEvents: 'none',
            width: '80px', height: '80px', objectFit: 'contain',
            filter: 'drop-shadow(3px 4px 8px rgba(0,0,0,0.35))',
            top: chickPos.y - 40,
            left: chickPos.side === 'left' ? (chickActive ? '0px' : '-80px') : 'auto',
            right: chickPos.side === 'left' ? 'auto' : (chickActive ? '0px' : '-80px'),
            transform: chickPos.side === 'left' ? 'scaleX(1)' : 'scaleX(-1)',
            transition: chickActive
              ? 'left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), right 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease'
              : 'left 0.35s ease-in, right 0.35s ease-in, opacity 0.25s ease',
            opacity: chickActive ? 1 : 0,
          }}
        />
      )}

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

        {/* LEFT — Today's Pick with chicken */}
        <Link
          href="/"
          onClick={squeak}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/favicon.png"
            alt="Rubberneck chicken"
            style={{ height: '32px', width: '32px', objectFit: 'contain' }}
          />
          <span style={{
            fontFamily: 'var(--font-cond)',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            color: 'var(--yellow)',
            whiteSpace: 'nowrap',
          }}>
            TODAY'S PICK
          </span>
        </Link>

        {/* CENTER — breadcrumb or date */}
        <div style={{
          fontFamily: 'var(--font-cond)',
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.3)',
          textAlign: 'center',
          flex: 1,
        }}>
          RUBBERNECK.AI
        </div>

        {/* RIGHT — Mute + Archive */}
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
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇 UNMUTE' : '🔊 MUTE'}
          </button>

          {showArchive && (
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
          )}
        </div>
      </header>
    </>
  )
}
