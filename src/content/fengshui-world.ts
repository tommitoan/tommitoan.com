import type { FengShuiLanguage } from "@/content/fengshui-content";

export type WorldStep = {
  /** Han character shown in the ring. */
  glyph: string;
  kicker: string;
  title: string;
  text: string;
};

/** Copy of the Feng Shui world that is not part of the original page: the scene, the story, the dial, the marquee. */
export type WorldCopy = {
  hero: { scrollHint: string; chartCta: string };
  scene: {
    label: string;
    first: string;
    firstSmall: string;
    starLabel: string;
    second: string;
    secondSmall: string;
    third: string;
    thirdSmall: string;
    pillarLabels: [string, string, string, string];
    ageUnit: string;
    sampleNote: string;
    frameAlts: [string, string, string];
  };
  story: { eyebrow: string; title: string; label: string; steps: [WorldStep, WorldStep, WorldStep, WorldStep] };
  dial: {
    eyebrow: string;
    title: string;
    description: string;
    dateLabel: string;
    sunAt: string;
    degreesUnit: string;
    lastTerm: string;
    month: string;
    monthWord: string;
    year: string;
    beforeLichun: string;
    note: string;
    ringLabel: string;
  };
  marquee: { eyebrow: string; title: string; caption: string };
  footer: { note: string };
};

const vi: WorldCopy = {
  hero: { scrollHint: "Cuộn xuống, xem một lá số thành hình", chartCta: "Lập lá số →" },
  scene: {
    label: "Một lá số lớn lên cùng thời gian: từ đêm sao đến bình minh, từ đứa trẻ sơ sinh đến cụ già",
    first: "Trước khi bạn ra đời, chỉ có bầu trời",
    firstSmall: "Cuộn xuống, một vì sao bắt đầu rơi",
    starLabel: "Sao chiếu mệnh của bạn",
    second: "Lúc bạn cất tiếng khóc chào đời, bầu trời được ghi lại",
    secondSmall: "Giờ Ngọ · 15/12/1995 · bốn trụ ra đời cùng bạn",
    third: "Mỗi đại vận là một chặng đường",
    thirdSmall: "Cứ mười năm, người trong lá số lại lớn thêm một chặng",
    pillarLabels: ["Năm", "Tháng", "Ngày", "Giờ"],
    ageUnit: "tuổi",
    sampleNote: "Đây là lá số minh họa, không phải của ai.",
    frameAlts: ["Em bé sơ sinh quấn khăn, nằm trong ánh sáng ấm", "Chàng trai hai mươi hai tuổi đeo túi, sải bước", "Cụ già tám mươi tuổi chống gậy, vẫn quàng khăn đỏ"],
  },
  story: {
    eyebrow: "Cách đọc",
    title: "Bốn trụ, bốn bước",
    label: "Bốn bước đọc một lá số: năm, tháng, ngày, giờ",
    steps: [
      { glyph: "年", kicker: "Bước 1 · Trụ Năm", title: "Năm đổi ở Lập Xuân", text: "Trụ năm đổi vào Lập Xuân, khoảng 4 tháng 2, chứ không phải mùng một Tết." },
      { glyph: "月", kicker: "Bước 2 · Trụ Tháng", title: "Tháng chạy theo tiết khí", text: "Mười hai tiết khí chia năm thành mười hai tháng. Sinh vào mùa nào thì Nhật Chủ vượng hay suy theo mùa đó." },
      { glyph: "日", kicker: "Bước 3 · Trụ Ngày", title: "Thiên can ngày là bạn", text: "Thiên can của ngày sinh là Nhật Chủ, tức là chính bạn. Các trụ còn lại đều được đọc trong quan hệ với nó." },
      { glyph: "時", kicker: "Bước 4 · Trụ Giờ", title: "Giờ sinh theo nơi sinh", text: "Giờ sinh tính theo múi giờ nơi bạn sinh. Lệch hai tiếng là đổi luôn cả trụ giờ." },
    ],
  },
  dial: {
    eyebrow: "Tiết khí",
    title: "Tiết khí là vị trí thật của Mặt Trời",
    description: "Năm Bát Tự đổi khi Mặt Trời đi tới 315° hoàng kinh (Lập Xuân), rồi cứ mỗi 30° tiếp theo lại sang một tháng mới. Kéo thanh ngày để xem.",
    dateLabel: "Ngày trong năm",
    sunAt: "Mặt Trời ở khoảng",
    degreesUnit: "° hoàng kinh",
    lastTerm: "Tiết khí vừa qua",
    month: "Tháng Bát Tự",
    monthWord: "tháng",
    year: "Trụ năm Bát Tự",
    beforeLichun: "(chưa tới Lập Xuân)",
    note: "Số liệu ở đây chỉ gần đúng, để minh họa. Bazica Web tính theo bảng tiết khí của thư viện.",
    ringLabel: "Vòng hoàng đạo với 24 tiết khí và vị trí Mặt Trời",
  },
  marquee: { eyebrow: "Giáp Tý", title: "Vòng sáu mươi năm", caption: "Sáu mươi cặp can chi, cứ sáu mươi năm lại quay về từ đầu." },
  footer: { note: "© Toan Ngo · tommitoan" },
};

