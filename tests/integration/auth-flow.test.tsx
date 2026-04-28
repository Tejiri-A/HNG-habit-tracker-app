import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";
import { KEYS } from "@/lib/constants";
import type { User } from "@/types/auth";


const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));


const mockSetSession = vi.fn();

vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual, // keeps signUp, logIn running for real
    useAuth: () => ({ setSession: mockSetSession }),
  };
});

// Mock local storage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Helper function
function seedUser(user: Partial<User> = {}) {
  const defaultUser: User = {
    id: "seed-user-id",
    email: "existing@example.com",
    password: "password123",
    createdAt: new Date().toISOString(),
    ...user,
  };
  localStorage.setItem(KEYS.USERS, JSON.stringify([defaultUser]));
  return defaultUser;
}


describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockReset();
    mockReplace.mockReset();
    mockSetSession.mockReset();
  });

  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "newuser@example.com",
    );
    await user.type(
      screen.getByTestId("auth-signup-password"),
      "securepassword123",
    );
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      // User was persisted to localStorage
      const storedUsers: User[] = JSON.parse(
        localStorage.getItem(KEYS.USERS) ?? "[]",
      );
      expect(storedUsers).toHaveLength(1);
      expect(storedUsers[0].email).toBe("newuser@example.com");

      // Session was created
      const storedSession = JSON.parse(
        localStorage.getItem(KEYS.SESSION) ?? "null",
      );
      expect(storedSession).not.toBeNull();
      expect(storedSession.email).toBe("newuser@example.com");

      // Context was synced and redirect fired
      expect(mockSetSession).toHaveBeenCalledOnce();
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for duplicate signup email", async () => {
    seedUser({ email: "existing@example.com" });

    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "existing@example.com",
    );
    await user.type(
      screen.getByTestId("auth-signup-password"),
      "somepassword123",
    );
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      
      expect(screen.getByText("User already exists")).toBeInTheDocument();

      
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockSetSession).not.toHaveBeenCalled();
    });
  });

  it("submits the login form and stores the active session", async () => {
    seedUser({ email: "user@example.com", password: "correctpassword" });

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "user@example.com");
    await user.type(
      screen.getByTestId("auth-login-password"),
      "correctpassword",
    );
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      // Session was written to localStorage
      const storedSession = JSON.parse(
        localStorage.getItem(KEYS.SESSION) ?? "null",
      );
      expect(storedSession).not.toBeNull();
      expect(storedSession.email).toBe("user@example.com");

      // Context was synced and redirect fired
      expect(mockSetSession).toHaveBeenCalledOnce();
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows an error for invalid login credentials", async () => {
    seedUser({ email: "user@example.com", password: "correctpassword" });

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "user@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrongpassword");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      // Spec-mandated error message
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();

      // No redirect, no session update
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockSetSession).not.toHaveBeenCalled();
    });
  });
});
