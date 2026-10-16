import type { GatewayHomeId } from "@/components/gateway/gatewayHomeConfig";
import type { SiteLanguage } from "@/lib/site-language";

/**
 * What the home page says about each of the three routes, in both languages: the line under the name, what the astronaut
 * says while the route is under the pointer, and a few highlights shown when its window opens wide. The highlights come
 * from the routes' own content (the Tech résumé, the Discover homelab, the Bazica product), so they stay true.
 */
export interface PortalCopy {
  description: string;
  /** One or two short sentences, spoken by the astronaut. */
  speech: string;
  /** Three or four short facts about what is inside. */
  highlights: string[];
}

export const PORTAL_COPY: Record<GatewayHomeId, Record<SiteLanguage, PortalCopy>> = {
  tech: {
    en: {
      description: "Dive into software, engineering, and digital tools.",
      speech: "This is the engineering desk: Go services, cloud systems and the tools behind them. Shall we step in?",
      highlights: ["Go backend and microservices", "120+ Go services in a B2B gaming backend", "AWS Certified Solutions Architect", "Projects, skills, experience and contact"],
    },
    vi: {
      description: "Phần mềm, kỹ thuật và các công cụ số.",
      speech: "Đây là bàn làm việc kỹ thuật: dịch vụ Go, hệ thống cloud và những công cụ phía sau. Mình vào xem nhé?",
      highlights: ["Backend Go và microservice", "Hơn 120 dịch vụ Go trong một backend game B2B", "AWS Certified Solutions Architect", "Dự án, kỹ năng, kinh nghiệm và liên hệ"],
    },
  },
  discover: {
    en: {
      description: "Explore the homelab, the experiments and the channels.",
      speech: "The lab: a homelab, experiments and the channels where ideas get tested. Want a look around?",
      highlights: ["A Fedora homelab with a 3-node k3s cluster", "GitOps with Argo CD, Helm and GitHub Actions", "Observability: Prometheus, Grafana, Loki, Jaeger", "Experiments and the channels where ideas are shared"],
    },
    vi: {
      description: "Khám phá homelab, các thử nghiệm và những kênh chia sẻ.",
      speech: "Phòng thí nghiệm: một homelab, các thử nghiệm và những kênh nơi ý tưởng được thử. Bạn muốn xem một vòng không?",
      highlights: ["Homelab Fedora với cụm k3s 3 node", "GitOps với Argo CD, Helm và GitHub Actions", "Giám sát: Prometheus, Grafana, Loki, Jaeger", "Thử nghiệm và những kênh chia sẻ ý tưởng"],
    },
  },
  fengshui: {
    en: {
      description: "Ba-zi, solar terms and software, in one scroll.",
      speech: "Here Ba-zi meets code. A star falls, a person grows, and a chart tells the story. Ready to see yours?",
      highlights: ["A free Ba-zi chart on Bazica Web", "Solar terms, stems, branches and Nayin", "An open-source Go library, 1700 to 2399", "A life told in four pillars"],
    },
    vi: {
      description: "Bát Tự, tiết khí và phần mềm, trong một lần cuộn.",
      speech: "Ở đây Bát Tự gặp code. Một ngôi sao rơi, một con người lớn lên, và lá số kể câu chuyện. Sẵn sàng xem lá số của bạn chưa?",
      highlights: ["Lập lá số Bát Tự miễn phí trên Bazica Web", "Tiết khí, Thiên Can, Địa Chi và Nạp Âm", "Thư viện Go mã nguồn mở, từ 1700 đến 2399", "Một đời người kể qua bốn trụ"],
    },
  },
};

/** The name of each route as the home page shows it: Vietnamese visitors read it in Vietnamese. */
export const PORTAL_TITLES: Record<GatewayHomeId, Record<SiteLanguage, string>> = {
  tech: { en: "Tech", vi: "Kỹ thuật" },
  discover: { en: "Discover", vi: "Khám phá" },
  fengshui: { en: "Feng Shui", vi: "Phong thuỷ" },
};

/** The words of the home page that are not about one route. */
export const GATEWAY_UI: Record<SiteLanguage, { enter: string; languageLabel: string }> = {
  en: { enter: "Click to enter", languageLabel: "Language" },
  vi: { enter: "Bấm để vào", languageLabel: "Ngôn ngữ" },
};

export function portalTitle(id: GatewayHomeId, language: SiteLanguage): string {
  return PORTAL_TITLES[id][language];
}

export function portalCopy(id: GatewayHomeId, language: SiteLanguage): PortalCopy {
  return PORTAL_COPY[id][language];
}
