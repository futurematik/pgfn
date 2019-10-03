import { PgClient } from './pg';
import { DbClient, enhanceClient } from '../core/DbCommand';
import { QueryResult } from '../core/QueryResult';
import { serializeQuery } from '../core/serializeQuery';

export function makePgClient(pgClient: PgClient): DbClient {
  return enhanceClient(
    async (query): Promise<QueryResult> => {
      const serialized = serializeQuery(query);
      const result = await pgClient.query({ ...serialized, rowMode: 'array' });

      return {
        fields: result.fields.map(x => x.name),
        rows: result.rows,
        rowsAffected: result.rowCount,
      };
    },
  );
}
