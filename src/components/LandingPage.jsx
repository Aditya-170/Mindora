"use client";
import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

const LandingPage = () => {
  const blobs = [
    { size: 80, top: "10%", left: "20%", color: "bg-yellow-400", duration: 25, rotate: 360 },
    { size: 60, top: "70%", left: "10%", color: "bg-black", duration: 30, rotate: -360 },
    { size: 100, top: "40%", left: "70%", color: "bg-yellow-300", duration: 35, rotate: 360 },
    { size: 50, top: "80%", left: "60%", color: "bg-black", duration: 40, rotate: -360 },
  ];

  const features = [
    { title: "Upload Notes", desc: "Easily upload and organize your study materials.", icon: "📄" },
    { title: "Take Quizzes", desc: "Interactive quizzes to test your knowledge.", icon: "📝" },
    { title: "Short Notes", desc: "Access concise and summarized notes for quick revision.", icon: "✏️" },
    { title: "Track Progress", desc: "Monitor your learning and achievements.", icon: "📊" },
    { title: "Discussion Forums", desc: "Collaborate and discuss with peers.", icon: "💬" },
    { title: "Expert Guidance", desc: "Get tips and advice from educators.", icon: "👨‍🏫" },
  ];

  const highlights = [
    { title: "Dark & Light Mode", desc: "Switch between modes for comfortable viewing.", icon: "🌙" },
    { title: "Cloud Sync", desc: "Access your notes and quizzes on any device.", icon: "☁️" },
    { title: "Gamified Learning", desc: "Earn points and badges while studying.", icon: "🏆" },
  ];

  return (
    <div className="bg-black text-yellow-400 min-h-screen relative overflow-hidden">

      {/* Background Blobs */}
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${blob.color} opacity-20 blur-2xl`}
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
          }}
          animate={{ rotate: blob.rotate }}
          transition={{ repeat: Infinity, duration: blob.duration, ease: "linear" }}
        />
      ))}

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 md:px-20 mt-20 relative z-10">
        <div className="md:w-1/2 space-y-6">
          <motion.h1
            className="text-6xl font-extrabold leading-tight"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            Learn <span className="text-yellow-300">Anything</span>, <br />
            Anytime, Anywhere
          </motion.h1>
          <motion.p
            className="text-lg text-yellow-200"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Upload notes, take quizzes, and access short notes to enhance your learning experience.
          </motion.p>
          <div className="flex space-x-4 mt-4">
            <motion.button
              className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition transform hover:scale-105"
              whileHover={{ scale: 1.1 }}
            >
              Start Learning
            </motion.button>
            <motion.button
              className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition transform hover:scale-105"
              whileHover={{ scale: 1.1 }}
            >
              Watch Demo
            </motion.button>
          </div>
        </div>

        {/* Hero Lottie Animation + Rotating Rings */}
        <div className="md:w-1/2 flex justify-center relative mt-10 md:mt-0">
          <motion.div
            className="absolute w-96 h-96 border-4 border-yellow-400 rounded-full opacity-20 blur-xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />
          <motion.div
            className="absolute w-72 h-72 border-4 border-yellow-300 rounded-full opacity-20 blur-2xl"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
          />

          {/* Lottie Animation */}
          <div className="w-80 h-80 md:w-96 md:h-96">
            <Lottie
              animationData={require("./animation.json")} // <-- use require here
              loop
              autoplay
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-10 md:px-20 mt-32 space-y-16 relative z-10">
        <motion.h2
          className="text-4xl font-bold text-center text-yellow-400 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Key Features
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08, y: -10 }}
              className="bg-yellow-400/10 border border-yellow-400 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-yellow-400/50 transition"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h4 className="text-2xl font-bold mb-2">{feature.title}</h4>
              <p className="text-yellow-200">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Highlight Section */}
      <section className="px-10 md:px-20 mt-32 space-y-16 relative z-10">
        <motion.h2
          className="text-4xl font-bold text-center text-yellow-400 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          More Highlights
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08, y: -10 }}
              className="bg-yellow-400/10 border border-yellow-400 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl hover:shadow-yellow-400/50 transition"
            >
              <div className="text-6xl mb-4">{item.icon}</div>
              <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
              <p className="text-yellow-200">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-32 text-center relative z-10 mb-32">
        <motion.h2
          className="text-5xl font-bold mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          Ready to start your learning journey?
        </motion.h2>
        <motion.button
          className="bg-yellow-400 text-black px-10 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition transform hover:scale-110"
          whileHover={{ scale: 1.1 }}
        >
          Get Started Now
        </motion.button>
      </section>
    </div>
  );
};

export default LandingPage;
