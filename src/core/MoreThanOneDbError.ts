import { DbError } from './DbError';

export class MoreThanOneDbError extends DbError {
  constructor() {
    super(`more than one row found`);
  }
}
