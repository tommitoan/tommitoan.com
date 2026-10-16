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
  /** The footer clock: the double-hour that has just passed, the current one with its countdown, and the next. */
  clock: { hour: string; previous: string; next: string; left: string };
  /** The call to try Bazica Web at the end of the page. */
  cta: { badge: string; free: string };
  scene: {
    label: string;
    first: string;
    starLabel: string;
    second: string;
    secondSmall: string;
    third: string;
    thirdSmall: string;
    pillarLabels: [string, string, string, string];
    ageUnit: string;
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
    month: string;
    monthWord: string;
    monthPillar: string;
    year: string;
    beforeLichun: string;
    /** Role of the term in the Ba-zi month, with {month} for the month's branch. */
    /** How the dial can be used: it runs by itself, and the pointer picks a term. */
    hint: string;
    opens: string;
    middle: string;
    opensBadge: string;
    middleBadge: string;
    imageAlt: string;
    note: string;
    ringLabel: string;
  };
  /** The Day Master section: the day pillar's stem, one of ten, with a picture and a few lines for each. */
  dayMaster: {
    eyebrow: string;
    title: string;
    description: string;
    pickerLabel: string;
    imagery: string;
    shadow: string;
    disclaimer: string;
    finderLabel: string;
    finderResult: string;
    finderNote: string;
    imageAlt: string;
    finderInvalid: string;
  };
  /** The earthly branches section: a ring of the twelve with a painting and the facts of the one in focus. */
  branches: {
    eyebrow: string;
    title: string;
    description: string;
    pickerLabel: string;
    ringLabel: string;
    imageAlt: string;
    hoursLabel: string;
    monthLabel: string;
    /** With {term}, {from}, {to} and {month}: the solar term that opens the month and its usual dates. */
    monthText: string;
    yearsLabel: string;
    hiddenLabel: string;
    harmonyLabel: string;
    /** The three-harmony frame, with {a} and {b} for the two other branches and {element}. */
    triadLabel: string;
    triadText: string;
    clashLabel: string;
    cautionLabel: string;
    hint: string;
    note: string;
  };
  /** The Nạp Âm section: the thirty sounds of the sixty pairs as paintings, with the one in focus explained. */
  nayin: {
    eyebrow: string;
    title: string;
    description: string;
    pickerLabel: string;
    kindLabel: string;
    pairsLabel: string;
    questionLabel: string;
    /** With {pillar} and {pair}: shown when the focused entry holds a pillar of the sample chart. */
    sampleLine: string;
    hint: string;
    note: string;
  };
  /** The chart anatomy section: the eight characters of the sample chart, one at a time, with the pillar's place in the sixty cycle. */
  anatomy: {
    eyebrow: string;
    title: string;
    description: string;
    chartLabel: string;
    stemRow: string;
    branchRow: string;
    pillarTitles: [string, string, string, string];
    dayMasterBadge: string;
    animalLabel: string;
    hoursLabel: string;
    ringLabel: string;
    /** The element of the pillar's Nạp Âm under its name, with {element}. */
    ringElement: string;
    hint: string;
    note: string;
    /** What each place is used for in reading: a line for the stem and one for the branch of each pillar. */
    roles: [AnatomyRole, AnatomyRole, AnatomyRole, AnatomyRole];
  };
  marquee: { eyebrow: string; title: string; caption: string };
  footer: { note: string; replay: string };
};

export type AnatomyRole = { stem: string; branch: string };

