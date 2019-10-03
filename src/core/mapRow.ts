export function mapRow<T>(fields: string[], row: unknown[]): T {
  const ret: { [k: string]: unknown } = {};

  for (let i = 0; i < fields.length; ++i) {
    ret[fields[i]] = row[i];
  }

  return (ret as unknown) as T;
}
