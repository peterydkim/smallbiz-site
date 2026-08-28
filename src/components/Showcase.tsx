"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { showcase } from "@/content/site";

export default function Showcase() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const total = showcase.slides.length;

  const go = useCallback(
    (next: number) => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((next + total) % total);
        setVisible(true);
      }, 280);
    },
    [total]
  );

  // Advance when the current clip finishes.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => go(index + 1);
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, [index, go]);

  // Load and play the newly selected clip.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    if (playing) v.play().catch(() => {});
  }, [index, playing]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play().catch(() => {});
      setPlaying(true);
    }
  };

  const slide = showcase.slides[index];

  return (
    <div
      className="relative w-full bg-black overflow-hidden"
      style={{ aspectRatio: "16 / 7", maxHeight: 480 }}
    >
      <video
        ref={videoRef}
        key={slide.src}
        poster={slide.poster}
        autoPlay
        muted
        playsInline
        preload={index === 0 ? "auto" : "metadata"}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={slide.src} type="video/mp4" />
      </video>

      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      <div
        className={`absolute bottom-10 left-8 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px] font-mono tracking-[0.25em] text-white/55 uppercase">
            {showcase.eyebrow}
          </span>
          <span className="text-[14px] font-mono text-white/30">{showcase.year}</span>
        </div>
        <div className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">
          {showcase.title}
        </div>
      </div>

      <div className="absolute top-5 left-8 text-white/35 text-sm font-mono tracking-widest select-none">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      <div className="absolute top-4 right-4">
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/35 hover:bg-black/60 text-white text-[13px] font-mono tracking-widest uppercase transition-colors"
        >
          {playing ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
              <rect x="1" y="1" width="2.5" height="8" />
              <rect x="6.5" y="1" width="2.5" height="8" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
              <path d="M2 1l7 4-7 4z" />
            </svg>
          )}
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <button
        onClick={() => go(index - 1)}
        aria-label="Previous clip"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next clip"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute bottom-10 right-8 flex items-center gap-1.5">
        {showcase.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to clip ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === index ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/55"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
