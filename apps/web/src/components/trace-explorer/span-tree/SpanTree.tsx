import { createContext, useContext } from "react";

import { InstrumentationScope, MissingSpan, Span } from "@/lib/types";
import { TraceExplorerContext } from "../context";
import { SpanItem, TraceItem } from "./TreeItems";

export const LevelContext = createContext(0);
export const ScopeContext = createContext<InstrumentationScope | null>(null);

export function SpanTree() {
  const { trace } = useContext(TraceExplorerContext)!;

  const rootSpan = buildRootSpan(trace.spans);
  const rootScope = rootSpan.type == "missing" ? null : rootSpan.scope;

  return (
    <ul className="p-2" role="tree">
      <TraceItem trace={trace} />
      <ScopeContext value={rootScope}>
        <LevelContext value={0}>
          <SpanItem span={rootSpan} />
        </LevelContext>
      </ScopeContext>
    </ul>
  );
}

export function buildRootSpan(spans: Span[]): Span | MissingSpan {
  const spansById = new Map<string, Span | MissingSpan>();
  let rootSpanId: string | undefined;

  spans.forEach((span) => {
    const spanId = span.span_id;
    // Re-attach any children accumulated while parent was "missing"
    const maybeMissingSelf = spansById.get(spanId);
    span.childSpans = maybeMissingSelf?.childSpans ?? [];
    spansById.set(spanId, span);

    if (!span.parent_span_id) {
      rootSpanId = spanId; // yay, we found the root span
      return;
    }

    const parent = spansById.get(span.parent_span_id) || {
      span_id: span.parent_span_id,
      childSpans: [],
      type: "missing",
    };
    parent.childSpans.push(span);
    spansById.set(span.parent_span_id, parent);
  });

  if (!rootSpanId) {
    // Find the single missing root, if any
    const missingRoots = Array.from(spansById.values()).filter(
      (span) => span.type == "missing",
    );
    if (missingRoots.length != 1) {
      throw new Error(
        `Unable to construct span tree: expected exactly one missing root span, but found ${missingRoots.length}`,
      );
    }

    rootSpanId = missingRoots[0].span_id;
  }

  return spansById.get(rootSpanId) as Span;
}
