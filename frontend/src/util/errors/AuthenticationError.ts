/**
 * An error to represent a failed authentication attempt.
 */
export class AuthenticationError extends Error {
  name: string;

  /**
   * An error to represent a failed authentication attempt.
   * @param {string} message The error message.
   */
  constructor(message:string) {
    super(message);
    this.name = this.constructor.name;
  }
}
