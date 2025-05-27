
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Clock, 
  MapPin, 
  Users,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Info
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

interface AssetGridProps {
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
  getAssetTypeIcon: (type: string) => React.ReactNode;
  getRiskColor: (score: number) => string;
}

export const AssetGrid = ({ assets, onAssetSelect, getAssetTypeIcon, getRiskColor }: AssetGridProps) => {
  const formatLastSeen = (date: Date) => {
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getVulnProgress = (asset: Asset) => {
    const total = asset.vulnerabilities;
    const critical = (asset.criticalVulns / total) * 100;
    const high = (asset.highVulns / total) * 100;
    return { critical, high, total };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => {
        const vulnProgress = getVulnProgress(asset);
        
        return (
          <Card 
            key={asset.id} 
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700 backdrop-blur-sm hover:from-slate-700/80 hover:to-slate-800/80 transition-all duration-300 cursor-pointer group"
            onClick={() => onAssetSelect(asset)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    {getAssetTypeIcon(asset.type)}
                  </div>
                  <div>
                    <CardTitle className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors">
                      {asset.hostname}
                    </CardTitle>
                    <p className="text-slate-400 text-xs">{asset.ip}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(asset.status)}`} />
                  <span className="text-xs text-slate-400">{asset.status}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Risk Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Risk Score</span>
                <Badge className={`${getRiskColor(asset.riskScore)} font-mono`}>
                  {asset.riskScore}/10
                </Badge>
              </div>

              {/* Vulnerability Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Vulnerabilities</span>
                  <span className="text-white font-medium">{asset.vulnerabilities}</span>
                </div>
                <div className="space-y-1">
                  {asset.criticalVulns > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-400">Critical</span>
                      <span className="text-red-400">{asset.criticalVulns}</span>
                    </div>
                  )}
                  {asset.highVulns > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-400">High</span>
                      <span className="text-orange-400">{asset.highVulns}</span>
                    </div>
                  )}
                  <Progress value={vulnProgress.critical + vulnProgress.high} className="h-1" />
                </div>
              </div>

              {/* Asset Info */}
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <div className="flex items-center text-xs text-slate-400">
                  <Monitor className="h-3 w-3 mr-2" />
                  {asset.type} • {asset.os}
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <MapPin className="h-3 w-3 mr-2" />
                  {asset.location}
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Users className="h-3 w-3 mr-2" />
                  {asset.owner}
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="h-3 w-3 mr-2" />
                  Last scan: {formatLastSeen(asset.lastScan)}
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-1">
                {asset.services.slice(0, 3).map((service) => (
                  <Badge 
                    key={service} 
                    variant="outline" 
                    className="text-xs bg-slate-700/50 border-slate-600 text-slate-300"
                  >
                    {service}
                  </Badge>
                ))}
                {asset.services.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-slate-700/50 border-slate-600 text-slate-400">
                    +{asset.services.length - 3}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle scan action
                  }}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Scan
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssetSelect(asset);
                  }}
                >
                  <Info className="h-3 w-3 mr-1" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
