"use client";

import Logo from "@/components/logo";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg">
            <div className="flex flex-row items-center space-x-3">
                <Logo />
                <div className="flex flex-col font-medium">
                    <span className="text-sm">PhotoID</span>
                    <span className="text-muted-foreground text-xs">
                        Tạo ảnh thẻ thông minh
                    </span>
                </div>
            </div>

            <div className="flex space-x-6">
                <Link href="/create" className="text-sm font-medium hover:text-blue-600 transition-colors">
                    Tạo ảnh thẻ
                </Link>
                <Link href="/remove-bg" className="text-sm font-medium hover:text-blue-600 transition-colors">
                    Xóa phông nền
                </Link>

                <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
                    Giới thiệu
                </Link>
                <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                    Đăng nhập
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;