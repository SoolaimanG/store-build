import { FC, ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export const NewsLetterButton: FC<{
  children: ReactNode;
  showModal?: boolean;
  email?: string;
}> = ({ children, showModal = false, email: initialEmail = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(initialEmail);

  const onSubmit = () => {
    if (showModal) return setIsOpen(true);
    handleSubscribe();
  };

  const handleSubscribe = () => {
    toast({
      title: "Welcome aboard!",
      description:
        "You've successfully joined our newsletter. Get ready for awesome updates!",
      duration: 5000,
    });
    setIsOpen(false);
    setEmail("");
  };

  return (
    <>
      <div onClick={onSubmit} className="inline-block">
        {children}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] border-0 text-white rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Join Our Newsletter
            </DialogTitle>
            <DialogDescription className="text-purple-100 text-center">
              Get exclusive updates, tips, and special offers delivered straight
              to your inbox!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-200"
                placeholder="your@email.com"
              />
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200"
                size={18}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSubscribe}
              variant="ringHover"
              className="w-full transition-colors duration-200"
            >
              Subscribe Now
            </Button>
          </DialogFooter>
          <p className="text-xs text-center text-purple-200 mt-4">
            By subscribing, you agree to our Privacy Policy and Terms of
            Service.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
