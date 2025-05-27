
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Server, 
  Clock, 
  MapPin, 
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Network,
  HardDrive,
  Cpu,
  BarChart3
} from 'lucide-react';

interface Asset {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  type: string;
  status: string;
  riskScore: number;
  vulnerabilities: number;
  criticalVulns: number;
  highVulns: number;
  mediumVulns: number;
  lowVulns: number;
  lastScan: Date;
  owner: string;
  location: string;
  services: string[];
  compliance: string[];
}

interface AssetDetailsProps {
  asset: Asset;
}

export const AssetDetails = ({ asset }: AssetDetailsProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (score: number) => {
    if (score >= 9) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (score >= 7) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (score >= 4) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-400 bg-green-500/10 border-green-500/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'offline': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default: return <Activity className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Asset Header */}
      <Card className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <Server className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{asset.hostname}</h2>
                <p className="text-slate-400">{asset.ip} • {asset.type}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {getStatusIcon(asset.status)}
                  <span className="text-sm text-slate-300">{asset.status}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${getRiskColor(asset.riskScore)} text-lg px-3 py-1`}>
                Risk: {asset.riskScore}/10
              </Badge>
              <p className="text-xs text-slate-400 mt-1">
                Last scan: {formatDate(asset.lastScan)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-slate-700">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-slate-700">Services</TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-slate-700">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* System Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating System</span>
                  <span className="text-white">{asset.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Asset Type</span>
                  <span className="text-white">{asset.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IP Address</span>
                  <span className="text-white font-mono">{asset.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <Badge className={asset.status === 'Online' ? 'bg-green-600' : 'bg-red-600'}>
                    {asset.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Location & Ownership */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location & Ownership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="text-white">{asset.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Owner</span>
                  <span className="text-white">{asset.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Scan</span>
                  <span className="text-white">{formatDate(asset.lastScan)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Risk Metrics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Score</span>
                  <Badge className={getRiskColor(asset.riskScore)}>
                    {asset.riskScore}/10
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Vulnerabilities</span>
                  <span className="text-white">{asset.vulnerabilities}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Critical</span>
                    <span className="text-red-400">{asset.criticalVulns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-400">High</span>
                    <span className="text-orange-400">{asset.highVulns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-400">Medium</span>
                    <span className="text-yellow-400">{asset.mediumVulns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Low</span>
                    <span className="text-green-400">{asset.lowVulns}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Vulnerability Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Detailed Vulnerability Data</h3>
                <p className="text-slate-400 mb-6">Upload .nessus file to view specific vulnerabilities for this asset</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Load Vulnerability Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Network className="h-5 w-5 mr-2" />
                Running Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {asset.services.map((service) => (
                  <div key={service} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{service}</span>
                      <Badge className="bg-green-600 text-white">Active</Badge>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">Port: Auto-detected</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Compliance Frameworks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {asset.compliance.map((framework) => (
                  <div key={framework} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{framework}</h4>
                        <p className="text-slate-400 text-sm">Compliance status for this framework</p>
                      </div>
                      <Badge className="bg-blue-600 text-white">Compliant</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
