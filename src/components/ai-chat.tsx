import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hand, MessageSquareOffIcon, Send, X } from "lucide-react";
import { MentionCombobox } from "./mention-combobox";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ExplorePrompts } from "./explore-prompt";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { appConfig, errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { apiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import { useStoreBuildState } from "@/store";
import { EmptyProductState } from "./empty";
import { Skeleton } from "./ui/skeleton";
import { Text } from "./text";
import { marked } from "marked";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
}

interface Mention {
  handle: string;
  name: string;
}

const MessageSkeleton = () => (
  <div className="space-y-3 w-full">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export function AIChat({
  children,
  type = "storeHelper",
  userId,
  aiName = `${appConfig.name} AI`,
  message = "",
  open = false,
}: {
  children: ReactNode;
  type: "customerHelper" | "storeHelper";
  userId?: string;
  aiName?: string;
  message?: string;
  open?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(open);
  const [input, setInput] = useState(message);
  const [showMentions, setShowMentions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentStore: store, user } = useStoreBuildState();
  const location = useLocation();
  const n = useNavigate();

  const { isLoading, data, error } = useQuery({
    queryKey: ["ai-chats", isOpen],
    queryFn: () =>
      storeBuilder.getAiConversation(
        userId,
        store?._id,
        storeBuilder.generateSessionId
      ),
    enabled: Boolean((store?._id || user?.storeId) && isOpen),
  });

  useToastError(error);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (data?.data) {
      const messages: Message[] = data.data.map((message) => ({
        id: message._id,
        content: message.aiResponse || message.userPrompt || "",
        sender: message.aiResponse ? "ai" : "user",
      }));

      setMessages(messages);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setShowMentions(e.target.value.endsWith("@"));
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async (e?: React.FormEvent, prompt?: string) => {
    e?.preventDefault();
    try {
      setIsStreaming(true);
      let r: apiResponse = {
        code: 10000,
        data: "",
        message: "",
        status: "SUCCESS",
      };

      if (type === "customerHelper") {
        r = await storeBuilder.customerHelper(
          prompt || input,
          store?._id!,
          storeBuilder.generateSessionId!
        );
      } else if (type === "storeHelper") {
        r = await storeBuilder.aiStoreAssistant(
          prompt || input,
          storeBuilder.generateSessionId
        );
      }

      if (input.trim() || prompt?.trim()) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: prompt || input,
          sender: "user",
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setMentions([]);
        inputRef.current!.style.height = "inherit";

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "",
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiMessage]);

        const response = r?.data;
        for (let i = 0; i < response.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 10));
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id
                ? { ...msg, content: response.slice(0, i + 1) }
                : msg
            )
          );
        }
      }
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "ERROR",
        description,
        variant: "destructive",
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const addMention = (mention: Mention) => {
    setMentions((prev) => [...prev, mention]);
    setInput((prev) => prev.slice(0, -1));
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const removeMention = (handle: string) => {
    setMentions((prev) => prev.filter((m) => m.handle !== handle));
    inputRef.current?.focus();
  };

  const handleSheetTrigger = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      const q = queryString.parse(location.search) as { timeRange: string };

      const newQuery = queryString.stringify({
        timeRange: q.timeRange || "all",
      });

      n(`${location.pathname}?${newQuery}`);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetTrigger}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className="w-full sm:max-w-lg p-0 bg-background flex flex-col h-[600px] md:h-full"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>{aiName}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4 h-[400px]">
          <div className="flex flex-col space-y-4">
            {isLoading ? (
              <MessageSkeleton />
            ) : !messages.length ? (
              <EmptyProductState
                icon={MessageSquareOffIcon}
                header="No Chat Yet!"
                message={`You do not have any conversation with ${aiName}, click the button below to start a conversation`}
              >
                <Button
                  style={{ background: store?.customizations?.theme?.primary }}
                  className="rounded-none gap-2"
                  onClick={() => handleSubmit(undefined, "Hello AI")}
                >
                  Say Hello
                  <Hand className="-rotate-12" size={17} />
                </Button>
              </EmptyProductState>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-none ${
                    message.sender === "ai"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  }`}
                  style={{
                    background:
                      message.sender !== "ai"
                        ? store?.customizations?.theme?.secondary
                        : undefined,
                  }}
                >
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: marked(message.content, { breaks: true }),
                    }}
                    className="text-sm"
                  />
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex flex-col space-y-1">
          {input === "" && type === "storeHelper" && (
            <ExplorePrompts setPrompt={setInput} />
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            {mentions.map((mention) => (
              <Badge
                key={mention.handle}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-sm"
              >
                {mention.name}
                <div
                  onClick={() => removeMention(mention.handle)}
                  className="ml-1 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </div>
              </Badge>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="relative mt-2 flex items-end gap-1 w-full"
          >
            <Textarea
              ref={inputRef}
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
                  e.preventDefault();
                  handleSubmit(undefined, input);
                } else if (e.key === "Enter" && e.shiftKey && e.ctrlKey) {
                  const textarea = e.target as HTMLTextAreaElement;
                  const cursorPosition = textarea?.selectionStart;
                  const textBeforeCursor = input.slice(0, cursorPosition);
                  const textAfterCursor = input.slice(cursorPosition);
                  setInput(`${textBeforeCursor}\n${textAfterCursor}`);
                  setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd =
                      cursorPosition + 1;
                  });
                  e.preventDefault();
                }
              }}
              className="pr-10 min-h-[40px] max-h-[200px] resize-none w-[89%] md:w-[91%] rounded-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isStreaming}
              className="md:w-[9%] w-[11%] rounded-none"
              variant="shine"
              style={{ background: store?.customizations?.theme?.primary }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {showMentions && <MentionCombobox onSelect={addMention} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
