/**
 * Service để tích hợp với API Tạo Ảnh Thẻ
 */

// Địa chỉ cơ sở của API
const API_BASE_URL = 'http://localhost:8000/api';

// Interface cho kích thước ảnh thẻ
export interface PhotoSize {
    width: number;
    height: number;
    name: string;
    description: string;
}

// Interface cho kết quả xử lý ảnh
export interface PhotoProcessResult {
    original_url: string;
    removed_bg_url: string;
    id_photo_url: string;
    message: string;
}

// Danh sách kích thước ảnh thẻ cố định
export const PHOTO_SIZES: PhotoSize[] = [
    { "width": 35, "height": 45, "name": "3x4", "description": "Ảnh thẻ 3x4 cm" },
    { "width": 40, "height": 60, "name": "4x6", "description": "Ảnh thẻ 4x6 cm" },
    { "width": 20, "height": 30, "name": "2x3", "description": "Ảnh thẻ 2x3 cm" },
    { "width": 25, "height": 35, "name": "2.5x3.5", "description": "Ảnh thẻ 2.5x3.5 cm" },
    { "width": 30, "height": 40, "name": "3x4_small", "description": "Ảnh thẻ 3x4 cm (nhỏ)" },
];

/**
 * Lấy danh sách kích thước ảnh thẻ có sẵn
 */
export async function getPhotoSizes(): Promise<PhotoSize[]> {
    // Trả về danh sách kích thước cố định thay vì gọi API
    return PHOTO_SIZES;
}

/**
 * Tải lên và xử lý ảnh
 * @param file File ảnh cần xử lý
 * @param size Kích thước ảnh thẻ (mặc định: "3x4")
 * @param bgColor Màu nền (mặc định: "255,255,255" - màu trắng)
 */
export async function uploadAndProcessPhoto(
    file: File,
    size: string = '3x4',
    bgColor: string = '255,255,255'
): Promise<PhotoProcessResult> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('size', size);
        formData.append('bg_color', bgColor);

        const response = await fetch(`${API_BASE_URL}/photo/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Lỗi API: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi xử lý ảnh:', error);
        throw error;
    }
}

/**
 * Chuyển đổi mã màu hex sang định dạng RGB cho API
 * @param hexColor Mã màu hex (ví dụ: #FFFFFF)
 * @returns Chuỗi RGB (ví dụ: "255,255,255")
 */
export function hexToRgb(hexColor: string): string {
    // Loại bỏ ký tự # nếu có
    const hex = hexColor.replace('#', '');

    // Chuyển đổi sang RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r},${g},${b}`;
}

/**
 * Lấy URL đầy đủ từ đường dẫn tương đối trả về từ API
 * @param relativePath Đường dẫn tương đối
 * @returns URL đầy đủ
 */
export function getFullUrl(relativePath: string): string {
    return `${API_BASE_URL.replace('/api', '')}${relativePath}`;
}