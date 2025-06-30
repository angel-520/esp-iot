"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight, Wifi, Zap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "@/components/dashboard";

export default function HomePage() {
  const [showDashboard, setShowDashboard] = useState(false);

  const viewVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-white to-zinc-100 p-4">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          <motion.div
            key="landing"
            variants={viewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-3xl"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl"
                >
                  ESP32 IoT 管理平台
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-4 text-lg text-zinc-600"
                >
                  一个简约、高效的物联网设备监控与管理解决方案。
                </motion.p>
              </CardHeader>
              <CardContent className="mt-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="grid grid-cols-1 gap-8 md:grid-cols-3"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Wifi className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900">
                      实时监控
                    </h3>
                    <p className="mt-2 text-zinc-600">
                      随时随地查看您的设备状态、传感器数据和日志。
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900">
                      远程控制
                    </h3>
                    <p className="mt-2 text-zinc-600">
                      通过向您的设备发送指令，实现远程操作和配置。
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900">
                      安全可靠
                    </h3>
                    <p className="mt-2 text-zinc-600">
                      采用多种加密方式，确保您的设备和数据安全。
                    </p>
                  </div>
                </motion.div>
              </CardContent>
              <CardFooter className="mt-10 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    size="lg"
                    className="text-base"
                    onClick={() => setShowDashboard(true)}
                  >
                    进入系统控制
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            variants={viewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-5xl"
          >
            <Dashboard onBack={() => setShowDashboard(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
