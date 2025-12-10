/**
 * PostCard component
 * Displays a single post in card format with animations
 */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Post } from "@/lib/types";
import { MessageSquare, Calendar, User } from "lucide-react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardFooter,
} from "@/components/ui/card";

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
         transition={{ duration: 0.4, delay: index * 0.1 }}
         whileHover={{ y: -4 }}
         className="group h-full"
      >
         <Link href={`/posts/${post.id}`}>
            <Card className="h-full transition-all hover:shadow-md">
               <CardHeader>
                  <CardTitle className="transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                     {post.title}
                  </CardTitle>
                  <CardDescription>
                     {truncateContent(post.content)}
                  </CardDescription>
               </CardHeader>
               <CardFooter>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                     <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                     </div>
                     <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.created_at)}</span>
                     </div>
                     <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comment_count} comments</span>
                     </div>
                  </div>
               </CardFooter>
            </Card>
         </Link>
      </motion.div>
   );
}
