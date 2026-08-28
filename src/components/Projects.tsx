import { projectsSection as p } from "@/content/site";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import ProjectCategory from "./ProjectCategory";

export default function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <SectionHead eyebrow={p.eyebrow} />
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <h2 className="text-5xl md:text-6xl font-black uppercase leading-none">{p.title}</h2>
            <p className="text-foreground/45 max-w-sm text-sm leading-relaxed">{p.blurb}</p>
          </div>
        </Reveal>

        <div className="flex gap-3 flex-wrap mb-12">
          {p.categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="px-4 py-1.5 border border-foreground/20 text-sm font-mono tracking-widest uppercase text-foreground/50 hover:border-foreground/50 hover:text-foreground transition-all"
            >
              {c.name}
            </a>
          ))}
        </div>

        <div className="space-y-20">
          {p.categories.map((c) => (
            <Reveal key={c.id}>
              <ProjectCategory category={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
