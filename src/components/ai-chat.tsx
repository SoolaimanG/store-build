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
import { Send, X } from "lucide-react";
import { MentionCombobox } from "./mention-combobox";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ExplorePrompts } from "./explore-prompt";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { appConfig } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
}

interface Mention {
  handle: string;
  name: string;
}

export function AIChat({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! How can I assist you today?", sender: "ai" },
  ]);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setShowMentions(e.target.value.endsWith("@"));
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: "user",
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setMentions([]);
      inputRef.current!.style.height = "inherit";

      // Simulate AI response streaming
      setIsStreaming(true);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);

      const response =
        "Thank you for your message. I'm processing your request and will respond shortly.";
      for (let i = 0; i < response.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessage.id
              ? { ...msg, content: response.slice(0, i + 1) }
              : msg
          )
        );
      }
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className="w-full sm:max-w-md p-0 bg-background flex flex-col"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>{appConfig.name} AI</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.sender === "ai"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex flex-col space-y-3">
          {input === "" && <ExplorePrompts setPrompt={setInput} />}
          <div className="flex flex-wrap gap-1 mb-2">
            {mentions.map((mention) => (
              <Badge
                key={mention.handle}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-sm"
              >
                {mention.name}
                <button
                  type="button"
                  onClick={() => removeMention(mention.handle)}
                  className="ml-1 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="relative mt-2 flex items-center gap-2 w-full"
          >
            <Textarea
              ref={inputRef}
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              className="pr-10 min-h-[40px] max-h-[200px] resize-none w-[92%]"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isStreaming}
              className="w-[8%]"
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
