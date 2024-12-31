import { useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DigitalProductUploadProps {
  onFileUpload: (file: File | null) => void;
  uploadedFile: File | null;
}

export function DigitalProductUpload({
  onFileUpload,
  uploadedFile,
}: DigitalProductUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl">Digital Product Upload</CardTitle>
        <CardDescription>
          Upload your digital product file here. Supported formats include PDF,
          ZIP, and multimedia files.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 ease-in-out ${
            dragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Input
            type="file"
            id="digitalProductUpload"
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.zip,.mp3,.mp4,.avi,.mov"
          />
          <Label htmlFor="digitalProductUpload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Drag and drop your file here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to select a file
              </p>
              <Button variant="outline">Choose File</Button>
            </div>
          </Label>
        </div>
        {uploadedFile && (
          <div className="flex items-center justify-between bg-muted p-3 rounded-md">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFileUpload(null)}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Max file size: 100MB. For larger files, please contact support.
        </p>
      </CardContent>
    </Card>
  );
}
