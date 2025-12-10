/**
 * SearchBar component
 * Debounced search input with loading state
 */
"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
   onSearch: (query: string) => void;
   placeholder?: string;
   debounceMs?: number;
}

export function SearchBar({
   onSearch,
   placeholder = "Search posts...",
   debounceMs = 500,
}: SearchBarProps) {
   const [query, setQuery] = useState("");

   useEffect(() => {
      if (!query.trim()) {
         onSearch("");
         return;
      }

      const timer = setTimeout(() => {
         onSearch(query);
      }, debounceMs);

      return () => {
         clearTimeout(timer);
      };
   }, [query, debounceMs, onSearch]);

   const handleClear = () => {
      setQuery("");
      onSearch("");
   };

   return (
      <div className="relative w-full">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder={placeholder}
               className="pl-10 pr-10"
            />
            <AnimatePresence>
               {query && (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.8 }}
                     className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="h-6 w-6"
                     >
                        <X className="h-4 w-4" />
                     </Button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
}
