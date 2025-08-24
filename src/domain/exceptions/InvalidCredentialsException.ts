import { DomainException } from './DomainException';

/**
 * Exception thrown when user credentials are invalid
 */
export class InvalidCredentialsException extends DomainException {
  constructor(message: string = 'Invalid credentials') {
    super(message);
    this.name = 'InvalidCredentialsException';
  }
}