"use client"
import { Footer } from "@/components/footer";
import * as FadeIn from "@/components/motion/fade";
import Navbar from "@/components/navbar";
import { getFullUrl, hexToRgb } from "@/services/photoApi";
import { type ChangeEvent, useRef, useState } from "react";

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

            const response = await fetch("http://localhost:8000/api/photo/remove-bg", {
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
                    <h1 className="font-bold text-2xl">Xóa phông nền</h1>
                    <p className="text-muted-foreground text-sm">
                        Tải lên ảnh của bạn và chúng tôi sẽ tự động xóa phông nền
                    </p>

                    {/* Khu vực kéo thả ảnh */}
                    <div
                        className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${isLoading ? "border-gray-300 bg-gray-100" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/30"}`}
                        onClick={openFileDialog}
                        onKeyDown={(e) => e.key === 'Enter' && openFileDialog()}
                        // Removed tabIndex={0} as indicated in the linting error
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        role="button"
                        aria-label="Upload image"
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
                                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-blue-500 border-b-2" />
                                <p className="text-muted-foreground text-sm">Đang xử lý ảnh...</p>
                            </div>
                        ) : (

                            <div className="flex flex-col items-center gap-2">
                                <p className="text-muted-foreground text-sm">
                                    Kéo và thả ảnh vào đây hoặc nhấp để chọn ảnh
                                </p>
                                {selectedFile && (
                                    <p className="font-medium text-green-600 text-sm">
                                        Đã chọn: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hiển thị lỗi nếu có */}
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Chọn màu nền */}
                    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                        <h3 className="mb-2 font-medium text-base">Chọn màu nền</h3>
                        <div className="flex flex-wrap gap-2">
                            {backgroundColors.map((color) => (
                                <div
                                    key={color.value}
                                    className={`h-8 w-8 cursor-pointer rounded-full ${color.value === "#FFFFFF" ? "border border-gray-300" : ""} ${selectedColor === color.value ? "ring-2 ring-blue-500" : ""}`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setSelectedColor(color.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedColor(color.value)}
                                    // Xóa tabIndex={0}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Nút xử lý ảnh */}
                    <button
                        onClick={processPhoto}
                        disabled={isLoading || !selectedFile}
                        type="button"
                        className={`mt-2 rounded-md px-4 py-2 font-medium transition-colors ${isLoading || !selectedFile ? "cursor-not-allowed bg-gray-300 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        {isLoading ? "Đang xử lý..." : "Xóa phông nền"}
                    </button>

                    {/* Hiển thị kết quả với thanh gạt so sánh */}
                    {result && (
                        <div className="mt-4">
                            <h3 className="mb-2 font-medium text-base">Kết quả</h3>
                            <div className="relative overflow-hidden rounded-lg border border-gray-200">
                                {/* Ảnh gốc */}
                                <div className="absolute top-0 left-0 h-full w-full">
                                    <img
                                        src={getFullUrl(result.original_url)}
                                        alt="Ảnh gốc"
                                        className="h-auto w-full"
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
                                        className="h-auto w-full"
                                        style={{ backgroundColor: selectedColor }}
                                    />
                                </div>

                                {/* Thanh gạt */}
                                <div className="absolute top-0 left-0 flex h-full w-full items-center">
                                    <div
                                        className="absolute flex h-full w-1 cursor-ew-resize items-center justify-center bg-white"
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
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12H3" />
                                                <path d="M8 5l-5 7 5 7" />
                                                <path d="M16 5l5 7-5 7" />
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
                                    className="rounded-md bg-green-600 px-4 py-2 text-center font-medium text-white hover:bg-green-700"
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