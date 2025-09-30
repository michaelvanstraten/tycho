import { useCallback, useContext, useMemo } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { MissingSpan, Span, SpanEvent, Trace } from "@/lib/types";
import { TraceExplorerContext } from "../context";

export interface SelectableSpanEvent extends SpanEvent {
  containingSpan: Span;
  indexInSpan: number;
}

export type SelectableItem = Span | MissingSpan | SelectableSpanEvent;

export function useSelectedItem() {
  const { trace } = useContext(TraceExplorerContext);

  const [params, setQueryParams] = useQueryStates({
    span: parseAsString,
    event: parseAsInteger,
  });

  const selectedItem: SelectableItem = useMemo(() => {
    if (!params?.span) return null;

    const span = trace.spans.find((s) => s.span_id === params.span);
    if (!span) return null;

    if (params.event == null) return span;
    if (span.type == "missing") return null;
    const idx = params.event - 1;
    return { ...span.events.at(idx), containingSpan: span, indexInSpan: idx };
  }, [trace, params]);

  const selectItem = useCallback(
    (item: SelectableItem) => {
      switch (item.type) {
        case "missing":
        case "span":
          setQueryParams({ span: item.span_id, event: null });
          break;
        case "event":
          setQueryParams({
            span: item.containingSpan.span_id,
            event: item.indexInSpan + 1,
          });
          break;
      }
    },
    [setQueryParams],
  );

  return { selectedItem, selectItem };
}
