"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, HeartHandshake, Sprout, Users, GraduationCap, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import "./auth.css";

export default function AuthShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".auth-story > h2, .auth-story > p, .auth-community", {
        y: 24, opacity: 0, duration: 0.9, stagger: 0.14, ease: "power3.out",
        clearProps: "transform,opacity",
      });
    }, root);
    return () => media.revert();
  }, []);

  return (
    <div className="auth-page" ref={root}>
      <header className="auth-header">
        <Link href="/" className="auth-brand">ZFund<span aria-hidden="true">.</span></Link>
        <Link href="/" className="auth-home"><ArrowLeft size={15} /> Back to home</Link>
      </header>
      <main className="auth-layout">
        <aside className="auth-story">
          <div className="auth-story-label"><span /> A shared purpose starts here</div>
          <h2>Your people.<br />Your purpose.<br />One place.</h2>
          <p>Come back to the causes you care about, and the community bringing them to life.</p>
          <div className="auth-community" aria-hidden="true">
            <div className="auth-people"><span><Users size={25} /></span><span><GraduationCap size={25} /></span><span><HeartHandshake size={25} /></span></div>
            <div className="auth-connection" />
            <div className="auth-purpose"><Sprout size={25} /><span>Good things grow<br /><strong>when we give together.</strong></span></div>
          </div>
          <div className="auth-story-bottom"><span>Built around Ghana’s communities.</span><Link href="/how-it-works" aria-label="Explore how ZFund works"><ArrowUpRight size={21} /></Link></div>
        </aside>
        <section className="auth-workspace" aria-label="Sign in">
          <div className="auth-card">{children}</div>
          <p className="auth-assurance"><ShieldCheck size={16} /> Your code is yours. Never share it.</p>
        </section>
      </main>
      <footer className="auth-footer"><span>Shared goals. Clearer fundraising.</span><Link href="/security">Trust &amp; security <ArrowUpRight size={13} /></Link></footer>
    </div>
  );
}
