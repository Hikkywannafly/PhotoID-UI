import { FeatureListSection } from "@/components/features/section";
import { Footer } from "@/components/footer";
import * as FadeIn from "@/components/motion/fade";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <FadeIn.Container className="flex flex-col gap-6">
      <FadeIn.Item>
        <Navbar />
      </FadeIn.Item>

      <FadeIn.Item>
        <p className="text-sm leading-relaxed">
          <strong className="font-semibold">PhotoID</strong> là dịch vụ hiện đại,
          nhẹ nhàng và hiệu suất cao giúp bạn tạo ảnh thẻ chuyên nghiệp một cách nhanh chóng.
          Với công nghệ AI tiên tiến, PhotoID tự động xóa phông nền và điều chỉnh ảnh của bạn
          theo đúng tiêu chuẩn ảnh thẻ, giúp bạn tiết kiệm thời gian và chi phí.
        </p>
      </FadeIn.Item>

      <FadeIn.Item>
        <FeatureListSection />
      </FadeIn.Item>

      <FadeIn.Item>
        <Footer />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
