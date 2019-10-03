import { TokenizedQuery } from './TokenizedQuery';
import { QueryResult } from './QueryResult';

export const TransactingSymbol = Symbol.for('DbClientIsTransacting');

export interface DbClientBase {
  (query: TokenizedQuery): PromiseLike<QueryResult>;
}

export interface DbClient extends DbClientBase {
  <T>(command: DbCommand<T>): PromiseLike<T>;
  [TransactingSymbol]?: boolean;
}

export interface DbCommand<T> {
  (db: DbClient): PromiseLike<T>;
}

export function cloneClient(client: DbClient): DbClient {
  return function(this: unknown) {
    return (client as Function).apply(this, Array.prototype.slice.call(
      /* eslint-disable-next-line prefer-rest-params */
      arguments,
    ) as unknown[]);
  } as DbClient;
}

export function enhanceClient(clientBase: DbClientBase): DbClient {
  async function client(query: TokenizedQuery): Promise<QueryResult>;
  async function client<T>(command: DbCommand<T>): Promise<T>;
  async function client<T>(
    command: TokenizedQuery | DbCommand<T>,
  ): Promise<T | QueryResult> {
    if (typeof command === 'function') {
      return await command(client);
    } else {
      return await clientBase(command);
    }
  }
  return client;
}
