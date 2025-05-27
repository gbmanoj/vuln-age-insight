
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { Vulnerability, SLAConfig } from '@/types/vulnerability';

interface SLATrackerProps {
  vulnerabilities: Vulnerability[];
  slaConfig: SLAConfig;
}

export const SLATracker = ({ vulnerabilities, slaConfig }: SLATrackerProps) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const calculateTimeRemaining = (vuln: Vulnerability): number => {
    const slaLimit = slaConfig[vuln.severity.toLowerCase() as keyof SLAConfig];
    const daysSinceDiscovery = Math.floor(
      (new Date().getTime() - vuln.discoveredDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, slaLimit - daysSinceDiscovery);
  };

  const getSLAStatus = (vuln: Vulnerability): 'On Track' | 'At Risk' | 'Overdue' => {
    const timeRemaining = calculateTimeRemaining(vuln);
    const slaLimit = slaConfig[vuln.severity.toLowerCase() as keyof SLAConfig];
    
    if (timeRemaining === 0) return 'Overdue';
    if (timeRemaining <= slaLimit * 0.2) return 'At Risk';
    return 'On Track';
  };

  const getProgressPercentage = (vuln: Vulnerability): number => {
    const slaLimit = slaConfig[vuln.severity.toLowerCase() as keyof SLAConfig];
    const daysSinceDiscovery = Math.floor(
      (new Date().getTime() - vuln.discoveredDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.min(100, (daysSinceDiscovery / slaLimit) * 100);
  };

  const filteredVulns = vulnerabilities
    .filter(v => v.status !== 'Resolved')
    .filter(v => statusFilter === 'all' || getSLAStatus(v).toLowerCase().replace(' ', '-') === statusFilter)
    .sort((a, b) => calculateTimeRemaining(a) - calculateTimeRemaining(b));

  const slaStats = {
    total: vulnerabilities.filter(v => v.status !== 'Resolved').length,
    onTrack: vulnerabilities.filter(v => getSLAStatus(v) === 'On Track').length,
    atRisk: vulnerabilities.filter(v => getSLAStatus(v) === 'At Risk').length,
    overdue: vulnerabilities.filter(v => getSLAStatus(v) === 'Overdue').length
  };

  const overallCompliance = slaStats.total > 0 
    ? Math.round(((slaStats.onTrack + slaStats.atRisk) / slaStats.total) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* SLA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Total Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">{slaStats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">On Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold text-white">{slaStats.onTrack}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{slaStats.atRisk}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-red-400" />
              <span className="text-2xl font-bold text-white">{slaStats.overdue}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Compliance Progress */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">SLA Compliance Overview</CardTitle>
          <CardDescription>Current compliance rate: {overallCompliance}%</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={overallCompliance} className="h-4" />
          <div className="mt-2 text-sm text-slate-400">
            {slaStats.onTrack + slaStats.atRisk} of {slaStats.total} vulnerabilities within SLA targets
          </div>
        </CardContent>
      </Card>

      {/* SLA Tracking Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">SLA Status Tracking</CardTitle>
          <CardDescription>Detailed view of vulnerability SLA compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by SLA status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800">
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-200">Vulnerability</TableHead>
                  <TableHead className="text-slate-200">Severity</TableHead>
                  <TableHead className="text-slate-200">Days Remaining</TableHead>
                  <TableHead className="text-slate-200">Progress</TableHead>
                  <TableHead className="text-slate-200">Status</TableHead>
                  <TableHead className="text-slate-200">Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVulns.slice(0, 10).map((vuln) => {
                  const timeRemaining = calculateTimeRemaining(vuln);
                  const progress = getProgressPercentage(vuln);
                  const status = getSLAStatus(vuln);

                  return (
                    <TableRow key={vuln.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">{vuln.title}</div>
                          <div className="text-sm text-slate-400">{vuln.host}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          vuln.severity === 'Critical' ? 'bg-red-600' :
                          vuln.severity === 'High' ? 'bg-orange-600' :
                          vuln.severity === 'Medium' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }>
                          {vuln.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        {timeRemaining > 0 ? `${timeRemaining} days` : 'Overdue'}
                      </TableCell>
                      <TableCell>
                        <div className="w-20">
                          <Progress 
                            value={progress} 
                            className={`h-2 ${
                              status === 'Overdue' ? 'bg-red-900' :
                              status === 'At Risk' ? 'bg-yellow-900' :
                              'bg-green-900'
                            }`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          status === 'Overdue' ? 'border-red-500 text-red-400' :
                          status === 'At Risk' ? 'border-yellow-500 text-yellow-400' :
                          'border-green-500 text-green-400'
                        }>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {vuln.assignedTo || 'Unassigned'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
