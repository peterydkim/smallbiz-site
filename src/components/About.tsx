import Image from "next/image";
import { aboutSection as a } from "@/content/site";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

function Dot() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function About() {
  const [tall, ...rest] = a.images;
  return (
    <section id="about" className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <SectionHead eyebrow={a.eyebrow} />
          <h2 className="text-5xl md:text-6xl font-black uppercase leading-none mb-8">
            {a.titleLines.map((line, i) => (
              <span key={line}>
                {line}
                {i < a.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-foreground/50 leading-relaxed mb-10">{a.body}</p>

          <div className="space-y-3">
            {a.features.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-5 bg-card border border-foreground/10 hover:border-foreground/20 transition-colors"
              >
                <div className="text-accent mt-0.5 shrink-0">
                  <Dot />
                </div>
                <div>
                  <div className="font-bold text-sm uppercase tracking-wide mb-0.5">{f.title}</div>
                  <div className="text-sm text-foreground/40">{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid grid-cols-2 gap-3">
            <Image
              src={tall.src}
              alt={tall.alt}
              width={900}
              height={1200}
              sizes="(max-width: 1024px) 50vw, 25vw"
              className={`w-full ${tall.ratio} object-cover`}
            />
            <div className="flex flex-col gap-3">
              {rest.map((img) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={800}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className={`w-full ${img.ratio} object-cover`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
