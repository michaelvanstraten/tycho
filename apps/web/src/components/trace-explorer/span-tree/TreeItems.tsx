import { ReactNode, useContext, useMemo, useState } from "react";
import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";

import { Button } from "@/components/button";
import { MissingSpan, Span, Trace } from "@/lib/types";
import {
  SelectableSpanEvent,
  useSelectedItem,
} from "../hooks/use-selected-item";
import { LevelContext, ScopeContext } from "./SpanTree";

type Item = Span | MissingSpan | SelectableSpanEvent;

export function TraceItem(props: { trace: Trace }) {
  return (
    <div className="flex items-center gap-2 text-sm mb-2">
      <div className="w-2 h-2 rounded-full bg-blue-500" />
      <span className="text-foreground">Trace - {props.trace.id}</span>
    </div>
  );
}

export function SpanItem({ span }: { span: Span | MissingSpan }) {
  const level = useContext(LevelContext);

  const events: SelectableSpanEvent[] = useMemo(() => {
    if (span.type === "missing") return [];
    const list = span.events ?? [];
    return list.map((event, i) => ({
      ...event,
      type: "event",
      containingSpan: span,
      indexInSpan: i,
    }));
  }, [span]);

  const childSpans = span.childSpans ?? [];

  const items = useMemo(
    () => sortItems([...childSpans, ...events]),
    [childSpans, events],
  );

  const [isExpanded, setIsExpanded] = useState(true);

  const renderItem = (item: Item) => {
    switch (item.type) {
      case "span":
      case "missing":
        return <SpanItem span={item} />;
      case "event":
        return <EventItem event={item} />;
    }
  };

  const hasChildren = items.length > 0;

  const prevScope = useContext(ScopeContext);
  const nextScope = span.type == "missing" ? null : span.scope;

  return (
    <>
      {prevScope != nextScope && nextScope != null && (
        <div
          className={`flex items-center gap-2 py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm border-l-4`}
        >
          <div className="w-4 h-4 shrink-0" />
          Instrumentation Scope {nextScope.name}
        </div>
      )}
      <ScopeContext value={nextScope}>
        <Collapsible.Root open={isExpanded} onOpenChange={setIsExpanded}>
          <SelectableItem item={span} key={span.span_id}>
            {hasChildren ? (
              <Collapsible.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-4 h-4 p-0 shrink-0"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </Button>
              </Collapsible.Trigger>
            ) : (
              <div className="w-4 h-4 shrink-0" />
            )}
            <span className="truncate">
              {span.type === "missing" ? "(missing span)" : span.name}
            </span>
          </SelectableItem>

          {hasChildren && (
            <Collapsible.Content asChild>
              <ul role="group">
                <LevelContext.Provider value={level + 1}>
                  {/* The items are sorted and thus the index stable */}
                  {items.map((item, i) => (
                    <li key={i}>{renderItem(item)}</li>
                  ))}
                </LevelContext.Provider>
              </ul>
            </Collapsible.Content>
          )}
        </Collapsible.Root>
      </ScopeContext>
    </>
  );
}

function EventItem({ event }: { event: SelectableSpanEvent }) {
  return (
    <SelectableItem item={event} role="treeitem" aria-selected={false}>
      <div className="w-4 h-4 shrink-0" />
      <span className="truncate">{event.name}</span>
    </SelectableItem>
  );
}

function SelectableItem(
  props: { children: ReactNode; item: Item } & React.ComponentProps<"div">,
) {
  const level = useContext(LevelContext);
  const { selectedItem, selectItem } = useSelectedItem();

  const { children, item, ...rest } = props;

  const isSelected = useMemo(() => {
    if (!selectedItem) return false;
    if (item.type !== selectedItem.type) return false;

    switch (item.type) {
      case "missing":
      case "span":
        return (selectedItem as Span | MissingSpan).span_id === item.span_id;
      case "event":
        return (
          (selectedItem as SelectableSpanEvent).containingSpan.span_id ===
            item.containingSpan.span_id &&
          (selectedItem as SelectableSpanEvent).indexInSpan === item.indexInSpan
        );
    }
  }, [item, selectedItem]);

  return (
    <div
      className={`flex items-center gap-2 py-1 px-2 hover:bg-muted/50 cursor-pointer text-sm border-l-4 ${
        isSelected ? "bg-muted" : ""
      }`}
      style={{ paddingLeft: `${level * 16 + 8}px` }}
      onClick={() => selectItem(item)}
      {...rest}
    >
      {children}
    </div>
  );
}

function sortItems(items: Item[]): Item[] {
  const timeOf = (item: Item) => {
    if (item.type === "event") return item.time_unix_nano;
    return item.type === "span" ? item.start_time_unix_nano : 0;
  };

  return [...items].sort((a, b) => timeOf(a) - timeOf(b));
}
