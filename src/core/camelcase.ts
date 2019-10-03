export function camelcase(str: string): string {
  return str.replace(/_+(.)/g, (_, x: string) => x.toUpperCase());
}
