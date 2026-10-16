import type { FengShuiLanguage } from "@/content/fengshui-content";

/**
 * The ten heavenly stems (thiên can) for the Day Master section, in the order Giáp to Quý. The pictures are
 * `public/fengshui/stems/stem-NN.webp`. The imagery and shadow lines are editorial figures of speech for remembering a
 * stem and asking questions, taken from the Bazica stem notes; they are not conclusions about anyone's character.
 */
export type Element = "wood" | "fire" | "earth" | "metal" | "water";

type Pair = Record<FengShuiLanguage, string>;

export type StemInfo = {
  han: string;
  vi: string;
  en: string;
  element: Element;
  yang: boolean;
  title: Pair;
  imagery: Pair;
  shadow: Pair;
};

const stem = (
  han: string,
  vi: string,
  en: string,
  element: Element,
  yang: boolean,
  title: [string, string],
  imagery: [string, string],
  shadow: [string, string],
): StemInfo => ({
  han,
  vi,
  en,
  element,
  yang,
  title: { vi: title[0], en: title[1] },
  imagery: { vi: imagery[0], en: imagery[1] },
  shadow: { vi: shadow[0], en: shadow[1] },
});

export const STEMS: readonly StemInfo[] = [
  stem("甲", "Giáp", "Jia", "wood", true, ["Khởi sự và giữ trục", "Starting and holding the trunk"],
    ["Cây lớn có thân chính: tăng trưởng có hướng, cần không gian và một trục để đứng.", "A great tree with a main trunk: growth with a direction, needing room and an axis to stand on."],
    ["Ôm một hướng quá lâu, hoặc coi thay đổi là thất bại.", "Holding one direction too long, or treating change as failure."]),
  stem("乙", "Ất", "Yi", "wood", false, ["Mềm để tìm đường", "Soft enough to find a way"],
    ["Dây leo hay cành mềm: vẫn muốn lớn, nhưng đi linh hoạt và dựa vào điểm tựa.", "A vine or a soft branch: still growing, but flexible and leaning on a support."],
    ["Dễ đổi hướng theo chỗ bám, hoặc vòng quá xa để tránh một va chạm cần thiết.", "Turning with whatever it clings to, or going far round a clash that needs facing."]),
  stem("丙", "Bính", "Bing", "fire", true, ["Ánh sáng có tầm lan", "Light that reaches far"],
    ["Mặt trời: năng lượng hướng ra ngoài, dễ thấy, lan rộng.", "The sun: energy turned outward, easy to see, spreading wide."],
    ["Làm quá nhanh, cháy mạnh rồi hụt sức, hoặc chiếu sáng mà bỏ qua giới hạn của người khác.", "Moving too fast, burning bright then running short, or lighting up what you want and ignoring others' limits."]),
  stem("丁", "Đinh", "Ding", "fire", false, ["Ngọn sáng gần người", "A flame close to people"],
    ["Ngọn đèn: nhỏ hơn mặt trời nhưng soi rất rõ một góc phòng.", "A lamp: smaller than the sun, but it lights one corner of a room very clearly."],
    ["Soi quá kỹ một điểm, hoặc chỉ đủ nhiên liệu cho một việc mà quên hồi sức.", "Lighting one spot too closely, or fuel for only one task with no time to recover."]),
  stem("戊", "Mậu", "Wu", "earth", true, ["Nền đất và sức chịu tải", "Ground and carrying strength"],
    ["Đồi núi hay nền đất lớn: khả năng chứa đựng, định ranh giới và gánh tải.", "Hills or broad ground: the ability to hold, to set boundaries and to carry a load."],
    ["Nhận quá nhiều việc, tích tụ bất mãn, hoặc nhầm im lặng với chấp nhận.", "Taking on too much, storing resentment, or mistaking silence for acceptance."]),
  stem("己", "Kỷ", "Ji", "earth", false, ["Đất gần bàn tay", "Soil within reach of the hand"],
    ["Đất ruộng có thể chăm bón: chú ý chi tiết, dưỡng nuôi, chỉnh từng luống.", "Field soil that can be tended: attention to detail, nurturing, adjusting row by row."],
    ["Lo từng chi tiết đến mệt, hoặc giữ nề nếp cũ quá lâu.", "Worrying over every detail until tired, or keeping old habits too long."]),
  stem("庚", "Canh", "Geng", "metal", true, ["Lưỡi cắt và quyết định", "The blade and the decision"],
    ["Kim loại thô hay lưỡi dao lớn: cắt, chọn và kết thúc việc đã tới hạn.", "Raw metal or a great blade: cutting, choosing and ending what has reached its limit."],
    ["Quá nhanh, làm tổn thương người khác, hoặc tưởng mọi vấn đề chỉ cần một nhát dứt điểm.", "Too quick, hurting others, or believing every problem needs one clean cut."]),
  stem("辛", "Tân", "Xin", "metal", false, ["Độ sắc của đường nét", "The sharpness of a line"],
    ["Kim loại đã mài hay món đồ tinh xảo: đường nét rõ, tiêu chuẩn, vẻ hoàn chỉnh.", "Polished metal or a fine piece of work: clear lines, standards, a finished look."],
    ["Quá nhạy với lỗi nhỏ, phê bình sắc, hoặc giữ hình thức cả lúc cần đổi cách làm.", "Over-alert to small flaws, sharp criticism, or keeping the form when the way must change."]),
  stem("壬", "Nhâm", "Ren", "water", true, ["Dòng lớn và đường xa", "A great river and the long way"],
    ["Sông lớn hay biển rộng: nối nhiều nguồn, nghĩ theo dòng dài, tìm đường vòng.", "A great river or a wide sea: joining many sources, thinking in long currents, finding the roundabout way."],
    ["Trôi quá xa trong giả thuyết, tích quá nhiều phương án, khó neo vào bước làm cụ thể.", "Drifting far into hypotheses, piling up options, hard to anchor in a concrete step."]),
  stem("癸", "Quý", "Gui", "water", false, ["Nước thấm vào khe nhỏ", "Water seeping into small cracks"],
    ["Mưa nhẹ, sương hay nước ngầm: quan sát tinh, đi vào chi tiết, tích lũy.", "Light rain, mist or groundwater: fine observation, going into detail, gathering."],
    ["Giữ suy nghĩ quá sâu bên trong, khó nói điều cần nói, thiếu điểm dừng khi phân tích.", "Keeping thoughts too deep inside, hard to say what needs saying, no stopping point when analysing."]),
];

export const ELEMENT_NAMES: Record<Element, Pair> = {
  wood: { vi: "Mộc", en: "Wood" },
  fire: { vi: "Hỏa", en: "Fire" },
  earth: { vi: "Thổ", en: "Earth" },
  metal: { vi: "Kim", en: "Metal" },
  water: { vi: "Thủy", en: "Water" },
};

export const stemName = (info: StemInfo, language: FengShuiLanguage): string => (language === "en" ? info.en : info.vi);

/** "Dương Mộc" / "Yang Wood". */
export function stemKind(info: StemInfo, language: FengShuiLanguage): string {
  const polarity = language === "en" ? (info.yang ? "Yang" : "Yin") : info.yang ? "Dương" : "Âm";
  return `${polarity} ${ELEMENT_NAMES[info.element][language]}`;
}

/** Path of a stem's picture. */
export const stemImage = (index: number): string => `/fengshui/stems/stem-${String(index).padStart(2, "0")}.webp`;
