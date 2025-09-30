import { Span, Resource, InstrumentationScope, Trace } from "@/lib/types";

export function transformGleanMetric(
  gleanMetric: any,
  version: string = "0.1",
): Trace[] {
  if (version !== "0.1") {
    console.warn(
      `Unsupported metric version: ${version}. Attempting to parse as v0.1`,
    );
    return [];
  }

  const spansByTraceId = new Map<string, Span[]>();

  for (const resourceSpan of gleanMetric.resource_spans) {
    const resource: Resource = {
      attributes: resourceSpan.resource.attributes,
    };

    for (const scopeSpan of resourceSpan.scope_spans) {
      const scope: InstrumentationScope = {
        name: scopeSpan.scope.name,
      };

      for (const s of scopeSpan.spans) {
        const span: Span = {
          trace_id: s.trace_id,
          span_id: s.span_id,
          parent_span_id: s.parent_span_id,
          name: s.name,
          start_time_unix_nano: s.start_time_unix_nano,
          end_time_unix_nano: s.end_time_unix_nano,
          attributes: s.attributes,
          status: s.status,
          events: s.events?.map((event: any) => ({
            name: event.name,
            time_unix_nano: event.time_unix_nano,
            attributes: event.attributes,
            type: "event" as const,
          })),
          childSpans: [],
          resource,
          scope,
          type: "span" as const,
        };

        const spans = spansByTraceId.get(s.trace_id) || [];
        spans.push(span);
        spansByTraceId.set(s.trace_id, spans);
      }
    }
  }

  // Convert Map to array of Trace objects with correct id property
  const result: Trace[] = [];
  for (const [trace_id, spans] of spansByTraceId.entries()) {
    result.push({
      id: trace_id,
      spans: spans,
    });
  }
  return result;
}
