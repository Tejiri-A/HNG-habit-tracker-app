"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import SplashScreen from "@/components/shared/SplashScreen";
import { SPLASH_DURATION } from "@/lib/constants";

function Home() {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    // Wait until auth provider has hydrated from local storage
    if (isLoading) return;
    // eslint-disable-next-line
    setStatusMessage(
      session ? "Redirecting to dashboard..." : "Redirecting to login...",
    );
    const timer = setTimeout(() => {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [isLoading, session, router]);
  return <SplashScreen>{statusMessage || "Loading..."}</SplashScreen>;
}

export default Home;
