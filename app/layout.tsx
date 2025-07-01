import type { Metadata } from "next";
import "./globals.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export const metadata: Metadata = {
  title: "刘禹的ESP32 IoT管理系统",
  description: "ESP32物联网设备管理与控制系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`antialiased flex min-h-screen flex-col bg-background text-foreground`}
      >
        {/* 简约的顶部导航栏 */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Image
                src="/globe.svg"
                alt="IoT Globe"
                width={24}
                height={24}
                className="dark:invert"
              />
              <span className="font-semibold text-lg text-foreground">
                刘禹的ESP32 IoT管理系统
              </span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* 主要内容区域 - 设置为 flex 容器以支持子元素居中 */}
        <main className="flex-1 flex justify-center items-center">
          {children}
        </main>

        {/* 简约的底部信息栏 */}
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p className="text-center md:text-left mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} 刘禹
            </p>
            <div className="flex items-center gap-x-4">
              <span>学号: 1034230331</span>
              <Separator orientation="vertical" className="h-4" />
              <span>班级: 物联网2303</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
