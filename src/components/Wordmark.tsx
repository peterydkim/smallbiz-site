import { company } from "@/content/site";

export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <div className="w-8 h-8 bg-foreground flex items-center justify-center shrink-0">
        <span className="text-background font-black text-sm">{company.short}</span>
      </div>
      <div className={`${compact ? "flex" : "hidden sm:flex"} flex-col leading-none`}>
        <span className="font-black text-[14px] uppercase tracking-widest">
          {company.name}
        </span>
        <span className="text-[13px] font-mono tracking-widest text-foreground/45 uppercase">
          LLC · Est. {company.established}
        </span>
      </div>
    </>
  );
}
