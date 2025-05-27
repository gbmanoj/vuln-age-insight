
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload = ({ onFileUpload, isLoading }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.nessus')) {
        onFileUpload(file);
        toast({
          title: "File uploaded successfully",
          description: `Processing ${file.name}...`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .nessus file",
          variant: "destructive",
        });
      }
    }
  }, [onFileUpload, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.nessus')) {
        onFileUpload(file);
        toast({
          title: "File uploaded successfully",
          description: `Processing ${file.name}...`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .nessus file",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-400 bg-blue-950/20'
            : 'border-slate-600 hover:border-slate-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="animate-spin">
              <File className="h-12 w-12 text-blue-400" />
            </div>
          ) : (
            <Upload className="h-12 w-12 text-slate-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {isLoading ? 'Processing Nessus File...' : 'Upload Nessus Scan Results'}
            </h3>
            <p className="text-slate-400 mb-4">
              Drag and drop your .nessus file here, or click to browse
            </p>
          </div>

          {!isLoading && (
            <div className="space-y-2">
              <Button
                variant="outline"
                className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                Choose File
              </Button>
              <input
                id="file-input"
                type="file"
                accept=".nessus"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Parsing vulnerability data...</span>
            <span className="text-blue-400">Processing</span>
          </div>
          <Progress value={65} className="h-2" />
        </div>
      )}

      <div className="text-xs text-slate-500 space-y-1">
        <p>• Supported format: Nessus (.nessus) files</p>
        <p>• File will be parsed automatically to extract vulnerability data</p>
        <p>• Large files may take several minutes to process</p>
      </div>
    </div>
  );
};
