import type { FengShuiLanguage } from "@/content/fengshui-content";

/**
 * The 24 solar terms for the pinned dial, in the order of the Sun's ecliptic longitude (index 0 is Xuân Phân at 0 degrees,
 * the same index the kit uses). The images are `public/fengshui/terms/term-NN.webp`, NN being this index. The dates are the
 * usual range in the northern hemisphere and move a little from year to year. The imagery lines are editorial prompts for
 * reflection, not statements about anyone's character; the text comes from the Bazica solar-term notes.
 */
export type TermInfo = {
  vi: string;
  en: string;
  /** Usual first and last day of the month on which the term begins, and that month (1 to 12). */
  from: number;
  to: number;
  month: number;
  imagery: Record<FengShuiLanguage, string>;
};

const term = (vi: string, en: string, from: number, to: number, month: number, imageryVi: string, imageryEn: string): TermInfo => ({
  vi,
  en,
  from,
  to,
  month,
  imagery: { vi: imageryVi, en: imageryEn },
});

export const TERMS: readonly TermInfo[] = [
  term("Xuân Phân", "Spring Equinox", 20, 21, 3, "Ngày đêm gần cân: tìm nhịp giữa tiến và nghỉ.", "Day and night nearly balance: finding the rhythm between moving and resting."),
  term("Thanh Minh", "Pure Brightness", 4, 6, 4, "Trời trong: nhìn rõ điều muốn giữ và điều cần dọn.", "A clear sky: seeing what you want to keep and what needs clearing."),
  term("Cốc Vũ", "Grain Rain", 19, 21, 4, "Mưa cho hạt: chăm việc âm thầm trước khi thấy quả.", "Rain for the seeds: quiet care before any fruit shows."),
  term("Lập Hạ", "Start of Summer", 5, 7, 5, "Sức ấm bước vào: chuẩn bị đi từ ý định sang hành động.", "Warmth steps in: moving from intention to action."),
  term("Tiểu Mãn", "Grain Buds", 20, 22, 5, "Hạt vừa đầy: biết vui với tiến bộ chưa trọn vẹn.", "Grain just filling out: being glad of progress that is not yet complete."),
  term("Mang Chủng", "Grain in Ear", 5, 7, 6, "Mùa gieo và gặt gặp nhau: chọn điều đáng dồn sức.", "Sowing and reaping meet: choosing what deserves your effort."),
  term("Hạ Chí", "Summer Solstice", 20, 22, 6, "Ánh sáng dài nhất: nhìn cả năng lượng và giới hạn.", "The longest light: seeing both your energy and your limits."),
  term("Tiểu Thử", "Minor Heat", 6, 8, 7, "Nóng bắt đầu rõ: tìm nhịp bền trước lúc cao điểm.", "Heat becomes clear: finding a lasting pace before the peak."),
  term("Đại Thử", "Major Heat", 22, 24, 7, "Sức nóng cực điểm: biết khi nào nên dừng để hồi sức.", "The peak of heat: knowing when to stop and recover."),
  term("Lập Thu", "Start of Autumn", 7, 9, 8, "Bước ngoặt của mùa: nhận ra chuyển động khi bề ngoài còn nóng.", "A turn of the season: noticing movement while it still looks hot."),
  term("Xử Thử", "End of Heat", 22, 24, 8, "Nóng lùi dần: buông sức ép không cần mang tiếp.", "The heat recedes: putting down pressure you need not carry."),
  term("Bạch Lộ", "White Dew", 7, 9, 9, "Giọt sương đầu: chú ý những thay đổi nhỏ.", "The first drop of dew: noticing small changes."),
  term("Thu Phân", "Autumn Equinox", 22, 24, 9, "Ngày đêm lại cân: đo lại điều được và điều mất.", "Day and night balance again: weighing what was gained and lost."),
  term("Hàn Lộ", "Cold Dew", 7, 9, 10, "Sương lạnh: thu gọn việc quan trọng.", "Cold dew: gathering in what matters."),
  term("Sương Giáng", "Frost", 22, 24, 10, "Ranh giới lạnh rõ hơn: điều gì cần được bảo vệ?", "The line of cold sharpens: what needs protecting?"),
  term("Lập Đông", "Start of Winter", 7, 8, 11, "Bước vào mùa tích trữ: dành chỗ cho chiều sâu.", "Entering the season of storing: making room for depth."),
  term("Tiểu Tuyết", "Minor Snow", 21, 23, 11, "Sự tĩnh lặng chớm đến: bớt tiếng ồn bên ngoài.", "Stillness begins: less noise from outside."),
  term("Đại Tuyết", "Major Snow", 6, 8, 12, "Lớp phủ dày: giữ ấm điều mình muốn nuôi lâu.", "A thick cover: keeping warm what you want to nurture for long."),
  term("Đông Chí", "Winter Solstice", 21, 23, 12, "Đêm dài nhất: mầm sáng bắt đầu quay về.", "The longest night: a seed of light begins to return."),
  term("Tiểu Hàn", "Minor Cold", 5, 7, 1, "Lạnh hiện diện: bền bỉ trong việc nhỏ mỗi ngày.", "Cold is here: staying steady with small daily tasks."),
  term("Đại Hàn", "Major Cold", 19, 21, 1, "Đoạn lạnh sâu cuối chu kỳ: chuẩn bị cho Lập Xuân mới.", "The deepest cold at the end of the cycle: preparing for the next Start of Spring."),
  term("Lập Xuân", "Start of Spring", 3, 5, 2, "Cánh cửa mở: khởi đầu còn mỏng, chưa cần nở rộ ngay.", "A door opening: the start is still thin and need not bloom at once."),
  term("Vũ Thủy", "Rain Water", 18, 20, 2, "Nước làm mềm đất: tiếp nhận và nuôi một điều mới.", "Water softens the soil: receiving and nurturing something new."),
  term("Kinh Trập", "Awakening of Insects", 5, 7, 3, "Sự sống thức dậy: tiếng động đầu tiên phá yên lặng.", "Life wakes up: the first sound breaks the quiet."),
];

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** The usual dates of a term: "20–21/3" in Vietnamese, "20–21 Mar" in English. */
export function termDates(info: TermInfo, language: FengShuiLanguage): string {
  const days = info.from === info.to ? String(info.from) : `${info.from}–${info.to}`;
  return language === "en" ? `${days} ${MONTHS_EN[info.month - 1]}` : `${days}/${info.month}`;
}

export const termName = (info: TermInfo, language: FengShuiLanguage): string => (language === "en" ? info.en : info.vi);

/** Path of a term's picture. */
export const termImage = (index: number): string => `/fengshui/terms/term-${String(index).padStart(2, "0")}.webp`;
