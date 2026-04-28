import React from "react";

type SplashScreenProps = {
  children: React.ReactNode;
};

function SplashScreen({ children }: SplashScreenProps) {
  return (
    <div
      className="splash-screen"
      data-testid="splash-screen"
      aria-label="Loading Habit Tracker"
      role="status"
      aria-live="polite"
    >
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-4xl brand">
          Habit<span className="brand-accent">Tracker</span>
        </span>
        <p className="spash-tagline">Build habits that stick</p>
      </div>

      {/* Spinner */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary animate-spin"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>

        {children && (
          <p className="text-muted-foreground text-sm animate-fade-in">
            {children}
          </p>
        )}
      </div>
    </div>
  );
}

export default SplashScreen;
