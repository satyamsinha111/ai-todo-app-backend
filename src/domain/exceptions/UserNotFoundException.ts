import { DomainException } from './DomainException';

/**
 * Exception thrown when a user is not found
 */
export class UserNotFoundException extends DomainException {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}