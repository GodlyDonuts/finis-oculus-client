"use client";
import { motion } from "framer-motion";

/**
 * Creates a mesmerizing, animated "Aurora" gradient.
 * This is a pure CSS + Framer Motion visual that looks very premium
 * and avoids the need for new dependencies like react-three-fiber.
 */
export function HeroVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Base container for the effect */}
      <div className="absolute inset-0 z-0 h-full w-full">
        {/* Gradient 1 */}
        <motion.div
          className="absolute h-[30rem] w-[30rem] rounded-full bg-primary opacity-30 blur-[120px] dark:opacity-20"
          animate={{
            rotate: 360,
            x: [0, 100, 0, -100, 0],
            y: [0, 50, -50, 50, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "10%" }}
        />
        {/* Gradient 2 */}
        <motion.div
          className="absolute h-[25rem] w-[25rem] rounded-full bg-blue-500 opacity-20 blur-[100px] dark:opacity-10"
          animate={{
            rotate: -360,
            x: [0, -50, 0, 50, 0],
            y: [0, -100, 50, -100, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          style={{ bottom: "10%", right: "15%" }}
        />
        {/* Gradient 3 */}
        <motion.div
          className="absolute h-[20rem] w-[20rem] rounded-full bg-purple-600 opacity-20 blur-[100px] dark:opacity-10"
          animate={{
            rotate: 360,
            x: [0, 20, 0, -20, 0],
            y: [0, -50, 50, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10,
          }}
          style={{ bottom: "20%", left: "5%" }}
        />
      </div>
    </div>
  );
}