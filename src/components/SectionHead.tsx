export default function SectionHead({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-5 h-px bg-foreground/30" />
      <span className="text-sm tracking-[0.25em] text-foreground/40 uppercase font-medium">
        {eyebrow}
      </span>
    </div>
  );
}
