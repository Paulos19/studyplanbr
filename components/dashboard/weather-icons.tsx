"use client";

import { motion } from "framer-motion";

export const SunIcon = () => (
  <motion.svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.circle 
      cx="32" cy="32" r="14" fill="#FDB813" 
      initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
    />
    <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 10 }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect key={deg} x="30" y="2" width="4" height="12" rx="2" fill="#FDB813" transform={`rotate(${deg} 32 32)`} />
      ))}
    </motion.g>
  </motion.svg>
);

export const CloudIcon = () => (
  <motion.svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M16 42C16 33.1634 23.1634 26 32 26C33.6 26 35.1 26.3 36.5 26.8C38.2 21.2 43.4 17 49.5 17C56.9 17 63 23.1 63 30.5C63 31.4 62.9 32.3 62.7 33.1C63.5 33.6 64 34.5 64 35.5C64 37.4 62.4 39 60.5 39H16Z"
      fill="white" fillOpacity="0.8"
      animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    />
    <motion.circle cx="20" cy="40" r="12" fill="white" fillOpacity="0.6" animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 3 }} />
  </motion.svg>
);

export const RainIcon = () => (
  <motion.svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 24C48 15.1634 40.8366 8 32 8C23.1634 8 16 15.1634 16 24" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <path d="M16 24H48" stroke="white" strokeWidth="4" strokeLinecap="round" />
    {[1, 2, 3].map((i) => (
      <motion.path
        key={i}
        d={`M${20 + i * 8} 30V40`}
        stroke="#60A5FA" strokeWidth="3" strokeLinecap="round"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 15, opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
      />
    ))}
  </motion.svg>
);

export const MoonIcon = () => (
  <motion.svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M46 38.5C46 47.6127 38.6127 55 29.5 55C21.8488 55 15.4296 49.7788 13.5937 42.7669C13.2592 41.4897 14.5915 40.4868 15.7486 41.0655C18.6775 42.5303 21.9839 43.3529 25.5 43.3529C35.9934 43.3529 44.5 34.8463 44.5 24.3529C44.5 20.8369 43.6774 17.5304 42.2126 14.6015C41.6339 13.4444 42.6368 12.1121 43.914 12.4466C50.9259 14.2825 56.1471 20.7017 56.1471 28.3529C56.1471 28.9245 56.1157 29.4893 56.0544 30.0471"
      fill="#F4F4F5"
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    />
    {/* Estrelas piscando */}
    <motion.circle cx="45" cy="10" r="1.5" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
    <motion.circle cx="55" cy="20" r="1" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
  </motion.svg>
);