
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Shield, 
  AlertTriangle, 
  Search, 
  Filter,
  Network,
  Database,
  Globe,
  HardDrive,
  Cpu,
  Activity,
  TrendingUp,
  Eye,
  Settings
} from 'lucide-react';
import { AssetGrid } from '@/components/AssetGrid';
import { AssetMap } from '@/components/AssetMap';
import { AssetDetails } from '@/components/AssetDetails';

// Mock data for demonstration
const mockAssets = [
  {
    id: '1',
    hostname: 'web-server-01.company.com',
    ip: '192.168.1.100',
    os: 'Ubuntu 20.04.3 LTS',
    type: 'Web Server',
    status: 'Online',
    riskScore: 8.5,
    vulnerabilities: 23,
    criticalVulns: 3,
    highVulns: 8,
    mediumVulns: 10,
    lowVulns: 2,
    lastScan: new Date('2024-01-20'),
    owner: 'IT Department',
    location: 'Data Center A',
    services: ['HTTP', 'HTTPS', 'SSH'],
    compliance: ['PCI-DSS', 'SOX']
  },
  {
    id: '2',
    hostname: 'db-primary-01.company.com',
    ip: '192.168.1.200',
    os: 'Windows Server 2019',
    type: 'Database',
    status: 'Online',
    riskScore: 9.2,
    vulnerabilities: 31,
    criticalVulns: 5,
    highVulns: 12,
    mediumVulns: 12,
    lowVulns: 2,
    lastScan: new Date('2024-01-19'),
    owner: 'Database Team',
    location: 'Data Center B',
    services: ['MSSQL', 'RDP'],
    compliance: ['SOX', 'HIPAA']
  },
  {
    id: '3',
    hostname: 'firewall-01.company.com',
    ip: '192.168.1.1',
    os: 'Cisco IOS',
    type: 'Network Device',
    status: 'Online',
    riskScore: 4.2,
    vulnerabilities: 8,
    criticalVulns: 0,
    highVulns: 2,
    mediumVulns: 4,
    lowVulns: 2,
    lastScan: new Date('2024-01-21'),
    owner: 'Network Team',
    location: 'Data Center A',
    services: ['SNMP', 'SSH'],
    compliance: ['ISO 27001']
  }
];

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.ip.includes(searchTerm) ||
                         asset.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || asset.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getAssetTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'web server': return <Globe className="h-5 w-5" />;
      case 'database': return <Database className="h-5 w-5" />;
      case 'network device': return <Network className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 9) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (score >= 7) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (score >= 4) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-400 bg-green-500/10 border-green-500/20';
  };

  const totalAssets = mockAssets.length;
  const highRiskAssets = mockAssets.filter(a => a.riskScore >= 7).length;
  const offlineAssets = mockAssets.filter(a => a.status === 'Offline').length;
  const totalVulns = mockAssets.reduce((sum, asset) => sum + asset.vulnerabilities, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Asset Management</h1>
            <p className="text-slate-400">Monitor and manage your IT infrastructure assets</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              <Settings className="h-4 w-4 mr-2" />
              Configure Scans
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Activity className="h-4 w-4 mr-2" />
              Run Scan
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Total Assets</CardTitle>
              <Server className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalAssets}</div>
              <div className="flex items-center text-sm text-blue-300 mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2 this week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-200">High Risk Assets</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{highRiskAssets}</div>
              <div className="text-sm text-red-300 mt-2">
                {Math.round((highRiskAssets / totalAssets) * 100)}% of total
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-200">Online Assets</CardTitle>
              <Activity className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalAssets - offlineAssets}</div>
              <div className="text-sm text-green-300 mt-2">
                {Math.round(((totalAssets - offlineAssets) / totalAssets) * 100)}% uptime
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Vulnerabilities</CardTitle>
              <Shield className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalVulns}</div>
              <div className="text-sm text-purple-300 mt-2">
                Across all assets
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assets by hostname, IP, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="web">Web Servers</SelectItem>
                  <SelectItem value="database">Databases</SelectItem>
                  <SelectItem value="network">Network Devices</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Grid View
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Network Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-slate-700">Asset Details</TabsTrigger>
            <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-slate-700">Vulnerabilities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {viewMode === 'grid' ? (
              <AssetGrid 
                assets={filteredAssets} 
                onAssetSelect={setSelectedAsset}
                getAssetTypeIcon={getAssetTypeIcon}
                getRiskColor={getRiskColor}
              />
            ) : (
              <AssetMap assets={filteredAssets} onAssetSelect={setSelectedAsset} />
            )}
          </TabsContent>

          <TabsContent value="details">
            {selectedAsset ? (
              <AssetDetails asset={selectedAsset} />
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Eye className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select an Asset</h3>
                  <p className="text-slate-400">Choose an asset from the overview to view detailed information</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="vulnerabilities">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Asset Vulnerabilities</CardTitle>
                <CardDescription>Vulnerability data from .nessus file analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Vulnerability Analysis</h3>
                  <p className="text-slate-400 mb-6">Upload a .nessus file to see detailed vulnerability information for your assets</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Upload .nessus File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
