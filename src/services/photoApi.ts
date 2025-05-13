/**
 * Service để tích hợp với API Tạo Ảnh Thẻ
 */

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
    id_photo_with_border_url: string; // URL ảnh thẻ có viền
    photo_sheet_url: string; // URL sheet ảnh thẻ
    message: string;
}

// Interface cho tùy chọn viền
export interface BorderOptions {
    enabled: boolean;
    width: number; // Độ rộng viền tính bằng pixel
    color: string; // Màu viền dạng hex
}

// Interface cho tùy chọn sheet
export interface SheetOptions {
    enabled: boolean;
    format: string; // Định dạng giấy: "A4", "4x6", etc.
    columns: number; // Số cột ảnh
    rows: number; // Số hàng ảnh
    spacing: number; // Khoảng cách giữa các ảnh (mm)
}

// Danh sách kích thước ảnh thẻ cố định
export const PHOTO_SIZES: PhotoSize[] = [
    { "width": 35, "height": 45, "name": "3x4", "description": "Ảnh thẻ 3x4 cm" },
    { "width": 40, "height": 60, "name": "4x6", "description": "Ảnh thẻ 4x6 cm" },
    { "width": 20, "height": 30, "name": "2x3", "description": "Ảnh thẻ 2x3 cm" },
    { "width": 25, "height": 35, "name": "2.5x3.5", "description": "Ảnh thẻ 2.5x3.5 cm" },
    { "width": 30, "height": 40, "name": "3x4_small", "description": "Ảnh thẻ 3x4 cm (nhỏ)" },
];

// Danh sách định dạng giấy in
export const SHEET_FORMATS = [
    { name: "A4", width: 210, height: 297, description: "Khổ giấy A4" },
    { name: "A5", width: 148, height: 210, description: "Khổ giấy A5" },
    { name: "4x6", width: 102, height: 152, description: "Khổ ảnh 4x6 inch" },
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
 * @param borderOptions Tùy chọn viền (mặc định: không có viền)
 * @param sheetOptions Tùy chọn sheet (mặc định: không tạo sheet)
 */
export async function uploadAndProcessPhoto(
    file: File,
    size = '3x4',
    bgColor = '255,255,255',
    borderOptions: BorderOptions = { enabled: false, width: 1, color: '#000000' },
    sheetOptions: SheetOptions = { enabled: false, format: 'A4', columns: 4, rows: 2, spacing: 5 }
): Promise<PhotoProcessResult> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('size', size);
        formData.append('bg_color', bgColor);

        // Thêm tùy chọn viền
        formData.append('border_enabled', borderOptions.enabled.toString());
        if (borderOptions.enabled) {
            formData.append('border_width', borderOptions.width.toString());
            formData.append('border_color', hexToRgb(borderOptions.color));
        }

        // Thêm tùy chọn sheet
        formData.append('sheet_enabled', sheetOptions.enabled.toString());
        if (sheetOptions.enabled) {
            formData.append('sheet_format', sheetOptions.format);
            formData.append('sheet_columns', sheetOptions.columns.toString());
            formData.append('sheet_rows', sheetOptions.rows.toString());
            formData.append('sheet_spacing', sheetOptions.spacing.toString());
        }

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
    const r = Number.parseInt(hex.substring(0, 2), 16);
    const g = Number.parseInt(hex.substring(2, 4), 16);
    const b = Number.parseInt(hex.substring(4, 6), 16);

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