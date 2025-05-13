"use client";

import { type BorderOptions, getFullUrl, getPhotoSizes, hexToRgb, type PhotoProcessResult, type PhotoSize, SHEET_FORMATS, type SheetOptions, uploadAndProcessPhoto } from "@/services/photoApi";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Thêm state cho tùy chọn viền
    const [borderOptions, setBorderOptions] = useState<BorderOptions>({
        enabled: false,
        width: 1,
        color: "#000000"
    });
    
    // Thêm state cho tùy chọn sheet
    const [sheetOptions, setSheetOptions] = useState<SheetOptions>({
        enabled: false,
        format: "A4",
        columns: 4,
        rows: 2,
        spacing: 5
    });

    // Lấy danh sách kích thước ảnh khi component được mount
    useEffect(() => {
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
    }, []); // Empty dependency array means this runs once on mount

    // Xử lý khi người dùng chọn file
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setSelectedFile(file);
        setError(null);
    };

    // Xử lý khi người dùng kéo thả file
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
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

    // Xử lý ảnh với API
    const processPhoto = async () => {
        if (!selectedFile) {
            setError("Vui lòng chọn một ảnh trước khi tạo ảnh thẻ");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const rgbColor = hexToRgb(selectedColor);
            const processResult = await uploadAndProcessPhoto(
                selectedFile, 
                selectedSize, 
                rgbColor,
                borderOptions,
                sheetOptions
            );

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
    
    // Danh sách màu viền
    const borderColors = [
        { value: "#000000", name: "Đen" },
        { value: "#FFFFFF", name: "Trắng" },
        { value: "#FF0000", name: "Đỏ" },
        { value: "#0000FF", name: "Xanh dương" },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Khu vực kéo thả ảnh */}
            <div
                className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${isLoading ? "border-gray-300 bg-gray-100" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/30"}`}
                onClick={openFileDialog}
                onKeyDown={(e) => e.key === 'Enter' && openFileDialog()}
                tabIndex={0}
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

            {/* Tùy chọn */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Chọn kích thước ảnh */}
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-2 font-medium text-base">Chọn kích thước ảnh</h3>
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2"
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
                                role="button"
                                aria-label={`Select ${color.name} background`}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Tùy chọn viền */}
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="enableBorder"
                        checked={borderOptions.enabled}
                        onChange={(e) => setBorderOptions({...borderOptions, enabled: e.target.checked})}
                        className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="enableBorder" className="font-medium text-base">Thêm viền cho ảnh thẻ</label>
                </div>
                
                {borderOptions.enabled && (
                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="borderWidth" className="mb-1 block text-sm">Độ rộng viền (px)</label>
                            <input 
                                id="borderWidth"
                                type="number" 
                                min="1" 
                                max="10"
                                value={borderOptions.width}
                                onChange={(e) => setBorderOptions({...borderOptions, width: Number.parseInt(e.target.value)})}
                                className="w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Màu viền</label>
                            <div className="flex flex-wrap gap-2">
                                {borderColors.map((color) => (
                                    <div
                                        key={color.value}
                                        className={`h-8 w-8 cursor-pointer rounded-full ${color.value === "#FFFFFF" ? "border border-gray-300" : ""} ${borderOptions.color === color.value ? "ring-2 ring-blue-500" : ""}`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => setBorderOptions({...borderOptions, color: color.value})}
                                        onKeyDown={(e) => e.key === 'Enter' && setBorderOptions({...borderOptions, color: color.value})}
                                        role="button"
                                        aria-label={`Select ${color.name} border color`}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Tùy chọn sheet */}
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="enableSheet"
                        checked={sheetOptions.enabled}
                        onChange={(e) => setSheetOptions({...sheetOptions, enabled: e.target.checked})}
                        className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="enableSheet" className="font-medium text-base">Tạo sheet ảnh thẻ</label>
                </div>
                
                {sheetOptions.enabled && (
                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm">Định dạng giấy</label>
                            <select
                                value={sheetOptions.format}
                                onChange={(e) => setSheetOptions({...sheetOptions, format: e.target.value})}
                                className="w-full rounded-md border border-gray-300 p-2"
                            >
                                {SHEET_FORMATS.map((format) => (
                                    <option key={format.name} value={format.name}>
                                        {format.description} ({format.width}x{format.height} mm)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Số cột x Số hàng</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="10"
                                    value={sheetOptions.columns}
                                    onChange={(e) => setSheetOptions({...sheetOptions, columns: Number.parseInt(e.target.value)})}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    placeholder="Số cột"
                                />
                                <span className="flex items-center">x</span>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="10"
                                    value={sheetOptions.rows}
                                    onChange={(e) => setSheetOptions({...sheetOptions, rows: Number.parseInt(e.target.value)})}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                    placeholder="Số hàng"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Khoảng cách giữa các ảnh (mm)</label>
                            <input 
                                type="number" 
                                min="0" 
                                max="20"
                                value={sheetOptions.spacing}
                                onChange={(e) => setSheetOptions({...sheetOptions, spacing: Number.parseInt(e.target.value)})}
                                className="w-full rounded-md border border-gray-300 p-2"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Nút tạo ảnh thẻ */}
            <button
                onClick={processPhoto}
                disabled={isLoading || !selectedFile}
                type="button"
                className={`mt-2 rounded-md px-4 py-2 font-medium transition-colors ${isLoading || !selectedFile ? "cursor-not-allowed bg-gray-300 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
                {isLoading ? "Đang xử lý..." : "Tạo ảnh thẻ"}
            </button>
            
            {/* Hiển thị kết quả */}
            {result && (
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-medium text-base">Ảnh gốc</h3>
                        <img
                            src={getFullUrl(result.original_url)}
                            alt="Ảnh gốc"
                            className="h-auto w-full rounded-md border border-gray-200"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="font-medium text-base">Ảnh thẻ đã xử lý</h3>
                        <img
                            src={getFullUrl(result.id_photo_url)}
                            alt="Ảnh thẻ đã xử lý"
                            className="h-auto w-full rounded-md border border-gray-200"
                        />
                    </div>
                    
                    {/* Hiển thị ảnh thẻ có viền nếu có */}
                    {borderOptions.enabled && result.id_photo_with_border_url && (
                        <div className="flex flex-col gap-2">
                            <h3 className="font-medium text-base">Ảnh thẻ có viền</h3>
                            <img
                                src={getFullUrl(result.id_photo_with_border_url)}
                                alt="Ảnh thẻ có viền"
                                className="h-auto w-full rounded-md border border-gray-200"
                            />
                        </div>
                    )}
                    
                    {/* Hiển thị sheet ảnh thẻ nếu có */}
                    {sheetOptions.enabled && result.photo_sheet_url && (
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <h3 className="font-medium text-base">Sheet ảnh thẻ</h3>
                            <img
                                src={getFullUrl(result.photo_sheet_url)}
                                alt="Sheet ảnh thẻ"
                                className="h-auto w-full rounded-md border border-gray-200"
                            />
                            <a 
                                href={getFullUrl(result.photo_sheet_url)} 
                                download="photo_sheet.jpg"
                                className="mt-2 rounded-md bg-green-600 px-4 py-2 text-center font-medium text-white hover:bg-green-700"
                            >
                                Tải xuống sheet ảnh thẻ
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}