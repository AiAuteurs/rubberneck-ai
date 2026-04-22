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
  const [logoHonking, setLogoHonking] = useState(false)
  const timerRef = useRef(null)
  const honkTimerRef = useRef(null)

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

  const handleLogoClick = useCallback((e) => {
    e.preventDefault()
    // Play squeak
    if (!muted && squeakRef.current) {
      squeakRef.current.currentTime = 0
      squeakRef.current.play().catch(() => {})
    }
    // Bulge animation
    if (honkTimerRef.current) clearTimeout(honkTimerRef.current)
    setLogoHonking(true)
    honkTimerRef.current = setTimeout(() => {
      setLogoHonking(false)
      window.location.href = '/'
    }, 750)
  }, [muted])

  const handleMute = (e) => {
    setMuted(m => !m)
    squeak(e)
  }

  return (
    <>
      {/* Roving chicken on squeak */}
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

      <style>{`
        @keyframes rn-bulge {
          0%   { transform: scale(1) rotate(0deg); filter: brightness(1); }
          15%  { transform: scale(1.25) rotate(-4deg); filter: brightness(1.2) saturate(1.5); }
          35%  { transform: scale(1.35) rotate(3deg);  filter: brightness(1.3) saturate(1.7); }
          55%  { transform: scale(1.28) rotate(-2deg); filter: brightness(1.2) saturate(1.5); }
          75%  { transform: scale(1.12) rotate(1deg);  filter: brightness(1.1); }
          100% { transform: scale(1) rotate(0deg);     filter: brightness(1); }
        }
        @keyframes rn-shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-5px) rotate(-2deg); }
          30%     { transform: translateX(6px)  rotate(2deg); }
          50%     { transform: translateX(-4px) rotate(-1deg); }
          70%     { transform: translateX(4px)  rotate(1deg); }
          85%     { transform: translateX(-2px); }
        }
        .rn-logo-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          flex-shrink: 0;
          cursor: pointer;
        }
        .rn-logo-link.honking .rn-logo-img {
          animation: rn-bulge 0.75s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
          transform-origin: 30% 40%;
        }
        .rn-logo-link.honking {
          animation: rn-shake 0.65s ease-in-out;
        }
        .rn-logo-link:not(.honking):hover .rn-logo-img {
          transform: scale(1.08);
          filter: brightness(1.1) saturate(1.2);
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .rn-logo-img {
          height: 40px;
          width: auto;
          object-fit: contain;
          display: block;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
      `}</style>

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

        {/* LEFT — Chicken logo → home */}
        <a
          href="/"
          onClick={handleLogoClick}
          className={`rn-logo-link${logoHonking ? ' honking' : ''}`}
          aria-label="Rubberneck home"
        >
          <img
            className="rn-logo-img"
            src="/assets/logo-chicken.png"
            alt="Rubberneck.ai"
          />
        </a>

        {/* CENTER — site name */}
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
