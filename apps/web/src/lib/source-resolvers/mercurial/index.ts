import { createContext, useContext } from "react";

import { SourceResolver } from "../.";
import { BuildIdResolver } from "./build-id-resolver";

const Context = createContext<null | { buildId: string }>(null);

export class MercurialSourceResolver implements SourceResolver {
  private readonly buildIdResolver: BuildIdResolver;

  constructor(buildIdResolver: BuildIdResolver) {
    this.buildIdResolver = buildIdResolver;
  }

  canResolve(file: string): boolean {
    return useContext(Context) !== null;
  }
  resolve(file: string): Promise<URL> {
	const context = useContext(Context);
	if 

    throw new Error("Method not implemented.");
  }
}
