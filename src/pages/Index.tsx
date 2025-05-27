import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Upload, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Target,
  Activity,
  Server,
  Database,
  Network,
  Eye,
  Settings,
  FileText,
  ChevronRight
} from 'lucide-react';
import { RiskDashboard } from '@/components/RiskDashboard';
import { VulnerabilityTable } from '@/components/VulnerabilityTable';
import { VulnerabilityChart } from '@/components/VulnerabilityChart';
import { FileUpload } from '@/components/FileUpload';
import { Link } from 'react-router-dom';
import { Vulnerability, RiskMetrics, SLAConfig } from '@/types/vulnerability';

// Mock data
const mockVulnerabilities: Vulnerability[] = [
  {
    id: '1',
    title: 'SQL Injection Vulnerability',
    severity: 'Critical',
    cvss: 9.5,
    host: 'web-server-01',
    port: 8080,
    protocol: 'TCP',
    description: 'A SQL injection vulnerability was detected in the login form.',
    solution: 'Apply parameterized queries or prepared statements.',
    discoveredDate: new Date('2024-01-15'),
    lastSeen: new Date('2024-01-22'),
    status: 'Open',
    cve: 'CVE-2023-1234',
    category: 'SQL Injection',
    riskScore: 9.5,
    businessImpact: 'Critical',
    exploitability: 'High',
    affectedAssets: ['web-server-01', 'db-server-01'],
    assignedTo: 'John Doe',
    dueDate: new Date('2024-02-15'),
    slaStatus: 'Overdue',
    remediationEffort: 'High',
    verificationStatus: 'Pending',
    complianceFrameworks: ['PCI-DSS', 'HIPAA'],
    threatIntelligence: {
      exploitAvailable: true,
      malwareFamily: 'SQLRat',
      threatActors: ['APT41']
    }
  },
  {
    id: '2',
    title: 'Cross-Site Scripting (XSS) Vulnerability',
    severity: 'High',
    cvss: 7.8,
    host: 'app-server-02',
    port: 443,
    protocol: 'HTTPS',
    description: 'A stored XSS vulnerability was found in the user profile page.',
    solution: 'Implement proper input validation and output encoding.',
    discoveredDate: new Date('2024-01-10'),
    lastSeen: new Date('2024-01-22'),
    status: 'In Progress',
    cve: 'CVE-2023-5678',
    category: 'XSS',
    riskScore: 7.8,
    businessImpact: 'High',
    exploitability: 'Medium',
    affectedAssets: ['app-server-02'],
    assignedTo: 'Jane Smith',
    dueDate: new Date('2024-02-01'),
    slaStatus: 'At Risk',
    remediationEffort: 'Medium',
    verificationStatus: 'Pending',
    complianceFrameworks: ['OWASP', 'GDPR'],
    threatIntelligence: {
      exploitAvailable: false,
      malwareFamily: 'XSSProxy',
      threatActors: ['Anonymous']
    }
  },
  {
    id: '3',
    title: 'Remote Code Execution (RCE) Vulnerability',
    severity: 'Critical',
    cvss: 9.8,
    host: 'file-server-03',
    port: 22,
    protocol: 'SSH',
    description: 'An RCE vulnerability exists in the file upload module.',
    solution: 'Update to the latest version of the file upload module.',
    discoveredDate: new Date('2024-01-05'),
    lastSeen: new Date('2024-01-22'),
    status: 'Open',
    cve: 'CVE-2023-9012',
    category: 'RCE',
    riskScore: 9.8,
    businessImpact: 'Critical',
    exploitability: 'High',
    affectedAssets: ['file-server-03'],
    assignedTo: 'Bob Johnson',
    dueDate: new Date('2024-01-29'),
    slaStatus: 'Overdue',
    remediationEffort: 'High',
    verificationStatus: 'Pending',
    complianceFrameworks: ['ISO 27001'],
    threatIntelligence: {
      exploitAvailable: true,
      malwareFamily: 'RCEBot',
      threatActors: ['APT29']
    }
  },
  {
    id: '4',
    title: 'Privilege Escalation Vulnerability',
    severity: 'High',
    cvss: 8.2,
    host: 'internal-server-04',
    port: 21,
    protocol: 'FTP',
    description: 'A privilege escalation vulnerability was identified in the FTP service.',
    solution: 'Restrict access to sensitive files and directories.',
    discoveredDate: new Date('2024-01-01'),
    lastSeen: new Date('2024-01-22'),
    status: 'Resolved',
    cve: 'CVE-2023-3456',
    category: 'Privilege Escalation',
    riskScore: 8.2,
    businessImpact: 'High',
    exploitability: 'Medium',
    affectedAssets: ['internal-server-04'],
    assignedTo: 'Alice Brown',
    dueDate: new Date('2024-01-22'),
    slaStatus: 'Resolved',
    remediationEffort: 'Medium',
    verificationStatus: 'Verified',
    complianceFrameworks: ['NIST'],
    threatIntelligence: {
      exploitAvailable: false,
      malwareFamily: 'PrivEscalator',
      threatActors: ['Insider Threat']
    }
  },
  {
    id: '5',
    title: 'Denial of Service (DoS) Vulnerability',
    severity: 'Medium',
    cvss: 6.5,
    host: 'load-balancer-05',
    port: 80,
    protocol: 'HTTP',
    description: 'A DoS vulnerability was detected in the handling of large HTTP requests.',
    solution: 'Implement rate limiting and request filtering.',
    discoveredDate: new Date('2023-12-25'),
    lastSeen: new Date('2024-01-22'),
    status: 'Risk Accepted',
    cve: 'CVE-2023-7890',
    category: 'DoS',
    riskScore: 6.5,
    businessImpact: 'Medium',
    exploitability: 'Low',
    affectedAssets: ['load-balancer-05'],
    assignedTo: 'Charlie Green',
    dueDate: new Date('2024-01-15'),
    slaStatus: 'On Track',
    remediationEffort: 'Low',
    verificationStatus: 'Pending',
    complianceFrameworks: ['SOC2'],
    threatIntelligence: {
      exploitAvailable: false,
      malwareFamily: 'DDoSAttack',
      threatActors: ['Hacktivists']
    }
  },
  {
    id: '6',
    title: 'Information Disclosure Vulnerability',
    severity: 'Low',
    cvss: 3.1,
    host: 'backup-server-06',
    port: 23,
    protocol: 'Telnet',
    description: 'Sensitive information is being disclosed via the Telnet service.',
    solution: 'Disable Telnet and use SSH instead.',
    discoveredDate: new Date('2023-12-20'),
    lastSeen: new Date('2024-01-22'),
    status: 'False Positive',
    cve: 'CVE-2023-2345',
    category: 'Information Disclosure',
    riskScore: 3.1,
    businessImpact: 'Low',
    exploitability: 'Low',
    affectedAssets: ['backup-server-06'],
    assignedTo: 'David White',
    dueDate: new Date('2024-01-10'),
    slaStatus: 'Resolved',
    remediationEffort: 'Low',
    verificationStatus: 'Verified',
    complianceFrameworks: ['GDPR'],
    threatIntelligence: {
      exploitAvailable: false,
      malwareFamily: 'InfoStealer',
      threatActors: ['Competitors']
    }
  }
];

