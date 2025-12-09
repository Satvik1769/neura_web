import { EngineData, EngineOption, ParameterReading } from "./types";

// Generate mock historical data for the last 2 hours
const generateHistoricalData = (): ParameterReading[] => {
  const data: ParameterReading[] = [];
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  
  for (let i = 0; i < 120; i++) {
    const timestamp = new Date(twoHoursAgo.getTime() + i * 60 * 1000);
    data.push({
      timestamp: timestamp.toISOString(),
      temperature: 85 + Math.random() * 20,
      vibration: 30 + Math.random() * 30,
      acceleration: 0.5 + Math.random() * 0.5,
      heat: 75 + Math.random() * 20,
    });
  }
  
  return data;
};

export const mockEngines: EngineOption[] = [
  {
    id: "1",
    name: "Engine Alpha",
    model: "V6 Turbo",
    serialNumber: "MH-01-AB-1234",
  },
  {
    id: "2",
    name: "Engine Beta",
    model: "V8 Supercharged",
    serialNumber: "MH-02-CD-5678",
  },
  {
    id: "3",
    name: "Engine Gamma",
    model: "Inline-4 Hybrid",
    serialNumber: "MH-03-EF-9012",
  },
];

export const mockEngineData: Record<string, EngineData> = {
  "1": {
    id: "1",
    name: "Engine Alpha",
    model: "V6 Turbo",
    serialNumber: "MH-01-AB-1234",
    currentParameters: {
      temperature: { value: 89.19, status: "healthy", isActive: true },
      vibration: { value: 35.15, status: "healthy", isActive: true },
      acceleration: { value: 0.62, status: "healthy", isActive: true },
      heat: { value: 81.8, status: "healthy", isActive: true },
    },
    historicalData: generateHistoricalData(),
  },
  "2": {
    id: "2",
    name: "Engine Beta",
    model: "V8 Supercharged",
    serialNumber: "MH-02-CD-5678",
    currentParameters: {
      temperature: { value: 92.45, status: "warning", isActive: true },
      vibration: { value: 42.3, status: "healthy", isActive: true },
      acceleration: { value: 0.75, status: "healthy", isActive: true },
      heat: { value: 88.2, status: "warning", isActive: true },
    },
    historicalData: generateHistoricalData(),
  },
  "3": {
    id: "3",
    name: "Engine Gamma",
    model: "Inline-4 Hybrid",
    serialNumber: "MH-03-EF-9012",
    currentParameters: {
      temperature: { value: 78.5, status: "healthy", isActive: true },
      vibration: { value: 28.9, status: "healthy", isActive: true },
      acceleration: { value: 0.48, status: "healthy", isActive: true },
      heat: { value: 72.3, status: "healthy", isActive: true },
    },
    historicalData: generateHistoricalData(),
  },
};