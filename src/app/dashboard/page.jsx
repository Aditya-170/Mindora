"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  const { user } = useUser();
  const userId = user?.id;

  const [stats, setStats] = useState({
    totalCreated: 0,
    totalJoined: 0,
    createdPerMonth: [],
    joinedPerMonth: [],
  });

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const res = await fetch(`/api/dashboard?userId=${userId}`);
      const data = await res.json();
      setStats(data);
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

  return (
    <>
    <UserNavbar/>
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-blue-100 p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">📊 Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center border-2 border-yellow-400">
          <h2 className="text-lg font-semibold text-gray-700">Rooms Created</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalCreated}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center border-2 border-yellow-400">
          <h2 className="text-lg font-semibold text-gray-700">Rooms Joined</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.totalJoined}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-blue-400">
          <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">Rooms Created Per Month</h2>
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
          <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">Rooms Joined Per Month</h2>
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
    <Footer/>
    </>
  );
}