const mockRiskMetrics: RiskMetrics = {
  totalRiskScore: 7.2,
  highRiskAssets: 12,
  criticalVulnerabilities: 5,
  slaBreaches: 2,
  meanTimeToRemediation: 14,
  vulnerabilityTrend: 'Increasing'
};

const mockSLAConfig: SLAConfig = {
  critical: 7, // days
  high: 14,
  medium: 30,
  low: 90
};

export default function Index() {
  const [uploadingFile, setUploadingFile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleFileUpload = (file: File) => {
    console.log('Uploading file:', file.name);
    setUploadingFile(true);
    
    // Simulate file processing
    setTimeout(() => {
      setUploadingFile(false);
      console.log('File processed successfully');
    }, 3000);
  };

  const criticalVulns = mockVulnerabilities.filter(v => v.severity === 'Critical').length;
  const highVulns = mockVulnerabilities.filter(v => v.severity === 'High').length;
  const totalAssets = 156; // Mock data
  const onlineAssets = 142; // Mock data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation Header */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">CyberGuard</h1>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/assets" 
                  className="text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center"
                >
                  Assets
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
                <span className="text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer">
                  Reports
                </span>
                <span className="text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer">
                  Settings
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload Scan
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Enterprise Vulnerability Management
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Comprehensive security analytics and risk management platform for modern enterprises
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-red-400">{criticalVulns}</div>
              <div className="text-sm text-red-300">Critical Vulnerabilities</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-orange-400">{highVulns}</div>
              <div className="text-sm text-orange-300">High Risk Issues</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-400">{totalAssets}</div>
              <div className="text-sm text-blue-300">Total Assets</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-green-400">{onlineAssets}</div>
              <div className="text-sm text-green-300">Assets Online</div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm p-1">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 px-6 py-3"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Risk Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="vulnerabilities" 
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 px-6 py-3"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Vulnerabilities
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 px-6 py-3"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 px-6 py-3"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <RiskDashboard 
              vulnerabilities={mockVulnerabilities}
              riskMetrics={mockRiskMetrics}
              slaConfig={mockSLAConfig}
            />
          </TabsContent>

          <TabsContent value="vulnerabilities" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Vulnerability Management
                </CardTitle>
                <CardDescription>
                  Comprehensive view of all security vulnerabilities across your infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VulnerabilityTable vulnerabilities={mockVulnerabilities} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Vulnerability Distribution</CardTitle>
                  <CardDescription>Breakdown by severity levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <VulnerabilityChart vulnerabilities={mockVulnerabilities} type="severity" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">CVSS Score Distribution</CardTitle>
                  <CardDescription>Risk assessment based on CVSS scoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <VulnerabilityChart vulnerabilities={mockVulnerabilities} type="cvss" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Vulnerability Categories</CardTitle>
                  <CardDescription>Distribution across different vulnerability types</CardDescription>
                </CardHeader>
                <CardContent>
                  <VulnerabilityChart vulnerabilities={mockVulnerabilities} type="category" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Nessus File Upload
                </CardTitle>
                <CardDescription>
                  Upload your .nessus scan files for automated vulnerability analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUpload={handleFileUpload} isLoading={uploadingFile} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/20 backdrop-blur-sm hover:from-blue-800/40 hover:to-blue-700/30 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Server className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Asset Management</h3>
              <p className="text-slate-400 text-sm mb-4">View and manage your IT infrastructure assets</p>
              <Link to="/assets">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  Manage Assets
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/20 backdrop-blur-sm hover:from-purple-800/40 hover:to-purple-700/30 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
              <p className="text-slate-400 text-sm mb-4">Comprehensive risk analysis and reporting</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                View Reports
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/20 backdrop-blur-sm hover:from-green-800/40 hover:to-green-700/30 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Monitoring</h3>
              <p className="text-slate-400 text-sm mb-4">Live security monitoring and alerts</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                View Monitor
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
