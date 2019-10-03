import { TokenizedQuery } from '../core/TokenizedQuery';
import { DbCommand } from '../core/DbCommand';

export function array<T>(query: TokenizedQuery): DbCommand<T[]> {
  return async (db): Promise<T[]> => {
    const result = await db(query);
    return result.rows.map(([x]) => x) as T[];
  };
}
