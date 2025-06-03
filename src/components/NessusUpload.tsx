
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, CheckCircle, AlertCircle, FileText, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NessusParser, NessusScanResult } from '@/utils/nessusParser';

interface NessusUploadProps {
  onScanComplete: (scanResult: NessusScanResult) => void;
}

export const NessusUpload = ({ onScanComplete }: NessusUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseStats, setParseStats] = useState<{
    totalHosts: number;
    totalVulns: number;
    processingStep: string;
  } | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processNessusFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    setParseStats({ totalHosts: 0, totalVulns: 0, processingStep: 'Reading file...' });

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 20, step: 'Parsing XML structure...' },
        { progress: 40, step: 'Extracting host information...' },
        { progress: 60, step: 'Processing vulnerabilities...' },
        { progress: 80, step: 'Analyzing risk scores...' },
        { progress: 100, step: 'Finalizing results...' }
      ];

      for (const { progress, step } of progressSteps) {
        setUploadProgress(progress);
        setParseStats(prev => prev ? { ...prev, processingStep: step } : null);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const scanResult = await NessusParser.parseNessusFile(file);
      
      setParseStats({
        totalHosts: scanResult.hosts.length,
        totalVulns: scanResult.vulnerabilitySummary.total,
        processingStep: 'Complete!'
      });

      toast({
        title: "Nessus scan processed successfully",
        description: `Found ${scanResult.hosts.length} hosts with ${scanResult.vulnerabilitySummary.total} vulnerabilities`,
      });

      onScanComplete(scanResult);
      
    } catch (error) {
      console.error('Nessus parsing error:', error);
      toast({
        title: "Failed to process Nessus file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setUploadProgress(0);
        setParseStats(null);
      }, 2000);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.nessus') || file.type === 'text/xml') {
        processNessusFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .nessus XML file",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.nessus') || file.type === 'text/xml') {
        processNessusFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .nessus XML file",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Nessus Scan Upload
        </CardTitle>
        <CardDescription>
          Upload and automatically parse Nessus .nessus XML files for comprehensive vulnerability analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-400 bg-blue-950/30 scale-105'
              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-6">
            {isProcessing ? (
              <div className="animate-pulse">
                <FileText className="h-16 w-16 text-blue-400" />
              </div>
            ) : uploadProgress === 100 ? (
              <CheckCircle className="h-16 w-16 text-green-400" />
            ) : (
              <Upload className="h-16 w-16 text-slate-400" />
            )}
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                {isProcessing ? 'Processing Nessus Scan...' : 'Upload Nessus Scan Results'}
              </h3>
              <p className="text-slate-400 max-w-md">
                {isProcessing 
                  ? 'Parsing vulnerability data and generating security insights...'
                  : 'Drag and drop your .nessus XML file here, or click to browse'
                }
              </p>
            </div>

            {!isProcessing && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                  onClick={() => document.getElementById('nessus-file-input')?.click()}
                >
                  <File className="h-4 w-4 mr-2" />
                  Choose Nessus File
                </Button>
                <input
                  id="nessus-file-input"
                  type="file"
                  accept=".nessus,.xml"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                {parseStats?.processingStep || 'Processing...'}
              </span>
              <span className="text-blue-400">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-3" />
            
            {parseStats && parseStats.totalHosts > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{parseStats.totalHosts}</div>
                  <div className="text-xs text-slate-400">Hosts Discovered</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">{parseStats.totalVulns}</div>
                  <div className="text-xs text-slate-400">Vulnerabilities Found</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-slate-500 space-y-2 bg-slate-900/50 p-4 rounded-lg">
          <h4 className="font-medium text-slate-400">Supported Features:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Automatic XML parsing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Host-wise vulnerability mapping</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>CVSS score extraction</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Compliance framework mapping</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Risk assessment analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>Export to multiple formats</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
