import { servicesSection as s } from "@/content/site";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 bg-secondary border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <SectionHead eyebrow={s.eyebrow} />
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
            <h2 className="text-5xl md:text-6xl font-black uppercase leading-none">{s.title}</h2>
            <p className="text-foreground/40 max-w-xs text-sm leading-relaxed">{s.blurb}</p>
          </div>
        </Reveal>

        <div className="flex flex-wrap gap-3 mb-10">
          {s.badges.map((b) => (
            <div
              key={b.text}
              className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-sm rounded-full ${
                b.tone === "accent"
                  ? "bg-accent text-accent-foreground"
                  : "bg-foreground text-background"
              }`}
            >
              {b.text}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-foreground/10">
          {s.items.map((item, i) => (
            <Reveal key={item.name} delay={Math.min(i, 8) * 40}>
              <div className="bg-background px-5 py-5 hover:bg-card transition-colors duration-200 group flex items-center gap-3 h-full">
                <div className="text-accent shrink-0">
                  <Check />
                </div>
                <div>
                  <div className="text-[13px] font-mono tracking-widest text-foreground/30 uppercase">
                    {item.cat}
                  </div>
                  <div className="font-bold text-sm leading-tight">{item.name}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
