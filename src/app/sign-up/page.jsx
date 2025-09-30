'use client';
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Wait until Clerk session is fully loaded
    if (isLoaded) {
      if (isSignedIn) {
        router.replace("/profile"); // redirect existing users
      } else {
        setShowSignUp(true); // only show SignUp for new users
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Render nothing until we decide whether to show SignUp
  if (!showSignUp) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </div>
  );
}
