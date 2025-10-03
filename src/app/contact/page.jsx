"use client";

import Footer from "@/components/Footer";
import UserNavbar from "@/components/Navbar";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";  // ✅ Clerk hook
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactUsPage() {
  const { user } = useUser();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          description,
          userId: user?.id, // ✅ send Clerk userId
        }),
      });

      if (res.ok) {
        toast.success("✅ Your issue has been sent to the admin!", {
          style: { background: "black", color: "yellow" },
        });
        setTopic("");
        setDescription("");
      } else {
        toast.error("❌ Failed to send. Please try again later.", {
          style: { background: "red", color: "white" },
        });
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong.", {
        style: { background: "red", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 to-blue-200 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Contact Us
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              placeholder="Describe your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="px-4 py-2 rounded-lg border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl font-semibold 
                         bg-gradient-to-r from-yellow-400 to-blue-500 
                         text-white shadow-md hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
      <Footer />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
