export type ParameterStatus = "healthy" | "warning" | "critical";
export type ParameterType = "temperature" | "vibration" | "acceleration" | "heat";

// Props types
export interface ParameterCardProps {
  label: string;
  value: number;
  unit: string;
  status: ParameterStatus;
  isActive: boolean;
  type: ParameterType;
}

export interface EngineOption {
  id: number;
  userId: number;
  deviceId: number;
  location: string;
  deviceType: string;
  deviceName: string;
  deviceModel: string;
  ipAddress: string;
  macAddress: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  healthScore?: number;
  status?: string;
  isHealthy?: boolean;
}

export interface DashboardProps {
  selectedEngineId?: string;
}

// Store types
export interface DashboardState {
  selectedEngineId: string | null;
  setSelectedEngineId: (id: string) => void;
}

// Query types
export interface ParameterReading {
  timestamp: string;
  temperature: number;
  vibration: number;
  acceleration: number;
  heat: number;
}

export interface EngineData {
  id: number;
  deviceName: string;
  deviceModel: string;
  macAddress: string;
  deviceId: number;
  location: string;
  deviceType: string;
  ipAddress: string;
  isActive: boolean;
  healthScore?: number;
  status?: string;
  isHealthy?: boolean;
  currentParameters: {
    temperature: { value: number; status: ParameterStatus; isActive: boolean };
    vibration: { value: number; status: ParameterStatus; isActive: boolean };
    acceleration: { value: number; status: ParameterStatus; isActive: boolean };
    heat: { value: number; status: ParameterStatus; isActive: boolean };
  };
  historicalData: ParameterReading[];
}