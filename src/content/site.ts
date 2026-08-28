// Single source of truth for all site copy.
// Edit text here — components read from this file.

export const company = {
  name: "A+ Construction Services",
  legal: "A+ Construction Services, LLC",
  short: "A+",
  tagline: "Licensed general contractor serving Maryland, Virginia & DC since 2006.",
  phone: "(703) 200-9060",
  phoneHref: "tel:+17032009060",
  email: "apservices@gmail.com",
  serviceArea: "Maryland · Virginia · DC",
  hours: "Mon–Fri 7am–6pm",
  established: 2006,
};

export const navLinks = [
  { label: "How We Work", href: "#process" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Est. 2006 · Maryland · Virginia · DC",
  titleLines: ["Built for", "how you"],
  titleAccent: "live.",
  body:
    "Known for timely construction, integrity, and reliability — serving Maryland, Virginia, and DC since 2006. When homeowners and businesses have challenging jobs, they call A+.",
  primaryCta: { label: "Start Your Project", href: "#contact" },
  secondaryCta: { label: "See Our Work", href: "#projects" },
};

// TODO(peter): verify every one of these before launch — each is a public claim.
export const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "18", label: "Years in Business" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "$2M+", label: "Value Delivered" },
];

export const showcase = {
  eyebrow: "Overview",
  year: "· 2024",
  title: "A+ Construction Services — Project Showcase",
  slides: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    src: `/videos/showcase-${n}.mp4`,
    poster: `/posters/showcase-${n}.jpg`,
  })),
};

export const servicesSection = {
  eyebrow: "What We Build",
  title: "Our Services",
  blurb: "One team. One standard. From single rooms to full commercial builds.",
  badges: [
    { text: "⚡ 24-Hour Emergency Service Available", tone: "accent" as const },
    { text: "🛡 We Accept All Insurance Claims", tone: "ink" as const },
  ],
  items: [
    { cat: "Interior", name: "Kitchen Remodeling" },
    { cat: "Interior", name: "Bathroom Remodeling" },
    { cat: "Interior", name: "Basement Remodeling" },
    { cat: "Interior", name: "Hardwood Flooring" },
    { cat: "Structural", name: "Foundation Repairs & Waterproofing" },
    { cat: "Emergency", name: "Water Damage Restoration" },
    { cat: "Exterior", name: "Windows & Doors" },
    { cat: "Exterior", name: "Roofing" },
    { cat: "Systems", name: "Electrical" },
    { cat: "Systems", name: "Water Heater & Replacement" },
    { cat: "Systems", name: "A/C Unit" },
    { cat: "Finish", name: "Trim & Molding" },
    { cat: "Systems", name: "Appliance Installation & Removal" },
    { cat: "Commercial", name: "Small Business Fit-Out" },
    { cat: "Exterior", name: "Decks & Exterior" },
    { cat: "General", name: "Disposal" },
  ],
};

export type Project = {
  location: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
};

export type Category = {
  id: string;
  name: string;
  blurb: string;
  projects: Project[];
};

