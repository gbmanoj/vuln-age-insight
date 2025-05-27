
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Server, Database, Globe, Shield } from 'lucide-react';

interface Asset {
  id: string;
  hostname: string;
  ip: string;
  type: string;
  riskScore: number;
  status: string;
}

interface AssetMapProps {
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
}

export const AssetMap = ({ assets, onAssetSelect }: AssetMapProps) => {
  const getAssetIcon = (type: string, size = "h-8 w-8") => {
    switch (type.toLowerCase()) {
      case 'web server': return <Globe className={`${size} text-blue-400`} />;
      case 'database': return <Database className={`${size} text-green-400`} />;
      case 'network device': return <Network className={`${size} text-purple-400`} />;
      default: return <Server className={`${size} text-gray-400`} />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 9) return 'border-red-500 bg-red-500/10';
    if (score >= 7) return 'border-orange-500 bg-orange-500/10';
    if (score >= 4) return 'border-yellow-500 bg-yellow-500/10';
    return 'border-green-500 bg-green-500/10';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Network Topology</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-slate-900/50 rounded-lg p-8 min-h-[600px] overflow-hidden">
          {/* Network Zones */}
          <div className="absolute inset-4 border-2 border-dashed border-slate-600 rounded-lg">
            <div className="absolute top-2 left-2 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
              DMZ Zone
            </div>
          </div>
          
          <div className="absolute top-16 left-8 right-8 bottom-32 border-2 border-dashed border-blue-600/30 rounded-lg">
            <div className="absolute top-2 left-2 text-xs text-blue-400 bg-slate-800 px-2 py-1 rounded">
              Internal Network (192.168.1.0/24)
            </div>
          </div>

          <div className="absolute bottom-8 left-16 right-16 h-24 border-2 border-dashed border-green-600/30 rounded-lg">
            <div className="absolute top-2 left-2 text-xs text-green-400 bg-slate-800 px-2 py-1 rounded">
              Secure Zone
            </div>
          </div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            {/* Network connections */}
            <line x1="20%" y1="50%" x2="50%" y2="30%" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="20%" y1="50%" x2="50%" y2="70%" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="50%" y1="30%" x2="80%" y2="50%" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </svg>

          {/* Assets positioned on the map */}
          {assets.map((asset, index) => {
            const positions = [
              { x: '15%', y: '45%' }, // Firewall
              { x: '45%', y: '25%' }, // Web Server
              { x: '75%', y: '45%' }, // Database
              { x: '60%', y: '70%' }, // Additional assets
              { x: '30%', y: '65%' },
            ];
            
            const position = positions[index] || { x: `${20 + (index * 15)}%`, y: `${30 + (index * 10)}%` };
            
            return (
              <div
                key={asset.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group ${getRiskColor(asset.riskScore)} border-2 rounded-lg p-3 backdrop-blur-sm hover:scale-110 transition-all duration-200`}
                style={{ left: position.x, top: position.y }}
                onClick={() => onAssetSelect(asset)}
              >
                <div className="flex flex-col items-center space-y-2">
                  {getAssetIcon(asset.type)}
                  <div className="text-center">
                    <div className="text-xs font-medium text-white truncate max-w-20">
                      {asset.hostname.split('.')[0]}
                    </div>
                    <div className="text-xs text-slate-400">{asset.ip}</div>
                  </div>
                  <Badge 
                    className={`text-xs ${asset.status === 'Online' ? 'bg-green-600' : 'bg-red-600'}`}
                  >
                    {asset.status}
                  </Badge>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg min-w-48">
                    <div className="text-sm font-medium text-white">{asset.hostname}</div>
                    <div className="text-xs text-slate-400">{asset.type}</div>
                    <div className="text-xs text-slate-400">Risk Score: {asset.riskScore}/10</div>
                    <div className="text-xs text-slate-400">IP: {asset.ip}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-slate-800/90 border border-slate-600 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-white mb-3">Asset Types</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-300">Web Server</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-300">Database</span>
              </div>
              <div className="flex items-center space-x-2">
                <Network className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-300">Network Device</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
