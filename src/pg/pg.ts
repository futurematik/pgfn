export interface QueryConfig {
  text: string;
  values?: unknown[];
  rowMode: 'array';
}

export interface PgField {
  name: string;
}

export interface PgQueryResult {
  rowCount: number;
  fields: PgField[];
  rows: unknown[][];
}

export interface PgClient {
  query(queryConfig: QueryConfig): PromiseLike<PgQueryResult>;
}

export interface PgPoolClient extends PgClient {
  release(): void;
}

export interface PgPool {
  connect(): PromiseLike<PgPoolClient>;
}
