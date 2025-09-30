'use client';
import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchUser = async () => {
        try {
          const res = await axios.post("/api/user-details", { clerkId: user.id });
          setUserData(res.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      router.push("/sign-up");
    }
  }, [isSignedIn, user, router]);

  if (loading) return <p className="text-center mt-20 text-white">Loading...</p>;
  if (!userData) return <p className="text-center mt-20 text-red-500">User not found</p>;

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <UserNavbar />

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start py-12 px-4 md:px-12">
        <Card className="bg-gray-800 border-2 border-yellow-500 w-full max-w-3xl p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-8 animate-fade-in">
          
          {/* Left Side: Avatar + Logout */}
          <div className="flex flex-col items-center gap-6 w-full md:w-1/3">
            <Avatar className="w-32 h-32 rounded-full border-4 border-yellow-500 shadow-lg">
              <AvatarImage src={userData.profileImage || "/favicon.ico"} />
              <AvatarFallback>{userData.firstName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900"
              onClick={() => {
                signOut();
                router.push("/sign-in");
              }}
            >
              Logout
            </Button>
          </div>

          {/* Right Side: User Info */}
          <div className="flex-1 flex flex-col gap-6 w-full md:w-2/3">
            <CardHeader className="text-center md:text-left mb-4">
              <CardTitle className="text-4xl font-extrabold text-yellow-500">
                {userData.firstName} {userData.lastName}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">{userData.email}</CardDescription>
            </CardHeader>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {userData.badges?.length > 0 ? (
                userData.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold shadow"
                  >
                    {badge}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No badges yet</p>
              )}
            </div>

            {/* Account Info */}
            <CardContent className="bg-gray-700 rounded-xl p-6 flex flex-col gap-3 text-gray-200 shadow-inner">
              <h3 className="text-2xl font-semibold mb-3 text-yellow-500">Account Details</h3>
              <p><strong>First Name:</strong> {userData.firstName}</p>
              <p><strong>Last Name:</strong> {userData.lastName}</p>
              <p><strong>Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(userData.updatedAt).toLocaleDateString()}</p>
            </CardContent>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
