import { TokenizedQuery, QueryToken } from './TokenizedQuery';
import { Verbatim } from './Verbatim';
import { Parameter } from './Parameter';

export function sql(
  literals: TemplateStringsArray,
  ...placeholders: unknown[]
): TokenizedQuery {
  const tokens: QueryToken[] = [];

  for (let i = 0; i < literals.length; ++i) {
    tokens.push(new Verbatim(literals[i]));

    if (i < placeholders.length) {
      if (
        placeholders[i] instanceof Verbatim ||
        placeholders[i] instanceof Parameter
      ) {
        tokens.push(placeholders[i] as QueryToken);
      } else if (placeholders[i] instanceof TokenizedQuery) {
        tokens.push(...(placeholders[i] as TokenizedQuery).tokens);
      } else {
        tokens.push(new Parameter(placeholders[i]));
      }
    }
  }

  return new TokenizedQuery(tokens);
}
