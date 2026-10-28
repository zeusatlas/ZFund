"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scope motion to public pages; reverting also removes route-specific triggers. */
export default function MarketingMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const select = gsap.utils.selector(scope);
      const intro = select(".hero, .page-intro")[0] as HTMLElement | undefined;

      if (intro) {
        const heading = intro.querySelector("h1");
        const copy = intro.querySelector(".hero-copy, .page-intro > p");
        const actions = intro.querySelector(".hero-actions");
        const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (heading) entrance.from(heading, {
          y: 48, opacity: 0, clipPath: "inset(0 0 100% 0)", duration: 1.1,
          clearProps: "transform,opacity,clipPath",
        });
        if (copy) entrance.from(copy, { y: 18, opacity: 0, duration: 0.7, clearProps: "transform,opacity" }, 0.35);
        if (actions) entrance.from(actions, { y: 12, opacity: 0, duration: 0.6, clearProps: "transform,opacity" }, 0.55);
      }

      const flow = select(".fund-flow")[0];
      if (flow) {
        gsap.timeline({
          defaults: { duration: 0.65, ease: "power3.out", clearProps: "transform,opacity" },
          scrollTrigger: { trigger: flow, start: "top 90%", once: true },
        })
          .from(select(".flow-stack:first-child .flow-node"), { x: -24, opacity: 0, stagger: 0.12 }, 0.15)
          .from(select(".flow-hub"), { scale: 0.84, opacity: 0 }, 0.45)
          .from(select(".flow-stack:last-child .flow-node"), { x: 24, opacity: 0, stagger: 0.12 }, 0.8);
      }

      // Reveal headings, leaving links and body content immediately available.
      select(".section-heading h2, .community-copy h2, .trust-panel h2, .page-section > h2, .closing h2").forEach((heading: HTMLElement) => {
        gsap.from(heading, {
          clipPath: "inset(0 0 100% 0)", y: 22, duration: 0.85, ease: "power3.out",
          clearProps: "clipPath,transform",
          scrollTrigger: { trigger: heading, start: "top 92%", once: true },
        });
      });

      const progress = select(".mini-ledger .bg-gold")[0];
      if (progress) gsap.from(progress, {
        scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "power2.inOut",
        clearProps: "transform,transformOrigin",
        scrollTrigger: { trigger: progress, start: "top 90%", once: true },
      });

      // Keyboard focus and pointer hover receive the same small response.
      const detach: (() => void)[] = [];
      select(".pill").forEach((button: HTMLElement) => {
        const move = gsap.quickTo(button, "y", { duration: 0.25, ease: "power2.out" });
        const enter = () => move(-3);
        const leave = () => move(0);
        button.addEventListener("pointerenter", enter);
        button.addEventListener("pointerleave", leave);
        button.addEventListener("focus", enter);
        button.addEventListener("blur", leave);
        detach.push(() => {
          button.removeEventListener("pointerenter", enter);
          button.removeEventListener("pointerleave", leave);
          button.removeEventListener("focus", enter);
          button.removeEventListener("blur", leave);
        });
      });
      return () => detach.forEach((remove) => remove());
    }, scope);

    return () => media.revert();
  }, [pathname]);

  return <div ref={root} className={`marketing ${className}`}>{children}</div>;
}
