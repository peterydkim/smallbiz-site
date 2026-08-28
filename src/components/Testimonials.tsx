import { testimonialsSection as t } from "@/content/site";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

function Stars() {
  return (
    <div className="flex gap-0.5 text-accent" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-secondary border-y border-foreground/10">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <SectionHead eyebrow={t.eyebrow} />
          <h2 className="text-5xl md:text-6xl font-black uppercase leading-none mb-14">
            {t.title}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
          {t.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 120} className="h-full">
              <figure className="bg-background p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[13px] font-mono tracking-widest text-foreground/35 uppercase">
                    {item.kind}
                  </span>
                  <Stars />
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/55 italic mb-6 flex-1">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="text-[14px] font-mono text-foreground/30 leading-relaxed mb-5">
                  {item.scope}
                </div>
                <figcaption className="pt-4 border-t border-foreground/10">
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-[13px] font-mono tracking-widest text-foreground/30 uppercase mt-0.5">
                    {item.role}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
