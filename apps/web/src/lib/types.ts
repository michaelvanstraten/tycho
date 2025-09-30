export interface Trace {
  id: string;
  spans: Span[];
  type: "trace";
}

export interface Span {
  trace_id: string;
  span_id: string;
  parent_span_id?: string;
  name: string;
  start_time_unix_nano: number;
  end_time_unix_nano: number;
  attributes?: Record<string, any>;
  status?: { code: number; message?: string };
  events?: SpanEvent[];
  childSpans: Span[];
  resource: Resource;
  scope: InstrumentationScope;
  type: "span";
}

export interface MissingSpan {
  span_id: string;
  childSpans: Span[];
  type: "missing";
}

export interface SpanEvent {
  name: string;
  time_unix_nano: number;
  attributes?: Record<string, any>;
  type: "event";
}

export interface Resource {
  attributes: {
    gecko_process_id: number;
    gecko_process_type: string;
    service_name: string;
    telemetry_sdk_name: string;
    telemetry_sdk_version: string;
  };
}

export interface InstrumentationScope {
  name: string;
}
