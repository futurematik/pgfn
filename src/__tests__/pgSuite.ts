/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'source-map-support/register';
import 'jest';
import generate from 'nanoid/generate';
import { Pool } from 'pg';
import { makePgPoolClient } from '../pg/makePgPoolClient';
import { nonQuery } from '../commands/nonQuery';
import { sql } from '../core/sql';
import { single } from '../commands/single';

const nanoid = () => generate('0123456789abcdefghijklmnopqrstuvwxyz', 15);

describe('smoke test', () => {
  let dbName: string | undefined;
  const dbUser = process.env.DB_USER || 'postgres';
  let pool: Pool | undefined;

  beforeAll(async () => {
    dbName = process.env.DB_NAME || `test_${nanoid()}`;
    pool = new Pool({ database: 'postgres', user: dbUser });
    await pool.query(`CREATE DATABASE ${dbName}`);
    await pool.end();
    pool = new Pool({ database: dbName, user: dbUser });
  });

  afterAll(async () => {
    if (pool) {
      await pool.end();
      pool = new Pool({ database: 'postgres', user: dbUser });
      await pool.query(`DROP DATABASE ${dbName}`);
      await pool.end();
    }
  });

  it('passes', async () => {
    const client = makePgPoolClient(pool!);

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
      single(sql`SELECT * FROM people WHERE id=${1}`),
    );

    expect(person).toEqual({
      id: 1,
      givenName: 'Fred',
      familyName: 'Flintstone',
    });
  });
});
