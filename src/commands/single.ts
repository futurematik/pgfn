import { camelcase } from '../core/camelcase';
import { TokenizedQuery } from '../core/TokenizedQuery';
import { DbCommand } from '../core/DbCommand';
import { NotFoundDbError } from '../core/NotFoundDbError';
import { MoreThanOneDbError } from '../core/MoreThanOneDbError';
import { mapRow } from '../core/mapRow';

export function single<T>(query: TokenizedQuery): DbCommand<T> {
  return async (db): Promise<T> => {
    const result = await db(query);

    if (result.rows.length === 0) {
      throw new NotFoundDbError();
    }
    if (result.rows.length > 1) {
      throw new MoreThanOneDbError();
    }

    return mapRow(result.fields.map(x => camelcase(x)), result.rows[0]);
  };
}
