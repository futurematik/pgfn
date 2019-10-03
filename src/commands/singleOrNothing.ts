import { camelcase } from '../core/camelcase';
import { TokenizedQuery } from '../core/TokenizedQuery';
import { DbCommand } from '../core/DbCommand';
import { MoreThanOneDbError } from '../core/MoreThanOneDbError';
import { mapRow } from '../core/mapRow';

export function singleOrNothing<T>(
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

    return mapRow(result.fields.map(x => camelcase(x)), result.rows[0]);
  };
}
