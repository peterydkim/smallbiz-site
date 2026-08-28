"use client";

import { useState } from "react";
import { company, navLinks } from "@/content/site";
import Wordmark from "./Wordmark";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-background">
      <div className="relative h-12 flex items-center px-6 lg:px-12">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <Wordmark />
        </a>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium tracking-wider text-foreground/55 hover:text-foreground transition-colors uppercase whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="ml-auto hidden md:flex items-center gap-4 shrink-0">
          <a
            href={company.phoneHref}
            className="text-[13px] text-foreground/50 hover:text-foreground transition-colors"
          >
            {company.phone}
          </a>
          <a
            href="#contact"
            className="px-4 py-1.5 border border-foreground/40 text-foreground text-[13px] font-semibold tracking-wider uppercase hover:bg-foreground hover:text-background transition-all rounded-full"
          >
            Get Estimate
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden ml-auto text-foreground"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 border-t border-foreground/10 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium uppercase text-foreground/65 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-1 py-3 bg-foreground text-background text-sm font-bold tracking-widest uppercase text-center"
          >
            Get Estimate
          </a>
        </div>
      </div>
    </nav>
  );
}
