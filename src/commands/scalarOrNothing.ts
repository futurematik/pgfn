import { TokenizedQuery } from '../core/TokenizedQuery';
import { DbCommand } from '../core/DbCommand';
import { MoreThanOneDbError } from '../core/MoreThanOneDbError';

export function scalarOrNothing<T>(
  query: TokenizedQuery,
): DbCommand<T | undefined> {
  return async (db): Promise<T | undefined> => {
    const result = await db(query);

    if (result.rows.length === 0) {
      return;
    }
    if (result.rows.length > 1) {
      throw new MoreThanOneDbError();
    }

    return result.rows[0][0] as T;
  };
}
