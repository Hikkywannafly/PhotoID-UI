"use client";

import { Footer } from "@/components/footer";
import * as FadeIn from "@/components/motion/fade";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Kiểm tra mật khẩu khớp nhau
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            setIsLoading(false);
            return;
        }

        try {
            // Ở đây sẽ thêm logic gọi API đăng ký
            // const response = await fetch("/api/auth/register", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify(formData),
            // });

            // if (!response.ok) {
            //   throw new Error("Đăng ký thất bại");
            // }

            // Giả lập đăng ký thành công
            setTimeout(() => {
                router.push("/auth/login?registered=true");
            }, 1000);
        } catch (error) {
            setError("Đăng ký thất bại. Vui lòng thử lại sau.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FadeIn.Container className="flex min-h-screen flex-col">
            <FadeIn.Item>
                <Navbar />
            </FadeIn.Item>

            <FadeIn.Item className="flex flex-1 items-center justify-center py-12">
                <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Đăng ký tài khoản</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Tạo tài khoản để sử dụng đầy đủ dịch vụ của chúng tôi
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium">
                                    Họ và tên
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Mật khẩu
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                Tôi đồng ý với{" "}
                                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                                    Điều khoản dịch vụ
                                </Link>{" "}
                                và{" "}
                                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                                    Chính sách bảo mật
                                </Link>
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${isLoading
                                        ? "cursor-not-allowed bg-blue-400"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    "Đăng ký"
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-sm">
                                Đã có tài khoản?{" "}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </FadeIn.Item>

            <FadeIn.Item>
                <Footer />
            </FadeIn.Item>
        </FadeIn.Container>
    );
}