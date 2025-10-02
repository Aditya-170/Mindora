"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotificationsPage() {
    const { user } = useUser();
    const [invites, setInvites] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("invites");

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const inviteRes = await fetch(`/api/notifications/invites?userId=${user.id}`);
                const inviteData = await inviteRes.json();

                const requestRes = await fetch(`/api/notifications/requests?userId=${user.id}`);
                const requestData = await requestRes.json();

                if (inviteRes.ok) setInvites(inviteData);
                else toast.error("Failed to fetch invites!", { style: { background: "red", color: "white" } });

                if (requestRes.ok) setRequests(requestData);
                else toast.error("Failed to fetch requests!", { style: { background: "red", color: "white" } });

            } catch (err) {
                console.error(err);
                toast.error("Error fetching notifications!", { style: { background: "red", color: "white" } });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleInviteAction = async (inviteId, action) => {
        try {
            const res = await fetch(`/api/notifications/invites/${inviteId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, userId: user.id }),
            });

            if (res.ok) {
                setInvites((prev) => prev.filter((i) => i.inviteId !== inviteId));
                toast.success(`Invite ${action}ed successfully!`, { style: { background: "black", color: "yellow" } });
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to perform action!", { style: { background: "red", color: "white" } });
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to perform action!", { style: { background: "red", color: "white" } });
        }
    };

    const handleRequestAction = async (requestId, action) => {
        try {
            const res = await fetch(`/api/notifications/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, userId: user.id }),
            });

            if (res.ok) {
                setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
                toast.success(`Request ${action}ed successfully!`, { style: { background: "black", color: "yellow" } });
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to perform action!", { style: { background: "red", color: "white" } });
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to perform action!", { style: { background: "red", color: "white" } });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <UserNavbar />

            <main className="flex-1 bg-gradient-to-b from-[#0b1b3a] to-[#11254d] p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 text-center">
                    Notifications
                </h1>

                {/* Sliding Tabs */}
                <div className="flex justify-center mb-6 gap-6">
                    <button
                        onClick={() => setActiveTab("invites")}
                        className={`px-6 py-2 rounded-lg font-semibold ${
                            activeTab === "invites"
                                ? "bg-yellow-400 text-black"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        Room Invitations
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`px-6 py-2 rounded-lg font-semibold ${
                            activeTab === "requests"
                                ? "bg-yellow-400 text-black"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        Room Requests
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-yellow-400 mt-10">Loading...</p>
                ) : (
                    <div className="flex flex-col gap-10 items-center">
                        {/* Invitations Section */}
                        {activeTab === "invites" && (
                            <section className="w-[85%]">
                                {invites.length === 0 ? (
                                    <p className="text-gray-300 text-center">No pending invitations.</p>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        {invites.map((invite) => (
                                            <div
                                                key={invite.inviteId}
                                                className="bg-[#1e2a4b] rounded-xl p-4 border border-yellow-500/20 flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {invite.roomImage && (
                                                        <img
                                                            src={invite.roomImage}
                                                            alt={invite.roomName}
                                                            className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                                                        />
                                                    )}
                                                    <div>
                                                        <h2 className="text-lg font-semibold text-yellow-400">
                                                            {invite.roomName}
                                                        </h2>
                                                        <p className="text-gray-300 text-sm">By {invite.roomOwner}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 ml-6">
                                                    <button
                                                        onClick={() => handleInviteAction(invite.inviteId, "accept")}
                                                        className="bg-green-400 hover:bg-green-500 text-black font-semibold px-4 py-1 rounded-lg"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleInviteAction(invite.inviteId, "reject")}
                                                        className="bg-gray-700 hover:bg-red-500 text-white font-semibold px-4 py-1 rounded-lg"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Requests Section */}
                        {activeTab === "requests" && (
                            <section className="w-[85%]">
                                {requests.length === 0 ? (
                                    <p className="text-gray-300 text-center">No pending requests.</p>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        {requests.map((request) => (
                                            <div
                                                key={request.requestId}
                                                className="bg-[#1e2a4b] rounded-xl p-4 border border-yellow-500/20 flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {request.roomImage && (
                                                        <img
                                                            src={request.roomImage}
                                                            alt={request.roomName}
                                                            className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                                                        />
                                                    )}
                                                    <div>
                                                        <h2 className="text-lg font-semibold text-yellow-400">
                                                            {request.roomName}
                                                        </h2>
                                                        <p className="text-gray-300 text-sm">
                                                            Owner: {request.roomOwner}
                                                        </p>
                                                        <p className="text-gray-400 text-sm italic">
                                                            Requested by: {request.fromUserEmail}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 ml-6">
                                                    <button
                                                        onClick={() => handleRequestAction(request.requestId, "accept")}
                                                        className="bg-green-400 hover:bg-green-500 text-black font-semibold px-4 py-1 rounded-lg"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(request.requestId, "reject")}
                                                        className="bg-gray-700 hover:bg-red-500 text-white font-semibold px-4 py-1 rounded-lg"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </main>

            <Footer />

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
}
