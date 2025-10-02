"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const { user } = useUser();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Badges", href: "/badges" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "My-Rooms", href: "/my-rooms" },
    { label: "Joined-Rooms", href: "/joined-rooms" },
  ];

  // Fetch invites + requests count
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const [invitesRes, requestsRes] = await Promise.all([
          fetch(`/api/notifications/invites?userId=${user.id}`),
          fetch(`/api/notifications/requests?userId=${user.id}`),
        ]);

        const invites = invitesRes.ok ? await invitesRes.json() : [];
        const requests = requestsRes.ok ? await requestsRes.json() : [];

        setNotifCount(invites.length + requests.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <nav className="bg-gray-900 text-white shadow-lg shadow-yellow-500/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-yellow-500 cursor-pointer hover:text-yellow-400 transition-all duration-300">
              Mindora
            </h1>
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative font-medium text-white hover:text-yellow-400 transition-colors group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right: Notification + Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <a
                href="/notification"
                className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Bell
                  className={`w-6 h-6 ${
                    notifCount > 0 ? "text-yellow-400 animate-pulse" : "text-yellow-500"
                  }`}
                />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                    {notifCount}
                  </span>
                )}
              </a>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <button className="px-5 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu btn */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              className="text-white hover:text-yellow-400"
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-yellow-500">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-6 py-3 hover:bg-yellow-500 hover:text-white"
            >
              {link.label}
            </a>
          ))}

          {/* Notifications in mobile */}
          <SignedIn>
            <a
              href="/notification"
              className="block px-6 py-3 flex items-center space-x-2 hover:bg-yellow-500 hover:text-white"
            >
              <Bell
                className={`w-5 h-5 ${
                  notifCount > 0 ? "text-yellow-400 animate-pulse" : "text-yellow-500"
                }`}
              />
              <span>Notifications</span>
              {notifCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                  {notifCount}
                </span>
              )}
            </a>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
