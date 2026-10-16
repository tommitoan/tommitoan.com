import type { FengShuiLanguage } from "@/content/fengshui-content";

/** Copy of the skip link, the 404 page and the error page of the Feng Shui world. */
export type ErrorCopy = {
  skip: string;
  notFound: { eyebrow: string; title: string; text: string; home: string; world: string };
  error: { eyebrow: string; title: string; text: string; retry: string; home: string };
};

const vi: ErrorCopy = {
  skip: "Bỏ qua, đi thẳng tới nội dung chính",
  notFound: {
    eyebrow: "404",
    title: "Không tìm thấy trang này",
    text: "Có thể địa chỉ bị gõ sai, hoặc trang đã được chuyển đi. Bạn thử vào một trong các trang dưới đây nhé.",
    home: "Về trang chủ",
    world: "Góc Phong thuỷ",
  },
  error: {
    eyebrow: "Lỗi",
    title: "Trang này đang gặp sự cố",
    text: "Trang này đang trục trặc. Bạn thử tải lại, hoặc quay về trang chủ.",
    retry: "Thử lại",
    home: "Về trang chủ",
  },
};

const en: ErrorCopy = {
  skip: "Skip to the main content",
  notFound: {
    eyebrow: "404",
    title: "This page was not found",
    text: "The address may be mistyped, or the page may have moved. Try one of the pages below.",
    home: "Home",
    world: "The Feng Shui corner",
  },
  error: {
    eyebrow: "Error",
    title: "This page ran into a problem",
    text: "Something went wrong while loading this page. Try again, or head back home.",
    retry: "Try again",
    home: "Home",
  },
};

export const errorContent: Record<FengShuiLanguage, ErrorCopy> = { vi, en };
