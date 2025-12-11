/**
 * Create Post Page
 * Form for creating a new blog post
 */
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostForm } from "@/components/PostForm";
import { api } from "@/lib/api";
import type { CreatePostInput, UpdatePostInput } from "@/lib/types";

export default function NewPostPage() {
   const router = useRouter();

   const handleSubmit = async (data: CreatePostInput | UpdatePostInput) => {
      try {
         const post = await api.createPost(data as CreatePostInput);
         toast.success("Post created successfully!");
         router.push(`/posts/${post.id}`);
      } catch (error) {
         toast.error("Failed to create post. Please try again.");
         console.error("Failed to create post:", error);
         throw error;
      }
   };

   const handleCancel = () => {
      router.back();
   };

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mx-auto max-w-3xl">
            <PostForm onSubmit={handleSubmit} onCancel={handleCancel} />
         </div>
      </div>
   );
}
