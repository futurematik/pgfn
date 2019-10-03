import { TokenizedQuery } from '../core/TokenizedQuery';
import { DbCommand } from '../core/DbCommand';

export function nonQuery(statement: TokenizedQuery): DbCommand<number> {
  return async (db): Promise<number> => {
    const result = await db(statement);
    return result.rowsAffected;
  };
}
