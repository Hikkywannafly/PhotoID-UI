"use client"
import { Footer } from "@/components/footer";
import * as FadeIn from "@/components/motion/fade";
import Navbar from "@/components/navbar";
import { getFullUrl, hexToRgb } from "@/services/photoApi";
import { ChangeEvent, useRef, useState } from "react";

export default function RemoveBgPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedColor, setSelectedColor] = useState("#FFFFFF");
    const [sliderPosition, setSliderPosition] = useState(50);
    const [result, setResult] = useState<{ original_url: string; removed_bg_url: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Xử lý khi người dùng chọn file
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setSelectedFile(file);
        setError(null);
    };

    // Xử lý khi người dùng kéo thả file
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            setError(null);
        }
    };

    // Ngăn chặn hành vi mặc định khi kéo thả
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Mở hộp thoại chọn file khi nhấp vào vùng kéo thả
    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Xử lý ảnh với API
    const processPhoto = async () => {
        if (!selectedFile) {
            setError("Vui lòng chọn một ảnh trước khi xóa phông nền");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('bg_color', hexToRgb(selectedColor));

            const response = await fetch(`http://localhost:8000/api/photo/remove-bg`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status}`);
            }

            const data = await response.json();
            setResult({
                original_url: data.original_url,
                removed_bg_url: data.removed_bg_url
            });
        } catch (error) {
            setError("Lỗi khi xử lý ảnh. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Danh sách màu nền
    const backgroundColors = [
        { value: "#FFFFFF", name: "Trắng" },
        { value: "#0000FF", name: "Xanh dương" },
        { value: "#FF0000", name: "Đỏ" },
        { value: "#00FF00", name: "Xanh lá" },
        { value: "#FFFF00", name: "Vàng" },
        { value: "#800080", name: "Tím" },
        { value: "#808080", name: "Xám" },
        { value: "#000000", name: "Đen" },
    ];

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

                    {/* Khu vực kéo thả ảnh */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isLoading ? "bg-gray-100 border-gray-300" : "hover:border-blue-500 hover:bg-blue-50/30 border-gray-300"}`}
                        onClick={openFileDialog}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {isLoading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                                <p className="text-sm text-muted-foreground">Đang xử lý ảnh...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Kéo và thả ảnh vào đây hoặc nhấp để chọn ảnh
                                </p>
                                {selectedFile && (
                                    <p className="text-sm font-medium text-green-600">
                                        Đã chọn: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hiển thị lỗi nếu có */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Chọn màu nền */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="font-medium text-base mb-2">Chọn màu nền</h3>
                        <div className="flex flex-wrap gap-2">
                            {backgroundColors.map((color) => (
                                <div
                                    key={color.value}
                                    className={`w-8 h-8 rounded-full cursor-pointer ${color.value === "#FFFFFF" ? "border border-gray-300" : ""} ${selectedColor === color.value ? "ring-2 ring-blue-500" : ""}`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setSelectedColor(color.value)}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Nút xử lý ảnh */}
                    <button
                        onClick={processPhoto}
                        disabled={isLoading || !selectedFile}
                        className={`mt-2 py-2 px-4 rounded-md font-medium transition-colors ${isLoading || !selectedFile ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        {isLoading ? "Đang xử lý..." : "Xóa phông nền"}
                    </button>

                    {/* Hiển thị kết quả với thanh gạt so sánh */}
                    {result && (
                        <div className="mt-4">
                            <h3 className="font-medium text-base mb-2">Kết quả</h3>
                            <div className="relative overflow-hidden rounded-lg border border-gray-200">
                                {/* Ảnh gốc */}
                                <div className="absolute top-0 left-0 w-full h-full">
                                    <img
                                        src={getFullUrl(result.original_url)}
                                        alt="Ảnh gốc"
                                        className="w-full h-auto"
                                    />
                                </div>

                                {/* Ảnh đã xóa phông nền với clip-path */}
                                <div
                                    className="absolute top-0 left-0 h-full"
                                    style={{
                                        width: '100%',
                                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                                    }}
                                >
                                    <img
                                        src={getFullUrl(result.removed_bg_url)}
                                        alt="Ảnh đã xóa phông nền"
                                        className="w-full h-auto"
                                        style={{ backgroundColor: selectedColor }}
                                    />
                                </div>

                                {/* Thanh gạt */}
                                <div className="absolute top-0 left-0 w-full h-full flex items-center">
                                    <div
                                        className="absolute h-full w-1 bg-white cursor-ew-resize flex justify-center items-center"
                                        style={{ left: `${sliderPosition}%` }}
                                        onMouseDown={(e) => {
                                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                                const container = e.currentTarget.parentElement;
                                                if (container) {
                                                    const rect = container.getBoundingClientRect();
                                                    const x = moveEvent.clientX - rect.left;
                                                    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
                                                    setSliderPosition(newPosition);
                                                }
                                            };

                                            const handleMouseUp = () => {
                                                document.removeEventListener('mousemove', handleMouseMove);
                                                document.removeEventListener('mouseup', handleMouseUp);
                                            };

                                            document.addEventListener('mousemove', handleMouseMove);
                                            document.addEventListener('mouseup', handleMouseUp);
                                        }}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12H3"></path>
                                                <path d="M8 5l-5 7 5 7"></path>
                                                <path d="M16 5l5 7-5 7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nút tải xuống */}
                            <div className="mt-4 flex gap-2">
                                <a
                                    href={getFullUrl(result.removed_bg_url)}
                                    download="removed_background.png"
                                    className="py-2 px-4 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 text-center"
                                >
                                    Tải xuống ảnh đã xóa phông
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </FadeIn.Item>

            <FadeIn.Item>
                <Footer />
            </FadeIn.Item>
        </FadeIn.Container>
    );
}