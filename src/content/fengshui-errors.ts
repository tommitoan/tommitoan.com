import type { FengShuiLanguage } from "@/content/fengshui-content";

/** Copy of the skip link, the 404 page and the error page of the Feng Shui world. */
export type ErrorCopy = {
  skip: string;
  notFound: { eyebrow: string; title: string; text: string; home: string; world: string; blog: string };
  error: { eyebrow: string; title: string; text: string; retry: string; home: string };
};

const vi: ErrorCopy = {
  skip: "Bỏ qua, đến nội dung chính",
  notFound: {
    eyebrow: "404",
    title: "Không tìm thấy trang này",
    text: "Địa chỉ có thể đã gõ sai hoặc trang đã được chuyển đi. Bạn có thể quay lại một trong các trang dưới đây.",
    home: "Về trang chủ",
    world: "Góc Phong thuỷ",
    blog: "Bài viết",
  },
  error: {
    eyebrow: "Lỗi",
    title: "Trang gặp sự cố",
    text: "Có gì đó trục trặc khi hiển thị trang này. Bạn thử tải lại, hoặc quay về trang chủ.",
    retry: "Thử lại",
    home: "Về trang chủ",
  },
};

const en: ErrorCopy = {
  skip: "Skip to the main content",
  notFound: {
    eyebrow: "404",
    title: "This page was not found",
    text: "The address may be mistyped, or the page has moved. You can go back to one of the pages below.",
    home: "Home",
    world: "The Feng Shui corner",
    blog: "Blog",
  },
  error: {
    eyebrow: "Error",
    title: "This page ran into a problem",
    text: "Something went wrong while showing this page. Try again, or go back home.",
    retry: "Try again",
    home: "Home",
  },
};

export const errorContent: Record<FengShuiLanguage, ErrorCopy> = { vi, en };
