"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <div className="relative flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 transition-all group-hover:shadow-blue-600/40 group-hover:scale-105">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          {/* O ícone representa um livro aberto que vira uma seta de progresso */}
          <motion.path
            d="M4 19.5C4 18.8 4 17 6 16C8.5 14.8 10 16 12 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.path
            d="M12 18C14 16 15.5 14.8 18 16C20 17 20 18.8 20 19.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.path
            d="M12 18V6C12 4.5 13.5 3 17 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.path
            d="M12 6C10.5 4.5 9 4 7 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-tight tracking-tight text-zinc-900 dark:text-white">
          StudyPlan
        </span>
        <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
          Intelligence
        </span>
      </div>
    </Link>
  );
};