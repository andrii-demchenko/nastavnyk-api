import { changeEmail } from "./changeEmail";
import { userRepository } from "../users/userRepository";

beforeEach(() => {
  userRepository.reset();
});

describe("changeEmail", () => {
  it("changes the email to a new valid one", () => {
    const user = userRepository.create({ email: "test@test.com", username: "tester" });

    const updated = changeEmail(user.id, "test-test@test.com");

    expect(updated.email).toBe("test-test@test.com");
    expect(userRepository.findById(user.id)?.email).toBe("test-test@test.com");
    expect(userRepository.findByEmail("test@test.com")).toBeUndefined();
  });

  it("rejects an email that belongs to another user and keeps the old one", () => {
    userRepository.create({ email: "test@test.com", username: "other" });
    const user = userRepository.create({ email: "test2test@test.com", username: "tester" });

    expect(() => changeEmail(user.id, "test@test.com")).toThrow("Email already registered");
    expect(userRepository.findById(user.id)?.email).toBe("test2test@test.com");
  });

  it("does nothing when the new email equals the current one", () => {
    const user = userRepository.create({ email: "test@gmail.com", username: "tester" });

    expect(changeEmail(user.id, "test@gmail.com").email).toBe("test@gmail.com");
    expect(changeEmail(user.id, " Test@Gmail.com ").email).toBe("test@gmail.com");
    expect(userRepository.findById(user.id)?.email).toBe("test@gmail.com");
  });

  it("rejects an invalid email and keeps the old one", () => {
    const user = userRepository.create({ email: "test@gmail.com", username: "tester" });

    expect(() => changeEmail(user.id, "not-an-email")).toThrow(
      "Please check the highlighted fields",
    );
    expect(userRepository.findById(user.id)?.email).toBe("test@gmail.com");
  });
});
