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
  const formattedData = data.map((reading) => {
    const date = new Date(reading.timestamp);
    return {
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      timeShort: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: reading.temperature,
      heat: reading.heat,
      vibration: reading.vibration,
      acceleration: reading.acceleration,
    };
  });

  return (
    <div className="w-full">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">
        Parameter Trends (Last 2 Hours)
      </h3>
      <ChartContainer config={chartConfig} className="w-full h-[300px] md:h-[400px]">
        <LineChart 
          data={formattedData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="timeShort"
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
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