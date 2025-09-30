"use client";

import { createContext } from "react";
import { Trace } from "@/lib/types";

export const TraceExplorerContext = createContext<{ trace: Trace } | null>(
  null,
);
