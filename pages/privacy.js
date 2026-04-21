import Head from 'next/head'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Rubberneck.ai</title>
        <meta name="description" content="The boring legal stuff. Written like a human." />
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
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔒</div>
        <h1 style={{
          fontFamily: 'var(--font-cond)',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          color: '#080808',
          letterSpacing: '0.03em',
          margin: 0,
          lineHeight: 1,
        }}>
          PRIVACY POLICY
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: '#333',
          marginTop: '0.75rem',
        }}>
          Written like a human. Because you are one.
        </p>
      </div>

      {/* CONTENT */}
      <main style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '3rem 1.5rem 5rem',
        fontFamily: 'var(--font-body)',
        color: '#bbb',
        lineHeight: 1.8,
        fontSize: '1rem',
      }}>

        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
          Last updated: April 2026
        </p>

        <Section title="THE SHORT VERSION">
          <p>You give us your email. We send you one website every morning. We don't sell your data. We don't spam you. You can leave anytime. That's it.</p>
          <p>If you want the longer version, it's below. We kept it in plain English.</p>
        </Section>

        <Section title="WHAT WE COLLECT">
          <p>When you subscribe, we collect your <strong style={{ color: '#F5F5F0' }}>email address</strong>. That's the only personal information we ask for.</p>
          <p>Like most websites, we also automatically receive basic technical data when you visit — your browser type, the page you came from, and your general location (country level). This is standard and we can't turn it off. We use it only to understand how the site is performing.</p>
        </Section>

        <Section title="WHAT WE DO WITH IT">
          <p>Your email address is used for one thing: <strong style={{ color: '#F5F5F0' }}>sending you Rubberneck.ai</strong>. One email per day. The day's featured website. That's all.</p>
          <p>We will never sell your email. We will never rent it. We will never trade it. We will never use it to send you anything you didn't sign up for.</p>
        </Section>

        <Section title="WHO HOLDS YOUR DATA">
          <p>Your email is stored with <strong style={{ color: '#F5F5F0' }}>Kit (formerly ConvertKit)</strong>, a reputable email marketing platform. You can read their privacy policy at <a href="https://kit.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow)' }}>kit.com/privacy</a>.</p>
          <p>We use Vercel to host the site. Vercel may collect basic request logs. Their privacy policy lives at <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow)' }}>vercel.com/legal/privacy-policy</a>.</p>
        </Section>

        <Section title="AFFILIATE LINKS">
          <p>Some links on this site and in our emails are affiliate links. If you click one and make a purchase, we may earn a small commission — at no extra cost to you. We only link to things we'd actually recommend. The commission doesn't change the price you pay for anything.</p>
        </Section>

        <Section title="COOKIES">
          <p>We use minimal cookies — only what's needed to keep the site running. We don't use advertising cookies. We don't track you around the internet. We don't know what you do after you leave.</p>
        </Section>

        <Section title="HOW TO UNSUBSCRIBE">
          <p>Every email we send has an <strong style={{ color: '#F5F5F0' }}>unsubscribe link at the bottom</strong>. Click it and you're out. No confirmation screen. No guilt. No re-engagement sequence. Done.</p>
          <p>You can also <Link href="/unsubscribe" style={{ color: 'var(--yellow)' }}>unsubscribe here</Link>.</p>
        </Section>

        <Section title="YOUR RIGHTS">
          <p>You have the right to access, correct, or delete your personal data. If you want any of that, email us and we'll sort it out.</p>
          <p>If you're in the EU or UK, you have additional rights under GDPR. Same deal — email us.</p>
        </Section>

        <Section title="CHANGES TO THIS POLICY">
          <p>If we change anything material, we'll update the date at the top of this page. We won't spam you about it.</p>
        </Section>

        <Section title="CONTACT">
          <p>Questions? Something weird going on? Find us on X at <a href="https://x.com/rubberneckai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--yellow)' }}>@rubberneckai</a>.</p>
        </Section>

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

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        fontFamily: 'var(--font-cond)',
        fontSize: '1.1rem',
        color: 'var(--yellow)',
        letterSpacing: '0.12em',
        marginBottom: '0.75rem',
        borderBottom: '1px solid #1a1a1a',
        paddingBottom: '0.5rem',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
