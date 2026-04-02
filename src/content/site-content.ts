type DiscoverChannel = {
  name: string;
  href: string;
  blurb: string;
};

type DiscoverServiceGroup = {
  title: string;
  description: string;
  items: string[];
};

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const siteContent = {
  siteMeta: {
    title: "Tommi Toan",
    domain: "https://tommitoan.com",
    description:
      "Personal space of Toan Ngo (tommitoan) — Go backend engineer, AWS Certified Solutions Architect, homelab operator, and builder of Feng Shui tools and digital products. Based in Ho Chi Minh City, Vietnam.",
    tagline: "Software engineer building backend systems, homelab platforms, and useful product worlds.",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Tech", href: "/tech" },
    { label: "Discover", href: "/discover" },
    { label: "Feng Shui", href: "/fengshui" },
  ] satisfies NavItem[],
  discover: {
    heading: "The broader world behind the resume.",
    intro:
      "Discover is where the personal operating system shows up: the homelab, the services I run, the experiments I keep alive, and the channels where I share or test ideas.",
    now: {
      heading: "What this route is for",
      body:
        "I enjoy building backend systems, but I also like the surrounding layers: infrastructure, deployment flow, observability, self-hosted software, and small products that sharpen the whole stack.",
      highlights: [
        "Go backend and microservice work",
        "GitOps delivery on k3s",
        "Self-hosted apps with real operational constraints",
        "Product experiments that can become public tools",
      ],
    },
    homelab: {
      heading: "Fedora k3s GitOps homelab",
      body:
        "A personal Fedora server runs a 3-node k3s cluster with Argo CD, Helm, GitHub Actions, and a full observability layer. It is both a playground and a serious proving ground for deployment flow, service health, and self-hosted operations.",
      stack: [
        "k3s",
        "Argo CD",
        "Helm",
        "GitHub Actions",
        "Prometheus",
        "Grafana",
        "Jaeger",
        "Loki",
        "Alertmanager",
        "Cloudflared",
      ],
      flow: [
        "Commit code and push",
        "Build and publish artifacts",
        "Argo CD syncs desired state",
        "k3s rolls out and health is checked",
      ],
      image: "/discover/homelab/diagram.png",
      imageAlt: "Homelab architecture diagram showing k3s, GitOps, and observability services.",
    },
    services: [
      {
        title: "Public-facing tools",
        description: "Things that can eventually be linked with confidence.",
        items: ["Bazica", "mytools.tommitoan.space", "future blog platform"],
      },
      {
        title: "Private personal surfaces",
        description: "Useful to me, but not part of the public front door.",
        items: ["memos.tommitoan.space", "files.tommitoan.space", "identity.tommitoan.space"],
      },
      {
        title: "Platform signals",
        description: "The infrastructure layer that proves the ecosystem is real.",
        items: ["Grafana and observability", "GitOps app deployment", "Cloudflare tunnel ingress"],
      },
    ] satisfies DiscoverServiceGroup[],
    experiments: [
      {
        title: "Product incubator",
        description: "Small utilities and product ideas that start private, then graduate into public tools when they are coherent enough.",
      },
      {
        title: "Operational playground",
        description: "A place to test deployment flow, service exposure, observability, and self-hosting decisions before they matter elsewhere.",
      },
      {
        title: "Content and teaching surface",
        description: "An eventual home for demos, walkthroughs, short-form content, and writing that connects code with infrastructure.",
      },
    ],
    channels: [
      {
        name: "GitHub",
        href: "https://github.com/tommitoan",
        blurb: "Code, experiments, and open-source output.",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/tommitoan/",
        blurb: "Professional signal and career-facing updates.",
      },
      {
        name: "Facebook",
        href: "https://www.facebook.com/tommitoan1995/",
        blurb: "Personal identity layer and broader presence.",
      },
      {
        name: "YouTube",
        href: "https://www.youtube.com/@727GamingStudio",
        blurb: "Video content, demos, and future technical storytelling.",
      },
    ] satisfies DiscoverChannel[],
  },
  footer: {
    note: "tommitoan.com is the main gateway for the Tech, Discover, and Feng Shui routes.",
  },
};
