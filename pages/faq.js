import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    q: "What even is this?",
    a: "Every morning, one website lands in your inbox. Not a list. Not a roundup. One site. Hand-picked by a human with too much time online and zero tolerance for boring. You click it. You stare at it. You lose 45 minutes. You come back tomorrow.",
  },
  {
    q: "How much does it cost?",
    a: "Zero. Free. Nothing. Nada. We make money when you click affiliate links and buy something. If it's boring, we don't feature it — so this arrangement keeps us honest.",
  },
  {
    q: "How do I subscribe?",
    a: "Drop your email in any of the boxes on the homepage and hit I'M IN. That's it. You'll get tomorrow's site at 8am EST.",
  },
  {
    q: "How do I unsubscribe?",
    a: "Every email we send has an unsubscribe link at the bottom. One click. No confirmation screen. No 'are you sure?' guilt trip. No hard feelings. We'll miss you, but we get it.",
  },
  {
    q: "How often do you send emails?",
    a: "Once a day. One email. One site. That's the whole deal. We will never spam you, sell you anything, or suddenly start sending 'weekly digests' and 'special offers.' One email. Every morning.",
  },
  {
    q: "Who picks the sites?",
    a: "A human. Michael. He lives in Bangkok, has been on the internet since the dial-up era, and has a genuinely alarming number of browser tabs open at any given moment. The chicken is the mascot. Michael does the work.",
  },
  {
    q: "Do you get paid to feature sites?",
    a: "Brands can pay to be featured — that's one of our revenue streams. When they do, we say so. We still have to actually like the site. Money doesn't buy a feature if the site is garbage.",
  },
  {
    q: "Do affiliate links cost me anything?",
    a: "No. Affiliate links work like this: you click, you buy something you were going to buy anyway, the store gives us a small cut at no extra cost to you. We only link to things we'd actually recommend.",
  },
  {
    q: "Can I submit a site to be featured?",
    a: "Not yet — but soon. Michael's eyeballs can only move so fast. For now, if you've found something truly unhinged and can't look away, slide into our DMs on X: @rubberneckai.",
  },
  {
    q: "What's with the chicken?",
    a: "A rubbernecker is someone who cranes their neck to stare at something they probably shouldn't. The chicken cranes its neck. It's perfect. We're not explaining it further.",
  },
  {
    q: "Is my email safe?",
    a: "Yes. We store it with Kit (ConvertKit), a reputable email platform. We don't sell it. We don't share it. We don't even look at it very often. It just gets you the daily email. Full details in our Privacy Policy.",
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: '2px solid #1a1a1a',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 0',
        gap: '1rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-cond)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: '#F5F5F0',
          letterSpacing: '0.03em',
          lineHeight: 1.2,
        }}>
          {q}
        </span>
        <span style={{
          fontFamily: 'var(--font-cond)',
          fontSize: '1.4rem',
          color: 'var(--yellow)',
          flexShrink: 0,
          transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          +
        </span>
      </div>
      {open && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: '#999',
          lineHeight: 1.7,
          paddingBottom: '1.25rem',
          margin: 0,
        }}>
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ — Rubberneck.ai</title>
        <meta name="description" content="Every dumb question answered. Mostly." />
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
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="Rubberneck.ai" style={{ height: '36px' }} />
        </Link>
        <Link href="/" style={{
          fontFamily: 'var(--font-cond)',
          fontSize: '0.9rem',
          letterSpacing: '0.1em',
          color: 'var(--yellow)',
          textDecoration: 'none',
        }}>
          ← BACK TO THE GOOD STUFF
        </Link>
      </header>

      {/* HERO */}
      <div style={{
        background: 'var(--yellow)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🐔</div>
        <h1 style={{
          fontFamily: 'var(--font-cond)',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          color: '#080808',
          letterSpacing: '0.03em',
          margin: 0,
          lineHeight: 1,
        }}>
          FREQUENTLY ASKED<br />QUESTIONS
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: '#333',
          marginTop: '0.75rem',
        }}>
          Every dumb question answered. Mostly.
        </p>
      </div>

      {/* FAQ LIST */}
      <main style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem 5rem',
      }}>
        {FAQS.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}

        {/* STILL HAVE Q */}
        <div style={{
          marginTop: '3rem',
          background: '#111',
          border: '2px solid #222',
          borderRadius: '6px',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-cond)',
            fontSize: '1.5rem',
            color: 'var(--yellow)',
            marginBottom: '0.5rem',
            letterSpacing: '0.05em',
          }}>
            STILL HAVE A QUESTION?
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: '#888',
            fontSize: '0.95rem',
            marginBottom: '1rem',
          }}>
            Slide into our DMs. We actually read them.
          </p>
          <a
            href="https://x.com/rubberneckai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'var(--yellow)',
              color: '#080808',
              fontFamily: 'var(--font-cond)',
              fontSize: '1rem',
              letterSpacing: '0.1em',
              padding: '0.6rem 1.5rem',
              borderRadius: '3px',
              textDecoration: 'none',
            }}
          >
            @RUBBERNECKAI ON X →
          </a>
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
