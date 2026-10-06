export type FengShuiLanguage = "vi" | "en";

export type FengShuiPillar = {
  title: string;
  description: string;
};

export type FengShuiLane = {
  title: string;
  items: string[];
};

export type FengShuiTerm = {
  term: string;
  description: string;
};

export type FengShuiBasicsCard = {
  title: string;
  paragraphs: string[];
  points: string[];
};

export type FengShuiCopy = {
  language: { label: string; vi: string; en: string };
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  repoCta: string;
  intro: string[];
  basics: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    cards: FengShuiBasicsCard[];
    glossaryTitle: string;
    glossary: FengShuiTerm[];
    note: string;
  };
  pillarsHeading: { eyebrow: string; title: string; accent: string };
  pillars: FengShuiPillar[];
  lanesHeading: { eyebrow: string; title: string; accent: string };
  lanes: FengShuiLane[];
  principlesHeading: { eyebrow: string; title: string; accent: string };
  principles: string[];
  linksSection: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    appCta: string;
    repoCta: string;
  };
};

/** The live Bazica Web app and the open-source library behind it. */
export const fengshuiLinks = {
  app: "https://bazi.tommitoan.com/",
  repo: "https://github.com/tommitoan/bazica",
};

const vi: FengShuiCopy = {
  language: { label: "Ngôn ngữ", vi: "VI", en: "EN" },
  eyebrow: "Phong thuỷ · Bát Tự",
  title: "Đưa Bát Tự và phong thuỷ vào phần mềm mà ai cũng dùng được.",
  description:
    "Góc này dành cho Bazica, Bát Tự và mảng phong thuỷ mà mình hay tò mò — làm mãi rồi thành code, giao diện và những sản phẩm thử nghiệm.",
  primaryCta: "Mở Bazica Web →",
  repoCta: "Xem trên GitHub →",
  intro: [
    "Với mình, đây không phải phần phụ bên cạnh công việc lập trình. Nó là một hướng sản phẩm thật: vừa tìm hiểu kiến thức nền, vừa viết code, vừa phải làm sao cho dễ hiểu và dễ dùng.",
    "Bazica là sản phẩm đầu tiên mình làm đến nơi đến chốn: một thư viện Go mã nguồn mở và trang bazi.tommitoan.com, nơi bạn nhập ngày giờ sinh là xem được lá số ngay.",
  ],
  basics: {
    eyebrow: "Cơ sở",
    title: "Hiểu nhanh về",
    titleAccent: "Bát Tự và Bazica",
    description:
      "Vài ý cơ bản giúp bạn đọc lá số dễ hơn, và biết trang web này thực sự làm gì.",
    cards: [
      {
        title: "Bát Tự là gì?",
        paragraphs: [
          "Bát Tự (hay Tứ Trụ) là cách lập lá số từ thời điểm sinh: năm, tháng, ngày, giờ. Mỗi trụ gồm một Thiên Can và một Địa Chi, cộng lại là tám chữ — nên gọi là “bát tự”.",
          "Có 10 Thiên Can và 12 Địa Chi, ghép lại thành vòng 60 Giáp Tý. Mỗi can chi thuộc một hành và một âm dương. Đọc lá số là xem các hành phân bố ra sao, các can chi nào xuất hiện và quan hệ giữa chúng.",
        ],
        points: [
          "Nhật Chủ là Thiên Can của trụ ngày, là mốc để đọc cả lá số.",
          "Trụ tháng đổi theo tiết khí (các mốc của mặt trời), không theo tháng âm lịch.",
          "Đại Vận là các giai đoạn khoảng 10 năm; Lưu Niên là can chi của từng năm.",
        ],
      },
      {
        title: "Bazica Web làm gì?",
        paragraphs: [
          "Bazica Web là trang web chạy trên thư viện mã nguồn mở Bazica (viết bằng Go). Máy chủ chỉ kiểm tra dữ liệu nhập rồi gọi thư viện; mọi phép tính Bát Tự nằm trong thư viện, nên có thể kiểm tra và dùng lại ở nơi khác.",
          "Bạn nhập ngày giờ sinh, nơi sinh (múi giờ) và giới tính, rồi nhận lá số bằng tiếng Việt hoặc tiếng Anh.",
        ],
        points: [
          "Bốn trụ, Thập Thần, Tàng Can, Trường Sinh, Nạp Âm, các sao, Không Vong và xung.",
          "Đại Vận, bảng Lưu Niên theo từng năm, Ngũ Hành, Cung Mệnh, Thai Nguyên, Thai Tức.",
          "Chia sẻ lá số bằng link, xuất PDF, kèm phần giải thích cách tính các mốc năm, tháng, ngày.",
          "Lá số cơ bản xem miễn phí; phần phân tích chi tiết và PDF cần credit.",
        ],
      },
    ],
    glossaryTitle: "Thuật ngữ cơ bản",
    glossary: [
      {
        term: "Tứ Trụ",
        description: "Bốn trụ năm, tháng, ngày, giờ; mỗi trụ là một cặp can chi.",
      },
      {
        term: "Thiên Can · Địa Chi",
        description: "10 can và 12 chi, ghép thành vòng 60.",
      },
      {
        term: "Nhật Chủ",
        description: "Can của trụ ngày, là mốc để phân tích.",
      },
      {
        term: "Ngũ Hành",
        description: "Mộc, Hoả, Thổ, Kim, Thuỷ, có quan hệ tương sinh và tương khắc.",
      },
      {
        term: "Thập Thần",
        description: "Mười mối quan hệ giữa một can với Nhật Chủ, xét theo hành và âm dương.",
      },
      {
        term: "Đại Vận · Lưu Niên",
        description: "Vận mười năm và can chi của từng năm.",
      },
    ],
    note: "Đây là kiến thức nền, không phải lời khuyên cá nhân. Cách tính cụ thể (mốc đổi trụ, giờ sinh, múi giờ) được ghi ngay trên trang Bazica Web.",
  },
  pillarsHeading: { eyebrow: "Lý do", title: "Vì sao mình", accent: "làm điều này" },
  pillars: [
    {
      title: "Vì sao có trang này",
      description:
        "Đây là chỗ cho phần việc nằm giữa lập trình, diễn giải và thiết kế sản phẩm: lấy những lĩnh vực ít người làm phần mềm rồi biến chúng thành công cụ dùng được lâu dài.",
    },
    {
      title: "Bazica cho thấy điều gì",
      description:
        "Mình có thể chuyển quy tắc của một lĩnh vực thành code rõ ràng, đưa ra một sản phẩm công khai dùng được, và theo nó đến cùng thay vì bỏ dở ở mức thử nghiệm.",
    },
    {
      title: "Sắp tới",
      description:
        "Thêm bài giải thích, kể rõ hơn về sản phẩm, và có thể có thêm công cụ về Bát Tự, lịch và phong thuỷ nếu giao diện vẫn giữ được sự gọn gàng.",
    },
  ],
  lanesHeading: { eyebrow: "Lộ trình", title: "Hướng đi", accent: "tiếp theo" },
  lanes: [
    {
      title: "Đã có",
      items: ["Thư viện Bazica (Go)", "Bazica Web — bazi.tommitoan.com", "Mã nguồn công khai trên GitHub"],
    },
    {
      title: "Tiếp theo",
      items: ["Bài giải thích từng bước", "Bản xuất PDF đẹp hơn", "Ghi chú kiến thức công khai"],
    },
    {
      title: "Xa hơn",
      items: ["Công cụ tính toán tương tác", "Giao diện hỗ trợ học Bát Tự", "Hệ sinh thái sản phẩm đầy đủ hơn"],
    },
  ],
  principlesHeading: { eyebrow: "Nguyên tắc", title: "Cách mình", accent: "làm" },
  principles: [
    "Biến kiến thức phức tạp thành phần mềm dễ hiểu",
    "Giữ sản phẩm tôn trọng người dùng, rõ ràng và hữu ích",
    "Làm cẩn thận như mọi dự án kỹ thuật khác, dù chủ đề có lạ",
  ],
  linksSection: {
    eyebrow: "Bắt đầu",
    title: "Thử",
    accent: "Bazica",
    description:
      "Sản phẩm đầu tiên của mảng này: thư viện Go mã nguồn mở và trang Bazica Web để lập lá số Bát Tự.",
    appCta: "Mở Bazica Web →",
    repoCta: "Xem trên GitHub →",
  },
};

