/**
 * Data Transfer Object for user response
 */
export interface UserResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  createdAt: Date;
}