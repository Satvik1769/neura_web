"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParameterCard } from "@/components/parameter-card";
import { DashboardLayout } from "@/components/dashboard-layout";
import { notFound } from "next/navigation";
import { deviceApi } from "@/lib/api";
import { EngineData, DeviceDetailsDto, DevicesDto } from "@/lib/types";
import { showToast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DevicePageClientProps {
  deviceId: string;
}

interface PerformanceData {
  options: Array<{
    optionName: string;
    timePeriods: Array<{
      periodName: string;
      multipliers: Array<{
        t: number;
        m: number;
      }>;
    }>;
  }>;
  multiplyRatio: Record<string, Record<string, number>>;
}

export function DevicePageClient({ deviceId }: DevicePageClientProps) {
  const [engineData, setEngineData] = useState<EngineData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("1D");

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch both device info and parameters
        const [deviceInfo, parameters] = await Promise.all([
          deviceApi.getDeviceById(deviceId),
          deviceApi.getDeviceParameters(deviceId)
        ]) as [DevicesDto, DeviceDetailsDto];

        // Check if device info was retrieved
        if (!deviceInfo) {
          setError("Device not found");
          showToast.error("Error", "Device not found");
          return;
        }

        // Check if parameters were retrieved
        if (!parameters) {
          setError("Device parameters not found");
          showToast.error("Error", "Device parameters not found");
          return;
        }

        // Helper function to determine parameter status
        const getParameterStatus = (metricName: string, metricHealth?: Record<string, boolean>): "healthy" | "warning" | "critical" => {
          if (!metricHealth) return "healthy";
          const isHealthy = metricHealth[metricName];
          return isHealthy === false ? "warning" : "healthy";
        };

        // Combine the data into EngineData format
        const combinedData: EngineData = {
          id: deviceInfo.id ?? 0,
          deviceName: deviceInfo.deviceName ?? "Unknown Device",
          deviceModel: deviceInfo.deviceModel ?? "Unknown Model",
          macAddress: deviceInfo.macAddress ?? "N/A",
          deviceId: deviceInfo.deviceId ?? 0,
          location: deviceInfo.location ?? "Unknown Location",
          deviceType: deviceInfo.deviceType ?? "Unknown Type",
          ipAddress: deviceInfo.ipAddress ?? "N/A",
          isActive: deviceInfo.isActive ?? false,
          healthScore: deviceInfo.healthScore ?? 0,
          status: parameters.status ?? deviceInfo.status ?? "unknown",
          isHealthy: deviceInfo.isHealthy ?? false,
          currentParameters: {
            temperature: {
              value: parameters.temperature ?? 0,
              status: getParameterStatus("temperature", parameters.metricHealth),
              isActive: parameters.temperature !== null && parameters.temperature !== undefined
            },
            vibration: {
              value: parameters.vibration ?? 0,
              status: getParameterStatus("vibration", parameters.metricHealth),
              isActive: parameters.vibration !== null && parameters.vibration !== undefined
            },
            acceleration: {
              value: parameters.rpm ?? 0,
              status: getParameterStatus("rpm", parameters.metricHealth),
              isActive: parameters.rpm !== null && parameters.rpm !== undefined
            },
            heat: {
              value: parameters.acoustic ?? 0,
              status: getParameterStatus("acoustic", parameters.metricHealth),
              isActive: parameters.acoustic !== null && parameters.acoustic !== undefined
            },
          },
          historicalData: parameters.historicalData ?? [],
        };

        setEngineData(combinedData);

        // Extract performance data if available
        if ((parameters as any).performance) {
          setPerformanceData((parameters as any).performance);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load device data";
        setError(errorMessage);
        showToast.error("Error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceData();
  }, [deviceId]);

  // Get chart data for all metrics based on selected time period
  const getChartData = () => {
    if (!performanceData) return [];

    // Get the first metric's time period to get timestamps
    const firstMetric = performanceData.options[0];
    if (!firstMetric) return [];

    const selectedPeriod = firstMetric.timePeriods.find(
      (period) => period.periodName === selectedTimePeriod
    );

    if (!selectedPeriod) return [];

    // Create a map to store all metrics' values for each timestamp
    const dataMap = new Map<number, any>();

    // Initialize with timestamps
    selectedPeriod.multipliers.forEach((item) => {
      dataMap.set(item.t, {
        timestamp: new Date(item.t).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        rawTimestamp: item.t,
      });
    });

    // Add data for each metric
    performanceData.options.forEach((option) => {
      const period = option.timePeriods.find((p) => p.periodName === selectedTimePeriod);
      if (!period) return;

      const baseValue = performanceData.multiplyRatio[option.optionName]?.[selectedTimePeriod] ?? 0;

      period.multipliers.forEach((item) => {
        const dataPoint = dataMap.get(item.t);
        if (dataPoint) {
          dataPoint[option.optionName] =  item.m;
        }
      });
    });

    return Array.from(dataMap.values());
  };

  const chartData = getChartData();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-cyan-accent animate-spin" />
            <p className="text-text-secondary">Loading device data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !engineData) {
    notFound();
  }

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log("Exporting CSV for engine:", deviceId);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        {/* Device Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-accent">
              {engineData.deviceName} - {engineData.deviceModel}
            </h2>
            <p className="text-text-secondary text-sm md:text-base">
              MAC Address: {engineData.macAddress} | Location: {engineData.location}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-cyan-accent text-cyan-accent hover:bg-cyan-accent/10"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>

        {/* Real-time Parameters */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Real-time Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ParameterCard
              label="Temperature"
              value={engineData.currentParameters.temperature.value}
              unit="°C"
              status={engineData.currentParameters.temperature.status}
              isActive={engineData.currentParameters.temperature.isActive}
              type="temperature"
            />
            <ParameterCard
              label="Vibration"
              value={engineData.currentParameters.vibration.value}
              unit="Hz"
              status={engineData.currentParameters.vibration.status}
              isActive={engineData.currentParameters.vibration.isActive}
              type="vibration"
            />
            <ParameterCard
              label="RPM"
              value={engineData.currentParameters.acceleration.value}
              unit="RPM"
              status={engineData.currentParameters.acceleration.status}
              isActive={engineData.currentParameters.acceleration.isActive}
              type="acceleration"
            />
            <ParameterCard
              label="Acoustic"
              value={engineData.currentParameters.heat.value}
              unit="dB"
              status={engineData.currentParameters.heat.status}
              isActive={engineData.currentParameters.heat.isActive}
              type="heat"
            />
          </div>
        </div>

        {/* Performance Trends Chart */}
        {performanceData && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">
                Performance Trends - All Metrics
              </h3>
              {/* Time Period Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Period:</span>
                <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                  <SelectTrigger className="w-[120px] border-border bg-background">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1D">1 Day</SelectItem>
                    <SelectItem value="7D">7 Days</SelectItem>
                    <SelectItem value="1M">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart */}
            <div className="w-full h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#888"
                    tick={{ fill: '#888', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#888"
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                    labelStyle={{ color: '#fff', marginBottom: '8px' }}
                    formatter={(value: number) => value.toFixed(2)}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="Temperature"
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Temperature (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="Vibration"
                    stroke="#4ecdc4"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Vibration (Hz)"
                  />
                  <Line
                    type="monotone"
                    dataKey="RPM"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="RPM"
                  />
                  <Line
                    type="monotone"
                    dataKey="Acoustic"
                    stroke="#ffd93d"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Acoustic (dB)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Base Values Info */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {performanceData.options.map((option) => (
                <div key={option.optionName} className="bg-background/50 rounded-lg p-3 border border-border">
                  <div className="text-xs text-text-secondary mb-1">{option.optionName}</div>
                  <div className="text-sm font-semibold text-foreground">
                    Base: {performanceData.multiplyRatio[option.optionName]?.[selectedTimePeriod]?.toFixed(2) ?? 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}