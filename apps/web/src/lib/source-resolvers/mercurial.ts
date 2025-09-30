import { SourceResolver } from ".";

export class MercurialSourceResolver implements SourceResolver {
  private readonly repository: string;
  private readonly revision: string;

  constructor(repository: string, revision: string) {
    this.repository = repository;
    this.revision = revision;
  }

  getSourceUrl(sourceLocation: SourceLocation): URL {
    return new URL(
      `${this.repository}/raw-file/${this.revision}/${sourceLocation.file}`,
    );
  }

  async resolveSource(sourceLocation: SourceLocation): Promise<string> {
    const response = await fetch(this.getSourceUrl(sourceLocation));

    return response.text();
  }

  async maybeToSearchfoxUrl(
    sourceLocation: SourceLocation,
  ): Promise<URL | null> {
    // Implement logic to resolve to Searchfox URL
    return null;
  }
}

export interface SourceInfo {
  repository: string;
  revision: string;
}

interface BuildIdResolver {
  resolveBuildId(id: string): Promise<SourceInfo>;
}

export class Buildhub2 implements BuildIdResolver {
  private readonly endpointUrl: string;

  public constructor(endpointUrl: string) {
    this.endpointUrl = endpointUrl;
  }

  async resolveBuildId(buildId: string): Promise<SourceInfo> {
    const response = await fetch(`${this.endpointUrl}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: 1,
        query: {
          term: {
            "build.id": buildId,
          },
        },
      }),
    });

    const result = await response.json();

    return result.hits.hits[0]._source.source;
  }
}
