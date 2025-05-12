import { ReactNode, useState } from "react";
import { Check, Copy, Facebook, Share2, Twitter, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";

interface ShareDialogProps {
  paymentLink: string;
  children?: ReactNode;
  open?: boolean;
  onClose?: () => void;
}

export function PaymentLinkDialog({
  children,
  open = false,
  onClose = () => {},
  ...props
}: ShareDialogProps) {
  props.paymentLink = `${import.meta.env.VITE_BASE_URL}/pay/${
    props.paymentLink
  }`;

  const [copied, setCopied] = useState(false);
  const [isOpen, onOpenChange] = useState(open);

  const handleCopy = async () => {
    copyToClipboard(props.paymentLink, "Payment Link");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=Pay me via this link: ${encodeURIComponent(
          props.paymentLink
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `Pay me via this link: ${props.paymentLink}`
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          props.paymentLink
        )}`;
        break;
      default:
        // For "others", we'll use the Web Share API if available
        if (navigator.share) {
          navigator
            .share({
              title: "Share payment link",
              text: "Pay me via this link",
              url: props.paymentLink,
            })
            .catch((err) => console.error("Error sharing:", err));
          return;
        }
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        if (!e) {
          onClose();
        }
        onOpenChange(e);
      }}
    >
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md rounded-2xl p-0 pb-5 overflow-hidden">
        <DialogHeader className="flex flex-row items-center bg-slate-900 justify-between p-6">
          <DialogTitle className="text-left">
            Share with friend to pay
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="bg-orange-400 rounded-full p-4">
            <Users size={25} />
          </div>

          <h2 className="text-2xl font-semibold">Share with a friend</h2>

          <div className="flex w-full max-w-sm items-center space-x-2 bg-muted/50 rounded-3xl p-2">
            <span className="text-sm truncate flex-1 text-primary">
              {props.paymentLink}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1 rounded-3xl"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>

          <div className="w-full">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Share Via:
            </p>
            <div className="flex justify-center space-x-8">
              <button
                onClick={() => handleShare("twitter")}
                className="flex flex-col items-center gap-2"
              >
                <div className="rounded-full bg-muted p-3">
                  <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                </div>
                <span className="text-xs">Twitter</span>
              </button>

              <button
                onClick={() => handleShare("whatsapp")}
                className="flex flex-col items-center gap-2"
              >
                <div className="rounded-full bg-muted p-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#25D366]"
                  >
                    <path
                      d="M17.6 6.32C16.12 4.82 14.12 4 12 4C7.72 4 4.23 7.5 4.23 11.78C4.23 13.38 4.67 14.94 5.48 16.29L4.13 20L7.96 18.68C9.29 19.42 10.68 19.81 12.09 19.81C16.37 19.81 19.86 16.31 19.86 12.03C19.86 9.9 19.04 7.9 17.6 6.32ZM12 18.44C10.8 18.44 9.61 18.07 8.59 17.39L8.28 17.21L5.99 17.99L6.79 15.78L6.59 15.45C5.84 14.39 5.44 13.11 5.44 11.79C5.44 8.25 8.33 5.36 12 5.36C13.79 5.36 15.47 6.04 16.71 7.29C17.95 8.54 18.63 10.22 18.63 12.02C18.63 15.56 15.74 18.44 12 18.44ZM15.38 13.54C15.16 13.43 14.22 12.97 14.03 12.89C13.83 12.82 13.69 12.78 13.54 13C13.39 13.22 13.04 13.64 12.91 13.79C12.79 13.93 12.67 13.95 12.45 13.84C11.32 13.28 10.58 12.83 9.83 11.54C9.63 11.21 10.14 11.24 10.61 10.31C10.69 10.16 10.65 10.03 10.59 9.92C10.53 9.81 10.03 8.86 9.85 8.42C9.67 8 9.5 8.06 9.37 8.05C9.25 8.04 9.11 8.04 8.96 8.04C8.81 8.04 8.58 8.1 8.38 8.31C8.18 8.53 7.69 8.99 7.69 9.94C7.69 10.89 8.38 11.81 8.47 11.95C8.57 12.09 10.02 14.31 12.22 15.14C13.5 15.64 14.03 15.69 14.7 15.59C15.1 15.53 15.87 15.12 16.05 14.61C16.23 14.1 16.23 13.66 16.17 13.57C16.11 13.47 15.97 13.42 15.75 13.32L15.38 13.54Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-xs">Whatsapp</span>
              </button>

              <button
                onClick={() => handleShare("facebook")}
                className="flex flex-col items-center gap-2"
              >
                <div className="rounded-full bg-muted p-3">
                  <Facebook className="h-5 w-5 text-[#1877F2]" />
                </div>
                <span className="text-xs">Facebook</span>
              </button>

              <button
                onClick={() => handleShare("others")}
                className="flex flex-col items-center gap-2"
              >
                <div className="rounded-full bg-muted p-3">
                  <Share2 size={20} />
                </div>
                <span className="text-xs">Others</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
