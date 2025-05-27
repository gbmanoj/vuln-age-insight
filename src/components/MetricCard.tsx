
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export const MetricCard = ({ title, value, icon, trend, className }: MetricCardProps) => {
  const isPositiveTrend = trend?.startsWith('+');
  const isNegativeTrend = trend?.startsWith('-');

  return (
    <Card className={cn("bg-slate-800/50 border-slate-700", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <div className="text-slate-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">{value}</div>
          {trend && (
            <div
              className={cn(
                "text-xs font-medium",
                isPositiveTrend && title.includes('Critical') ? "text-red-400" : isPositiveTrend ? "text-green-400" : "",
                isNegativeTrend && title.includes('Critical') ? "text-green-400" : isNegativeTrend ? "text-red-400" : "",
                !isPositiveTrend && !isNegativeTrend ? "text-slate-400" : ""
              )}
            >
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