const vi: WorldCopy = {
  clock: { hour: "Giờ", previous: "Vừa qua", next: "Sắp tới", left: "còn lại" },
  cta: { badge: "Thử ngay hôm nay", free: "Miễn phí tạo lá số" },
  scene: {
    label: "Một lá số lớn lên cùng thời gian: từ đêm sao đến bình minh, từ đứa trẻ sơ sinh đến cụ già",
    first: "Trước khi bạn ra đời, chỉ có bầu trời",
    starLabel: "Sao chiếu mệnh của bạn",
    second: "Lúc bạn cất tiếng khóc chào đời, bầu trời được ghi lại",
    secondSmall: "Giờ Ngọ · 29/12/1995 · bốn trụ ra đời cùng bạn",
    third: "Mỗi đại vận là một chặng đường",
    thirdSmall: "Cứ mười năm, người trong lá số lại lớn thêm một chặng",
    pillarLabels: ["Năm", "Tháng", "Ngày", "Giờ"],
    ageUnit: "tuổi",
    frameAlts: ["Em bé sơ sinh quấn khăn, nằm trong ánh sáng ấm", "Chàng trai hai mươi hai tuổi đeo túi, sải bước", "Cụ già tám mươi tuổi chống gậy, vẫn quàng khăn đỏ"],
  },
  story: {
    eyebrow: "Cách đọc",
    title: "Đọc lá số trong bốn bước",
    label: "Bốn bước đọc một lá số: trụ năm, trụ tháng, trụ ngày, trụ giờ",
    steps: [
      { glyph: "年", kicker: "Bước 1 · Trụ Năm", title: "Năm mới bắt đầu từ Lập Xuân", text: "Bát Tự không đổi năm vào mùng một Tết mà vào Lập Xuân, khoảng ngày 4 tháng 2. Ai sinh trước mốc đó vẫn thuộc năm trước." },
      { glyph: "月", kicker: "Bước 2 · Trụ Tháng", title: "Tháng đổi theo tiết khí", text: "Một năm có mười hai tháng, mỗi tháng mở đầu bằng một tiết khí. Mùa bạn sinh ra cho biết Nhật Chủ mạnh hay yếu." },
      { glyph: "日", kicker: "Bước 3 · Trụ Ngày", title: "Ngày sinh chính là bạn", text: "Thiên Can của ngày sinh gọi là Nhật Chủ, đại diện cho chính bạn. Mọi can chi còn lại đều được đọc trong quan hệ với nó." },
      { glyph: "時", kicker: "Bước 4 · Trụ Giờ", title: "Giờ sinh tính theo nơi sinh", text: "Giờ sinh tính theo múi giờ nơi bạn chào đời. Chỉ lệch hai tiếng là đã sang một trụ giờ khác." },
    ],
  },
  dial: {
    eyebrow: "Tiết khí",
    title: "Tiết khí quyết định trụ Tháng của bạn",
    description:
      "Bát Tự không tính tháng theo lịch âm hay lịch dương mà theo 12 tiết khí mở tháng (vạch đỏ). Sinh trước hay sau một mốc, dù chỉ vài phút, là đổi chi tháng, tức đổi Nguyệt trụ. Đó là trụ nói về mùa và môi trường bạn sinh ra, và là “nguyệt lệnh”: yếu tố nặng nhất khi xét Nhật chủ mạnh hay yếu.",
    dateLabel: "Ngày trong năm",
    sunAt: "Mặt Trời ở khoảng",
    degreesUnit: "° hoàng kinh",
    month: "Tháng Bát Tự",
    monthWord: "tháng",
    monthPillar: "Nguyệt trụ",
    year: "Trụ năm Bát Tự",
    beforeLichun: "(chưa tới Lập Xuân)",
    hint: "Vòng tự chạy, khoảng 3 giây một tiết. Rê chuột lên vòng (hoặc kéo ngón tay) để chọn một tiết; rời ra là vòng chạy tiếp.",
    opens: "Tiết mở tháng {month}: sinh sau mốc này là sang tháng {month}, Nguyệt trụ đổi.",
    middle: "Trung khí, nằm giữa tháng {month}: Nguyệt trụ vẫn giữ nguyên.",
    opensBadge: "Mở tháng",
    middleBadge: "Giữa tháng",
    imageAlt: "Tranh minh họa tiết {name}",
    note: "Số liệu ở đây chỉ gần đúng, để minh họa. Bazica Web tính theo bảng tiết khí của thư viện.",
    ringLabel: "Vòng hoàng đạo với 24 tiết khí và vị trí Mặt Trời",
  },
  dayMaster: {
    eyebrow: "Nhật chủ",
    title: "Ngày sinh là chính bạn trong lá số",
    description:
      "Trụ ngày là ngày sinh của bạn, và Thiên Can của nó gọi là Nhật chủ: bản thân bạn trong lá số. Mọi Can Chi khác đều được đọc so với Nhật chủ. Có mười Can, mỗi hành hai Can, một dương một âm.",
    pickerLabel: "Chọn một Can",
    imagery: "Hình tượng",
    shadow: "Mặt bóng cần để ý",
    disclaimer: "Đây là hình tượng để ghi nhớ và đặt câu hỏi, không phải kết luận về tính cách. Cùng một Nhật chủ, mùa sinh và các Can Chi còn lại có thể làm hai lá số khác hẳn nhau.",
    finderLabel: "Tìm Nhật chủ theo ngày sinh",
    finderResult: "Ngày {date} là ngày {pillar}. Nhật chủ của bạn là {stem} ({kind}).",
    finderNote: "Tính theo ngày dương lịch. Nếu bạn sinh từ 23:00, ngày có thể tính sang hôm sau tuỳ quy ước; Bazica Web tính đúng theo giờ sinh.",
    imageAlt: "Tranh minh họa Thiên Can {name}",
    finderInvalid: "Ngày chưa hợp lệ. Nhập theo dd/mm/yyyy, từ năm 1900 đến 2100.",
  },
  branches: {
    eyebrow: "Địa Chi",
    title: "Mười hai Địa Chi",
    description:
      "Mười hai Chi làm ba việc cùng lúc: chia một ngày thành mười hai canh giờ, đặt tên cho mười hai tháng tiết khí, và đặt tên cho mười hai năm của vòng con giáp. Trụ giờ, trụ tháng và trụ năm đều lấy Chi từ đó. Mỗi Chi còn mang một hành, một âm dương và vài Thiên Can ẩn bên trong.",
    pickerLabel: "Chọn một Địa Chi",
    ringLabel: "Vòng mười hai Địa Chi, Tý ở trên cùng, đánh dấu Chi lục hợp, tam hợp và lục xung với Chi đang chọn",
    imageAlt: "Tranh minh họa Địa Chi {name}",
    hoursLabel: "Canh giờ",
    monthLabel: "Tháng Ba-zi",
    monthText: "mở đầu ở {term} ({from}–{to}/{month})",
    yearsLabel: "Các năm",
    hiddenLabel: "Can ẩn",
    harmonyLabel: "Lục hợp",
    triadLabel: "Tam hợp",
    triadText: "{a} · {b} (cục {element})",
    clashLabel: "Lục xung",
    cautionLabel: "Cần tránh",
    hint: "Tự chạy mỗi vài giây; rê chuột vào một Chi để chọn và giữ lại. Đường xanh lá nối Chi lục hợp, đường xanh dương nối ba Chi tam hợp, đường đứt đỏ nối Chi xung.",
    note: "Năm tính theo năm Ba-zi, đổi ở Lập Xuân, nên người sinh trong tháng một hoặc tháng hai có thể thuộc năm trước. Hình tượng chỉ để ghi nhớ.",
  },
  nayin: {
    eyebrow: "Nạp Âm",
    title: "Ba mươi Nạp Âm",
    description:
      "Trong vòng sáu mươi Can Chi, cứ hai cặp liên tiếp dùng chung một cái tên và một hành: đó là Nạp Âm. Sáu mươi cặp thành ba mươi tên, mỗi tên là một hình tượng như Hải Trung Kim hay Lư Trung Hỏa, và mỗi trụ của lá số đều mang một Nạp Âm. Các ô bên dưới đi theo thứ tự của vòng sáu mươi.",
    pickerLabel: "Chọn một Nạp Âm",
    kindLabel: "Nạp Âm hành {element}",
    pairsLabel: "Hai cặp Can Chi",
    questionLabel: "Câu hỏi để kiểm tra",
    sampleLine: "Trong lá số mẫu: {pillar} ({pair}) mang Nạp Âm này.",
    hint: "Tự chạy mỗi vài giây; rê chuột vào một ô để chọn và giữ lại.",
    note: "Hình tượng chỉ để ghi nhớ, không phải kết luận về ai. Tên Nạp Âm và cách giải theo truyền thống có nhiều dị bản.",
  },
  anatomy: {
    eyebrow: "Luận giải",
    title: "Tám chữ của một lá số",
    description:
      "Một lá số có bốn trụ, mỗi trụ là một Thiên Can nằm trên một Địa Chi: tám chữ. Rê chuột vào từng chữ để xem nó là gì và dùng để đọc điều gì. Vòng bên cạnh cho thấy cặp can chi đó nằm ở đâu trong sáu mươi cặp, cùng Nạp Âm và ngũ hành của nó.",
    chartLabel: "Bốn trụ của lá số mẫu, tám chữ",
    stemRow: "Thiên Can",
    branchRow: "Địa Chi",
    pillarTitles: ["Trụ Năm", "Trụ Tháng", "Trụ Ngày", "Trụ Giờ"],
    dayMasterBadge: "Nhật Chủ",
    animalLabel: "Con giáp",
    hoursLabel: "Giờ",
    ringLabel: "Vòng sáu mươi cặp can chi, đánh dấu bốn trụ của lá số mẫu",
    ringElement: "Hành {element}",
    hint: "Tự chạy mỗi vài giây; rê chuột vào một chữ để chọn và giữ lại.",
    note: "Cách gắn mỗi vị trí với đời sống là quy ước truyền thống, dùng để học cách đọc, không phải kết luận về ai.",
    roles: [
      {
        stem: "Can của năm sinh. Ba-zi đổi năm ở Lập Xuân chứ không phải mùng một Tết. Theo truyền thống, trụ năm là lớp ngoài cùng của lá số: gốc gác gia đình và thế hệ đi trước.",
        branch: "Chi của năm sinh, cũng là con giáp của năm Ba-zi. Truyền thống xem đây là phần xa nhất của lá số, bối cảnh bạn lớn lên.",
      },
      {
        stem: "Can của tháng sinh. Tháng đổi theo tiết khí, nên người sinh sát mốc tiết có thể thuộc tháng bên cạnh. Truyền thống gắn trụ tháng với cha mẹ và môi trường làm việc.",
        branch: "Chi của tháng sinh cho biết bạn sinh vào mùa nào. Đây là chi có sức nặng lớn nhất khi xét Nhật Chủ vượng hay suy.",
      },
      {
        stem: "Nhật Chủ: chính bạn trong lá số. Cả lá số được đọc quanh chữ này, nên đây là chữ đầu tiên cần tìm.",
        branch: "Chi của ngày sinh, nằm ngay dưới Nhật Chủ. Truyền thống gọi là cung phối ngẫu, nơi xem các mối quan hệ gần gũi nhất.",
      },
      {
        stem: "Can của giờ sinh. Giờ tính theo múi giờ nơi sinh, lệch hai tiếng là đổi cả trụ. Truyền thống gắn trụ giờ với con cái và giai đoạn về sau.",
        branch: "Chi của giờ sinh, tức canh giờ dài hai tiếng bạn chào đời. Biết giờ sinh chính xác là điều khó nhất khi lập lá số.",
      },
    ],
  },
  marquee: { eyebrow: "Giáp Tý", title: "Vòng sáu mươi năm", caption: "Sáu mươi cặp can chi, cứ sáu mươi năm lại quay về từ đầu." },
  footer: { note: "© Toan Ngo · tommitoan", replay: "Trải nghiệm lại hành trình" },
};

