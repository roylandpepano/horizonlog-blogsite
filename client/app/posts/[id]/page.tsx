/**
 * Single Post Page
 * Displays a single blog post with comments
 */
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Calendar, User, Edit, Trash2, ArrowLeft } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";
import { api } from "@/lib/api";
import type { Post, Comment, CreateCommentInput } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PostPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const resolvedParams = use(params);
   const router = useRouter();
   const postId = parseInt(resolvedParams.id);

   const [post, setPost] = useState<Post | null>(null);
   const [comments, setComments] = useState<Comment[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);
         try {
            const [postData, commentsData] = await Promise.all([
               api.getPost(postId),
               api.getComments(postId),
            ]);
            setPost(postData);
            setComments(commentsData);
         } catch (err) {
            toast.error("Failed to load post. Please try again later.");
            console.error("Error fetching post:", err);
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
   }, [postId]);

   const handleAddComment = async (data: CreateCommentInput) => {
      try {
         const newComment = await api.createComment(postId, data);
         setComments([...comments, newComment]);
         toast.success("Comment added successfully!");
      } catch (error) {
         toast.error("Failed to add comment. Please try again.");
         console.error("Failed to add comment:", error);
         throw error;
      }
   };

   const handleDeleteComment = async (commentId: number) => {
      try {
         await api.deleteComment(commentId);
         setComments(comments.filter((c) => c.id !== commentId));
         toast.success("Comment deleted successfully!");
      } catch (error) {
         toast.error("Failed to delete comment. Please try again.");
         console.error("Failed to delete comment:", error);
      }
   };

   const handleDeletePost = async () => {
      try {
         await api.deletePost(postId);
         toast.success("Post deleted successfully!");
         router.push("/");
      } catch (error) {
         toast.error("Failed to delete post. Please try again.");
         console.error("Failed to delete post:", error);
      }
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   if (isLoading) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl space-y-6">
               <div className="h-12 w-32 animate-pulse rounded bg-muted" />
               <Card className="h-96 animate-pulse" />
            </div>
         </div>
      );
   }

   if (!post && !isLoading) {
      return (
         <div className="container mx-auto px-4 py-8">
            <Card className="mx-auto max-w-4xl">
               <CardContent className="py-12 text-center">
                  <p className="text-xl text-destructive">Post not found</p>
                  <Link href="/">
                     <Button variant="link" className="mt-4">
                        Go back home
                     </Button>
                  </Link>
               </CardContent>
            </Card>
         </div>
      );
   }

   if (!post) return null;

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mx-auto max-w-4xl space-y-8">
            {/* Back Button */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
            >
               <Link href="/">
                  <Button variant="ghost" className="gap-2">
                     <ArrowLeft className="h-5 w-5" />
                     Back to posts
                  </Button>
               </Link>
            </motion.div>

            {/* Post Content */}
            <Card>
               <CardContent className="p-8">
                  <div className="mb-6 flex items-start justify-between">
                     <div className="flex-1">
                        <h1 className="mb-4 text-4xl font-bold">
                           {post.title}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                           <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{post.author}</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(post.created_at)}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <Link href={`/posts/${post.id}/edit`}>
                           <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                           >
                              <Button size="icon">
                                 <Edit className="h-5 w-5" />
                              </Button>
                           </motion.div>
                        </Link>
                        <motion.div
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                        >
                           <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => setShowDeleteConfirm(true)}
                           >
                              <Trash2 className="h-5 w-5" />
                           </Button>
                        </motion.div>
                     </div>
                  </div>

                  <div className="prose prose-gray max-w-none dark:prose-invert">
                     <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>
               </CardContent>
            </Card>

            {/* Comments Section */}
            <CommentSection
               comments={comments}
               onAddComment={handleAddComment}
               onDeleteComment={handleDeleteComment}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                  onClick={() => setShowDeleteConfirm(false)}
               >
                  <Card className="w-full max-w-md">
                     <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                     >
                        <CardContent>
                           <h3 className="mb-4 text-xl font-bold">
                              Delete Post?
                           </h3>
                           <p className="mb-6 text-muted-foreground">
                              Are you sure you want to delete this post? This
                              action cannot be undone.
                           </p>
                           <div className="flex gap-4">
                              <Button
                                 variant="destructive"
                                 onClick={handleDeletePost}
                              >
                                 Delete
                              </Button>
                              <Button
                                 variant="outline"
                                 onClick={() => setShowDeleteConfirm(false)}
                              >
                                 Cancel
                              </Button>
                           </div>
                        </CardContent>
                     </motion.div>
                  </Card>
               </motion.div>
            )}
         </div>
      </div>
   );
}
