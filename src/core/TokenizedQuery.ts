import { Parameter } from './Parameter';
import { Verbatim } from './Verbatim';

export type QueryToken = Parameter | Verbatim;

export class TokenizedQuery {
  constructor(public readonly tokens: QueryToken[]) {}
}
