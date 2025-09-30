import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { Input } from "@/components/input";
import SpanTree from "./span-tree";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/separator";

export default function SearchableSpanTree() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="relative p-4">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search in trace"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Separator />
      <ScrollArea className="overflow-hidden flex-1">
        <SpanTree />
      </ScrollArea>
    </div>
  );
}
