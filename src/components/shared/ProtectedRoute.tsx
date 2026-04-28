"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  useEffect(() => {
    if (isLoading) return;
    if (!session) router.replace("/login");
  }, [isLoading, session, router]);

  // While hydrating or about to redirect — render nothing visible
  if (isLoading || !session) {
    return (
      <div className="flex justify-center items-center page-wrapper">
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
        <span className="sr-only">Checking session…</span>
      </div>
    );
  }
  return <>{children}</>;
}

export default ProtectedRoute;
