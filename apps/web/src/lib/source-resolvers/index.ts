export interface SourceResolver {
  canResolve(file: string): boolean;

  resolve(file: string): Promise<URL>;
}
