import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IFilter } from "@/types";
import { useState } from "react";
import { motion } from "framer-motion";

const FILTERS = [
  {
    id: "recent",
    value: "recent",
    label: "Recent Customers",
  },
  {
    id: "spend",
    value: "spend",
    label: "VIP Customers",
  },
];

export function CustomerFilters({
  onSearch,
  onSortSelect,
}: {
  onSearch: (term: string) => void;
  onSortSelect: (id: string) => void;
}) {
  const [filters, setFilters] = useState<IFilter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const removeFilter = (id: string) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  const addFilter = (newFilter: IFilter) => {
    onSortSelect(newFilter.id);
    setFilters([...filters, newFilter]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="secondary"
            size="sm"
            className="h-8 rounded-none"
            onClick={() => removeFilter(filter.id)}
          >
            {filter.label}
            <X className="w-4 h-4 ml-2" />
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 rounded-none">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {!!filters.length ? "More" : "Apply"} filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Add filter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {FILTERS.map((filter) => (
              <DropdownMenuCheckboxItem
                key={filter.id}
                checked={filters.some((f) => f.id === filter.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    addFilter(filter);
                  } else {
                    removeFilter(filter.id);
                  }
                }}
              >
                {filter.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-8 w-full sm:w-[250px]"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </div>
    </motion.div>
  );
}
