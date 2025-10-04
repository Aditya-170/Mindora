"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "@/components/Spinner";

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

            <main className="flex-1 bg-gradient-to-b from-[#0b1b3a] to-[#11254d] p-4 sm:p-6 md:p-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-6 sm:mb-8 text-center">
                    Notifications
                </h1>

                {/* Sliding Tabs */}
                <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-3 sm:gap-6">
                    <button
                        onClick={() => setActiveTab("invites")}
                        className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base ${activeTab === "invites"
                                ? "bg-yellow-400 text-black"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Room Invitations
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base ${activeTab === "requests"
                                ? "bg-yellow-400 text-black"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Room Requests
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spinner />
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 items-center">
                        {/* Invitations Section */}
                        {activeTab === "invites" && (
                            <section className="w-full sm:w-[85%]">
                                {invites.length === 0 ? (
                                    <p className="text-gray-300 text-center">No pending invitations.</p>
                                ) : (
                                    <div className="flex flex-col gap-4 sm:gap-6">
                                        {invites.map((invite) => (
                                            <div
                                                key={invite.inviteId}
                                                className="bg-[#1e2a4b] rounded-xl p-3 sm:p-4 border border-yellow-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                            >
                                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                                    {invite.roomImage && (
                                                        <img
                                                            src={invite.roomImage}
                                                            alt={invite.roomName}
                                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-yellow-400"
                                                        />
                                                    )}
                                                    <div>
                                                        <h2 className="text-base sm:text-lg font-semibold text-yellow-400">
                                                            {invite.roomName}
                                                        </h2>
                                                        <p className="text-gray-300 text-xs sm:text-sm">By {invite.roomOwner}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 w-full sm:w-auto justify-end">
                                                    <button
                                                        onClick={() => handleInviteAction(invite.inviteId, "accept")}
                                                        className="flex-1 sm:flex-none bg-green-400 hover:bg-green-500 text-black font-semibold px-3 sm:px-4 py-1 rounded-lg text-sm"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleInviteAction(invite.inviteId, "reject")}
                                                        className="flex-1 sm:flex-none bg-gray-700 hover:bg-red-500 text-white font-semibold px-3 sm:px-4 py-1 rounded-lg text-sm"
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
                            <section className="w-full sm:w-[85%]">
                                {requests.length === 0 ? (
                                    <p className="text-gray-300 text-center">No pending requests.</p>
                                ) : (
                                    <div className="flex flex-col gap-4 sm:gap-6">
                                        {requests.map((request) => (
                                            <div
                                                key={request.requestId}
                                                className="bg-[#1e2a4b] rounded-xl p-3 sm:p-4 border border-yellow-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                            >
                                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                                    {request.roomImage && (
                                                        <img
                                                            src={request.roomImage}
                                                            alt={request.roomName}
                                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-yellow-400"
                                                        />
                                                    )}
                                                    <div>
                                                        <h2 className="text-base sm:text-lg font-semibold text-yellow-400">
                                                            {request.roomName}
                                                        </h2>
                                                        <p className="text-gray-300 text-xs sm:text-sm">
                                                            Owner: {request.roomOwner}
                                                        </p>
                                                        <p className="text-gray-400 text-xs sm:text-sm italic">
                                                            Requested by: {request.fromUserEmail}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 w-full sm:w-auto justify-end">
                                                    <button
                                                        onClick={() => handleRequestAction(request.requestId, "accept")}
                                                        className="flex-1 sm:flex-none bg-green-400 hover:bg-green-500 text-black font-semibold px-3 sm:px-4 py-1 rounded-lg text-sm"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(request.requestId, "reject")}
                                                        className="flex-1 sm:flex-none bg-gray-700 hover:bg-red-500 text-white font-semibold px-3 sm:px-4 py-1 rounded-lg text-sm"
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
