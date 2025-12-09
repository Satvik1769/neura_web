"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ParameterReading } from "@/lib/types";

interface ParameterChartProps {
  data: ParameterReading[];
}

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "#ef4444",
  },
  heat: {
    label: "Heat",
    color: "#10b981",
  },
  vibration: {
    label: "Vibration",
    color: "#eab308",
  },
  acceleration: {
    label: "Acceleration",
    color: "#3b82f6",
  },
};

export function ParameterChart({ data }: ParameterChartProps) {
  const formattedData = data.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    temperature: reading.temperature,
    heat: reading.heat,
    vibration: reading.vibration,
    acceleration: reading.acceleration,
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Parameter Trends (Last 2 Hours)
      </h3>
      <ChartContainer config={chartConfig} className="w-full h-[400px]">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={20}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="acceleration"
            stroke={chartConfig.acceleration.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="heat"
            stroke={chartConfig.heat.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={chartConfig.temperature.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="vibration"
            stroke={chartConfig.vibration.color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}