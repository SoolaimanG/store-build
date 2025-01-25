import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ImageIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Img } from "react-image";

interface ImageUploaderProps {
  onUpload: (files: File[], url?: string[]) => void;
  children?: React.ReactNode;
  max?: number;
}

export function ImageUploader({
  onUpload,
  children,
  max = 1,
}: ImageUploaderProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, max);
      setFiles(newFiles);
      setPreviews(newFiles.map((file) => URL.createObjectURL(file)));
    },
    [files, max]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: max > 1,
  });

  const handleUpload = () => {
    if (files.length > 0) {
      // Simulating upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          onUpload(files, urls);
          setOpen(false);
          // Reset state after upload
          setTimeout(() => {
            setFiles([]);
            setPreviews([]);
            setUrls([]);
            setProgress(0);
          }, 500);
        }
      }, 200);
    } else if (urls.length > 0) {
      onUpload([], urls);
      setOpen(false);
      setUrls([]);
    }
  };

  const handleUrlAdd = () => {
    if (urls.length < max) {
      setUrls([...urls, ""]);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Upload Images</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Images (Max: {max})</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center py-5 text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-4" />
                <p className="mb-2 text-sm font-semibold">
                  {isDragActive
                    ? "Drop the images here"
                    : "Drag & drop images here"}
                </p>
                <p className="text-xs">or click to select</p>
              </div>
            </div>
            <ScrollArea className="mt-4">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative mb-2 w-[5.5rem] h-[5.5rem]"
                >
                  <Img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-0 -mr-2 right-0 h-5 p-1 rounded-md"
                    onClick={() => removeFile(index)}
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="url">
            <div className="space-y-4 mt-4">
              {urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => removeUrl(index)}
                  >
                    <X size={20} />
                  </Button>
                </div>
              ))}
              {urls.length < max && (
                <Button onClick={handleUrlAdd} className="w-full">
                  Add URL
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
        {progress > 0 && progress < 100 && <Progress value={progress} />}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 && urls.length === 0}
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
