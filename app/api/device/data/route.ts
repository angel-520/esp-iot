import { NextResponse } from "next/server";

// 定义单条数据的类型，并加上时间戳
interface DeviceDataWithTimestamp {
  temperature: number;
  humidity: number;
  presence: boolean;
  timestamp: number; // 使用 Unix 时间戳 (毫秒)
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

// 将存储从单个对象变为一个数组，用于记录历史
let historicalData: DeviceDataWithTimestamp[] = [];

// 新增：在内存中存储设备设置，并设置初始默认值
let deviceSettings: DeviceSettings = {
  isTempAutomationOn: false,
  tempThreshold: 100,
  isHumidityAutomationOn: false,
  humidityThreshold: 100,
  isTempAlarmOn: false,
  alarmTempThreshold: 100,
  isHumidityAlarmOn: false,
  alarmHumidityThreshold: 100,
  isFanManualOn: false,
  isDehumidifierManualOn: false,
};

const MAX_HISTORY_LENGTH = 100; // 我们最多只保留最近100条数据

/**
 * 处理来自 ESP32 的 POST 请求，并返回最新设置
 * URL: /api/device/data
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 前端更新设置的逻辑
    if (data.settings) {
      deviceSettings = { ...deviceSettings, ...data.settings };
      return NextResponse.json({ message: "Settings updated successfully", settings: deviceSettings }, { status: 200 });
    }

    // ESP32上报数据的逻辑
    if (typeof data.temperature === 'undefined' || typeof data.humidity === 'undefined' || typeof data.presence === 'undefined') {
      return NextResponse.json({ message: "Invalid data. 'temperature', 'humidity', and 'presence' are required." }, { status: 400 });
    }

    console.log("Received data from ESP32:", data);

    // 创建一条带时间戳的新记录
    const newRecord: DeviceDataWithTimestamp = {
      temperature: data.temperature,
      humidity: data.humidity,
      presence: data.presence,
      timestamp: Date.now(), // 添加当前服务器时间作为时间戳
    };

    // 将新记录添加到历史数据数组的末尾
    historicalData.push(newRecord);

    // 如果历史数据超过了最大长度，就从数组开头移除最旧的一条
    if (historicalData.length > MAX_HISTORY_LENGTH) {
      historicalData.shift();
    }

    // 在响应中将最新的设置返回给ESP32
    return NextResponse.json(deviceSettings, { status: 200 });

  } catch (error) {
    console.error("Error in POST /api/device/data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * 处理来自前端页面的 GET 请求
 * URL: /api/device/data
 */
export async function GET(request: Request) {
  // 同时返回历史数据和当前设置
  return NextResponse.json({
    historicalData,
    settings: deviceSettings,
  });
}
