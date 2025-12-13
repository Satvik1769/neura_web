"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParameterCard } from "@/components/parameter-card";
import { ParameterChart } from "@/components/parameter-chart";
import { DashboardLayout } from "@/components/dashboard-layout";
import { notFound } from "next/navigation";
import { deviceApi } from "@/lib/api";
import { EngineData, DeviceDetailsDto, DevicesDto } from "@/lib/types";
import { showToast } from "@/lib/toast";

interface DevicePageClientProps {
  deviceId: string;
}


export function DevicePageClient({ deviceId }: DevicePageClientProps) {
  const [engineData, setEngineData] = useState<EngineData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        {/* Parameter Trends Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <ParameterChart data={engineData.historicalData} />
        </div>
      </div>
    </DashboardLayout>
  );
}