export class Verbatim {
  constructor(public readonly text: string) {}
}

export function verbatim(text: string): Verbatim {
  return new Verbatim(text);
}
