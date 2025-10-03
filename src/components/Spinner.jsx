// Spinner.jsx
"use client";
import React from "react";
import { motion } from "framer-motion";

const blobs = [
  { size: 16, color: "bg-yellow-400", delay: 0 },
  { size: 14, color: "bg-black", delay: 0.1 },
  { size: 12, color: "bg-yellow-300", delay: 0.2 },
  { size: 14, color: "bg-black", delay: 0.3 },
  { size: 10, color: "bg-yellow-400", delay: 0.4 },
  { size: 12, color: "bg-black", delay: 0.5 },
  { size: 10, color: "bg-yellow-300", delay: 0.6 },
];

const radius = 50; // circle radius in px
const steps = 40; // more steps = smoother animation

const generateCirclePath = (radius) => {
  const x = [];
  const y = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    x.push(radius * Math.cos(angle));
    y.push(radius * Math.sin(angle));
  }
  return { x, y };
};

const Spinner = () => {
  const path = generateCirclePath(radius);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-32 h-32">
        {blobs.map((blob, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full ${blob.color}`}
            style={{
              width: blob.size * 2,
              height: blob.size * 2,
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              x: path.x,
              y: path.y,
            }}
            transition={{
              duration: 1, // faster rotation
              repeat: Infinity,
              ease: "linear",
              delay: blob.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Spinner;
