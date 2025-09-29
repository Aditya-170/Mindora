import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 py-16 px-6 sm:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Logo & Tagline */}
                <div>
                    <h1 className="text-2xl font-bold text-yellow-500 mb-4">Mindora</h1>
                    <p className="text-gray-400">
                        AI-powered collaborative learning platform. Connect, learn, and grow together with your peers.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-semibold text-yellow-400 mb-4">Quick Links</h2>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:text-yellow-500 transition">Home</a></li>
                        <li><a href="/dashboard" className="hover:text-yellow-500 transition">Dashboard</a></li>
                        <li><a href="/courses" className="hover:text-yellow-500 transition">Courses</a></li>
                        <li><a href="/projects" className="hover:text-yellow-500 transition">Projects</a></li>
                        <li><a href="/contact" className="hover:text-yellow-500 transition">Contact Us</a></li>
                    </ul>
                </div>

                {/* Resources / Learn More */}
                <div>
                    <h2 className="text-xl font-semibold text-yellow-400 mb-4">Resources</h2>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-yellow-500 transition">Blog</a></li>
                        <li><a href="#" className="hover:text-yellow-500 transition">Guides</a></li>
                        <li><a href="#" className="hover:text-yellow-500 transition">FAQ</a></li>
                        <li><a href="#" className="hover:text-yellow-500 transition">Support</a></li>
                    </ul>
                </div>

                {/* Newsletter & Social */}
                <div>
                    <h2 className="text-xl font-semibold text-yellow-400 mb-4">Stay Updated</h2>
                    <p className="text-gray-400 mb-4">Subscribe to our newsletter to get latest updates.</p>
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="flex-1 px-4 py-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none border border-gray-700 focus:border-yellow-500 transition-all"
                        />
                        <Button className="bg-yellow-500 hover:bg-yellow-600 rounded-full px-6 py-3 text-white font-semibold transition-all">
                            Subscribe
                        </Button>
                    </div>

                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-yellow-500 transition"><Facebook size={24} /></a>
                        <a href="#" className="hover:text-yellow-500 transition"><Twitter size={24} /></a>
                        <a href="#" className="hover:text-yellow-500 transition"><Linkedin size={24} /></a>
                        <a href="#" className="hover:text-yellow-500 transition"><Instagram size={24} /></a>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 mt-10"></div>

            {/* Copyright */}
            <div className="mt-6 text-center text-gray-500 text-sm">
                &copy; 2025 Mindora. All rights reserved. | <a href="#" className="hover:text-yellow-500 transition">Privacy Policy</a> | <a href="#" className="hover:text-yellow-500 transition">Terms of Service</a>
            </div>
        </footer>
    );
}
