"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Thermometer,
  Droplets,
  Fan,
  Wind,
  User,
  History,
  Settings,
  AlertTriangle,
} from "lucide-react";

interface DashboardProps {
  onBack: () => void;
}

interface DeviceData {
  temperature: number;
  humidity: number;
  presence: boolean;
}

// 新增：定义设备设置的类型
interface DeviceSettings {
  isTempAutomationOn: boolean;
  tempThreshold: number;
  isHumidityAutomationOn: boolean;
  humidityThreshold: number;
  isTempAlarmOn: boolean;
  alarmTempThreshold: number;
  isHumidityAlarmOn: boolean;
  alarmHumidityThreshold: number;
  isFanManualOn: boolean;
  isDehumidifierManualOn: boolean;
}

interface HistoricalData extends DeviceData {
  timestamp: string;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [tempThreshold, setTempThreshold] = useState(100);
  const [humidityThreshold, setHumidityThreshold] = useState(100);
  const [alarmTempThreshold, setAlarmTempThreshold] = useState(100);
  const [alarmHumidityThreshold, setAlarmHumidityThreshold] = useState(100);
  const [isTempAutomationOn, setIsTempAutomationOn] = useState(false);
  const [isHumidityAutomationOn, setIsHumidityAutomationOn] = useState(false);
  const [isTempAlarmOn, setIsTempAlarmOn] = useState(false);
  const [isHumidityAlarmOn, setIsHumidityAlarmOn] = useState(false);
  const [isFanManualOn, setIsFanManualOn] = useState(false);
  const [isDehumidifierManualOn, setIsDehumidifierManualOn] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  // 新增：用于跟踪警报状态
  const [isTempAlarmActive, setIsTempAlarmActive] = useState(false);
  const [isHumidityAlarmActive, setIsHumidityAlarmActive] = useState(false);

  // 新增：在线状态相关的状态
  const [isOnline, setIsOnline] = useState(false);
  const [lastDataTime, setLastDataTime] = useState<number | null>(null);

