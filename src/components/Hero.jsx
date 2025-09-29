// "use client";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import Lottie from "lottie-react";
// import brainAnimation from "@/animations/brain.json"; // replace with your Lottie JSON

// export default function HeroSection() {
//   return (
//     <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 sm:px-20 py-20 bg-black overflow-hidden">
      
//       {/* Left Side: Text */}
//       <motion.div
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 1 }}
//         className="flex-1 flex flex-col items-start text-left space-y-6"
//       >
//         <h1 className="text-5xl sm:text-6xl font-bold text-yellow-500">
//           Mindora
//         </h1>

//         <p className="text-gray-300 text-lg sm:text-xl max-w-lg leading-relaxed">
//           AI-powered collaborative learning platform that makes learning fun, engaging, and highly effective.
//           Connect with learners worldwide, join projects, track progress, and earn certifications.
//         </p>

//         <p className="text-gray-400 max-w-lg leading-relaxed">
//           Dive into a thriving community, share knowledge, and accelerate your personal and professional growth. 
//           Smart AI suggestions guide you to learn faster and smarter.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4 mt-4">
//           <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 font-medium transition transform hover:scale-105">
//             Get Started
//           </Button>
//           <Button className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-3 font-medium transition transform hover:scale-105">
//             Learn More
//           </Button>
//         </div>
//       </motion.div>

//       {/* Right Side: Animation */}
//       <motion.div
//         initial={{ opacity: 0, x: 50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 1.2 }}
//         className="flex-1 mt-10 lg:mt-0 flex justify-center items-center"
//       >
//         <Lottie animationData={brainAnimation} loop={true} className="w-full max-w-lg" />
//       </motion.div>

//     </section>
//   );
// }
