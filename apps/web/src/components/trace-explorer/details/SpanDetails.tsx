import { Separator } from "@/components/separator";
import { MissingSpan, Span } from "@/lib/types";
import Link from "next/link";

export function SpanDetails(props: { span: Span | MissingSpan }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-foreground">
        Span Details
      </h2>
      <Separator />
      <div>
        Parent Span Id:{" "}
        <Link
          href={`http://localhost:3000/trace/23eb8690e85aa5eba0451471e72ad7d5?span=${props.span.parent_span_id}`}
        >
          {props.span.parent_span_id}
        </Link>
      </div>
    </div>
  );
}
