"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, BookOpen, TrendingUp, Users, Zap, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: <User className="w-8 h-8 text-yellow-500" />, title: "Personalized Learning", desc: "AI-powered learning paths adapt to your style, pace, and goals. Get recommendations tailored just for you." },
    { icon: <BookOpen className="w-8 h-8 text-yellow-500" />, title: "Collaborative Projects", desc: "Join teams with peers worldwide, work on real-life projects, and develop hands-on skills in a collaborative environment." },
    { icon: <TrendingUp className="w-8 h-8 text-yellow-500" />, title: "Progress Tracking", desc: "Monitor your learning progress with insightful analytics, detailed reports, and goal-setting features to stay on track." },
    { icon: <Users className="w-8 h-8 text-yellow-500" />, title: "Community Driven", desc: "Connect with learners globally, participate in discussions, and share knowledge through active community engagement." },
    { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: "Fast Learning", desc: "Get AI-driven suggestions and shortcuts to focus on what matters most, accelerating your learning journey." },
    { icon: <CheckCircle className="w-8 h-8 text-yellow-500" />, title: "Certifications", desc: "Earn verified badges and certificates for completed courses and projects to showcase your achievements." },
  ];

  const testimonials = [
    { name: "Priya S.", text: '"Mindora transformed the way I learn. AI suggestions are amazing and help me save time while learning efficiently."' },
    { name: "Rahul K.", text: '"Collaborative projects here make learning fun and highly effective. The teamwork experience is excellent."' },
    { name: "Ananya M.", text: '"Progress tracking keeps me motivated. Seeing my achievements and goals clearly helps me stay focused."' },
    { name: "Karan T.", text: '"The community support is incredible. I can always find help and connect with like-minded learners."' },
    { name: "Meera L.", text: '"I love the AI suggestions. They save me hours and guide me to the right resources."' },
    { name: "Ravi P.", text: '"Mindora is my go-to platform for learning and collaboration. Everything from projects to analytics is top-notch."' },
  ];

  return (
    <div className="font-sans bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 sm:px-20 py-20">
        <div className="absolute inset-0 bg-yellow-500/10 animate-pulse-slow rounded-xl"></div>

        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl font-bold text-yellow-500 mb-6 z-10"
        >
          Mindora
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-gray-300 text-lg sm:text-xl max-w-3xl mb-8 z-10"
        >
          AI-powered collaborative learning platform. Connect, learn, and grow together with your peers. Participate in projects, track your growth, earn certifications, and become part of a thriving learning community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col sm:flex-row gap-4 z-10"
        >
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 font-medium transition transform hover:scale-105">
            Get Started
          </Button>
          <Button className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white px-6 py-3 font-medium transition transform hover:scale-105">
            Learn More
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-center text-yellow-500 mb-12"
        >
          Features
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="bg-gray-800 rounded-2xl p-6 hover:scale-105 transition transform shadow-lg shadow-yellow-500/40 flex flex-col items-center text-center"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold text-yellow-400 mb-2 mt-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 sm:px-20 bg-gray-950 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-center text-yellow-500 mb-12"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { step: 1, title: "Sign Up", desc: "Create your account quickly and join the community to start learning immediately." },
            { step: 2, title: "Join Projects", desc: "Participate in collaborative projects, join teams, and work on real-world challenges." },
            { step: 3, title: "Learn & Grow", desc: "Use AI suggestions, peer feedback, and progress tracking to maximize your learning." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl animate-bounce">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 sm:px-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-center text-yellow-500 mb-12"
        >
          What People Say
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg shadow-yellow-500/40 hover:scale-105 transition transform"
            >
              <p className="text-gray-300 mb-4">{t.text}</p>
              <h4 className="text-yellow-400 font-semibold">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-6 sm:px-20 bg-gray-900">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-center text-yellow-500 mb-12"
        >
          Our Community
        </motion.h2>
        <div className="flex flex-col sm:flex-row justify-around items-center text-center gap-6">
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg shadow-yellow-500/30 hover:scale-105 transition transform">
            <h3 className="text-3xl font-bold text-yellow-400">10K+</h3>
            <p className="text-gray-300">Active Learners</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg shadow-yellow-500/30 hover:scale-105 transition transform">
            <h3 className="text-3xl font-bold text-yellow-400">500+</h3>
            <p className="text-gray-300">Projects Completed</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg shadow-yellow-500/30 hover:scale-105 transition transform">
            <h3 className="text-3xl font-bold text-yellow-400">1K+</h3>
            <p className="text-gray-300">Collaborators Worldwide</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      

    </div>
  );
}
