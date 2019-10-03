export interface QueryResult {
  fields: string[];
  rows: unknown[][];
  rowsAffected: number;
}
