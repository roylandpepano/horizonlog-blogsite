/**
 * TypeScript interfaces for the Blogsite application
 * Matches backend SQLAlchemy models
 */

export interface Post {
   id: number;
   title: string;
   content: string;
   author: string;
   created_at: string;
   updated_at: string;
   comment_count: number;
   comments?: Comment[];
}

export interface Comment {
   id: number;
   post_id: number;
   author: string;
   content: string;
   rating: number | null;
   created_at: string;
   updated_at: string;
   post?: {
      id: number;
      title: string;
      author: string;
   };
}

export interface PaginatedResponse<T> {
   data: T[];
   total: number;
   page: number;
   per_page: number;
   total_pages: number;
}

export interface CreatePostInput {
   title: string;
   content: string;
   author: string;
}

export interface UpdatePostInput {
   title?: string;
   content?: string;
   author?: string;
}

export interface CreateCommentInput {
   author: string;
   content: string;
   rating?: number;
}

export interface UpdateCommentInput {
   content?: string;
   rating?: number;
}

export interface ApiError {
   error: string;
   message?: string;
   status?: number;
}
