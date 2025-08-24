/**
 * Base domain exception class
 * All domain exceptions should extend this class
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}