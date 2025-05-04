"use client";

import { getFullUrl, getPhotoSizes, hexToRgb, PhotoProcessResult, PhotoSize, uploadAndProcessPhoto } from "@/services/photoApi";
import { ChangeEvent, useRef, useState } from "react";

interface PhotoUploaderProps {
    onPhotoProcessed?: (result: PhotoProcessResult) => void;
}

export default function PhotoUploader({ onPhotoProcessed }: PhotoUploaderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photoSizes, setPhotoSizes] = useState<PhotoSize[]>([]);
    const [selectedSize, setSelectedSize] = useState("3x4");
    const [selectedColor, setSelectedColor] = useState("#FFFFFF");
    const [result, setResult] = useState<PhotoProcessResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Lấy danh sách kích thước ảnh khi component được mount
    useState(() => {
        const fetchPhotoSizes = async () => {
            try {
                const sizes = await getPhotoSizes();
                setPhotoSizes(sizes);
            } catch (error) {
                setError("Không thể lấy danh sách kích thước ảnh");
                console.error(error);
            }
        };

        fetchPhotoSizes();
    });

    // Xử lý khi người dùng chọn file
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        await processPhoto(file);
    };

    // Xử lý khi người dùng kéo thả file
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            await processPhoto(file);
        }
    };

    // Ngăn chặn hành vi mặc định khi kéo thả
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Xử lý ảnh với API
    const processPhoto = async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            const rgbColor = hexToRgb(selectedColor);
            const processResult = await uploadAndProcessPhoto(file, selectedSize, rgbColor);

            setResult(processResult);

            if (onPhotoProcessed) {
                onPhotoProcessed(processResult);
            }
        } catch (error) {
            setError("Lỗi khi xử lý ảnh. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Mở hộp thoại chọn file khi nhấp vào vùng kéo thả
    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
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
        <div className="flex flex-col gap-6">
            {/* Khu vực kéo thả ảnh */}
            <div
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isLoading ? "bg-gray-100 border-gray-300" : "hover:border-blue-500 hover:bg-blue-50/30 border-gray-300"
                    }`}
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
                    <p className="text-sm text-muted-foreground">
                        Kéo và thả ảnh vào đây hoặc nhấp để chọn ảnh
                    </p>
                )}
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Tùy chọn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chọn kích thước ảnh */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-medium text-base mb-2">Chọn kích thước ảnh</h3>
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        disabled={isLoading}
                    >
                        {photoSizes.length > 0 ? (
                            photoSizes.map((size) => (
                                <option key={size.name} value={size.name}>
                                    {size.description} ({size.width}x{size.height} mm)
                                </option>
                            ))
                        ) : (
                            <option value="3x4">Ảnh thẻ 3x4 cm</option>
                        )}
                    </select>
                </div>

                {/* Chọn màu nền */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-medium text-base mb-2">Chọn màu nền</h3>
                    <div className="flex flex-wrap gap-2">
                        {backgroundColors.map((color) => (
                            <div
                                key={color.value}
                                className={`w-8 h-8 rounded-full cursor-pointer ${color.value === "#FFFFFF" ? "border border-gray-300" : ""
                                    } ${selectedColor === color.value ? "ring-2 ring-blue-500" : ""
                                    }`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setSelectedColor(color.value)}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Hiển thị kết quả */}
            {result && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-medium text-base">Ảnh gốc</h3>
                        <img
                            src={getFullUrl(result.original_url)}
                            alt="Ảnh gốc"
                            className="w-full h-auto rounded-md border border-gray-200"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="font-medium text-base">Ảnh thẻ đã xử lý</h3>
                        <img
                            src={getFullUrl(result.id_photo_url)}
                            alt="Ảnh thẻ đã xử lý"
                            className="w-full h-auto rounded-md border border-gray-200"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}