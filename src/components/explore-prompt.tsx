import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useStoreBuildState } from "@/store";
import { Sparkles } from "lucide-react";
import { SetStateAction, useState } from "react";

const prompts = [
  "Add a product",
  "Edit my Store-front",
  "Delete a product",
  "Go to a page",
  "How to withdraw",
  "Send an email",
  "Show my best customer",
  "Create an order",
];

export function ExplorePrompts({
  setPrompt,
}: {
  setPrompt: React.Dispatch<SetStateAction<string>>;
}) {
  const { currentStore: store } = useStoreBuildState();
  const [isHovering, setIsHovering] = useState(0);
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-2 p-1">
        {prompts.map((prompt, index) => (
          <Button
            onMouseLeave={() => setIsHovering(0)}
            onMouseEnter={() => setIsHovering(index + 1)}
            key={index}
            variant="outline"
            size="sm"
            className="flex items-center rounded-none"
            onClick={() => setPrompt(prompt)}
            style={{
              borderColor: store?.customizations?.theme?.primary,
              background:
                isHovering === index + 1
                  ? store?.customizations?.theme?.primary
                  : undefined,
            }}
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
