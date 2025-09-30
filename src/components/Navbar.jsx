'use client';
import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const navLinks = ["Home", "Rooms", "Dashboard", "Badges", "Contact Us"];

  const handleProfileClick = () => {
    if (isSignedIn && user) {
      router.push("/profile"); // your profile page
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-20">

          {/* Left: Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-yellow-500 cursor-pointer hover:text-yellow-400 transition-all duration-300">
              Mindora
            </h1>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "")}`}
                className="relative font-medium text-white hover:text-yellow-400 transition-colors group"
              >
                {link}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right: Profile Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar
              className="w-12 h-12 rounded-full border-2 border-yellow-500 hover:scale-110 transition-transform duration-300 cursor-pointer"
              onClick={handleProfileClick}
            >
              <AvatarImage src={user?.imageUrl || "/favicon.ico"} alt="User Avatar" />
              <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              className="text-white hover:text-yellow-400 transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-yellow-500 animate-slide-down">
          {navLinks.map((link) => (
            <a
              key={link}
              href={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "")}`}
              className="block px-6 py-3 hover:bg-yellow-500 hover:text-white transition-all duration-300"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
