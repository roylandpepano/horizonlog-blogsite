/**
 * Loading component
 * Reusable loading spinner
 */
"use client";

import { motion } from "motion/react";

export function Loading() {
   return (
      <div className="flex min-h-screen items-center justify-center">
         <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"
         />
      </div>
   );
}
