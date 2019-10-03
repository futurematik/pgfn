export class NotFoundDbError extends Error {
  constructor() {
    super(`no results found`);
  }
}
