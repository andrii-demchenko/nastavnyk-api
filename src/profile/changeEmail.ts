import { RegistrationError } from "../registration/errors";
import { userRepository, User } from "../users/userRepository";
import { normalizeEmail, validateEmail } from "../validation/email";

export function changeEmail(userId: number, newEmail: string): User {
  const user = userRepository.findById(userId);
  if (!user) throw new Error("User not found");

  const email = normalizeEmail(newEmail);

  const emailErrors = validateEmail(email);
  if (emailErrors.length) throw new RegistrationError("INVALID_INPUT", { email: emailErrors });

  if (email === user.email) return user;

  const owner = userRepository.findByEmail(email);
  if (owner && owner.id !== user.id) throw new RegistrationError("EMAIL_TAKEN");

  return userRepository.updateEmail(user.id, email) as User;
}
