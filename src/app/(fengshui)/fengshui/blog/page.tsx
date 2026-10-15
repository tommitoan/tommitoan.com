import { BlogListView } from "@/components/fengshui/blog/BlogListView";
import { loadEntries } from "@/lib/blog/load";
import { toSummaryEntry } from "@/lib/blog/entries";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Notes on Ba-zi, solar terms and building Feng Shui products as software. / Ghi chép về Bát Tự, tiết khí và làm sản phẩm phong thuỷ bằng phần mềm.",
  path: "/fengshui/blog/",
  keywords: ["Ba-zi", "Bát Tự", "Four Pillars", "bazica", "blog", "Toan Ngo"],
});

export default function BlogPage() {
  return <BlogListView entries={loadEntries().map(toSummaryEntry)} />;
}
