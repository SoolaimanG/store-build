"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Eye, EyeOff, KeyRound, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from "@uidotdev/usehooks";
import { toast } from "@/hooks/use-toast";
import { errorMessageAndStatus } from "@/lib/utils";

type ApiKeyType = "accessKey" | "accessKeyAndToken";

interface ApiKeyFormData {
  name: string;
  type: ApiKeyType;
  accessKey: string;
  token?: string;
  description?: string;
}

interface AddApiKeysProps {
  open?: boolean;
  onSubmit: (data: ApiKeyFormData) => Promise<void>;
  children?: ReactNode;
}

export function AddApiKeys({
  open = false,
  children,
  onSubmit,
}: AddApiKeysProps) {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: "",
    type: "accessKey",
    accessKey: "",
    token: "",
    description: "",
  });
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isOpen, setIsOpen] = useState(open);

  const handleChange = (field: keyof ApiKeyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsOpen(false);

      setFormData({
        name: "",
        type: "accessKey",
        accessKey: "",
        token: "",
        description: "",
      });

      toast({
        title: "SUCCESS",
        description: "API Key Added Successfully",
      });
    } catch (error) {
      toast({
        title: "ERROR",
        description: errorMessageAndStatus(error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (!formData.name || !formData.accessKey) return false;
    if (formData.type === "accessKeyAndToken" && !formData.token) return false;
    return true;
  };

  const content = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          You are about to add API keys that will be used for authentication.
          These keys grant access to your account and services. Keep them secure
          and never share them publicly.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="key-name">API Key Name</Label>
          <Input
            id="key-name"
            placeholder="e.g., Production API Key"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="key-type">Key Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: ApiKeyType) => handleChange("type", value)}
          >
            <SelectTrigger id="key-type">
              <SelectValue placeholder="Select key type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accessKey">Access Key Only</SelectItem>
              <SelectItem value="accessKeyAndToken">
                Access Key & Token
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-green-600" />
            <Label htmlFor="access-key">Access Key</Label>
          </div>
          <div className="relative">
            <Input
              id="access-key"
              type={showAccessKey ? "text" : "password"}
              placeholder="Enter your access key"
              value={formData.accessKey}
              onChange={(e) => handleChange("accessKey", e.target.value)}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowAccessKey(!showAccessKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showAccessKey ? "Hide access key" : "Show access key"}
            >
              {showAccessKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {formData.type === "accessKeyAndToken" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <Label htmlFor="token">Token</Label>
            </div>
            <div className="relative">
              <Input
                id="token"
                type={showToken ? "text" : "password"}
                placeholder="Enter your token"
                value={formData.token}
                onChange={(e) => handleChange("token", e.target.value)}
                className="pr-10"
                required={formData.type === "accessKeyAndToken"}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            placeholder="What is this API key used for?"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </div>

      <div className={isMobile ? "" : "flex justify-end gap-3"}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          className={isMobile ? "w-full mb-2" : ""}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className={isMobile ? "w-full" : ""}
        >
          {isSubmitting ? "Adding..." : "Add API Key"}
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle>Add API Keys</DrawerTitle>
            <DrawerDescription>
              Add authentication keys for your services
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">{content}</div>
          <DrawerFooter className="pt-2"></DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add API Keys</DialogTitle>
          <DialogDescription>
            Add authentication keys for your services
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
