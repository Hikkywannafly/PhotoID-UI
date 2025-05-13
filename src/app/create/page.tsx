import { Footer } from "@/components/footer";
import * as FadeIn from "@/components/motion/fade";
import Navbar from "@/components/navbar";
import PhotoUploader from "@/components/photo/PhotoUploader";

export default function CreatePage() {
    return (
        <FadeIn.Container className="flex flex-col gap-6">
            <FadeIn.Item>
                <Navbar />
            </FadeIn.Item>

            <FadeIn.Item>
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl">Tạo ảnh thẻ tự động</h1>
                    <p className="text-muted-foreground text-sm">
                        Tải lên ảnh của bạn và chúng tôi sẽ tự động tạo ảnh thẻ theo đúng tiêu chuẩn
                    </p>

                    <PhotoUploader />
                </div>
            </FadeIn.Item>

            <FadeIn.Item>
                <Footer />
            </FadeIn.Item>
        </FadeIn.Container>
    );
}