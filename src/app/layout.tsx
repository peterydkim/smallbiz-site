import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { company } from "@/content/site";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const SITE_URL = "https://aplusservicesva.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "A+ Construction Services | Remodeling & General Contracting in MD, VA & DC",
  description:
    "Licensed general contractor serving Maryland, Virginia and Washington DC since 2006. Kitchen, bathroom and basement remodeling, roofing, decks, water damage restoration. Free estimates within 24 hours.",
  keywords: [
    "general contractor Maryland",
    "kitchen remodeling Rockville MD",
    "bathroom remodeling Fairfax VA",
    "basement finishing Silver Spring",
    "deck builder Northern Virginia",
    "water damage restoration DC",
  ],
  openGraph: {
    type: "website",
    siteName: company.name,
    title: "A+ Construction Services — Built for how you live.",
    description:
      "Licensed, insured general contractor serving Maryland, Virginia and DC since 2006. Free estimates within 24 hours.",
    images: ["/images/kitchen-quartz-island.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "A+ Construction Services — Built for how you live.",
    description:
      "Licensed, insured general contractor serving Maryland, Virginia and DC since 2006.",
    images: ["/images/kitchen-quartz-island.jpg"],
  },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: company.legal,
  description: company.tagline,
  telephone: company.phone,
  email: company.email,
  url: SITE_URL,
  foundingDate: String(company.established),
  areaServed: [
    { "@type": "State", name: "Maryland" },
    { "@type": "State", name: "Virginia" },
    { "@type": "City", name: "Washington, DC" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
