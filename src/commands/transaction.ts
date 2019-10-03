import {
  DbCommand,
  DbClient,
  TransactingSymbol,
  cloneClient,
} from '../core/DbCommand';
import { sql } from '../core/sql';
import { DbError } from '../core/DbError';
import { verbatim } from '../core/Verbatim';

export enum TransactionIsolation {
  Snapshot = 'SNAPSHOT',
}

export function transaction<T>(
  cmd: DbCommand<T>,
  isolation = TransactionIsolation.Snapshot,
): DbCommand<T> {
  return async (db): Promise<T> => {
    if (isTransacting(db)) {
      throw new DbError(`nested transactions are not supported`);
    }
    const txdb = cloneClient(db);
    txdb[TransactingSymbol] = true;

    try {
      await db(sql`BEGIN TRANSACTION ${verbatim(isolation)}`);
      const result = await cmd(db);
      await db(sql`COMMIT`);
      return result;
    } catch (e) {
      await db(sql`ROLLBACK`);
      throw e;
    }
  };
}

export function isTransacting(db: DbClient): boolean {
  return !!db[TransactingSymbol];
}
