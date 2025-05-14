"use client";

import { Footer } from "@/components/footer";
import * as FadeIn from "@/components/motion/fade";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Ở đây sẽ thêm logic gọi API quên mật khẩu
            // const response = await fetch("/api/auth/forgot-password", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ email }),
            // });

            // if (!response.ok) {
            //   throw new Error("Không thể gửi email khôi phục");
            // }

            // Giả lập gửi email thành công
            setTimeout(() => {
                setSuccess(true);
            }, 1000);
        } catch (error) {
            setError("Không thể gửi email khôi phục. Vui lòng thử lại sau.");
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
                        <h1 className="text-2xl font-bold tracking-tight">Quên mật khẩu</h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="space-y-6">
                            <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
                                Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ {email}. Vui lòng kiểm tra hộp thư của bạn.
                            </div>
                            <div className="flex justify-center">
                                <Link
                                    href="/auth/login"
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    placeholder="your.email@example.com"
                                />
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
                                        "Gửi liên kết đặt lại mật khẩu"
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="text-sm">
                                    <Link
                                        href="/auth/login"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Quay lại đăng nhập
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </FadeIn.Item>

            <FadeIn.Item>
                <Footer />
            </FadeIn.Item>
        </FadeIn.Container>
    );
}