const en: FengShuiCopy = {
  language: { label: "Language", vi: "VI", en: "EN" },
  eyebrow: "Feng Shui · Ba-zi",
  title: "A product lane where symbolic systems become usable software.",
  description:
    "This route is for Bazica, Ba-zi, and the broader curiosity around Feng Shui that keeps turning into code, interfaces, and product experiments.",
  primaryCta: "Open Bazica Web →",
  repoCta: "View on GitHub →",
  intro: [
    "I do not treat this lane as decoration beside the engineering work. It is a real product direction where domain research, technical implementation, and careful simplification meet.",
    "Bazica is the first serious proof point: an open-source Go library and the live app at bazi.tommitoan.com that turn a niche symbolic system into something people can actually test and use.",
  ],
  basics: {
    eyebrow: "Basics",
    title: "A quick look at",
    titleAccent: "Ba-zi and Bazica",
    description:
      "A few foundations that make a chart easier to read, and a clear idea of what the web app actually does.",
    cards: [
      {
        title: "What is Ba-zi?",
        paragraphs: [
          "Ba-zi, or the Four Pillars of Destiny, builds a chart from the moment of birth: year, month, day and hour. Each pillar is one Heavenly Stem and one Earthly Branch, which gives eight characters in total — the “eight characters” of the name.",
          "The 10 stems and 12 branches combine into the sixty-step Jiazi cycle. Every stem and branch carries an element and a yin or yang polarity; reading a chart means looking at those elements, the stems and branches, and how they relate.",
        ],
        points: [
          "The Day Master is the stem of the day pillar, the reference point for reading the chart.",
          "The month pillar follows solar terms (sun-based markers), not lunar months.",
          "Luck pillars are periods of about ten years; annual pillars are the stem and branch of each year.",
        ],
      },
      {
        title: "What does Bazica Web do?",
        paragraphs: [
          "Bazica Web is a web app built on the open-source Bazica library (Go). The server only validates input and calls the library; all Ba-zi logic lives in the library, so results can be checked and reused.",
          "You enter a birth date and time, a birthplace (time zone) and gender, and get a chart in Vietnamese or English.",
        ],
        points: [
          "Four pillars, Ten Gods, hidden stems, twelve life stages, Nayin, stars, void branches and clashes.",
          "Luck pillars, a yearly table, element counts, life palace, conception and gestation pillars.",
          "Shareable chart links, PDF export, and a method section that states the year, month and day boundaries.",
          "Detailed analysis and the PDF use credits; the basic chart can be viewed for free.",
        ],
      },
    ],
    glossaryTitle: "Core terms",
    glossary: [
      {
        term: "Four Pillars",
        description: "Year, month, day and hour pillars — each one a stem-and-branch pair.",
      },
      {
        term: "Heavenly Stems · Earthly Branches",
        description: "10 stems and 12 branches, combined into a sixty-step cycle.",
      },
      {
        term: "Day Master",
        description: "The stem of the day pillar, the reference point for analysis.",
      },
      {
        term: "Five Elements",
        description: "Wood, Fire, Earth, Metal, Water — linked by generating and controlling cycles.",
      },
      {
        term: "Ten Gods",
        description: "Ten roles of a stem relative to the Day Master, by element and polarity.",
      },
      {
        term: "Luck pillars · Annual pillars",
        description: "Ten-year periods and the stem and branch of each specific year.",
      },
    ],
    note: "This is background knowledge, not personal advice. The exact rules (pillar boundaries, birth hour, time zone) are stated on the Bazica Web page itself.",
  },
  pillarsHeading: { eyebrow: "Pillars", title: "Why", accent: "this matters" },
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
  ],
  lanesHeading: { eyebrow: "Roadmap", title: "Where this is", accent: "headed" },
  lanes: [
    {
      title: "Current artifact",
      items: ["Bazica Go library", "Bazica Web — bazi.tommitoan.com", "Public GitHub repository"],
    },
    {
      title: "Likely next layer",
      items: ["Guided explainers", "More polished visual outputs", "Public-facing domain notes"],
    },
    {
      title: "Longer horizon",
      items: ["Interactive calculators", "Teaching-oriented interfaces", "A stronger product ecosystem"],
    },
  ],
  principlesHeading: { eyebrow: "Principles", title: "How it", accent: "gets built" },
  principles: [
    "Translate domain complexity into understandable software",
    "Keep the product respectful, clear, and useful",
    "Use engineering discipline even in unusual subject areas",
  ],
  linksSection: {
    eyebrow: "Get started",
    title: "Try",
    accent: "Bazica",
    description:
      "The first product from this lane — an open-source Go library and the Bazica Web app for Ba-zi Four Pillars charts.",
    appCta: "Open Bazica Web →",
    repoCta: "View on GitHub →",
  },
};

export const fengshuiContent: Record<FengShuiLanguage, FengShuiCopy> = { vi, en };

export const DEFAULT_FENGSHUI_LANGUAGE: FengShuiLanguage = "vi";
