/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'source-map-support/register';
import 'jest';
import { connectTestDatabase } from '@fmtk/dbtest';
import { makePgPoolClient } from '../pg/makePgPoolClient';
import { nonQuery } from '../commands/nonQuery';
import { sql } from '../core/sql';
import { single } from '../commands/single';
import { transaction } from '../commands/transaction';

describe('smoke test', () => {
  const context = connectTestDatabase();

  it('passes', async () => {
    const client = makePgPoolClient(context.pool);

    await client(
      nonQuery(sql`
        CREATE TABLE people (
          id int not null primary key,
          given_name text not null,
          family_name text not null
        )`),
    );

    const n = await client(
      nonQuery(sql`
        INSERT INTO people(
          id, given_name, family_name
        ) VALUES (${1}, ${'Fred'}, ${'Flintstone'})`),
    );

    expect(n).toEqual(1);

    const person = await client(
      transaction(db => db(single(sql`SELECT * FROM people WHERE id=${1}`))),
    );

    expect(person).toEqual({
      id: 1,
      givenName: 'Fred',
      familyName: 'Flintstone',
    });
  });
});
