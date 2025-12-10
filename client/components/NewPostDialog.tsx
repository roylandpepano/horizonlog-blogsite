/**
 * New Post Dialog Component
 * Dialog for creating a new blog post
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostForm } from "@/components/PostForm";
import { api } from "@/lib/api";
import type { CreatePostInput, UpdatePostInput } from "@/lib/types";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { motion } from "motion/react";
import { DialogDescription } from "@radix-ui/react-dialog";

export function NewPostDialog() {
   const router = useRouter();
   const [open, setOpen] = useState(false);

   const handleSubmit = async (data: CreatePostInput | UpdatePostInput) => {
      try {
         // Ensure all required fields are present for new post
         if (!data.title || !data.content || !data.author) {
            toast.error("Please fill in all required fields.");
            return;
         }
         const postData: CreatePostInput = {
            title: data.title,
            content: data.content,
            author: data.author,
         };
         const post = await api.createPost(postData);
         toast.success("Post created successfully!");
         setOpen(false);
         router.push(`/posts/${post.id}`);
      } catch (error) {
         toast.error("Failed to create post. Please try again.");
         console.error("Failed to create post:", error);
         throw error;
      }
   };

   const handleCancel = () => {
      setOpen(false);
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <Button className="gap-2">
                  <PenSquare className="h-5 w-5" />
                  <span className="hidden sm:inline">New Post</span>
               </Button>
            </motion.div>
         </DialogTrigger>
         <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <div className="mt-4">
               <PostForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
         </DialogContent>
      </Dialog>
   );
}
