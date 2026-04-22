import Head from 'next/head'
import Link from 'next/link'

export default function Unsubscribe() {
  return (
    <>
      <Head>
        <title>Unsubscribe — Rubberneck.ai</title>
        <meta name="description" content="We'll miss you. The chicken won't stop staring though." />
        <link rel="icon" href="/assets/favicon.png" />
      </Head>

      {/* NAV */}
      <header style={{
        background: '#080808',
        borderBottom: '3px solid var(--yellow)',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="Rubberneck.ai" style={{ height: '36px' }} />
        </Link>
      </header>

      {/* MAIN */}
      <main style={{
        background: '#0d0d0d',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div style={{
        maxWidth: '560px',
        margin: '5rem auto',
        padding: '0 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😢🐔</div>

        <h1 style={{
          fontFamily: 'var(--font-cond)',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          color: '#F5F5F0',
          letterSpacing: '0.03em',
          marginBottom: '1rem',
          lineHeight: 1.1,
        }}>
          YOU WANT OUT?
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          color: '#888',
          fontSize: '1.05rem',
          lineHeight: 1.7,
          marginBottom: '2rem',
        }}>
          No guilt. No dark patterns. No "are you sure?" screen.<br />
          Every email we send has an <strong style={{ color: '#F5F5F0' }}>unsubscribe link at the very bottom</strong> — click that and you're instantly out.
        </p>

        <div style={{
          background: '#111',
          border: '2px solid #222',
          borderRadius: '6px',
          padding: '1.5rem',
          marginBottom: '2rem',
          fontFamily: 'var(--font-body)',
          color: '#666',
          fontSize: '0.95rem',
          lineHeight: 1.6,
        }}>
          Can't find the email? Check your spam folder — and while you're in there, mark us as Not Spam. Then click the unsubscribe link in any issue we sent you.
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          color: '#555',
          fontSize: '0.9rem',
          marginBottom: '2.5rem',
        }}>
          If you're having trouble, find us at{' '}
          <a href="https://x.com/rubberneckai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow)' }}>
            @rubberneckai
          </a>{' '}
          and we'll sort it out manually.
        </p>

        <Link href="/" style={{
          display: 'inline-block',
          background: 'var(--yellow)',
          color: '#080808',
          fontFamily: 'var(--font-cond)',
          fontSize: '1rem',
          letterSpacing: '0.1em',
          padding: '0.7rem 1.75rem',
          borderRadius: '3px',
          textDecoration: 'none',
        }}>
          ACTUALLY, TAKE ME BACK →
        </Link>
      </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <span>© {new Date().getFullYear()} Rubberneck.ai</span>
        <a href="/faq">FAQ</a>
        <a href="/privacy">Privacy</a>
        <a href="/unsubscribe">Unsubscribe</a>
      </footer>
    </>
  )
}
