import { SHICHEN_VI } from "@kit/shichen";
import type { FengShuiLanguage } from "@/content/fengshui-content";
import { ELEMENT_NAMES, type Element } from "@/content/fengshui-stems";

/**
 * The twelve earthly branches (địa chi) for the chart anatomy and branches sections, in the order Tý to Hợi. The Han
 * characters come from the kit (BRANCHES_HAN) and the Vietnamese names from SHICHEN_VI. The pictures are
 * `public/fengshui/branches/branch-NN.webp`, NN being the index. The hidden stems follow the Bazica library's table (main
 * stem first). The title, imagery and caution lines come from the Bazica earthly-branch notes: figures of speech for
 * remembering a branch, and a reminder of what not to conclude from it.
 */
type Pair = Record<FengShuiLanguage, string>;

export type BranchInfo = {
  /** Pinyin, for the English page. */
  en: string;
  element: Element;
  yang: boolean;
  animal: Pair;
  /** The double-hour the branch names, 24-hour clock. */
  hours: string;
  /** Stems hidden in the branch, as indexes into STEMS (0 is Giáp), main stem first. */
  hidden: readonly number[];
  title: Pair;
  imagery: Pair;
  caution: Pair;
};

const branch = (
  en: string,
  element: Element,
  yang: boolean,
  animal: [string, string],
  hours: string,
  hidden: number[],
  title: [string, string],
  imagery: [string, string],
  caution: [string, string],
): BranchInfo => ({
  en,
  element,
  yang,
  animal: { vi: animal[0], en: animal[1] },
  hours,
  hidden,
  title: { vi: title[0], en: title[1] },
  imagery: { vi: imagery[0], en: imagery[1] },
  caution: { vi: caution[0], en: caution[1] },
});

