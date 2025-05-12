import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToastError } from "@/hooks/use-toast-error";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Text } from "./text";
import { Skeleton } from "./ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ZapIcon } from "lucide-react";

interface SendEmailProps {
  isDesktop: boolean;
  customerEmail?: string;
  orderId: string;
  phoneNumber: string;
}

export function SendEmailButton({
  isDesktop,
  customerEmail = "",
  orderId,
  ...props
}: SendEmailProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ModalComponent = isDesktop ? Dialog : Drawer;
  const TriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;
  const ContentComponent = isDesktop ? DialogContent : DrawerContent;
  const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <ModalComponent open={isOpen} onOpenChange={setIsOpen}>
      <TriggerComponent asChild>
        <Button variant="link" className="mt-2 h-auto p-0 text-primary">
          Send an email
        </Button>
      </TriggerComponent>
      <ContentComponent className="max-w-xl">
        <HeaderComponent>
          <TitleComponent>Send Email to Customer</TitleComponent>
        </HeaderComponent>
        <SendEmailForm
          orderId={orderId}
          customerEmail={customerEmail}
          onClose={() => setIsOpen(false)}
          isOpen={isOpen}
          phoneNumber={props.phoneNumber}
        />
      </ContentComponent>
    </ModalComponent>
  );
}

function SendEmailForm({
  orderId,
  customerEmail,
  onClose,
  isOpen,
  phoneNumber,
}: {
  orderId: string;
  customerEmail: string;
  onClose: () => void;
  isOpen: boolean;
  phoneNumber: string;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useState(false);

  const { isLoading, data, error } = useQuery({
    queryKey: ["quick-emails"],
    queryFn: () => storeBuilder.getQuickEmails(),
    enabled: isOpen,
  });

  const { data: quickEmails = [] } = data || {};

  useToastError(error);

  const sendQuickEmail = async (id: string) => {
    try {
      startTransition(true);
      const res = await storeBuilder.sendQuickEmail(id, orderId, phoneNumber);

      onClose();

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: Implement email sending logic
    console.log("Sending email:", { to: customerEmail, subject, message });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-0 overflow-hidden">
      <div className="space-y-4 overflow-hidden p-2">
        {isLoading ? (
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <Skeleton key={idx} className="w-full h-[2.3rem]" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <Text className="text-lg font-semibold text-white">
              Quick Emails
            </Text>
            <div className="flex gap-3 overflow-auto">
              {quickEmails.map((email) => (
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() => sendQuickEmail(email.id)}
                  key={email.id}
                  size="sm"
                  variant="outline"
                  className="rounded-none gap-2"
                >
                  <ZapIcon size={17} />
                  {email.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="to" className="text-left">
            To
          </label>
          <Input
            id="to"
            value={customerEmail}
            disabled
            className="col-span-3 h-[3rem]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className="text-left">
            Subject
          </label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="col-span-3 h-[3rem]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-left">
            Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="col-span-3 "
            rows={5}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="ringHover" type="submit">
          Send Email
        </Button>
      </div>
    </form>
  );
}
