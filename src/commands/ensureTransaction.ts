import { DbCommand } from '../core/DbCommand';
import { isTransacting, transaction } from './transaction';

export function ensureTransaction<T>(cmd: DbCommand<T>): DbCommand<T> {
  return async (db): Promise<T> => {
    if (isTransacting(db)) {
      return db(cmd);
    }
    return transaction(cmd)(db);
  };
}
