import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParameterCardProps } from "@/lib/types";

export function ParameterCard({
  label,
  value,
  unit,
  status,
  isActive,
}: ParameterCardProps) {
  const statusColors = {
    healthy: "text-green-status",
    warning: "text-yellow-500",
    critical: "text-red-500",
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-text-secondary text-sm">{label}</span>
          {isActive && (
            <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30 hover:bg-cyan-accent/30">
              ACTIVE
            </Badge>
          )}
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-bold text-foreground">
            {value.toFixed(2)}
          </span>
          <span className="text-text-secondary text-sm">{unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[status].replace('text-', 'bg-')}`} />
          <span className={`text-sm ${statusColors[status]}`}>{status}</span>
        </div>
      </CardContent>
    </Card>
  );
}