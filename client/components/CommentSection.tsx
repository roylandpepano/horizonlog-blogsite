/**
 * CommentSection component
 * Displays comments with rating system and handles new comments
 */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, User, Calendar, Trash2 } from "lucide-react";
import type { Comment, CreateCommentInput } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CommentSectionProps {
   comments: Comment[];
   onAddComment: (data: CreateCommentInput) => Promise<void>;
   onDeleteComment?: (commentId: number) => Promise<void>;
}

export function CommentSection({
   comments,
   onAddComment,
   onDeleteComment,
}: CommentSectionProps) {
   const [author, setAuthor] = useState("");
   const [content, setContent] = useState("");
   const [rating, setRating] = useState<number>(0);
   const [hoveredRating, setHoveredRating] = useState<number>(0);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!author.trim() || !content.trim()) return;

      setIsSubmitting(true);
      try {
         await onAddComment({
            author: author.trim(),
            content: content.trim(),
            rating: rating > 0 ? rating : undefined,
         });
         setAuthor("");
         setContent("");
         setRating(0);
      } catch (error) {
         console.error("Failed to add comment:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const formatDate = (dateString: string) => {
      try {
         return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
         });
      } catch {
         return "Invalid Date";
      }
   };

   return (
      <div className="space-y-6">
         {/* Comment Form */}
         <Card>
            <CardHeader>
               <CardTitle>Leave a Comment</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="author">Your Name</Label>
                     <Input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="John Doe"
                        required
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="content">Comment</Label>
                     <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        required
                        rows={4}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label>Rating (Optional)</Label>
                     <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="transition-transform hover:scale-110"
                           >
                              <Star
                                 className={`h-6 w-6 ${
                                    star <= (hoveredRating || rating)
                                       ? "fill-yellow-400 text-yellow-400"
                                       : "text-muted-foreground"
                                 }`}
                              />
                           </button>
                        ))}
                     </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
               </form>
            </CardContent>
         </Card>

         {/* Comments List */}
         <div className="space-y-4">
            <h3 className="text-lg font-semibold">
               Comments ({comments.length})
            </h3>
            <AnimatePresence>
               {comments.map((comment, index) => (
                  <motion.div
                     key={comment.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ delay: index * 0.05 }}
                  >
                     <Card>
                        <CardContent className="pt-6">
                           <div className="mb-2 flex items-start justify-between">
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                 <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium text-foreground">
                                       {comment.author}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                       {formatDate(comment.created_at)}
                                    </span>
                                 </div>
                              </div>
                              {onDeleteComment && (
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDeleteComment(comment.id)}
                                    className="h-8 w-8 text-red-500 hover:text-red-700"
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              )}
                           </div>

                           {comment.rating && (
                              <div className="mb-2 flex gap-1">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                       key={star}
                                       className={`h-4 w-4 ${
                                          star <= comment.rating!
                                             ? "fill-yellow-400 text-yellow-400"
                                             : "text-muted-foreground"
                                       }`}
                                    />
                                 ))}
                              </div>
                           )}

                           <p className="text-foreground">{comment.content}</p>
                        </CardContent>
                     </Card>
                  </motion.div>
               ))}
            </AnimatePresence>

            {comments.length === 0 && (
               <Card>
                  <CardContent className="py-8 text-center">
                     <p className="text-muted-foreground">
                        No comments yet. Be the first to comment!
                     </p>
                  </CardContent>
               </Card>
            )}
         </div>
      </div>
   );
}
