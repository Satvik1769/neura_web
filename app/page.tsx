"use client";

import { useState } from "react";
import { Power, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParameterCard } from "@/components/parameter-card";
import { ParameterChart } from "@/components/parameter-chart";
import { mockEngines, mockEngineData } from "@/lib/mock-data";

export default function Dashboard() {
  const [selectedEngineId, setSelectedEngineId] = useState<string>("1");
  
  const engineData = mockEngineData[selectedEngineId];
  const selectedEngine = mockEngines.find((e) => e.id === selectedEngineId);

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log("Exporting CSV for engine:", selectedEngineId);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-accent flex items-center justify-center">
              <Power className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-accent">
                Predictive Engine Maintenance
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                Real-time monitoring & AI-powered diagnostics
              </p>
            </div>
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

        {/* Engine Selector */}
        <div>
          <label className="text-foreground font-semibold mb-2 block">
            Select Engine
          </label>
          <Select value={selectedEngineId} onValueChange={setSelectedEngineId}>
            <SelectTrigger className="w-full md:w-[400px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockEngines.map((engine) => (
                <SelectItem key={engine.id} value={engine.id}>
                  {engine.name} - {engine.model} ({engine.serialNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Real-time Parameters */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Real-time Parameters
          </h2>
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
    </div>
  );
}