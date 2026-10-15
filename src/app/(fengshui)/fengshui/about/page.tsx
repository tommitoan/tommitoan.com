import { AboutView } from "@/components/fengshui/blog/AboutView";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About",
  description:
    "Toan Ngo (tommitoan): a Go backend engineer in Ho Chi Minh City who builds Feng Shui products, including the Bazica Ba-zi library. / Kỹ sư backend Go ở TP. Hồ Chí Minh, làm sản phẩm phong thuỷ như thư viện Bát Tự Bazica.",
  path: "/fengshui/about/",
  keywords: ["Toan Ngo", "tommitoan", "about", "Go", "Bazica", "Ba-zi"],
});

export default function AboutPage() {
  return <AboutView />;
}
