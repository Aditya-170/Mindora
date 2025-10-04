"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/Spinner";
import { Mail, UserPlus, Users } from "lucide-react"; // ✅ optional icons

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const [stats, setStats] = useState({
    totalCreated: 0,
    totalJoined: 0,
    totalRequests: 0,
    totalInvitations: 0,
    createdPerMonth: [],
    joinedPerMonth: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dashboard?userId=${userId}`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const createdData = stats.createdPerMonth.map((d) => ({
    month: monthNames[d._id - 1],
    rooms: d.count,
  }));

  const joinedData = stats.joinedPerMonth.map((d) => ({
    month: monthNames[d._id - 1],
    rooms: d.count,
  }));

  if (!isLoaded || loading) return <Spinner />;

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-blue-100 p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
          📊 Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Rooms Created */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center border-2 border-yellow-400">
            <h2 className="text-lg font-semibold text-gray-700 flex justify-center items-center gap-2">
              <Users className="text-blue-600" /> Rooms Created
            </h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCreated}</p>
          </div>

          {/* Rooms Joined */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center border-2 border-yellow-400">
            <h2 className="text-lg font-semibold text-gray-700 flex justify-center items-center gap-2">
              <UserPlus className="text-yellow-500" /> Rooms Joined
            </h2>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalJoined}</p>
          </div>

          {/* Room Requests */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center border-2 border-blue-400">
            <h2 className="text-lg font-semibold text-gray-700 flex justify-center items-center gap-2">
              <Mail className="text-blue-600" /> Room Requests
            </h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalRequests}</p>
          </div>

          {/* Invitations */}
          <div className="bg-white shadow-lg rounded-xl p-6 text-center border-2 border-yellow-400">
            <h2 className="text-lg font-semibold text-gray-700 flex justify-center items-center gap-2">
              <Mail className="text-yellow-500" /> Invitations
            </h2>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalInvitations}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-blue-400">
            <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
              Rooms Created Per Month
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={createdData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rooms" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-yellow-400">
            <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
              Rooms Joined Per Month
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={joinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rooms" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
