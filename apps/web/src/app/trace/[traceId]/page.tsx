import { TraceExplorer } from "@/components";

import { transformGleanMetric } from "../../../lib/transforms";
import sampleMetric from "../../../sample-data.json";

export default async function TracePage(props: {
  params: Promise<{ traceId: string }>;
}) {
  const { traceId } = await props.params;

  const trace = await fetchTrace(traceId);

  return (
    <div className="h-screen">
      <TraceExplorer trace={trace} />
    </div>
  );
}

async function fetchTrace(traceId: string) {
  const traces = transformGleanMetric(sampleMetric);
  return traces.find((trace) => trace.id == traceId)!;
}
