/**
 * PostGrid component
 * Displays posts in a responsive grid layout
 */
"use client";

import { PostCard } from "./PostCard";
import type { Post } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface PostGridProps {
   posts: Post[];
   isLoading?: boolean;
}

export function PostGrid({ posts, isLoading = false }: PostGridProps) {
   if (isLoading) {
      return (
         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
               <Card key={i} className="h-64 animate-pulse" />
            ))}
         </div>
      );
   }

   if (posts.length === 0) {
      return (
         <Card className="flex min-h-[400px] items-center justify-center">
            <CardContent className="text-center">
               <p className="text-xl text-muted-foreground">No posts found</p>
               <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your search or create a new post
               </p>
            </CardContent>
         </Card>
      );
   }

   return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
         {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
         ))}
      </div>
   );
}
