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
  { name: "GitHub", href: "https://github.com/tommitoan", blurb: "Mã nguồn, các thử nghiệm và dự án mã nguồn mở." },
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
    lead: "Mình làm backend: hệ thống chạy nhanh, dễ theo dõi và bền theo thời gian. Việc của mình đi từ dịch vụ Go, kiến trúc hướng sự kiện, hạ tầng đám mây, CI/CD, đến cả tư duy sản phẩm, để nền tảng kỹ thuật trở thành phần mềm người ta dùng được.",
    doTitle: "Mình làm gì",
    doItems: [
      { title: "Backend", text: "Dịch vụ Go, gRPC, Temporal, hệ thống hướng sự kiện và kiến trúc sạch. Ở tầng nào mình cũng muốn code chạy đúng, dễ theo dõi và dễ bảo trì." },
      { title: "Đám mây và triển khai", text: "AWS, GCP, Kubernetes và GitOps, để mỗi lần phát hành đều yên tâm, còn việc vận hành thì nhàm chán, theo nghĩa tốt nhất của từ này." },
      { title: "Chuẩn kỹ thuật", text: "Mình xây quy ước code, mẫu kiến trúc và công cụ nội bộ để cả nhóm làm nhanh hơn, mà hệ thống vẫn nhất quán khi lớn dần." },
    ],
    fengshuiTitle: "Phần phong thuỷ",
    fengshuiText: [
      "Với mình, Bát Tự không phải thú vui bên lề của việc lập trình. Đó là một hướng sản phẩm thật: vừa học kiến thức nền, vừa viết code, vừa phải làm cho người dùng thấy dễ hiểu, dễ dùng.",
      "Bazica là sản phẩm đầu tiên mình làm đến nơi đến chốn: một thư viện Go mã nguồn mở và trang bazi.tommitoan.com.",
    ],
    fengshuiCta: "Xem góc Phong thuỷ",
    findTitle: "Tìm mình ở đâu",
    findText: "Mã nguồn và hồ sơ nghề nghiệp của mình có ở các kênh dưới đây.",
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
    lead: "I build backend systems that are fast, easy to observe and made to last. My work runs from Go microservices and event-driven design to cloud infrastructure, CI/CD, and the product thinking that turns a solid foundation into software people can actually use.",
    doTitle: "What I do",
    doItems: [
      { title: "Backend engineering", text: "Go services, gRPC, Temporal workflows, event-driven systems, and clean architecture. At every layer I want the code to be correct, easy to observe and easy to maintain." },
      { title: "Cloud and delivery", text: "AWS, GCP, Kubernetes and GitOps, so releases feel safe and operations stay boring, in the best possible way." },
      { title: "Engineering standards", text: "Coding conventions, architecture patterns and internal tooling, so teams ship faster and systems stay consistent as they grow." },
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
