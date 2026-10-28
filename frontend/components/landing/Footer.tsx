import Link from "next/link";

export default async function Footer() {
  "use cache";
  return <footer className="site-footer"><div className="wrap">
    <div className="footer-grid">
      <div><Link href="/" className="brand">ZFund</Link><p>Bringing Ghana’s communities together through clearer fundraising. Shared goals. A purpose everyone can follow.</p></div>
      <div><span className="kicker">Explore</span><ul>{[["/how-it-works", "How it works"], ["/for-hosts", "For hosts"], ["/for-organizations", "For organisations"], ["/security", "Trust & security"]].map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></div>
      <div><span className="kicker">Your workspace</span><ul><li><Link href="/login">Sign in</Link></li><li><Link href="/login">Host dashboard</Link></li><li><Link href="/login">Admin console</Link></li></ul></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} ZFund. All rights reserved.</span><span>Built for shared purpose, in Ghana.</span></div>
  </div></footer>;
}
