"use client";
import { useAuth } from "@/lib/auth";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

function Dashboard() {
  const { session, logout } = useAuth();
  return (
    <ProtectedRoute>
      <div className="page-wrapper" data-testid="dashboard-page">
        {/* header */}
        <header className="dashboard-header">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg brand">
              Habit<span className="brand-accent">Tracker</span>
            </span>
            <span className="max-w-45 text-faint-foreground text-xs truncate-1">
              {session?.email}
            </span>
          </div>

          <button
            onClick={logout}
            data-testid="auth-logout-button"
            className="text-sm btn-ghost"
            aria-label="Log out of your account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </header>

        {/* habit components to be rendered here */}
        <main className="flex-1 py-6 page-container">
          {/* habits */}
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default Dashboard;
