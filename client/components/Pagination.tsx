/**
 * Pagination component
 * Handles page navigation with animation
 */
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
}

export function Pagination({
   currentPage,
   totalPages,
   onPageChange,
}: PaginationProps) {
   if (totalPages <= 1) return null;

   const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const showEllipsis = totalPages > 7;

      if (!showEllipsis) {
         for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
         }
      } else {
         if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
         } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push("...");
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
         } else {
            pages.push(1);
            pages.push("...");
            for (let i = currentPage - 1; i <= currentPage + 1; i++)
               pages.push(i);
            pages.push("...");
            pages.push(totalPages);
         }
      }

      return pages;
   };

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="flex items-center justify-center gap-2"
      >
         <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
         >
            <ChevronLeft className="h-5 w-5" />
         </Button>

         {getPageNumbers().map((page, index) => (
            <div key={index}>
               {typeof page === "number" ? (
                  <Button
                     variant={page === currentPage ? "default" : "outline"}
                     onClick={() => onPageChange(page)}
                     className="min-w-10"
                  >
                     {page}
                  </Button>
               ) : (
                  <span className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                     {page}
                  </span>
               )}
            </div>
         ))}

         <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
         >
            <ChevronRight className="h-5 w-5" />
         </Button>
      </motion.div>
   );
}
