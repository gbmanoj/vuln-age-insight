
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileText, 
  Table, 
  BarChart3, 
  Calendar,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Vulnerability } from '@/types/vulnerability';
import { NessusScanResult } from '@/utils/nessusParser';

interface ReportExportProps {
  vulnerabilities: Vulnerability[];
  scanResult?: NessusScanResult;
}

export const ReportExport = ({ vulnerabilities, scanResult }: ReportExportProps) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const filteredVulns = severityFilter === 'all' 
        ? vulnerabilities 
        : vulnerabilities.filter(v => v.severity === severityFilter);

      if (exportFormat === 'csv') {
        exportToCSV(filteredVulns);
      } else if (exportFormat === 'json') {
        exportToJSON(filteredVulns, scanResult);
      } else if (exportFormat === 'pdf') {
        await exportToPDF(filteredVulns, scanResult);
      }

      toast({
        title: "Report exported successfully",
        description: `Vulnerability report exported as ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred while generating the report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = (vulns: Vulnerability[]) => {
    const headers = [
      'ID', 'Title', 'Severity', 'CVSS', 'Host', 'Port', 'Protocol',
      'Status', 'CVE', 'Category', 'Risk Score', 'Discovered Date',
      'Last Seen', 'Business Impact', 'Exploitability', 'Solution'
    ];

    const csvData = vulns.map(vuln => [
      vuln.id,
      `"${vuln.title.replace(/"/g, '""')}"`,
      vuln.severity,
      vuln.cvss,
      vuln.host,
      vuln.port,
      vuln.protocol,
      vuln.status,
      vuln.cve || '',
      vuln.category,
      vuln.riskScore,
      vuln.discoveredDate.toISOString().split('T')[0],
      vuln.lastSeen.toISOString().split('T')[0],
      vuln.businessImpact,
      vuln.exploitability,
      `"${vuln.solution.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    downloadFile(csvContent, 'vulnerability-report.csv', 'text/csv');
  };

  const exportToJSON = (vulns: Vulnerability[], scanResult?: NessusScanResult) => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalVulnerabilities: vulns.length,
        scanInfo: scanResult?.scanInfo,
        summary: scanResult?.vulnerabilitySummary
      },
      vulnerabilities: vulns,
      ...(scanResult && { hostDetails: scanResult.hosts })
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, 'vulnerability-report.json', 'application/json');
  };

  const exportToPDF = async (vulns: Vulnerability[], scanResult?: NessusScanResult) => {
    // Create a comprehensive PDF report content
    const reportContent = generatePDFReport(vulns, scanResult, {
      includeCharts,
      includeSummary,
      includeDetails,
      includeRecommendations
    });

    // For now, we'll export as HTML that can be printed to PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vulnerability Assessment Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .summary { margin: 20px 0; }
            .vulnerability { margin: 15px 0; padding: 10px; border: 1px solid #ddd; }
            .critical { border-left: 5px solid #ef4444; }
            .high { border-left: 5px solid #f97316; }
            .medium { border-left: 5px solid #eab308; }
            .low { border-left: 5px solid #22c55e; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${reportContent}
        </body>
      </html>
    `;

    downloadFile(htmlContent, 'vulnerability-report.html', 'text/html');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePDFReport = (
    vulns: Vulnerability[], 
    scanResult?: NessusScanResult,
    options: any = {}
  ): string => {
    const summary = scanResult?.vulnerabilitySummary || calculateSummary(vulns);
    const reportDate = new Date().toLocaleDateString();

    let content = `
      <div class="header">
        <h1>Vulnerability Assessment Report</h1>
        <p>Generated on: ${reportDate}</p>
        ${scanResult ? `<p>Scan Date: ${scanResult.scanInfo.scanStart.toLocaleDateString()}</p>` : ''}
      </div>
    `;

    if (options.includeSummary) {
      content += `
        <div class="summary">
          <h2>Executive Summary</h2>
          <table>
            <tr><th>Severity</th><th>Count</th><th>Percentage</th></tr>
            <tr><td>Critical</td><td>${summary.critical}</td><td>${((summary.critical / summary.total) * 100).toFixed(1)}%</td></tr>
            <tr><td>High</td><td>${summary.high}</td><td>${((summary.high / summary.total) * 100).toFixed(1)}%</td></tr>
            <tr><td>Medium</td><td>${summary.medium}</td><td>${((summary.medium / summary.total) * 100).toFixed(1)}%</td></tr>
            <tr><td>Low</td><td>${summary.low}</td><td>${((summary.low / summary.total) * 100).toFixed(1)}%</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>${summary.total}</strong></td><td><strong>100%</strong></td></tr>
          </table>
        </div>
      `;
    }

    if (options.includeDetails) {
      content += `
        <div class="details">
          <h2>Vulnerability Details</h2>
          ${vulns.map(vuln => `
            <div class="vulnerability ${vuln.severity.toLowerCase()}">
              <h3>${vuln.title}</h3>
              <p><strong>Severity:</strong> ${vuln.severity} (CVSS: ${vuln.cvss})</p>
              <p><strong>Host:</strong> ${vuln.host}:${vuln.port}</p>
              <p><strong>Description:</strong> ${vuln.description}</p>
              <p><strong>Solution:</strong> ${vuln.solution}</p>
              ${vuln.cve ? `<p><strong>CVE:</strong> ${vuln.cve}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    if (options.includeRecommendations) {
      content += `
        <div class="recommendations">
          <h2>Recommendations</h2>
          <ol>
            <li>Prioritize fixing critical and high-severity vulnerabilities immediately</li>
            <li>Implement a regular vulnerability scanning schedule</li>
            <li>Establish a patch management process</li>
            <li>Review and update security policies</li>
            <li>Conduct security awareness training for staff</li>
          </ol>
        </div>
      `;
    }

    return content;
  };

  const calculateSummary = (vulns: Vulnerability[]) => {
    return vulns.reduce((acc, vuln) => {
      acc[vuln.severity.toLowerCase() as keyof typeof acc]++;
      acc.total++;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0, informational: 0, total: 0 });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export Vulnerability Report
        </CardTitle>
        <CardDescription>
          Generate comprehensive vulnerability reports in multiple formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF Report
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <Table className="h-4 w-4 mr-2" />
                      CSV Data
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      JSON Export
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-300">Severity Filter</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical Only</SelectItem>
                  <SelectItem value="High">High Only</SelectItem>
                  <SelectItem value="Medium">Medium Only</SelectItem>
                  <SelectItem value="Low">Low Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {exportFormat === 'pdf' && (
            <div className="space-y-4">
              <Label className="text-slate-300">Report Sections</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="summary" 
                    checked={includeSummary}
                    onCheckedChange={(checked) => setIncludeSummary(checked as boolean)}
                  />
                  <Label htmlFor="summary" className="text-slate-400">Executive Summary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="charts" 
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                  />
                  <Label htmlFor="charts" className="text-slate-400">Charts & Graphs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="details" 
                    checked={includeDetails}
                    onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
                  />
                  <Label htmlFor="details" className="text-slate-400">Detailed Findings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="recommendations" 
                    checked={includeRecommendations}
                    onCheckedChange={(checked) => setIncludeRecommendations(checked as boolean)}
                  />
                  <Label htmlFor="recommendations" className="text-slate-400">Recommendations</Label>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-slate-600" />

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {vulnerabilities.length} vulnerabilities ready for export
            {severityFilter !== 'all' && ` (${severityFilter} severity)`}
          </div>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isExporting ? (
              <>Processing...</>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg">
          <p className="font-medium mb-2">Export Information:</p>
          <ul className="space-y-1">
            <li>• PDF reports include executive summary, vulnerability details, and recommendations</li>
            <li>• CSV exports contain all vulnerability data in spreadsheet format</li>
            <li>• JSON exports include raw data suitable for integration with other tools</li>
            <li>• All exports include scan metadata and timestamps</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
