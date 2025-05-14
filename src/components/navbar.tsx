"use client";

import Logo from "@/components/logo";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between rounded-lg bg-white px-6 py-4 shadow-sm">
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
                <Link href="/create" className="font-medium text-sm transition-colors hover:text-blue-600">
                    Tạo ảnh thẻ
                </Link>
                <Link href="/remove-bg" className="font-medium text-sm transition-colors hover:text-blue-600">
                    Xóa phông nền
                </Link>

                <Link href="/about" className="font-medium text-sm transition-colors hover:text-blue-600">
                    Giới thiệu
                </Link>
                <Link href="/auth/login" className="rounded-md  text-sm font-medium ">
                    Đăng nhập
                </Link>

                {/* <Link href="/auth/register" className="rounded-md border  text-sm font-medium  ">
                    Đăng ký
                </Link> */}
            </div>
        </nav>
    );
};

export default Navbar;