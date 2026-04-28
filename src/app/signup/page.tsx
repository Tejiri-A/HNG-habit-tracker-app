import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account | Habit Tracker",
};

export default function SignupPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="mb-8 text-center">
          <span className="text-xl brand">
            Habit<span className="brand-accent">Tracker</span>
          </span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start building habits that stick</p>
        </div>

        <SignupForm />
      </div>
    </main>
  );
}
