"use client";
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";

import UserNavbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import Footer from "@/components/Footer";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const saveUser = async () => {
        try {
          await axios.post("/api/create-user", {
            clerkId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0].emailAddress,
            profileImage: user.imageUrl,
          });
          console.log("User saved to DB");
        } catch (err) {
          console.error("Error saving user:", err);
        }
      };

      saveUser();
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="font-sans bg-black text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <UserNavbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-16">
        <LandingPage />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
