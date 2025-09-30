"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/resizable";
import SearchableSpanTree from "./SearchableSpanTree";
import { Trace } from "@/lib/types";
import { TraceExplorerContext } from "./context";

import { Details } from "./details";

export default function TraceExplorer(props: { trace: Trace }) {
  return (
    <section className="h-full flex" aria-label="Trace Explorer">
      <TraceExplorerContext value={props}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <SearchableSpanTree />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <Details />
          </ResizablePanel>
        </ResizablePanelGroup>
      </TraceExplorerContext>
    </section>
  );
}
