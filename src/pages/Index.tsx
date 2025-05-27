
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/FileUpload';
import { VulnerabilityChart } from '@/components/VulnerabilityChart';
import { VulnerabilityTable } from '@/components/VulnerabilityTable';
import { MetricCard } from '@/components/MetricCard';
import { AgingMetrics } from '@/components/AgingMetrics';
import { TrendChart } from '@/components/TrendChart';
import { Shield, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Vulnerability } from '@/types/vulnerability';

const Index = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    console.log('Processing file:', file.name);
    
    // Simulate file processing
    setTimeout(() => {
      const mockData: Vulnerability[] = [
        {
          id: '1',
          title: 'Critical SQL Injection Vulnerability',
          severity: 'Critical',
          cvss: 9.8,
          host: '192.168.1.100',
          port: 80,
          protocol: 'tcp',
          description: 'SQL injection vulnerability in web application login form',
          solution: 'Apply vendor security patch immediately',
          discoveredDate: new Date('2024-01-15'),
          lastSeen: new Date('2024-05-27'),
          status: 'Open',
          cve: 'CVE-2024-1234',
          category: 'Web Application Security'
        },
        {
          id: '2',
          title: 'Outdated SSL/TLS Configuration',
          severity: 'High',
          cvss: 7.5,
          host: '192.168.1.101',
          port: 443,
          protocol: 'tcp',
          description: 'Server supports weak SSL/TLS protocols',
          solution: 'Update SSL/TLS configuration to support only secure protocols',
          discoveredDate: new Date('2024-02-01'),
          lastSeen: new Date('2024-05-27'),
          status: 'Open',
          cve: 'CVE-2024-5678',
          category: 'SSL/TLS Security'
        },
        {
          id: '3',
          title: 'Missing Security Headers',
          severity: 'Medium',
          cvss: 5.3,
          host: '192.168.1.102',
          port: 80,
          protocol: 'tcp',
          description: 'Web server missing important security headers',
          solution: 'Configure security headers: X-Frame-Options, CSP, HSTS',
          discoveredDate: new Date('2024-03-10'),
          lastSeen: new Date('2024-05-27'),
          status: 'In Progress',
          cve: '',
          category: 'Web Application Security'
        },
        {
          id: '4',
          title: 'Weak Password Policy',
          severity: 'Low',
          cvss: 3.1,
          host: '192.168.1.103',
          port: 22,
          protocol: 'tcp',
          description: 'System allows weak passwords',
          solution: 'Implement strong password policy requirements',
          discoveredDate: new Date('2024-04-05'),
          lastSeen: new Date('2024-05-27'),
          status: 'Open',
          cve: '',
          category: 'Authentication'
        }
      ];
      
      setVulnerabilities(mockData);
      setIsLoading(false);
    }, 2000);
  };

  const severityCounts = {
    Critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
    High: vulnerabilities.filter(v => v.severity === 'High').length,
    Medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
    Low: vulnerabilities.filter(v => v.severity === 'Low').length
  };

  const totalVulns = vulnerabilities.length;
  const avgCVSS = vulnerabilities.length > 0 
    ? (vulnerabilities.reduce((sum, v) => sum + v.cvss, 0) / vulnerabilities.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Vulnerability Management Platform
            </h1>
            <p className="text-slate-400 mt-2">Advanced security assessment and vulnerability tracking</p>
          </div>
          <Shield className="h-12 w-12 text-blue-400" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Vulnerabilities"
            value={totalVulns.toString()}
            icon={<AlertTriangle className="h-5 w-5" />}
            trend="+12%"
            className="border-red-500/20 bg-red-950/20"
          />
          <MetricCard
            title="Critical Issues"
            value={severityCounts.Critical.toString()}
            icon={<Shield className="h-5 w-5" />}
            trend="-5%"
            className="border-orange-500/20 bg-orange-950/20"
          />
          <MetricCard
            title="Average CVSS"
            value={avgCVSS}
            icon={<TrendingUp className="h-5 w-5" />}
            trend="+0.3"
            className="border-yellow-500/20 bg-yellow-950/20"
          />
          <MetricCard
            title="Avg Age (Days)"
            value="45"
            icon={<Clock className="h-5 w-5" />}
            trend="+7"
            className="border-blue-500/20 bg-blue-950/20"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="upload">Upload Scan</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Vulnerability Distribution</CardTitle>
                  <CardDescription>Breakdown by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <VulnerabilityChart vulnerabilities={vulnerabilities} />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Aging Metrics</CardTitle>
                  <CardDescription>Vulnerability age distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <AgingMetrics vulnerabilities={vulnerabilities} />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Trend Analysis</CardTitle>
                <CardDescription>7-day vulnerability discovery trend</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Upload Nessus Scan Results</CardTitle>
                <CardDescription>
                  Upload .nessus files for automatic vulnerability parsing and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vulnerabilities">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Vulnerability Details</CardTitle>
                <CardDescription>
                  Comprehensive view of all identified vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VulnerabilityTable vulnerabilities={vulnerabilities} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">CVSS Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <VulnerabilityChart vulnerabilities={vulnerabilities} type="cvss" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <VulnerabilityChart vulnerabilities={vulnerabilities} type="category" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
