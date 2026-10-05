import Link from 'next/link';
import { Footer, Header } from '@/components/site-chrome';

export default function Page() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px 96px', fontFamily: 'sans-serif', color: '#222' }}>
        <div style={{ marginBottom: 40, borderBottom: '1px solid #ECE7DE', paddingBottom: 28 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#927d3d', fontWeight: 600 }}>TRADE PROGRAM</span>
          <h1 style={{ fontSize: 42, fontWeight: 400, margin: '14px 0 10px', color: '#1c1c1a' }}>IHF Trade Program</h1>
          <p style={{ fontSize: 15, color: '#555', margin: 0, lineHeight: 1.7 }}>Exclusive program designed for interior designers, architects, and home staging professionals who specify our bespoke draperies for client projects.</p>
        </div>
        <section style={{ lineHeight: 1.8, fontSize: 14.5, color: '#444', paddingBottom: 32 }}>
          <p>Our full IHF Trade Program page is coming soon. For immediate assistance, please contact our concierge team at <a href='mailto:concierge@indiahomefurnishings.com' style={{ color: '#927d3d', textDecoration: 'underline' }}>concierge@indiahomefurnishings.com</a> or call toll-free at +1 (800) 555-0199.</p>
        </section>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #ECE7DE' }}>
          <Link href='/' style={{ fontSize: 13, letterSpacing: '0.08em', textDecoration: 'underline', color: '#1c1c1a' }}>
            Return to Storefront
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}