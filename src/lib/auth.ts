import { Storage } from "@/lib/storage";
import type { User, Session } from "@/types/auth";

export function signUp(
  email: string,
  password: string,
): { success: true; session: Session } | { success: false; error: string } {
  const existingUsers = Storage.getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const duplicate = existingUsers.some(
    (u) => u.email.toLowerCase() === normalizedEmail,
  );
  if (duplicate) {
    return { success: false, error: "User already exists" };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  Storage.saveUsers([...existingUsers, newUser]);

  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  };

  Storage.saveSession(session);

  return { success: true, session };
}

export function logIn(
  email: string,
  password: string,
): { success: true; session: Session } | { success: false; error: string } {
  const users = Storage.getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password,
  );

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  Storage.saveSession(session);

  return { success: true, session };
}

export function logOut(): void {
  Storage.clearSession();
}

export function getSession(): Session | null {
  return Storage.getSession();
}
