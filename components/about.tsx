"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Github,
  Mail,
  User,
  Code,
  Cpu,
  Wifi,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

interface AboutProps {
  onBack: () => void;
}

export default function About({ onBack }: AboutProps) {
  const technologies = [
    { name: "Next.js 15", icon: "⚡" },
    { name: "TypeScript", icon: "🔷" },
    { name: "Tailwind CSS", icon: "🎨" },
    { name: "Recharts", icon: "📊" },
    { name: "ESP32-C3", icon: "🔧" },
    { name: "IoT传感器", icon: "📡" },
  ];

  const features = [
    "实时温湿度监控",
    "人体感应检测",
    "设备在线状态监控",
    "智能自动化控制",
    "异常报警系统",
    "历史数据可视化",
    "响应式设计界面",
    "夜间模式支持",
  ];

  return (
    <Card className="w-full max-w-4xl border-0 shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">关于本项目</CardTitle>
              <CardDescription>
                ESP32 IoT管理平台 - 智能家居控制系统
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回主页
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* 作者信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                作者信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">姓名</p>
                  <p className="font-medium">刘禹</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">学号</p>
                  <p className="font-medium">1034230331</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">班级</p>
                  <p className="font-medium">物联网2303</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">专业</p>
                  <p className="font-medium">物联网工程</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">项目描述</p>
                <p className="text-sm">
                  基于ESP32-C3微控制器的智能家居IoT管理平台，集成温湿度监测、人体感应、设备控制等功能，
                  采用现代化Web技术栈开发，提供直观易用的管理界面。
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 技术栈 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-500" />
                技术栈
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-2 py-2 px-3 text-sm">
                      <span className="text-base">{tech.icon}</span>
                      {tech.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 功能特性 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-500" />
                功能特性
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 致谢 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                特别致谢
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">技术支持</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Next.js 团队 - 优秀的React框架</li>
                    <li>• Vercel - 卓越的部署平台</li>
                    <li>• Tailwind CSS - 现代化的CSS框架</li>
                    <li>• shadcn/ui - 现代化的 React 组件库</li>
                    <li>• Recharts - 强大的图表库</li>
                    <li>• Lucide Icons - 精美的图标库</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">硬件支持</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 乐鑫科技 - ESP32-C3芯片</li>
                    <li>• 传感器制造商</li>
                    <li>• 开源硬件社区</li>
                    <li>• Arduino生态系统</li>
                  </ul>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  感谢所有为开源社区贡献的开发者们 ❤️
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  本项目致力于推动物联网技术的发展与普及
                </p>
              </div>
              {/* 新增：对周彪老师的特别致谢 */}
              <div className="text-center mt-4">
                <p className="text-base text-primary font-semibold">
                  特别致谢周彪老师，感谢他的物联网系统课程与单片机课程带我走进物联网！
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 版权信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center py-4"
        >
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} 刘禹 ESP32 IoT管理平台. 保留所有权利.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            本项目仅供学习交流使用
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