  // 新增：用于更新服务器设置的函数
  const updateSettings = async (newSettings: Partial<DeviceSettings>) => {
    try {
      await fetch("/api/device/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: newSettings }),
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/device/data");
        // 只有当请求成功时才更新数据
        if (response.ok) {
          const { historicalData: newHistoricalData, settings } = await response.json();
          
          // 检查是否有新数据
          if (newHistoricalData && newHistoricalData.length > 0) {
            const latestTimestamp = newHistoricalData[newHistoricalData.length - 1].timestamp;
            const latestTime = new Date(latestTimestamp).getTime();
            
            // 只有当有新数据时才更新最后数据时间
            if (!lastDataTime || latestTime > lastDataTime) {
              setLastDataTime(latestTime);
              setIsOnline(true); // 收到新数据时立即设置为在线
            }
          }
          
          setHistoricalData(newHistoricalData);
          // 使用从服务器获取的设置更新本地状态
          if (settings) {
            setTempThreshold(settings.tempThreshold);
            setHumidityThreshold(settings.humidityThreshold);
            setIsTempAutomationOn(settings.isTempAutomationOn);
            setIsHumidityAutomationOn(settings.isHumidityAutomationOn);
            setAlarmTempThreshold(settings.alarmTempThreshold);
            setAlarmHumidityThreshold(settings.alarmHumidityThreshold);
            setIsTempAlarmOn(settings.isTempAlarmOn );
            setIsHumidityAlarmOn(settings.isHumidityAlarmOn);
            setIsFanManualOn(settings.isFanManualOn);
            setIsDehumidifierManualOn(settings.isDehumidifierManualOn);
          }
        } else {
          // 如果ESP32还没开始发送数据，API会返回404，这里可以不做处理，等待下一次轮询
          console.log("Waiting for device data...");
        }
      } catch (error) {
        console.error("Failed to fetch device data:", error);
      }
    };

    // 立即获取一次数据
    fetchData();

    // 设置一个定时器，每3秒获取一次数据
    const intervalId = setInterval(fetchData, 3000);

    // 组件卸载时清除定时器，防止内存泄漏
    return () => clearInterval(intervalId);
  }, [lastDataTime]); // 添加 lastDataTime 到依赖数组

  // 新增：每60秒检查一次在线状态
  useEffect(() => {
    if (!lastDataTime) return;

    const checkOnlineStatus = () => {
      const now = Date.now();
      const timeDiff = now - lastDataTime;
      const oneMinute = 60 * 1000; // 1分钟 = 60,000毫秒
      
      setIsOnline(timeDiff < oneMinute);
    };

    // 立即检查一次
    checkOnlineStatus();

    // 每60秒检查一次在线状态
    const statusCheckInterval = setInterval(checkOnlineStatus, 60000);

    return () => clearInterval(statusCheckInterval);
  }, [lastDataTime]);

  const latestData =
    historicalData.length > 0 ? historicalData[historicalData.length - 1] : null;

  useEffect(() => {
    if (latestData) {
      const tempAlarm = isTempAlarmOn && latestData.temperature > alarmTempThreshold;
      const humidityAlarm = isHumidityAlarmOn && latestData.humidity > alarmHumidityThreshold;
      
      if (tempAlarm !== isTempAlarmActive) {
        setIsTempAlarmActive(tempAlarm);
      }
      if (humidityAlarm !== isHumidityAlarmActive) {
        setIsHumidityAlarmActive(humidityAlarm);
      }
    }
  }, [latestData, isTempAlarmOn, alarmTempThreshold, isHumidityAlarmOn, alarmHumidityThreshold, isTempAlarmActive, isHumidityAlarmActive]);

  return (
    <Card className="w-full max-w-4xl border-0 shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Thermometer className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">客厅环境控制器</CardTitle>
              <CardDescription>
                设备ID: ESP32-C3 -{" "}
                <span className={`font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? '在线' : '离线'}
                </span>
                {lastDataTime && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    最后更新: {new Date(lastDataTime).toLocaleString('zh-CN')}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={onBack}>
            返回主页
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">
              <User className="mr-2 h-4 w-4" />
              设备状态
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              历史数据
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              自动化设置
            </TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="mt-6">
            {/* 添加离线警告 */}
            {!isOnline && lastDataTime && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>设备离线!</AlertTitle>
                <AlertDescription>
                  设备已超过1分钟未发送数据，最后活动时间: {new Date(lastDataTime).toLocaleString('zh-CN')}
                </AlertDescription>
              </Alert>
            )}
            {isTempAlarmActive && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>高温警报!</AlertTitle>
                <AlertDescription>
                  当前温度 {latestData?.temperature.toFixed(1)}°C 已超过阈值 {alarmTempThreshold}°C.
                </AlertDescription>
              </Alert>
            )}
            {isHumidityAlarmActive && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>高湿警报!</AlertTitle>
                <AlertDescription>
                  当前湿度 {latestData?.humidity}% 已超过阈值 {alarmHumidityThreshold}%.
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Temperature and Humidity */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    实时温湿度
                  </CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestData ? `${latestData.temperature.toFixed(1)}°C` : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {latestData ? `湿度: ${latestData.humidity}%` : "湿度: --"}
                  </p>
                </CardContent>
              </Card>

              {/* Human Presence Sensor */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    人体感应
                  </CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestData ? (
                      <Badge variant={latestData.presence ? "destructive" : "secondary"}>
                        {latestData.presence ? "有人" : "无人"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">--</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {latestData ? (latestData.presence ? "检测到活动" : "15分钟内无活动") : "状态未知"}
                  </p>
                </CardContent>
              </Card>

              {/* Spacer Card to align items, can be used for other info */}
              <Card className="hidden lg:block">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    连接状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <Badge variant={isOnline ? "default" : "destructive"}>
                      {isOnline ? "正常" : "断线"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {lastDataTime 
                      ? `${Math.floor((Date.now() - lastDataTime) / 1000)}秒前更新`
                      : "等待连接..."
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Controls */}
              <Card className="sm:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>设备控制</CardTitle>
                  <CardDescription>
                    远程开启或关闭连接的设备
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-3">
                      <Fan className="h-5 w-5" />
                      <span className="font-medium">风扇</span>
                    </div>
                    {isTempAutomationOn ? (
                      <Badge variant="secondary" title="自动化已开启，无法手动控制">
                        自动化控制中
                      </Badge>
                    ) : (
                      <Switch 
                        id="fan-switch" 
                        checked={isFanManualOn}
                        disabled={!isOnline} // 离线时禁用控制
                        onCheckedChange={(checked) => {
                          setIsFanManualOn(checked);
                          updateSettings({ isFanManualOn: checked });
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-3">
                      <Wind className="h-5 w-5" />
                      <span className="font-medium">除湿器</span>
                    </div>
                    {isHumidityAutomationOn ? (
                      <Badge variant="secondary" title="自动化已开启，无法手动控制">
                        自动化控制中
                      </Badge>
                    ) : (
                      <Switch 
                        id="dehumidifier-switch"
                        checked={isDehumidifierManualOn}
                        disabled={!isOnline} // 离线时禁用控制
                        onCheckedChange={(checked) => {
                          setIsDehumidifierManualOn(checked);
                          updateSettings({ isDehumidifierManualOn: checked });
                        }}
                      />
                    )}
                  </div>
                  {!isOnline && (
                    <p className="text-sm text-muted-foreground text-center">
                      设备离线时无法进行手动控制
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    温度曲线
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {historicalData.length > 0 ? (
                      <AreaChart
                        data={historicalData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="colorTemperature"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#ef4444"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ef4444"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickLine={false}
                          tickFormatter={() => ""}
                          fontSize={12}
                        />
                        <YAxis
                          domain={[0, 50]}
                          label={{
                            value: "温度 (°C)",
                            angle: -90,
                            position: "insideLeft",
                            offset: -10,
                          }}
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--background))",
                            color: "hsl(var(--foreground))",
                          }}
                          labelFormatter={(label) =>
                            new Date(label).toLocaleString("zh-CN")
                          }
                          formatter={(value, name) => [
                            `${(value as number).toFixed(1)}°C`,
                            "温度",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="temperature"
                          stroke="#ef4444"
                          fillOpacity={1}
                          fill="url(#colorTemperature)"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </AreaChart>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">
                          正在等待设备数据...
                        </p>
                      </div>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    湿度曲线
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {historicalData.length > 0 ? (
                      <AreaChart
                        data={historicalData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="colorHumidity"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickLine={false}
                          tickFormatter={() => ""}
                          fontSize={12}
                        />
                        <YAxis
                          domain={[0, 100]}
                          label={{
                            value: "湿度 (%)",
                            angle: -90,
                            position: "insideLeft",
                            offset: -10,
                          }}
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--background))",
                            color: "hsl(var(--foreground))",
                          }}
                          labelFormatter={(label) =>
                            new Date(label).toLocaleString("zh-CN")
                          }
                          formatter={(value, name) => [
                            `${(value as number).toFixed(1)}%`,
                            "湿度",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="humidity"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorHumidity)"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </AreaChart>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">
                          正在等待设备数据...
                        </p>
                      </div>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>自动化设置</CardTitle>
                <CardDescription>
                  设置自动化规则和异常报警阈值。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                {/* Automation Rules */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">自动化规则</h3>
                  {/* Temperature Threshold Setting */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="temp-automation"
                        className="flex items-center gap-2"
                      >
                        <Fan className="h-5 w-5" />
                        <span className="font-medium">高温自动开启风扇</span>
                      </Label>
                      <Switch
                        id="temp-automation"
                        checked={isTempAutomationOn}
                        onCheckedChange={(checked) => {
                          setIsTempAutomationOn(checked);
                          updateSettings({ isTempAutomationOn: checked });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="temp-threshold" className="text-right">
                        阈值
                      </Label>
                      <Slider
                        id="temp-threshold"
                        min={0}
                        max={100}
                        step={0.1}
                        value={[tempThreshold]}
                        onValueChange={(value) => setTempThreshold(value[0])}
                        onValueCommit={(value) => updateSettings({ tempThreshold: value[0] })}
                        className="col-span-2"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          id="temp-threshold-input"
                          type="number"
                          value={tempThreshold}
                          onChange={(e) =>
                            setTempThreshold(Number(e.target.value))
                          }
                          onBlur={(e) => updateSettings({ tempThreshold: Number(e.target.value) })}
                          className="w-20"
                        />
                        <span>°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Humidity Threshold Setting */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="humidity-automation"
                        className="flex items-center gap-2"
                      >
                        <Wind className="h-5 w-5" />
                        <span className="font-medium">高湿自动开启除湿器</span>
                      </Label>
                      <Switch
                        id="humidity-automation"
                        checked={isHumidityAutomationOn}
                        onCheckedChange={(checked) => {
                          setIsHumidityAutomationOn(checked);
                          updateSettings({ isHumidityAutomationOn: checked });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="humidity-threshold"
                        className="text-right"
                      >
                        阈值
                      </Label>
                      <Slider
                        id="humidity-threshold"
                        min={0}
                        max={100}
                        step={0.1}
                        value={[humidityThreshold]}
                        onValueChange={(value) =>
                          setHumidityThreshold(value[0])
                        }
                        onValueCommit={(value) => updateSettings({ humidityThreshold: value[0] })}
                        className="col-span-2"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          id="humidity-threshold-input"
                          type="number"
                          value={humidityThreshold}
                          onChange={(e) =>
                            setHumidityThreshold(Number(e.target.value))
                          }
                          onBlur={(e) => updateSettings({ humidityThreshold: Number(e.target.value) })}
                          className="w-20"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Alarm Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">报警设置</h3>
                  {/* Temperature Alarm Setting */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="temp-alarm"
                        className="flex items-center gap-2"
                      >
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="font-medium">温度异常报警</span>
                      </Label>
                      <Switch
                        id="temp-alarm"
                        checked={isTempAlarmOn}
                        onCheckedChange={(checked) => {
                          setIsTempAlarmOn(checked);
                          updateSettings({ isTempAlarmOn: checked });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="temp-alarm-threshold"
                        className="text-right"
                      >
                        报警阈值
                      </Label>
                      <Slider
                        id="temp-alarm-threshold"
                        min={0}
                        max={100}
                        step={0.1}
                        value={[alarmTempThreshold]}
                        onValueChange={(value) => setAlarmTempThreshold(value[0])}
                        onValueCommit={(value) => updateSettings({ alarmTempThreshold: value[0] })}
                        className="col-span-2"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          id="temp-alarm-input"
                          type="number"
                          value={alarmTempThreshold}
                          onChange={(e) =>
                            setAlarmTempThreshold(Number(e.target.value))
                          }
                          onBlur={(e) => updateSettings({ alarmTempThreshold: Number(e.target.value) })}
                          className="w-20"
                        />
                        <span>°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Humidity Alarm Setting */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="humidity-alarm"
                        className="flex items-center gap-2"
                      >
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="font-medium">湿度异常报警</span>
                      </Label>
                      <Switch
                        id="humidity-alarm"
                        checked={isHumidityAlarmOn}
                        onCheckedChange={(checked) => {
                          setIsHumidityAlarmOn(checked);
                          updateSettings({ isHumidityAlarmOn: checked });
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label
                        htmlFor="humidity-alarm-threshold"
                        className="text-right"
                      >
                        报警阈值
                      </Label>
                      <Slider
                        id="humidity-alarm-threshold"
                        min={0}
                        max={100}
                        step={0.1}
                        value={[alarmHumidityThreshold]}
                        onValueChange={(value) =>
                          setAlarmHumidityThreshold(value[0])
                        }
                        onValueCommit={(value) => updateSettings({ alarmHumidityThreshold: value[0] })}
                        className="col-span-2"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          id="humidity-alarm-input"
                          type="number"
                          value={alarmHumidityThreshold}
                          onChange={(e) =>
                            setAlarmHumidityThreshold(Number(e.target.value))
                          }
                          onBlur={(e) => updateSettings({ alarmHumidityThreshold: Number(e.target.value) })}
                          className="w-20"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
