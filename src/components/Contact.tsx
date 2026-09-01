"use client";

import { useState } from "react";
import { company, contactSection as c, servicesSection } from "@/content/site";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

const FORM_NAME = "estimate-request";

const fieldClass =
  "w-full bg-secondary border border-foreground/10 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/35 transition-colors";
const labelClass =
  "text-[14px] font-mono tracking-widest text-foreground/40 uppercase block mb-1";

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture the form node BEFORE any await. React nulls out `currentTarget`
    // once the synchronous phase of the handler ends, so touching it after the
    // fetch throws — which the catch below would report as a failed send even
    // though the submission already succeeded.
    const form = e.currentTarget;
    setStatus("sending");
    const data = new FormData(form);
    data.set("form-name", FORM_NAME);
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const details = [
    { icon: <IconPhone />, label: "Phone", value: company.phone, href: company.phoneHref },
    { icon: <IconMail />, label: "Email", value: company.email, href: `mailto:${company.email}` },
    { icon: <IconPin />, label: "Service Area", value: company.serviceArea, href: undefined },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <Reveal>
          <SectionHead eyebrow={c.eyebrow} />
          <h2 className="text-5xl md:text-6xl font-black uppercase leading-none mb-8">
            {c.titleLines[0]}
            <br />
            {c.titleLines[1]}
          </h2>
          <p className="text-foreground/50 mb-10 leading-relaxed">{c.body}</p>

          <div className="space-y-3">
            {details.map((d) => {
              const inner = (
                <>
                  <div className="text-foreground/40">{d.icon}</div>
                  <div>
                    <div className="text-[14px] font-mono tracking-widest text-foreground/30">
                      {d.label}
                    </div>
                    <div className="text-sm font-medium group-hover:text-accent transition-colors">
                      {d.value}
                    </div>
                  </div>
                </>
              );
              const cls =
                "flex items-center gap-4 p-5 bg-card border border-foreground/10 hover:border-foreground/25 transition-colors group";
              return d.href ? (
                <a key={d.label} href={d.href} className={cls}>
                  {inner}
                </a>
              ) : (
                <div key={d.label} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <form
            name={FORM_NAME}
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="bg-card border border-foreground/10 p-8 space-y-4"
          >
            <input type="hidden" name="form-name" value={FORM_NAME} />
            <p className="hidden">
              <label>
                Don&apos;t fill this out: <input name="bot-field" />
              </label>
            </p>

            <div className="text-[14px] font-mono tracking-widest text-foreground/40 uppercase mb-6">
              {c.formTitle}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" required placeholder="First Name" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" required placeholder="Last Name" className={fieldClass} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required placeholder="your@email.com" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(703) 555-0123"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="projectType">Project Type</label>
              <select id="projectType" name="projectType" defaultValue="" className={`${fieldClass} appearance-none`}>
                <option value="">Select a service</option>
                {servicesSection.items.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="details">Project Details</label>
              <textarea
                id="details"
                name="details"
                rows={4}
                placeholder="Describe your project, timeline, and budget..."
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="referral">Referral</label>
              <input
                id="referral"
                name="referral"
                placeholder="Name of person who referred you (optional)"
                className={fieldClass}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 bg-foreground text-background font-bold tracking-widest uppercase text-sm hover:bg-foreground/80 transition-colors disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : c.submitLabel}
            </button>

            {status === "sent" && (
              <p role="status" className="text-sm text-accent font-medium">
                Thanks — your request is in. We respond within 24 hours.
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="text-sm text-destructive font-medium">
                That didn&apos;t send. Please call {company.phone} or email {company.email}.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
