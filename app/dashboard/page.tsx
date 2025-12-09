"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";
import { mockEngines, mockEngineData } from "@/lib/mock-data";
import { Power } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const handleDeviceClick = (deviceId: string) => {
    router.push(`/dashboard/${deviceId}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-accent mb-2">
            Your Devices
          </h2>
          <p className="text-text-secondary">
            Select a device to view detailed monitoring data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEngines.map((engine) => {
            const engineData = mockEngineData[engine.id];
            const allHealthy = Object.values(
              engineData.currentParameters
            ).every((param) => param.status === "healthy");

            return (
              <Card
                key={engine.id}
                className="border-border bg-card hover:border-cyan-accent/50 transition-all cursor-pointer group"
                onClick={() => handleDeviceClick(engine.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-cyan-accent/20 flex items-center justify-center group-hover:bg-cyan-accent/30 transition-colors">
                        <Power className="w-6 h-6 text-cyan-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground group-hover:text-cyan-accent transition-colors">
                          {engine.name}
                        </CardTitle>
                        <p className="text-sm text-text-secondary">
                          {engine.model}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        allHealthy
                          ? "bg-green-status/20 text-green-status border-green-status/30"
                          : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                      }
                    >
                      {allHealthy ? "Healthy" : "Warning"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Serial Number</span>
                      <span className="text-foreground font-mono">
                        {engine.serialNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Temperature</span>
                      <span className="text-foreground">
                        {engineData.currentParameters.temperature.value.toFixed(
                          1
                        )}
                        °C
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Vibration</span>
                      <span className="text-foreground">
                        {engineData.currentParameters.vibration.value.toFixed(
                          1
                        )}{" "}
                        Hz
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}