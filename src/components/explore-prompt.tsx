import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";
import { SetStateAction } from "react";

const prompts = [
  "Add a product",
  "Edit my Store-front",
  "Delete a product",
  "Go to a page",
  "How to withdraw",
  "send an email",
  "show my best customer",
  "Create an order",
];

export function ExplorePrompts({
  setPrompt,
}: {
  setPrompt: React.Dispatch<SetStateAction<string>>;
}) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setPrompt(prompt)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {prompt}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
}
