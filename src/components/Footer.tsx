import { company, footerSection } from "@/content/site";
import Wordmark from "./Wordmark";

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wordmark compact />
            </div>
            <p className="text-sm text-foreground/35 leading-relaxed">
              {company.tagline}
            </p>
          </div>

          {footerSection.columns.map((col) => (
            <div key={col.heading}>
              <div className="text-[14px] font-mono tracking-widest text-foreground/35 uppercase mb-4">
                {col.heading}
              </div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-foreground/50 hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="text-[14px] font-mono tracking-widest text-foreground/35 uppercase mb-4">
              Contact
            </div>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li>
                <a href={company.phoneHref} className="hover:text-foreground transition-colors">
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="hover:text-foreground transition-colors">
                  {company.email}
                </a>
              </li>
              <li>{company.hours}</li>
              <li>Emergency Line Available</li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-foreground/10 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="text-sm text-foreground/30 font-mono">
            © {new Date().getFullYear()} {company.legal}. All rights reserved.
          </span>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Licensing"].map((l) => (
              <span
                key={l}
                className="text-sm text-foreground/30 font-mono"
                title="Page not written yet"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
