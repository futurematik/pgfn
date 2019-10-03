import { TokenizedQuery } from './TokenizedQuery';
import { Verbatim } from './Verbatim';
import { Parameter } from './Parameter';

export interface SerializedQuery {
  text: string;
  values: unknown[];
}

export function serializeQuery(query: TokenizedQuery): SerializedQuery {
  const ret: SerializedQuery = { text: '', values: [] };

  for (const token of query.tokens) {
    if (token instanceof Verbatim) {
      ret.text += token.text;
    } else if (token instanceof Parameter) {
      ret.values.push(token.value);
      ret.text += `$${ret.values.length}`;
    }
  }

  return ret;
}
