import { Footer } from "@/components/footer";
import * as FadeIn from "@/components/motion/fade";
import Navbar from "@/components/navbar";

export default function RemoveBgPage() {
    return (
        <FadeIn.Container className="flex flex-col gap-6">
            <FadeIn.Item>
                <Navbar />
            </FadeIn.Item>

            <FadeIn.Item>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-bold">Xóa phông nền</h1>
                    <p className="text-sm text-muted-foreground">
                        Tải lên ảnh của bạn và chúng tôi sẽ tự động xóa phông nền
                    </p>

                    {/* Thêm form upload ảnh ở đây */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <p className="text-sm text-muted-foreground">Kéo và thả ảnh vào đây hoặc nhấp để chọn ảnh</p>
                    </div>
                </div>
            </FadeIn.Item>

            <FadeIn.Item>
                <Footer />
            </FadeIn.Item>
        </FadeIn.Container>
    );
}