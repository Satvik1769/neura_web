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
  id: string;
  name: string;
  model: string;
  serialNumber: string;
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
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  currentParameters: {
    temperature: { value: number; status: ParameterStatus; isActive: boolean };
    vibration: { value: number; status: ParameterStatus; isActive: boolean };
    acceleration: { value: number; status: ParameterStatus; isActive: boolean };
    heat: { value: number; status: ParameterStatus; isActive: boolean };
  };
  historicalData: ParameterReading[];
}