export const BRANCHES: readonly BranchInfo[] = [
  branch(
    "Zi",
    "water",
    true,
    ["Chuột", "Rat"],
    "23:00–01:00",
    [9],
    ["Khởi điểm của vòng", "Where the cycle begins"],
    ["Một chấm nước trong đêm dài", "A drop of water in the long night"],
    ["Gán “thông minh, mưu mẹo” cho mọi người tuổi Chuột là bước suy diễn quá xa. Giờ Tý đi qua nửa đêm nên quy tắc đổi ngày của từng hệ tính lịch cũng cần được kiểm tra.", "Calling everyone born in a Rat year clever or cunning is too long a leap. The Zi hour passes midnight, so the day-change rule of each calendar system also needs checking."],
  ),
  branch(
    "Chou",
    "earth",
    false,
    ["Trâu", "Ox"],
    "01:00–03:00",
    [5, 9, 7],
    ["Nhịp chậm trước xuân", "A slow pace before spring"],
    ["Đất lạnh vẫn giữ hạt", "Cold soil still keeps its seed"],
    ["Không dùng hình trâu để kết luận một cá nhân hiền lành hoặc cam chịu. Hai người cùng tuổi Sửu vẫn có Can năm, tháng, ngày, giờ và môi trường khác nhau.", "Do not use the ox to conclude that a person is gentle or long-suffering. Two people born in Ox years still have different year, month, day and hour stems and different surroundings."],
  ),
  branch(
    "Yin",
    "wood",
    true,
    ["Hổ", "Tiger"],
    "03:00–05:00",
    [0, 2, 4],
    ["Cửa mở của mùa xuân", "The door of spring opens"],
    ["Bước chân trong rừng sớm", "Footsteps in the early forest"],
    ["Hình hổ có thể làm người đọc vội gán dũng cảm, nóng tính hoặc lãnh đạo. Những phẩm chất ấy không đo được chỉ từ một Chi.", "The image of the tiger may tempt a reader to assign courage, temper or leadership. Those qualities cannot be measured from one branch."],
  ),
  branch(
    "Mao",
    "wood",
    false,
    ["Mèo / Thỏ", "Rabbit"],
    "05:00–07:00",
    [1],
    ["Một mùa đang nở", "A season in bloom"],
    ["Tai nghe buổi sáng", "Listening to the morning"],
    ["Đừng lấy khác biệt Mèo/Thỏ để kết luận hai lịch có hai Chi khác nhau; cũng đừng dùng con vật thay cho dữ liệu sinh đầy đủ.", "Do not use the Cat/Rabbit difference to conclude that two calendars have two different branches, or the animal in place of the full birth data."],
  ),
  branch(
    "Chen",
    "earth",
    true,
    ["Rồng", "Dragon"],
    "07:00–09:00",
    [4, 1, 9],
    ["Khoảng chuyển của đất", "The earth in transition"],
    ["Mây trước cơn mưa", "Clouds before the rain"],
    ["Không đồng nhất hình rồng với thiên mệnh, tham vọng hoặc thành công. Đây là biểu tượng văn hóa có lịch sử riêng.", "Do not equate the dragon with destiny, ambition or success. It is a cultural symbol with its own history."],
  ),
  branch(
    "Si",
    "fire",
    false,
    ["Rắn", "Snake"],
    "09:00–11:00",
    [2, 4, 6],
    ["Nhiệt đang tích", "Heat building up"],
    ["Vệt nắng trên đá", "A streak of sun on a stone"],
    ["Không suy từ rắn ra “thâm hiểm” hay “khôn ngoan”. Một biểu tượng đa nghĩa càng cần tránh biến thành phán xét đạo đức.", "Do not infer \"sly\" or \"wise\" from the snake. The more meanings a symbol has, the more it needs guarding from turning into a moral verdict."],
  ),
  branch(
    "Wu",
    "fire",
    true,
    ["Ngựa", "Horse"],
    "11:00–13:00",
    [3, 5],
    ["Giữa ngày, giữa hạ", "Midday, midsummer"],
    ["Bóng ngắn dưới nắng", "Short shadows in the sun"],
    ["Không suy từ con ngựa rằng ai tuổi Ngọ cũng thích tự do, ham đi xa hoặc dễ bốc đồng.", "Do not infer from the horse that everyone born in a Horse year loves freedom, far travel or acts on impulse."],
  ),
  branch(
    "Wei",
    "earth",
    false,
    ["Dê", "Goat"],
    "13:00–15:00",
    [5, 3, 1],
    ["Cái nền sau đỉnh nóng", "The ground after the heat peaks"],
    ["Bóng râm chiều hạ", "Shade on a summer afternoon"],
    ["Không mặc định người tuổi Dê hiền, yếu hay nhẫn nhịn; đó là khuôn mẫu từ hình con vật.", "Do not assume that a Goat person is gentle, weak or patient; that is a stereotype taken from the animal's image."],
  ),
  branch(
    "Shen",
    "metal",
    true,
    ["Khỉ", "Monkey"],
    "15:00–17:00",
    [6, 8, 4],
    ["Mùa bắt đầu đổi hướng", "The season starts to turn"],
    ["Một nhánh cây và con đường mới", "A branch and a new path"],
    ["Tránh gán “khôn lỏi” hoặc “linh hoạt” thành bản chất cá nhân chỉ vì biểu tượng Khỉ.", "Avoid turning \"cunning\" or \"adaptable\" into a personal nature just because of the Monkey symbol."],
  ),
  branch(
    "You",
    "metal",
    false,
    ["Gà", "Rooster"],
    "17:00–19:00",
    [7],
    ["Giờ của tín hiệu", "The hour of the signal"],
    ["Tiếng gáy không thay mặt trời", "A rooster's call is not the sun"],
    ["Đừng suy “hay soi xét” từ hình Gà. Truyện dân gian và quan sát đời thường là hai loại bằng chứng khác nhau.", "Do not infer \"fault-finding\" from the rooster. Folk tales and everyday observation are two different kinds of evidence."],
  ),
  branch(
    "Xu",
    "earth",
    true,
    ["Chó", "Dog"],
    "19:00–21:00",
    [4, 7, 3],
    ["Giữ cửa của mùa", "Keeping the gate of the season"],
    ["Ngọn đèn ở cổng làng", "A lamp at the village gate"],
    ["Không biến Chó thành nhãn “trung thành tuyệt đối” hoặc “cố chấp”. Cả hai đều là kết luận hành vi.", "Do not turn the dog into a label of \"absolute loyalty\" or \"stubbornness\". Both are conclusions about behaviour."],
  ),
  branch(
    "Hai",
    "water",
    false,
    ["Lợn", "Pig"],
    "21:00–23:00",
    [8, 0],
    ["Bắt đầu cất giữ", "Beginning to store"],
    ["Kho nước dưới sân", "A cistern under the yard"],
    ["Đừng dùng hình Lợn để gán lười hoặc ham ăn. Đó là định kiến đối với cả biểu tượng và con người.", "Do not use the pig to assign laziness or greed. That is a prejudice against both the symbol and people."],
  ),
];

export const branchName = (index: number, language: FengShuiLanguage): string => (language === "en" ? BRANCHES[index]!.en : SHICHEN_VI[index]!);

/** "Dương Thủy" / "Yang Water" for a branch. */
export function branchKind(info: BranchInfo, language: FengShuiLanguage): string {
  const polarity = language === "en" ? (info.yang ? "Yang" : "Yin") : info.yang ? "Dương" : "Âm";
  return `${polarity} ${ELEMENT_NAMES[info.element][language]}`;
}

/** Path of a branch's picture. */
export const branchImage = (index: number): string => `/fengshui/branches/branch-${String(index).padStart(2, "0")}.webp`;
