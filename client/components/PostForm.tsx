/**
 * PostForm component
 * Form for creating and editing blog posts with validation
 */
"use client";

import { useState, useEffect } from "react";
import type { Post, CreatePostInput, UpdatePostInput } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PostFormProps {
   post?: Post;
   onSubmit: (data: CreatePostInput | UpdatePostInput) => Promise<void>;
   onCancel?: () => void;
   isEdit?: boolean;
}

export function PostForm({
   post,
   onSubmit,
   onCancel,
   isEdit = false,
}: PostFormProps) {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [author, setAuthor] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errors, setErrors] = useState<{ [key: string]: string }>({});

   useEffect(() => {
      if (post) {
         setTitle(post.title);
         setContent(post.content);
         setAuthor(post.author);
      }
   }, [post]);

   const validate = () => {
      const newErrors: { [key: string]: string } = {};

      if (!title.trim()) {
         newErrors.title = "Title is required";
      } else if (title.length > 200) {
         newErrors.title = "Title must be less than 200 characters";
      }

      if (!content.trim()) {
         newErrors.content = "Content is required";
      }

      if (!isEdit && !author.trim()) {
         newErrors.author = "Author name is required";
      } else if (author.length > 100) {
         newErrors.author = "Author name must be less than 100 characters";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);
      try {
         const data = isEdit
            ? { title: title.trim(), content: content.trim() }
            : {
                 title: title.trim(),
                 content: content.trim(),
                 author: author.trim(),
              };

         await onSubmit(data);
      } catch (error) {
         // Error toast is handled in the parent component
         console.error("Failed to submit post:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
         <p className="font-bold">{isEdit ? "Edit Post" : "Create New Post"}</p>
         <p className="text-sm italic mb-5 text-gray-400">
            Input all the necessary details for your post.
         </p>
         <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
               <Label htmlFor="title">Title *</Label>
               <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  className={errors.title ? "border-red-500" : ""}
               />
               {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
               )}
            </div>

            {/* Author Field (only for new posts) */}
            {!isEdit && (
               <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                     id="author"
                     type="text"
                     value={author}
                     onChange={(e) => setAuthor(e.target.value)}
                     placeholder="Your name"
                     className={errors.author ? "border-red-500" : ""}
                  />
                  {errors.author && (
                     <p className="text-sm text-red-500">{errors.author}</p>
                  )}
               </div>
            )}

            {/* Content Field */}
            <div className="space-y-2">
               <Label htmlFor="content">Content *</Label>
               <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content..."
                  rows={12}
                  className={errors.content ? "border-red-500" : ""}
               />
               {errors.content && (
                  <p className="text-sm text-red-500">{errors.content}</p>
               )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
               <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                     ? "Saving..."
                     : isEdit
                     ? "Update Post"
                     : "Create Post"}
               </Button>
               {onCancel && (
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onCancel}
                     disabled={isSubmitting}
                  >
                     Cancel
                  </Button>
               )}
            </div>
         </form>
      </>
   );
}
