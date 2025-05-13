import { Footer } from "@/components/footer";
import * as FadeIn from "@/components/motion/fade";
import Navbar from "@/components/navbar";

export default function AboutPage() {
    return (
        <FadeIn.Container className="flex flex-col gap-6">
            <FadeIn.Item>
                <Navbar />
            </FadeIn.Item>

            <FadeIn.Item>
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl">Giới thiệu về PhotoID</h1>
                    <p className="text-sm leading-relaxed">
                        PhotoID là dịch vụ hiện đại, nhẹ nhàng và hiệu suất cao giúp bạn tạo ảnh thẻ chuyên nghiệp một cách nhanh chóng.
                        Với công nghệ AI tiên tiến, PhotoID tự động xóa phông nền và điều chỉnh ảnh của bạn
                        theo đúng tiêu chuẩn ảnh thẻ, giúp bạn tiết kiệm thời gian và chi phí.
                    </p>

                    <h2 className="mt-4 font-semibold text-xl">Tính năng chính</h2>
                    <ul className="list-inside list-disc space-y-2 text-sm">
                        <li>Tạo ảnh thẻ tự động theo nhiều kích thước chuẩn</li>
                        <li>Xóa phông nền chuyên nghiệp với công nghệ AI</li>
                        <li>Điều chỉnh màu nền theo ý muốn</li>
                        <li>Tối ưu hóa ảnh theo tiêu chuẩn hộ chiếu, visa, CMND/CCCD</li>
                        <li>Giao diện đơn giản, dễ sử dụng</li>
                    </ul>
                </div>
            </FadeIn.Item>

            <FadeIn.Item>
                <Footer />
            </FadeIn.Item>
        </FadeIn.Container>
    );
}