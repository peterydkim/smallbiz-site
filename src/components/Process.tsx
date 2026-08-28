import { processSection as p } from "@/content/site";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section id="process" className="py-24 bg-secondary border-y border-foreground/10">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <SectionHead eyebrow={p.eyebrow} />
          <h2 className="text-5xl md:text-6xl font-black uppercase leading-none mb-14">
            {p.title}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {p.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 100}>
              <div className="text-6xl font-black text-foreground/10 mb-4 leading-none">
                {step.n}
              </div>
              <div className="w-6 h-px bg-foreground/20 mb-4" />
              <h3 className="font-black text-lg uppercase mb-3">{step.title}</h3>
              <p className="text-sm text-foreground/45 leading-relaxed">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
