"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParameterCard } from "@/components/parameter-card";
import { ParameterChart } from "@/components/parameter-chart";
import { mockEngineData } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/dashboard-layout";
import { notFound } from "next/navigation";

interface DevicePageClientProps {
  deviceId: string;
}

export function DevicePageClient({ deviceId }: DevicePageClientProps) {
  const engineData = mockEngineData[deviceId];

  if (!engineData) {
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
              {engineData.name} - {engineData.model}
            </h2>
            <p className="text-text-secondary text-sm md:text-base">
              Serial Number: {engineData.serialNumber}
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
              label="Acceleration"
              value={engineData.currentParameters.acceleration.value}
              unit="m/s²"
              status={engineData.currentParameters.acceleration.status}
              isActive={engineData.currentParameters.acceleration.isActive}
              type="acceleration"
            />
            <ParameterCard
              label="Heat"
              value={engineData.currentParameters.heat.value}
              unit="°C"
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