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
  title: "Nơi các hệ thống biểu tượng trở thành phần mềm dùng được.",
  description:
    "Đây là nơi dành cho Bazica, Bát Tự (Ba-zi) và sự tò mò rộng hơn về phong thuỷ — thứ cứ liên tục biến thành code, giao diện và các thử nghiệm sản phẩm.",
  primaryCta: "Mở Bazica Web →",
  repoCta: "Xem trên GitHub →",
  intro: [
    "Mình không coi mảng này là phần trang trí bên cạnh công việc kỹ thuật. Đây là một hướng sản phẩm thực sự, nơi nghiên cứu lĩnh vực, triển khai kỹ thuật và việc đơn giản hoá cẩn thận gặp nhau.",
    "Bazica là bằng chứng nghiêm túc đầu tiên: một thư viện Go mã nguồn mở cùng trang web bazi.tommitoan.com, biến một hệ thống biểu tượng ít người biết thành thứ ai cũng có thể thử và dùng.",
  ],
  basics: {
    eyebrow: "Cơ sở",
    title: "Hiểu nhanh về",
    titleAccent: "Bát Tự và Bazica",
    description:
      "Vài ý nền tảng để đọc lá số dễ hơn, và để biết trang web thực sự làm gì.",
    cards: [
      {
        title: "Bát Tự (Ba-zi) là gì?",
        paragraphs: [
          "Bát Tự, hay Tứ Trụ, là cách lập lá số từ thời điểm sinh: năm, tháng, ngày và giờ. Mỗi trụ gồm một Thiên Can và một Địa Chi, nên có tổng cộng tám chữ — “bát tự”.",
          "Thiên Can (10 can) và Địa Chi (12 chi) ghép thành chu kỳ sáu mươi Giáp Tý. Mỗi can chi mang một hành và một âm dương; đọc lá số là xem các hành, các can chi và các mối quan hệ giữa chúng.",
        ],
        points: [
          "Nhật Chủ là Thiên Can của trụ ngày, dùng làm điểm quy chiếu khi đọc lá số.",
          "Trụ tháng đổi theo tiết khí (mốc mặt trời), không theo tháng âm lịch.",
          "Đại Vận là các giai đoạn khoảng mười năm; Lưu Niên là can chi của từng năm.",
        ],
      },
      {
        title: "Bazica Web làm gì?",
        paragraphs: [
          "Bazica Web là trang web dùng thư viện mã nguồn mở Bazica (Go). Máy chủ chỉ kiểm tra dữ liệu nhập rồi gọi thư viện; toàn bộ logic Bát Tự nằm trong thư viện, nên cùng một kết quả có thể kiểm chứng và tái sử dụng.",
          "Bạn nhập ngày giờ sinh, nơi sinh (múi giờ) và giới tính để nhận lá số bằng tiếng Việt hoặc tiếng Anh.",
        ],
        points: [
          "Bốn trụ, Thập Thần, Tàng Can, Trường Sinh, Nạp Âm, các sao, Không Vong và xung.",
          "Đại Vận, bảng Lưu Niên theo từng năm, Ngũ Hành, Cung Mệnh, Thai Nguyên và Thai Tức.",
          "Liên kết chia sẻ lá số, xuất PDF, và phần phương pháp tính nêu rõ các mốc năm, tháng, ngày.",
          "Phần phân tích chi tiết và PDF dùng credit; phần lá số cơ bản có thể xem miễn phí.",
        ],
      },
    ],
    glossaryTitle: "Thuật ngữ cơ bản",
    glossary: [
      {
        term: "Tứ Trụ",
        description: "Bốn trụ năm, tháng, ngày, giờ — mỗi trụ là một cặp can chi.",
      },
      {
        term: "Thiên Can · Địa Chi",
        description: "10 can và 12 chi, ghép thành chu kỳ sáu mươi.",
      },
      {
        term: "Nhật Chủ",
        description: "Can của trụ ngày, điểm quy chiếu khi phân tích.",
      },
      {
        term: "Ngũ Hành",
        description: "Mộc, Hoả, Thổ, Kim, Thuỷ — có quan hệ tương sinh và tương khắc.",
      },
      {
        term: "Thập Thần",
        description: "Mười vai trò của một can so với Nhật Chủ, theo hành và âm dương.",
      },
      {
        term: "Đại Vận · Lưu Niên",
        description: "Vận mười năm và can chi của từng năm cụ thể.",
      },
    ],
    note: "Đây là phần giới thiệu kiến thức nền, không phải lời khuyên cá nhân. Cách tính cụ thể (mốc đổi trụ, giờ sinh, múi giờ) được ghi ngay trên trang Bazica Web.",
  },
  pillarsHeading: { eyebrow: "Trụ cột", title: "Vì sao", accent: "điều này quan trọng" },
  pillars: [
    {
      title: "Vì sao có trang này",
      description:
        "Nó là nơi dành cho phần công việc nằm giữa kỹ thuật, diễn giải và thiết kế sản phẩm — nơi các lĩnh vực ít quen thuộc được biến thành phần mềm bền vững.",
    },
    {
      title: "Bazica chứng minh điều gì",
      description:
        "Mình mã hoá được quy tắc của một lĩnh vực một cách rõ ràng, phát hành một sản phẩm công khai dùng được, và giữ một sản phẩm tập trung đi đến cùng thay vì dừng ở thử nghiệm.",
    },
    {
      title: "Tiếp theo là gì",
      description:
        "Thêm bài giải thích, kể chuyện sản phẩm phong phú hơn, và có thể là các công cụ khác quanh Bát Tự, lịch và phong thuỷ nếu giao diện vẫn đủ rõ ràng.",
    },
  ],
  lanesHeading: { eyebrow: "Lộ trình", title: "Hướng đi", accent: "sắp tới" },
  lanes: [
    {
      title: "Hiện có",
      items: ["Thư viện Bazica (Go)", "Bazica Web — bazi.tommitoan.com", "Kho mã công khai trên GitHub"],
    },
    {
      title: "Lớp tiếp theo",
      items: ["Bài giải thích có hướng dẫn", "Bản xuất đẹp hơn", "Ghi chú kiến thức công khai"],
    },
    {
      title: "Tầm nhìn dài hạn",
      items: ["Máy tính tương tác", "Giao diện phục vụ học tập", "Hệ sinh thái sản phẩm vững hơn"],
    },
  ],
  principlesHeading: { eyebrow: "Nguyên tắc", title: "Cách mình", accent: "xây dựng" },
  principles: [
    "Chuyển sự phức tạp của lĩnh vực thành phần mềm dễ hiểu",
    "Giữ sản phẩm tôn trọng, rõ ràng và hữu ích",
    "Áp dụng kỷ luật kỹ thuật ngay cả với những chủ đề khác thường",
  ],
  linksSection: {
    eyebrow: "Bắt đầu",
    title: "Thử",
    accent: "Bazica",
    description:
      "Sản phẩm đầu tiên của mảng này — thư viện Go mã nguồn mở và trang Bazica Web để lập lá số Bát Tự.",
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
