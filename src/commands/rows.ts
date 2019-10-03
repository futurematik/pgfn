import { camelcase } from '../core/camelcase';
import { TokenizedQuery } from '../core/TokenizedQuery';
import { DbCommand } from '../core/DbCommand';
import { mapRow } from '../core/mapRow';

export function rows<T>(query: TokenizedQuery): DbCommand<T[]> {
  return async (db): Promise<T[]> => {
    const result = await db(query);
    const fields = result.fields.map(x => camelcase(x));
    return result.rows.map(x => mapRow(fields, x));
  };
}
