import type { FengShuiLanguage } from "@/content/fengshui-content";

/** Page chrome of the blog and the About page. The posts themselves live in `content/blog`. */
export type BlogCopy = {
  nav: { blog: string; about: string };
  list: {
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
    readingMinutes: (minutes: number) => string;
    onlyIn: (language: string) => string;
    previewHint: string;
  };
  post: {
    back: string;
    minutes: (minutes: number) => string;
    translation: (language: string) => string;
    readIn: string;
    onlyInThisLanguage: string;
    languageName: Record<FengShuiLanguage, string>;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    lead: string;
    doTitle: string;
    doItems: { title: string; text: string }[];
    fengshuiTitle: string;
    fengshuiText: string[];
    fengshuiCta: string;
    findTitle: string;
    findText: string;
    channels: { name: string; href: string; blurb: string }[];
  };
};

const channelsVi = [
  { name: "GitHub", href: "https://github.com/tommitoan", blurb: "Mã nguồn, thử nghiệm và các dự án mã nguồn mở." },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/tommitoan/", blurb: "Hồ sơ nghề nghiệp." },
  { name: "Facebook", href: "https://www.facebook.com/tommitoan1995/", blurb: "Trang cá nhân." },
  { name: "YouTube", href: "https://www.youtube.com/@727GamingStudio", blurb: "Video và các buổi demo." },
];

const channelsEn = [
  { name: "GitHub", href: "https://github.com/tommitoan", blurb: "Code, experiments and open-source work." },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/tommitoan/", blurb: "Professional profile." },
  { name: "Facebook", href: "https://www.facebook.com/tommitoan1995/", blurb: "Personal page." },
  { name: "YouTube", href: "https://www.youtube.com/@727GamingStudio", blurb: "Videos and demos." },
];

const vi: BlogCopy = {
  nav: { blog: "Bài viết", about: "Giới thiệu" },
  list: {
    eyebrow: "Bài viết",
    title: "Ghi chép về Bát Tự và làm sản phẩm",
    description: "Cách đọc lá số, những chỗ dễ nhầm khi tính tiết khí, và chuyện làm phong thuỷ bằng phần mềm.",
    empty: "Chưa có bài viết nào.",
    readingMinutes: (minutes) => `${minutes} phút đọc`,
    onlyIn: (language) => `Chỉ có bản ${language}`,
    previewHint: "Di chuột vào một bài để xem tóm tắt.",
  },
  post: {
    back: "← Tất cả bài viết",
    minutes: (minutes) => `${minutes} phút đọc`,
    translation: (language) => `Bài này có bản ${language}.`,
    readIn: "Đọc bản này",
    onlyInThisLanguage: "Bài này chưa có bản dịch.",
    languageName: { vi: "tiếng Việt", en: "tiếng Anh" },
  },
  about: {
    eyebrow: "Giới thiệu",
    title: "Mình là Toan, viết Go và làm sản phẩm phong thuỷ",
    description: "Kỹ sư phần mềm ở Thành phố Hồ Chí Minh, làm backend bằng Go, và dành thời gian rảnh cho Bát Tự.",
    lead: "Mình xây các hệ thống backend nhanh, dễ quan sát và bền. Công việc của mình trải từ dịch vụ Go, kiến trúc hướng sự kiện, hạ tầng đám mây, CI/CD, đến phần tư duy sản phẩm để biến nền tảng kỹ thuật thành phần mềm dùng được.",
    doTitle: "Mình làm gì",
    doItems: [
      { title: "Backend", text: "Dịch vụ Go, gRPC, Temporal, hệ thống hướng sự kiện và kiến trúc sạch. Mình coi trọng tính đúng, khả năng quan sát và dễ bảo trì ở mọi tầng." },
      { title: "Đám mây và triển khai", text: "AWS, GCP, Kubernetes và GitOps để việc phát hành đáng tin và việc vận hành nhàm chán theo nghĩa tốt nhất." },
      { title: "Chuẩn kỹ thuật", text: "Mình đặt ra quy ước code, mẫu kiến trúc và công cụ nội bộ để cả nhóm giao việc nhanh hơn mà hệ thống vẫn nhất quán khi lớn lên." },
    ],
    fengshuiTitle: "Phần phong thuỷ",
    fengshuiText: [
      "Với mình, Bát Tự không phải phần phụ bên cạnh công việc lập trình. Nó là một hướng sản phẩm thật: vừa tìm hiểu kiến thức nền, vừa viết code, vừa phải làm sao cho dễ hiểu và dễ dùng.",
      "Bazica là sản phẩm đầu tiên mình làm đến nơi đến chốn: một thư viện Go mã nguồn mở và trang bazi.tommitoan.com.",
    ],
    fengshuiCta: "Xem góc Phong thuỷ",
    findTitle: "Tìm mình ở đâu",
    findText: "Mã nguồn và hồ sơ nghề nghiệp nằm ở các kênh dưới đây.",
    channels: channelsVi,
  },
};

const en: BlogCopy = {
  nav: { blog: "Blog", about: "About" },
  list: {
    eyebrow: "Blog",
    title: "Notes on Ba-zi and building products",
    description: "How to read a chart, the places where solar terms are easy to get wrong, and building Feng Shui as software.",
    empty: "No posts yet.",
    readingMinutes: (minutes) => `${minutes} min read`,
    onlyIn: (language) => `${language} only`,
    previewHint: "Hover a post to see its summary.",
  },
  post: {
    back: "← All posts",
    minutes: (minutes) => `${minutes} min read`,
    translation: (language) => `This post also exists in ${language}.`,
    readIn: "Read it",
    onlyInThisLanguage: "This post has no translation yet.",
    languageName: { vi: "Vietnamese", en: "English" },
  },
  about: {
    eyebrow: "About",
    title: "I'm Toan: I write Go and build Feng Shui products",
    description: "A software engineer in Ho Chi Minh City who builds backends in Go and spends spare time on Ba-zi.",
    lead: "I build backend systems that are fast, observable, and built to last. My work spans Go microservices, event-driven architecture, cloud infrastructure, CI/CD, and the product thinking needed to turn technical foundations into usable software.",
    doTitle: "What I do",
    doItems: [
      { title: "Backend engineering", text: "Go services, gRPC, Temporal workflows, event-driven systems, and clean architecture. I care about correctness, observability, and maintainability at every layer." },
      { title: "Cloud and delivery", text: "AWS, GCP, Kubernetes, and GitOps workflows that make releases reliable and operations boring, in the best possible way." },
      { title: "Engineering standards", text: "Coding conventions, architecture patterns, and internal tooling so teams ship faster and systems stay consistent as they scale." },
    ],
    fengshuiTitle: "The Feng Shui side",
    fengshuiText: [
      "For me Ba-zi is not a side note next to programming. It is a real product direction: learning the background, writing the code, and making it easy to understand and use.",
      "Bazica is the first product I took all the way: an open-source Go library and the website bazi.tommitoan.com.",
    ],
    fengshuiCta: "See the Feng Shui corner",
    findTitle: "Where to find me",
    findText: "Code and professional profiles are on the channels below.",
    channels: channelsEn,
  },
};

export const blogContent: Record<FengShuiLanguage, BlogCopy> = { vi, en };
