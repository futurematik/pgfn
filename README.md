# @fmtk/pgfn

This package contains utility functions for building composable queries for use
with [node-postgres](https://node-postgres.com/).

## Quick start

```typescript
import * as pg from 'pg';
import { makePgPoolClient, sql } from '@fmtk/pgfn';

const pool = new pg.Pool({
  /* connection params */
});

const db = makePgPoolClient(pool);

await db(sql`SELECT current_database()`);
```

## Principals

### SQL Queries

This library does not create yet another DSL for querying databases, because SQL works fine.

Queries are constructed using a tagged template:

```typescript
const query = sql`SELECT * FROM products WHERE id=${id}`;
```

The query is automatically converted to a parameterised query for the driver. This has the same effect as the following:

```typescript
// equivalent to:
pool.query(`SELECT * FROM products WHERE id=$1`, id);
```

Literal values and other queries can also be included:

```typescript
const select = sql`SELECT * FROM ${verbatim(table)} WHERE id=${id}`;

const query = sql`WITH cte AS (${select}) SELECT * FROM cte`;
```

### Composability

The database connection is simplified to a single function which can be passed a simple tokenized query or a more complex command function:

```typescript
interface DbClient {
  (query: TokenizedQuery): PromiseLike<QueryResult>;
  <T>(command: DbCommand<T>): PromiseLike<T>;
}

interface DbCommand<T> {
  (db: DbClient): PromiseLike<T>;
}
```

This makes composability really easy. Consider the transaction function:

```typescript
function transaction<T>(
  cmd: DbCommand<T>,
  isolation = TransactionIsolation.Serializable,
): DbCommand<T> {
  return async (db): Promise<T> => {
    if (txdb[TransactingSymbol]) {
      throw new DbError(`nested transactions are not supported`);
    }

    const txdb = cloneClient(db);
    txdb[TransactingSymbol] = true;

    try {
      await db(sql`BEGIN TRANSACTION ISOLATION LEVEL ${verbatim(isolation)}`);
      const result = await cmd(db);
      await db(sql`COMMIT`);
      return result;
    } catch (e) {
      await db(sql`ROLLBACK`);
      throw e;
    }
  };
}
```

This function wraps any given command in another command that automatically runs `BEGIN TRANSACTION`, `COMMIT` and `ROLLBACK` as necessary. Because the connection object is also just a function, it can be easily wrapped too.

Consider also the implementation of `makePgPoolClient`:

```typescript
function makePgPoolClient(pool: PgPool): DbClient {
  return async (query) => {
      const client = await pool.connect();

      try {
        const connectedClient = makePgClient(client);
        return connectedClient(query);
      } finally {
        client.release();
      }
    },
  );
}
```

This function automatically acquires a connection from the pool on first use and returns it when the query (or batch of queries) is complete. Composition of the `db` function makes this trivial.
