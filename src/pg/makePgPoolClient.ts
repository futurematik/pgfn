import { DbClient, enhanceClient } from '../core/DbCommand';
import { QueryResult } from '../core/QueryResult';
import { PgPool } from './pg';
import { makePgClient } from './makePgClient';

export function makePgPoolClient(pool: PgPool): DbClient {
  return enhanceClient(
    async (query): Promise<QueryResult> => {
      const client = await pool.connect();

      try {
        const connectedClient = makePgClient(client);
        return connectedClient(query);
      } finally {
        client.release();
      }
    },
  );
}
