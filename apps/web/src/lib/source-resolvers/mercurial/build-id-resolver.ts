export interface BuildIdResolver {
  resolveBuildId(id: string): Promise<SourceInfo>;
}

export interface SourceInfo {
  repository: string;
  revision: string;
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
