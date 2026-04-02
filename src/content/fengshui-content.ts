export type FengShuiPillar = {
  title: string;
  description: string;
};

export type FengShuiLane = {
  title: string;
  items: string[];
};

export const fengshuiContent = {
  eyebrow: "Feng Shui",
  title: "A product lane where symbolic systems become usable software.",
  description:
    "This route is for Bazica, Ba-zi, and the broader curiosity around Feng Shui that keeps turning into code, interfaces, and product experiments.",
  intro: [
    "I do not treat this lane as decoration beside the engineering work. It is a real product direction where domain research, technical implementation, and careful simplification meet.",
    "Bazica is the first serious proof point: an open-source Go library and live demo that turns a niche symbolic system into something people can actually test and use.",
  ],
  pillars: [
    {
      title: "Why this route exists",
      description:
        "It gives a proper home to the part of my work that sits between engineering, interpretation, and product design. It is where unusual domains get turned into durable software surfaces.",
    },
    {
      title: "What Bazica proves",
      description:
        "It proves I can encode domain rules clearly, ship a usable public artifact, and keep a focused product coherent instead of leaving it as an experiment forever.",
    },
    {
      title: "What comes next",
      description:
        "More explainers, richer product storytelling, and possibly additional tools around Ba-zi, calendar systems, and Feng Shui workflows if the surface stays clear enough.",
    },
  ] satisfies FengShuiPillar[],
  lanes: [
    {
      title: "Current artifact",
      items: ["Bazica Go library", "Live demo", "Public GitHub repository"],
    },
    {
      title: "Likely next layer",
      items: ["Guided explainers", "More polished visual outputs", "Public-facing domain notes"],
    },
    {
      title: "Longer horizon",
      items: ["Interactive calculators", "Teaching-oriented interfaces", "A stronger product ecosystem"],
    },
  ] satisfies FengShuiLane[],
  principles: [
    "Translate domain complexity into understandable software",
    "Keep the product respectful, clear, and useful",
    "Use engineering discipline even in unusual subject areas",
  ],
  links: {
    demo: "https://bazica.onrender.com/",
    repo: "https://github.com/tommitoan/bazica",
  },
};
