"use client";

import { motion } from "framer-motion";

export default function DotRing({ size = 160 }: { size?: number }) {
  const radius = size / 2 - 4;
  return (
    <div aria-hidden className="pointer-events-none select-none">
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="60%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="url(#glow)" />
        <circle cx={size / 2} cy={size / 2} r={radius - 6} fill="none" stroke="white" strokeOpacity="0.2" />
        <circle cx={size / 2} cy={size / 2} r={4} fill="white" />
      </motion.svg>
    </div>
  );
}
