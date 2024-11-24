import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const people = [
  { name: "Olivia Martin", handle: "@olivia", avatar: "/avatars/01.png" },
  { name: "Jackson Lee", handle: "@jackson", avatar: "/avatars/02.png" },
  { name: "Isabella Nguyen", handle: "@isabella", avatar: "/avatars/03.png" },
];

interface MentionComboboxProps {
  onSelect: (mention: { handle: string; name: string }) => void;
}

export function MentionCombobox({ onSelect }: MentionComboboxProps) {
  return (
    <Command className="absolute bottom-full left-0 w-full mb-1 rounded-lg border shadow-md">
      <CommandInput placeholder="Search people..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {people.map((person) => (
            <CommandItem
              key={person.handle}
              onSelect={() =>
                onSelect({ handle: person.handle, name: person.name })
              }
              className="flex items-center space-x-2 py-2 cursor-pointer"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{person.name}</p>
                <p className="text-xs text-muted-foreground">{person.handle}</p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
