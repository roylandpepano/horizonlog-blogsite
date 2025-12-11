/**
 * Navbar component
 * Navigation bar with branding and links
 */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewPostDialog } from "@/components/NewPostDialog";
import Image from "next/image";

export function Navbar() {
   return (
      <motion.nav
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80"
      >
         <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
               <Image
                  src="/logo.png"
                  width={64}
                  height={64}
                  alt="HorizonLog logo"
               />
               <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col leading-none"
               >
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                     HorizonLog
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                     A Blog Site by RoylandVP
                  </span>
               </motion.div>
            </Link>

            <div className="flex items-center gap-4">
               <Link href="/">
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <Button variant="ghost" className="gap-2">
                        <Home className="h-5 w-5" />
                        <span className="hidden sm:inline">Home</span>
                     </Button>
                  </motion.div>
               </Link>
               <NewPostDialog />
            </div>
         </div>
      </motion.nav>
   );
}
