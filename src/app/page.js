"use client";
import UserNavbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import Footer from "@/components/Footer";

export default function Home() {
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
