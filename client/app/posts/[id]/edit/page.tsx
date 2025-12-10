/**
 * Edit Post Page
 * Form for editing an existing blog post
 */
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostForm } from "@/components/PostForm";
import { api } from "@/lib/api";
import type { Post, UpdatePostInput } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export default function EditPostPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const resolvedParams = use(params);
   const router = useRouter();
   const postId = parseInt(resolvedParams.id);

   const [post, setPost] = useState<Post | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchPost = async () => {
         setIsLoading(true);
         try {
            const postData = await api.getPost(postId);
            setPost(postData);
         } catch (err) {
            toast.error("Failed to load post. Please try again later.");
            console.error("Error fetching post:", err);
         } finally {
            setIsLoading(false);
         }
      };

      fetchPost();
   }, [postId]);

   const handleSubmit = async (data: UpdatePostInput) => {
      try {
         await api.updatePost(postId, data);
         toast.success("Post updated successfully!");
         router.push(`/posts/${postId}`);
      } catch (error) {
         toast.error("Failed to update post. Please try again.");
         console.error("Failed to update post:", error);
         throw error;
      }
   };

   const handleCancel = () => {
      router.push(`/posts/${postId}`);
   };

   if (isLoading) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-3xl">
               <Card className="h-96 animate-pulse" />
            </div>
         </div>
      );
   }

   if (!post && !isLoading) {
      return (
         <div className="container mx-auto px-4 py-8">
            <Card className="mx-auto max-w-3xl">
               <CardContent className="py-12 text-center">
                  <p className="text-xl text-destructive">Post not found</p>
               </CardContent>
            </Card>
         </div>
      );
   }

   if (!post) return null;

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mx-auto max-w-3xl">
            <PostForm
               post={post}
               onSubmit={handleSubmit}
               onCancel={handleCancel}
               isEdit={true}
            />
         </div>
      </div>
   );
}