const en: WorldCopy = {
  clock: { hour: "Hour of the", previous: "Just passed", next: "Up next", left: "left" },
  cta: { badge: "Try it today", free: "Making a chart is free" },
  scene: {
    label: "A chart grows up over time: from the night sky to dawn, from a newborn to an elder",
    first: "Before you were born, there was only the sky",
    starLabel: "The star that watches over you",
    second: "The moment you first cried, the sky was written down",
    secondSmall: "Hour of the Horse · 29 Dec 1995 · your four pillars are born with you",
    third: "Each luck pillar is one stretch of the road",
    thirdSmall: "The person in the chart grows up, ten years at a time",
    pillarLabels: ["Year", "Month", "Day", "Hour"],
    ageUnit: "yrs",
    frameAlts: ["A newborn wrapped in cloth, resting in a warm glow", "A young man of twenty-two walking with a shoulder bag", "An elder of eighty leaning on a cane, still wearing the red scarf"],
  },
  story: {
    eyebrow: "How to read",
    title: "Reading a chart in four steps",
    label: "Four steps to read a chart: year, month, day and hour pillar",
    steps: [
      { glyph: "年", kicker: "Step 1 · Year pillar", title: "The year begins at Lichun", text: "Ba-zi does not change the year on Lunar New Year's day but at Lichun, around 4 February. Anyone born before that still belongs to the previous year." },
      { glyph: "月", kicker: "Step 2 · Month pillar", title: "The month follows the solar terms", text: "A year has twelve months, each opened by a solar term. The season you were born in shows whether the Day Master is strong or weak." },
      { glyph: "日", kicker: "Step 3 · Day pillar", title: "Your birth day is you", text: "The stem of the birth day is called the Day Master and stands for you. Every other stem and branch is read in relation to it." },
      { glyph: "時", kicker: "Step 4 · Hour pillar", title: "The hour follows your birthplace", text: "The hour is counted in the time zone where you were born. Just two hours off, and it is a different hour pillar." },
    ],
  },
  dial: {
    eyebrow: "Solar terms",
    title: "Solar terms set your Month Pillar",
    description:
      "Ba-zi counts months by the 12 solar terms that open a month (the red ticks), not by lunar or calendar months. Being born a few minutes before or after one of them changes the month branch, and so the Month Pillar: the pillar traditionally read as the season and surroundings you are born into, and the “month command” that weighs most when judging how strong the Day Master is.",
    dateLabel: "Day of the year",
    sunAt: "The Sun is at about",
    degreesUnit: "° ecliptic longitude",
    month: "Ba-zi month",
    monthWord: "month of the",
    monthPillar: "Month Pillar",
    year: "Ba-zi year pillar",
    beforeLichun: "(Lichun has not come yet)",
    hint: "The ring runs by itself, about three seconds a term. Move the pointer over it (or drag a finger) to pick a term; move away and it runs on.",
    opens: "A term that opens the {month} month: born after it, you are in the {month} month and the Month Pillar changes.",
    middle: "A mid-month term inside the {month} month: the Month Pillar stays the same.",
    opensBadge: "Opens a month",
    middleBadge: "Mid-month",
    imageAlt: "Painting of {name}",
    note: "These values are approximate and only for illustration. Bazica Web uses the library's own solar-term tables.",
    ringLabel: "The ecliptic ring with the 24 solar terms and the position of the Sun",
  },
  dayMaster: {
    eyebrow: "Day Master",
    title: "Your birth day is you, in the chart",
    description:
      "The Day Pillar is your birth day, and its heavenly stem is the Day Master: you, in the chart. Every other stem and branch is read against it. There are ten stems, two for each element, one yang and one yin.",
    pickerLabel: "Pick a stem",
    imagery: "Imagery",
    shadow: "Shadow side to watch",
    disclaimer: "This imagery is for remembering and asking questions, not a verdict on character. Two charts with the same Day Master can differ widely in season of birth and in their other stems and branches.",
    finderLabel: "Find your Day Master from your birth date",
    finderResult: "{date} is a {pillar} day. Your Day Master is {stem} ({kind}).",
    finderNote: "Counted by calendar date. If you were born from 23:00 the day may count as the next one, depending on the convention; Bazica Web uses your exact birth time.",
    imageAlt: "Painting of the heavenly stem {name}",
    finderInvalid: "That is not a valid date. Type it as dd/mm/yyyy, from 1900 to 2100.",
  },
  branches: {
    eyebrow: "Earthly branches",
    title: "The twelve earthly branches",
    description:
      "The twelve branches do three jobs at once: they divide a day into twelve double-hours, they name the twelve solar-term months, and they name the twelve years of the animal cycle. The hour, month and year pillars all take their branch from there. Each branch also carries an element, a yin or yang, and a few stems hidden inside it.",
    pickerLabel: "Pick an earthly branch",
    ringLabel: "The ring of the twelve earthly branches, Zi at the top, with the six harmony, three harmony and clash of the chosen branch marked",
    imageAlt: "Painting of the earthly branch {name}",
    hoursLabel: "Double-hour",
    monthLabel: "Ba-zi month",
    monthText: "opens at {term} ({from}–{to}/{month})",
    yearsLabel: "Years",
    hiddenLabel: "Hidden stems",
    harmonyLabel: "Six harmony",
    triadLabel: "Three harmony",
    triadText: "{a} · {b} ({element} frame)",
    clashLabel: "Six clash",
    cautionLabel: "Avoid concluding",
    hint: "It moves on by itself every few seconds; move over a branch to pick it and hold it. A green line joins its six harmony, blue lines join its three-harmony frame, and a dashed red line its clash.",
    note: "Years are Ba-zi years, which change at Lichun, so someone born in January or February may belong to the year before. The imagery is only for remembering.",
  },
  nayin: {
    eyebrow: "Nayin",
    title: "The thirty Nayin",
    description:
      "In the sixty-pair cycle, every two pairs in a row share one name and one element: that is the Nayin (the sound). Sixty pairs make thirty names, each an image such as Sea Metal or Furnace Fire, and every pillar of a chart carries a Nayin. The tiles below follow the order of the sixty-pair cycle.",
    pickerLabel: "Pick a Nayin",
    kindLabel: "{element} Nayin",
    pairsLabel: "The two pairs",
    questionLabel: "A question to test it with",
    sampleLine: "In the sample chart: the {pillar} ({pair}) carries this Nayin.",
    hint: "It moves on by itself every few seconds; move over a tile to pick it and hold it.",
    note: "The imagery is only for remembering, not a verdict on anyone. Nayin names and their traditional explanations have many variants.",
  },
  anatomy: {
    eyebrow: "Reading",
    title: "The eight characters of a chart",
    description:
      "A chart has four pillars, each a heavenly stem over an earthly branch: eight characters. Move over each one to see what it is and what it is used for in reading. The ring beside it shows where that pair stands among the sixty, with its Nayin and element.",
    chartLabel: "The four pillars of the sample chart, eight characters",
    stemRow: "Heavenly stem",
    branchRow: "Earthly branch",
    pillarTitles: ["Year pillar", "Month pillar", "Day pillar", "Hour pillar"],
    dayMasterBadge: "Day Master",
    animalLabel: "Animal",
    hoursLabel: "Hours",
    ringLabel: "The ring of sixty stem and branch pairs, with the four pillars of the sample chart marked",
    ringElement: "{element} element",
    hint: "It moves on by itself every few seconds; move over a character to pick it and hold it.",
    note: "Tying each place to areas of life is a traditional convention, used here to learn how to read, not a verdict on anyone.",
    roles: [
      {
        stem: "The stem of the birth year. Ba-zi changes the year at Lichun, not on Lunar New Year's day. By tradition the year pillar is the outermost layer of the chart: family background and the generation before you.",
        branch: "The branch of the birth year, also the animal of the Ba-zi year. Tradition treats it as the furthest part of the chart, the setting you grew up in.",
      },
      {
        stem: "The stem of the birth month. Months change with the solar terms, so someone born close to a term may belong to the next month. Tradition ties the month pillar to parents and the working environment.",
        branch: "The branch of the birth month tells which season you were born in. It weighs most when judging whether the Day Master is strong or weak.",
      },
      {
        stem: "The Day Master: you, in the chart. The whole chart is read around this character, so it is the first one to find.",
        branch: "The branch of the birth day, sitting right under the Day Master. Tradition calls it the spouse palace, where close relationships are read.",
      },
      {
        stem: "The stem of the birth hour. Count the hour in the time zone of the birthplace; two hours off changes the whole pillar. Tradition ties the hour pillar to children and later life.",
        branch: "The branch of the birth hour, the two-hour period you were born in. The exact birth time is the hardest thing to know when building a chart.",
      },
    ],
  },
  marquee: { eyebrow: "Jia Zi", title: "The sixty-year cycle", caption: "Sixty stem-and-branch pairs, starting over every sixty years." },
  footer: { note: "© Toan Ngo · tommitoan", replay: "Experience the journey again" },
};

export const worldContent: Record<FengShuiLanguage, WorldCopy> = { vi, en };
