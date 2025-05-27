
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MetricCard } from '@/components/MetricCard';
import { TrendChart } from '@/components/TrendChart';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Target, 
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Vulnerability, RiskMetrics, SLAConfig } from '@/types/vulnerability';

interface RiskDashboardProps {
  vulnerabilities: Vulnerability[];
  riskMetrics: RiskMetrics;
  slaConfig: SLAConfig;
}

export const RiskDashboard = ({ vulnerabilities, riskMetrics, slaConfig }: RiskDashboardProps) => {
  const calculateSLACompliance = () => {
    const totalVulns = vulnerabilities.filter(v => v.status !== 'Resolved').length;
    const onTrack = vulnerabilities.filter(v => v.slaStatus === 'On Track').length;
    return totalVulns > 0 ? Math.round((onTrack / totalVulns) * 100) : 100;
  };

  const getTopRisks = () => {
    return vulnerabilities
      .filter(v => v.status === 'Open')
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);
  };

  const getRiskDistribution = () => {
    const distribution = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    vulnerabilities.forEach(v => {
      if (v.riskScore >= 9) distribution.Critical++;
      else if (v.riskScore >= 7) distribution.High++;
      else if (v.riskScore >= 4) distribution.Medium++;
      else distribution.Low++;
    });
    return distribution;
  };

  const slaCompliance = calculateSLACompliance();
  const topRisks = getTopRisks();
  const riskDistribution = getRiskDistribution();

  return (
    <div className="space-y-6">
      {/* Risk Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Risk Score"
          value={riskMetrics.totalRiskScore.toString()}
          icon={<Shield className="h-5 w-5" />}
          trend={riskMetrics.vulnerabilityTrend === 'Increasing' ? '+15%' : '-8%'}
          className="border-red-500/20 bg-red-950/20"
        />
        <MetricCard
          title="High-Risk Assets"
          value={riskMetrics.highRiskAssets.toString()}
          icon={<Target className="h-5 w-5" />}
          trend="+3"
          className="border-orange-500/20 bg-orange-950/20"
        />
        <MetricCard
          title="SLA Compliance"
          value={`${slaCompliance}%`}
          icon={<Clock className="h-5 w-5" />}
          trend={slaCompliance >= 90 ? '+2%' : '-5%'}
          className="border-blue-500/20 bg-blue-950/20"
        />
        <MetricCard
          title="MTTR (Days)"
          value={riskMetrics.meanTimeToRemediation.toString()}
          icon={<TrendingUp className="h-5 w-5" />}
          trend="-1.2"
          className="border-green-500/20 bg-green-950/20"
        />
      </div>

      {/* SLA Status Alert */}
      {slaCompliance < 80 && (
        <Alert className="border-red-500/50 bg-red-950/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            SLA compliance is below 80%. {riskMetrics.slaBreaches} vulnerabilities are overdue for remediation.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Risk Distribution</CardTitle>
            <CardDescription>Current vulnerability risk levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(riskDistribution).map(([level, count]) => {
              const total = Object.values(riskDistribution).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const colors = {
                Critical: 'bg-red-600',
                High: 'bg-orange-600',
                Medium: 'bg-yellow-600',
                Low: 'bg-green-600'
              };
              
              return (
                <div key={level} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{level} Risk</span>
                    <span className="text-white">{count} ({percentage}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Risk Items */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Risk Vulnerabilities</CardTitle>
            <CardDescription>Highest risk items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRisks.map((vuln) => (
                <div key={vuln.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{vuln.title}</div>
                    <div className="text-slate-400 text-xs">{vuln.host}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Risk: {vuln.riskScore}
                    </Badge>
                    <Badge className={
                      vuln.slaStatus === 'Overdue' ? 'bg-red-600' :
                      vuln.slaStatus === 'At Risk' ? 'bg-yellow-600' :
                      'bg-green-600'
                    }>
                      {vuln.slaStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Trends */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Risk Trend Analysis</CardTitle>
          <CardDescription>30-day risk score evolution</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart />
        </CardContent>
      </Card>
    </div>
  );
};