export const projectsSection = {
  eyebrow: "Featured Projects",
  title: "Our Work",
  blurb:
    "Every photo is a real A+ Construction Services project. Browse by category or scroll through the full portfolio.",
  categories: [
    {
      id: "cat-kitchen",
      name: "Kitchens",
      blurb: "Custom cabinetry · Quartz & granite countertops · Open-concept layouts",
      projects: [
        {
          location: "Rockville, MD",
          title: "Quartz Island Kitchen",
          desc: "Full gut renovation — custom shaker cabinets, quartz island, farmhouse sink",
          img: "/images/kitchen-quartz-island.jpg",
          alt: "White quartz island kitchen with pendant lighting",
        },
        {
          location: "Washington, DC",
          title: "Kitchen + Exposed Brick",
          desc: "New cabinets, quartz counters, stainless appliances, exposed brick accent preserved",
          img: "/images/kitchen-brick.jpg",
          alt: "White shaker kitchen with exposed brick accent wall",
        },
        {
          location: "Gaithersburg, MD",
          title: "Granite Island Kitchen",
          desc: "Granite waterfall island, subway tile backsplash, hardwood floors refinished",
          img: "/images/kitchen-granite.jpg",
          alt: "White shaker kitchen with granite island and bar stools",
        },
        {
          location: "Chevy Chase, MD",
          title: "Open Kitchen & Dining",
          desc: "Opened wall between kitchen and dining, new cabinetry, dark hardwood throughout",
          img: "/images/kitchen-dining.jpg",
          alt: "Kitchen and dining room with glass table and light chairs",
        },
      ],
    },
    {
      id: "cat-bathroom",
      name: "Bathrooms",
      blurb: "Walk-in showers · Marble tile · Custom vanities · Black matte fixtures",
      projects: [
        {
          location: "Fairfax, Virginia",
          title: "Marble Walk-In Shower",
          desc: "Full marble surround, frameless glass enclosure, matte black fixtures, hex mosaic floor",
          img: "/images/bath-marble-shower.jpeg",
          alt: "Marble walk-in shower with black matte fixtures and hexagon floor tile",
        },
      ],
    },
    {
      id: "cat-living",
      name: "Living & Basement",
      blurb: "Fireplace surrounds · Basement finishing · Built-in cabinetry · Recessed lighting",
      projects: [
        {
          location: "Silver Spring, MD",
          title: "Marble Fireplace & Built-Ins",
          desc: "Calacatta marble surround, custom built-in cabinets, white oak mantle shelf",
          img: "/images/living-fireplace.png",
          alt: "Marble fireplace surround with wall-mounted TV and white built-in cabinets",
        },
        {
          location: "Arlington, VA",
          title: "Basement Remodel",
          desc: "Full basement finish — new framing, drywall, carpet, recessed lighting, paint",
          img: "/images/living-basement.jpg",
          alt: "Finished basement living room with recessed lighting and open layout",
        },
      ],
    },
    {
      id: "cat-exterior",
      name: "Decks & Exterior",
      blurb: "Composite & cedar decks · Driveways · Gazebos · Railings",
      projects: [
        {
          location: "Herndon, VA",
          title: "Cedar Deck & Gazebo",
          desc: "New cedar deck, octagon gazebo, pressure-treated posts, painted railing",
          img: "/images/deck-cedar-gazebo.jpg",
          alt: "Cedar deck with octagon gazebo and custom wood railing",
        },
        {
          location: "Falls Church, VA",
          title: "Composite Deck Renovation",
          desc: "Trex composite decking, black aluminum balusters, two-level landing",
          img: "/images/deck-composite.jpg",
          alt: "Gray composite deck with black metal balusters and step landing",
        },
        {
          location: "Fairfax, VA",
          title: "Concrete Driveway Install",
          desc: "Full excavation, compacted base, wood form setting, ready for concrete pour",
          img: "/images/driveway-forms.jpg",
          alt: "Concrete driveway forms set and ready for pour",
        },
        {
          location: "Silver Spring, MD",
          title: "Driveway — Finished Pour",
          desc: "Smooth-finish concrete driveway, full-width apron, expansion joints",
          img: "/images/driveway-finished.jpg",
          alt: "Freshly poured concrete driveway with smooth finish",
        },
      ],
    },
  ] satisfies Category[],
};

export const processSection = {
  eyebrow: "How We Work",
  title: "The A+ Process",
  steps: [
    {
      n: "01",
      title: "Discovery Call",
      body: "We audit your space, goals, and budget. No surprises — just an honest assessment.",
    },
    {
      n: "02",
      title: "Design & Blueprint",
      body: "Detailed plans, drawings, and material specs before a single nail is driven.",
    },
    {
      n: "03",
      title: "Precision Build",
      body: "Licensed crews execute on schedule with daily progress updates.",
    },
    {
      n: "04",
      title: "Final Walkthrough",
      body: "We don't hand over keys until every punch-list item is resolved.",
    },
  ],
};

