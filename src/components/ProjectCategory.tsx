"use client";

import { useState } from "react";
import Image from "next/image";
import type { Category } from "@/content/site";

export default function ProjectCategory({ category }: { category: Category }) {
  const [active, setActive] = useState(0);
  const featured = category.projects[active];

  return (
    <div id={category.id}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <div className="text-[14px] font-mono tracking-[0.25em] text-foreground/40 uppercase mb-1">
            Category
          </div>
          <h3 className="text-3xl md:text-4xl font-black uppercase leading-none">
            {category.name}
          </h3>
        </div>
        <p className="text-sm text-foreground/45 max-w-xs leading-relaxed">{category.blurb}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="relative overflow-hidden group bg-muted">
          <Image
            src={featured.img}
            alt={featured.alt}
            width={1600}
            height={1200}
            sizes="(max-width: 1024px) 100vw, 70vw"
            priority={category.id === "cat-kitchen"}
            className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-600"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 right-5">
            <div className="text-[14px] font-mono tracking-widest text-white/50 uppercase mb-1">
              {featured.location}
            </div>
            <div className="text-white text-xl font-black uppercase tracking-tight mb-1">
              {featured.title}
            </div>
            <div className="text-white/60 text-sm leading-relaxed">{featured.desc}</div>
          </div>
        </div>

        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {category.projects.map((p, i) => (
            <button
              key={p.title}
              onClick={() => setActive(i)}
              aria-label={`Show ${p.title}`}
              aria-pressed={i === active}
              className={`relative shrink-0 overflow-hidden group transition-all duration-200 w-[140px] h-[100px] ${
                i === active ? "ring-2 ring-foreground" : "opacity-60 hover:opacity-90"
              }`}
            >
              <Image
                src={p.img}
                alt=""
                fill
                sizes="140px"
                className="object-cover group-hover:scale-105 transition-transform duration-400"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-1.5 left-2 right-2">
                <div className="text-white text-[13px] font-bold uppercase tracking-wide leading-tight line-clamp-1 text-left">
                  {p.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-px bg-foreground/10" />
    </div>
  );
}
