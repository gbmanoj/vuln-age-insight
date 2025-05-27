
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
import { RiskDashboard } from '@/components/RiskDashboard';
import { SLATracker } from '@/components/SLATracker';
import { VulnerabilityAssessment } from '@/components/VulnerabilityAssessment';
import { Shield, AlertTriangle, Clock, TrendingUp, Target, FileCheck, Users } from 'lucide-react';
import { Vulnerability, RiskMetrics, SLAConfig } from '@/types/vulnerability';

const Index = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Enterprise SLA Configuration
  const slaConfig: SLAConfig = {
    critical: 1,  // 1 day for critical
    high: 7,      // 7 days for high
    medium: 30,   // 30 days for medium
    low: 90       // 90 days for low
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    console.log('Processing file:', file.name);
    
    // Simulate file processing with enterprise data
    setTimeout(() => {
      const mockData: Vulnerability[] = [
        {
          id: '1',
          title: 'Critical SQL Injection in Authentication Module',
          severity: 'Critical',
          cvss: 9.8,
          host: '192.168.1.100',
          port: 80,
          protocol: 'tcp',
          description: 'SQL injection vulnerability in web application login form allowing authentication bypass',
          solution: 'Apply vendor security patch immediately and implement input validation',
          discoveredDate: new Date('2024-05-25'),
          lastSeen: new Date('2024-05-27'),
          status: 'Open',
          cve: 'CVE-2024-1234',
          category: 'Web Application Security',
          riskScore: 9.5,
          businessImpact: 'Critical',
          exploitability: 'High',
          affectedAssets: ['Web Server', 'Database', 'User Data'],
          assignedTo: 'security-team@company.com',
          dueDate: new Date('2024-05-26'),
          slaStatus: 'Overdue',
          remediationEffort: 'Medium',
          verificationStatus: 'Verified',
          complianceFrameworks: ['PCI-DSS', 'SOX', 'GDPR'],
          threatIntelligence: {
            exploitAvailable: true,
            malwareFamily: 'SQLMap variants',
            threatActors: ['APT-28', 'Criminal Groups']
          }
        },
        {
          id: '2',
          title: 'Outdated SSL/TLS Configuration (TLS 1.0/1.1)',
          severity: 'High',
          cvss: 7.5,
          host: '192.168.1.101',
          port: 443,
          protocol: 'tcp',
          description: 'Server supports deprecated SSL/TLS protocols vulnerable to POODLE and BEAST attacks',
          solution: 'Update SSL/TLS configuration to support only TLS 1.2+ and implement secure cipher suites',
          discoveredDate: new Date('2024-05-20'),
          lastSeen: new Date('2024-05-27'),
          status: 'In Progress',
          cve: 'CVE-2024-5678',
          category: 'SSL/TLS Security',
          riskScore: 7.2,
          businessImpact: 'High',
          exploitability: 'Medium',
          affectedAssets: ['Web Server', 'API Gateway'],
          assignedTo: 'infrastructure-team@company.com',
          dueDate: new Date('2024-05-27'),
          slaStatus: 'On Track',
          remediationEffort: 'Low',
          verificationStatus: 'Verified',
          complianceFrameworks: ['PCI-DSS', 'ISO 27001'],
          threatIntelligence: {
            exploitAvailable: false,
            threatActors: ['Script Kiddies']
          }
        },
        {
          id: '3',
          title: 'Missing Security Headers (CSP, HSTS, X-Frame-Options)',
          severity: 'Medium',
          cvss: 5.3,
          host: '192.168.1.102',
          port: 80,
          protocol: 'tcp',
          description: 'Web server missing critical security headers exposing application to XSS and clickjacking',
          solution: 'Configure security headers: Content-Security-Policy, HTTP Strict Transport Security, X-Frame-Options',
          discoveredDate: new Date('2024-05-15'),
          lastSeen: new Date('2024-05-27'),
          status: 'Open',
          cve: '',
          category: 'Web Application Security',
          riskScore: 5.8,
          businessImpact: 'Medium',
          exploitability: 'Medium',
          affectedAssets: ['Web Application', 'User Sessions'],
          assignedTo: 'dev-team@company.com',
          dueDate: new Date('2024-06-14'),
          slaStatus: 'On Track',
          remediationEffort: 'Low',
          verificationStatus: 'Pending',
          complianceFrameworks: ['OWASP Top 10', 'NIST'],
          threatIntelligence: {
            exploitAvailable: false
          }
        },
        {
          id: '4',
          title: 'Weak Password Policy Configuration',
          severity: 'Low',
          cvss: 3.1,
          host: '192.168.1.103',
          port: 22,
          protocol: 'tcp',
          description: 'System allows weak passwords with insufficient complexity requirements',
          solution: 'Implement strong password policy: minimum 12 characters, complexity requirements, password history',
          discoveredDate: new Date('2024-05-10'),
          lastSeen: new Date('2024-05-27'),
          status: 'Risk Accepted',
          cve: '',
          category: 'Authentication',
          riskScore: 3.5,
          businessImpact: 'Low',
          exploitability: 'Low',
          affectedAssets: ['User Accounts', 'SSH Access'],
          assignedTo: 'admin-team@company.com',
          dueDate: new Date('2024-08-08'),
          slaStatus: 'On Track',
          remediationEffort: 'High',
          verificationStatus: 'Verified',
          complianceFrameworks: ['NIST', 'CIS Controls'],
          threatIntelligence: {
            exploitAvailable: false
          }
        },
        {
          id: '5',
          title: 'Unpatched Apache HTTP Server (Remote Code Execution)',
          severity: 'Critical',
          cvss: 9.0,
          host: '192.168.1.105',
          port: 80,
          protocol: 'tcp',
          description: 'Apache HTTP Server vulnerable to remote code execution via path traversal',
          solution: 'Update Apache HTTP Server to latest version immediately',
          discoveredDate: new Date('2024-05-24'),
          lastSeen: new Date('2024-05-27'),
          status: 'Open',
          cve: 'CVE-2024-9999',
          category: 'Server Security',
          riskScore: 9.2,
          businessImpact: 'Critical',
          exploitability: 'High',
          affectedAssets: ['Web Server', 'Backend Systems'],
          assignedTo: 'infrastructure-team@company.com',
          dueDate: new Date('2024-05-25'),
          slaStatus: 'Overdue',
          remediationEffort: 'Medium',
          verificationStatus: 'Pending',
          complianceFrameworks: ['PCI-DSS', 'SOX', 'HIPAA'],
          threatIntelligence: {
            exploitAvailable: true,
            malwareFamily: 'Webshells',
            threatActors: ['APT Groups', 'Ransomware Gangs']
          }
        }
      ];
      
      setVulnerabilities(mockData);
      setIsLoading(false);
    }, 2000);
  };

  const handleStatusUpdate = (id: string, status: string, notes?: string) => {
    setVulnerabilities(prev => 
      prev.map(vuln => 
        vuln.id === id 
          ? { ...vuln, verificationStatus: status as any, status: status as any }
          : vuln
      )
    );
    console.log(`Updated vulnerability ${id} to status: ${status}`, notes);
  };

  // Calculate enterprise metrics
  const riskMetrics: RiskMetrics = {
    totalRiskScore: vulnerabilities.reduce((sum, v) => sum + v.riskScore, 0),
    highRiskAssets: new Set(vulnerabilities.flatMap(v => v.affectedAssets)).size,
    criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'Critical').length,
    slaBreaches: vulnerabilities.filter(v => v.slaStatus === 'Overdue').length,
    meanTimeToRemediation: 15, // Average days
    vulnerabilityTrend: 'Increasing'
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
              Enterprise Vulnerability Management Platform
            </h1>
            <p className="text-slate-400 mt-2">Advanced security assessment, risk management, and SLA tracking</p>
          </div>
          <Shield className="h-12 w-12 text-blue-400" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            title="SLA Breaches"
            value={riskMetrics.slaBreaches.toString()}
            icon={<Clock className="h-5 w-5" />}
            trend="+3"
            className="border-red-500/20 bg-red-950/20"
          />
          <MetricCard
            title="Risk Score"
            value={Math.round(riskMetrics.totalRiskScore / totalVulns || 0).toString()}
            icon={<Target className="h-5 w-5" />}
            trend="+0.8"
            className="border-yellow-500/20 bg-yellow-950/20"
          />
          <MetricCard
            title="Avg MTTR"
            value={`${riskMetrics.meanTimeToRemediation}d`}
            icon={<TrendingUp className="h-5 w-5" />}
            trend="-2d"
            className="border-blue-500/20 bg-blue-950/20"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="risk-management">Risk Management</TabsTrigger>
            <TabsTrigger value="sla-tracking">SLA Tracking</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
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
                <CardDescription>7-day vulnerability discovery and resolution trend</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-management">
            <RiskDashboard 
              vulnerabilities={vulnerabilities}
              riskMetrics={riskMetrics}
              slaConfig={slaConfig}
            />
          </TabsContent>

          <TabsContent value="sla-tracking">
            <SLATracker 
              vulnerabilities={vulnerabilities}
              slaConfig={slaConfig}
            />
          </TabsContent>

          <TabsContent value="assessment">
            <VulnerabilityAssessment 
              vulnerabilities={vulnerabilities}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="upload">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Upload Security Scan Results</CardTitle>
                <CardDescription>
                  Upload .nessus files for automatic vulnerability parsing and enterprise-level analysis
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
                <CardTitle className="text-white">Vulnerability Management</CardTitle>
                <CardDescription>
                  Comprehensive view of all identified vulnerabilities with enterprise context
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
