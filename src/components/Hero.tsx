import { hero, stats } from "@/content/site";
import Showcase from "./Showcase";

export default function Hero() {
  return (
    <section id="top" className="pt-12">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 pt-10 pb-6 grid lg:grid-cols-2 gap-8 items-end">
        <div>
          <p className="text-sm font-mono tracking-[0.3em] text-foreground/40 uppercase mb-4">
            {hero.eyebrow}
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-[96px] font-black leading-none uppercase tracking-tight">
            {hero.titleLines[0]}
            <br />
            {hero.titleLines[1]}
            <br />
            <span className="text-accent">{hero.titleAccent}</span>
          </h1>
        </div>

        <div className="flex flex-col justify-end gap-5 pb-1">
          <p className="text-foreground/55 text-base leading-relaxed max-w-lg">
            {hero.body}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={hero.primaryCta.href}
              className="flex items-center gap-2 px-8 py-4 bg-foreground text-background font-semibold tracking-wider uppercase text-sm hover:bg-foreground/80 transition-colors"
            >
              {hero.primaryCta.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={hero.secondaryCta.href}
              className="flex items-center gap-2 px-8 py-4 border border-foreground/30 text-foreground font-semibold tracking-wider uppercase text-sm hover:border-foreground/60 transition-colors"
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          <div className="pt-4 border-t border-foreground/10 flex flex-wrap gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black leading-none">{s.value}</div>
                <div className="text-[14px] font-mono tracking-widest text-foreground/40 uppercase mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Showcase />
    </section>
  );
}