export const aboutSection = {
  eyebrow: "Why A+ Construction Services",
  titleLines: ["The standard", "others measure", "against."],
  body:
    "Licensed, insured, and award-winning general contractor serving Maryland, Virginia, and Washington DC since 2006. Every project is led by a senior foreman with 10+ years of field experience and backed by a 5-year workmanship warranty.",
  features: [
    {
      title: "Fast Turnaround",
      body: "Most residential projects delivered in 2–4 weeks.",
    },
    {
      // TODO(peter): CGC#1234567 is placeholder filler, and "CGC" is a Florida
      // license prefix. Replace with your real MD MHIC / VA / DC numbers
      // before this goes on the custom domain.
      title: "Fully Licensed & Insured",
      body: "CGC#1234567 · $2M liability coverage · Worker's comp included.",
    },
    {
      // TODO(peter): verify this award before launch.
      title: "Award-Winning Work",
      body: "NARI Excellence in Remodeling Award — 2022 & 2023.",
    },
  ],
  images: [
    { src: "/images/bath-marble-shower.jpeg", alt: "Marble walk-in shower", ratio: "aspect-[3/4]" },
    { src: "/images/living-fireplace.png", alt: "Marble fireplace with built-ins", ratio: "aspect-square" },
    { src: "/images/deck-cedar-gazebo.jpg", alt: "Cedar deck and gazebo", ratio: "aspect-square" },
  ],
};

export const testimonialsSection = {
  eyebrow: "Client Voices",
  title: "What They Say",
  items: [
    {
      kind: "Bathroom Remodeling",
      quote:
        "Elmer did an incredible job remodeling both of our bathrooms. The design is sleek and modern, and every detail was executed with real craftsmanship. What stood out most was how reliable and honest Elmer was throughout the entire project. He showed up when he said he would, communicated clearly at every step, and never tried to upsell us. His pricing was incredibly fair — we got high-end results without the high-end price tag. Elmer is hands-down the best in the business.",
      scope: "Home renovations · Bathroom remodeling · Drywall · Flooring",
      name: "Peter Kim",
      role: "Verified Client",
    },
    {
      kind: "Full Home Renovation",
      quote:
        "Elmer and his team do good work and have met many needs of ours in our 98-year-old house — from finishing the basement to remodeling the kitchen to cleaning up after a flood and installing waterproofing. Elmer has a wide breadth of knowledge and I am comfortable turning to him with any job. He truly cares that the work is done properly so that we are taken care of.",
      scope: "Basement finishing · Kitchen remodel · Flood remediation · Waterproofing",
      name: "Kristin Josey",
      role: "Verified Client",
    },
    {
      kind: "Accessible Bathroom Remodel",
      quote:
        "I had to remodel my bathroom to remedy old water damage and address a mobility issue. A+ suggested a walk-in shower with a bench and grab bars. Elmer helped with many concrete suggestions to improve both safety and quality. I appreciated the expert attention to detail. The project took a little longer but it was absolutely worth it — an excellent value.",
      scope: "Bathroom remodeling · Walk-in shower · Safety modifications · Drywall repair",
      name: "Ruth Bittorf",
      role: "Verified Client",
    },
  ],
};

export const contactSection = {
  eyebrow: "Get In Touch",
  titleLines: ["Start your", "project today."],
  body:
    "Free estimates within 24 hours. No pressure, no obligation — just a straight conversation about what you want to build.",
  formTitle: "Free Estimate Request",
  submitLabel: "Send — We Respond Within 24 Hours",
};

export const footerSection = {
  columns: [
    {
      heading: "Services",
      links: [
        "Home Remodeling",
        "Commercial Construction",
        "Bathroom Renovation",
        "Deck & Exterior",
        "Small Business Fit-Out",
      ].map((l) => ({ label: l, href: "#services" })),
    },
    {
      heading: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Our Process", href: "#process" },
        { label: "Projects", href: "#projects" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "Careers", href: "#contact" },
      ],
    },
  ],
};
