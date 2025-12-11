/**
 * PostCard component
 * Displays a single post in card format with animations
 */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Post } from "@/lib/types";
import { MessageSquare, Calendar, User } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

interface PostCardProps {
   post: Post;
   index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   const truncateContent = (content: string, maxLength: number = 150) => {
      if (content.length <= maxLength) return content;
      return content.substring(0, maxLength) + "...";
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, delay: index * 0.08 }}
         whileHover={{ scale: 1.02, y: -6 }}
         className="group h-full"
      >
         <Link href={`/posts/${post.id}`} className="block h-full">
            <Card className="h-full overflow-hidden rounded-2xl border border-transparent bg-white/60 dark:bg-slate-900/60 transition-shadow shadow-sm hover:shadow-lg transform-gpu will-change-transform">
               <div className="flex h-full flex-col">
                  <div className="flex items-start gap-4 p-5">
                     <div className="shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-indigo-500 text-white font-semibold">
                           {post.author
                              ? post.author.charAt(0).toUpperCase()
                              : "P"}
                        </div>
                     </div>
                     <div className="min-w-0">
                        <CardTitle className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100 transition-colors group-hover:text-sky-600">
                           {post.title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                           {truncateContent(post.content, 160)}
                        </CardDescription>
                     </div>
                  </div>

                  <div className="mt-auto border-t border-transparent/20 px-5 py-3">
                     <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2 rounded-full bg-slate-100/50 px-3 py-1">
                           <User className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                           <span className="font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-slate-100/40 px-3 py-1">
                           <Calendar className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                           <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-slate-100/40 px-3 py-1">
                           <MessageSquare className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                           <span>{post.comment_count} comments</span>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>
         </Link>
      </motion.div>
   );
}