const en: WorldCopy = {
  hero: { scrollHint: "Scroll to watch a chart come to life", chartCta: "Make a chart →" },
  scene: {
    label: "A chart grows up over time: from the night sky to dawn, from a newborn to an elder",
    first: "Before you were born, there was only the sky",
    firstSmall: "Scroll on. A star begins to fall",
    starLabel: "The star that watches over you",
    second: "The moment you first cried, the sky was written down",
    secondSmall: "Hour of the Horse · 15 Dec 1995 · your four pillars are born with you",
    third: "Each luck pillar is one stretch of the road",
    thirdSmall: "The person in the chart grows up, ten years at a time",
    pillarLabels: ["Year", "Month", "Day", "Hour"],
    ageUnit: "yrs",
    sampleNote: "A sample chart, not anyone's own.",
    frameAlts: ["A newborn wrapped in cloth, resting in a warm glow", "A young man of twenty-two walking with a shoulder bag", "An elder of eighty leaning on a cane, still wearing the red scarf"],
  },
  story: {
    eyebrow: "How to read",
    title: "Four pillars, four steps",
    label: "Four steps to read a chart: year, month, day, hour",
    steps: [
      { glyph: "年", kicker: "Step 1 · Year pillar", title: "The year turns at Lichun", text: "The year pillar changes at Lichun, around 4 February, not on Lunar New Year's day." },
      { glyph: "月", kicker: "Step 2 · Month pillar", title: "Months follow the solar terms", text: "Twelve solar terms divide the year into twelve months. The season you are born in decides whether the Day Master is strong or weak." },
      { glyph: "日", kicker: "Step 3 · Day pillar", title: "The day stem is you", text: "The stem of your birth day is the Day Master, the part of the chart that is you. Every other pillar is read against it." },
      { glyph: "時", kicker: "Step 4 · Hour pillar", title: "The hour follows the birthplace", text: "Count the hour in the time zone where you were born. Two hours off, and the whole pillar changes." },
    ],
  },
  dial: {
    eyebrow: "Solar terms",
    title: "The solar terms are the Sun's real position",
    description: "The Ba-zi year turns when the Sun reaches 315° of ecliptic longitude (Lichun), and a new month begins every 30° after that. Drag the date to see it.",
    dateLabel: "Day of the year",
    sunAt: "The Sun is at about",
    degreesUnit: "° ecliptic longitude",
    lastTerm: "Last solar term",
    month: "Ba-zi month",
    monthWord: "month of the",
    year: "Ba-zi year pillar",
    beforeLichun: "(Lichun has not come yet)",
    note: "These values are approximate and only for illustration. Bazica Web uses the library's own solar-term tables.",
    ringLabel: "The ecliptic ring with the 24 solar terms and the position of the Sun",
  },
  marquee: { eyebrow: "Jia Zi", title: "The sixty-year cycle", caption: "Sixty stem-and-branch pairs, starting over every sixty years." },
  footer: { note: "© Toan Ngo · tommitoan" },
};

export const worldContent: Record<FengShuiLanguage, WorldCopy> = { vi, en };
