"""
API routes for Comment operations.
Handles CRUD operations, ratings, and caching.
"""

from flask import Blueprint, request, jsonify
from sqlalchemy import and_
from models import db, Comment, Post

comments_bp = Blueprint('comments', __name__)


@comments_bp.route('', methods=['GET'])
def get_all_comments():
    """
    Get all comments with optional filtering by post_id.
    
    Query Parameters:
        - post_id: Filter comments by post (optional)
        - page: Page number (default: 1)
        - per_page: Comments per page (default: 20)
    
    Returns:
        JSON with comments list and pagination info
    """
    try:
        page = request.args.get('page', 1, type=int)
        post_id = request.args.get('post_id', None, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Validate pagination inputs
        if page < 1:
            page = 1
        if per_page < 1 or per_page > 100:
            per_page = 20
        
        # Build query
        query = Comment.query
        
        # Filter by post_id if provided
        if post_id:
            # Verify post exists
            post = Post.query.get(post_id)
            if not post:
                return jsonify({'success': False, 'error': 'Post not found'}), 404
            query = query.filter(Comment.post_id == post_id)
        
        # Order by created_at descending (newest first)
        query = query.order_by(Comment.created_at.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        comments = [comment.to_dict() for comment in pagination.items]
        
        return jsonify({
            'success': True,
            'data': comments,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@comments_bp.route('/post/<int:post_id>', methods=['GET'])
def get_comments_for_post(post_id):
    """
    Get all comments for a specific post.
    
    Args:
        post_id: ID of the post
    
    Query Parameters:
        - page: Page number (default: 1)
        - per_page: Comments per page (default: 20)
    
    Returns:
        JSON with comments for the post
    """
    try:
        # Verify post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'success': False, 'error': 'Post not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Validate pagination inputs
        if page < 1:
            page = 1
        if per_page < 1 or per_page > 100:
            per_page = 20
        
        # Get comments for post
        pagination = Comment.query.filter(
            Comment.post_id == post_id
        ).order_by(Comment.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        comments = [comment.to_dict() for comment in pagination.items]
        
        return jsonify({
            'success': True,
            'data': comments,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@comments_bp.route('', methods=['POST'])
def create_comment():
    """
    Create a new comment on a post.
    
    Request JSON:
        - post_id: ID of the post (required)
        - author: Comment author name (required, max 100 chars)
        - content: Comment content (required)
        - rating: Rating from 1-5 stars (optional)
    
    Returns:
        JSON with created comment
    """
    try:
        data = request.get_json()
        
        # Validation
        if not data:
            return jsonify({'success': False, 'error': 'Request body is required'}), 400
        
        post_id = data.get('post_id')
        author = data.get('author', '').strip()
        content = data.get('content', '').strip()
        rating = data.get('rating')
        
        # Validate required fields
        if not post_id or not isinstance(post_id, int):
            return jsonify({'success': False, 'error': 'post_id is required and must be an integer'}), 400
        
        if not author or not content:
            return jsonify({'success': False, 'error': 'Author and content are required'}), 400
        
        if len(author) > 100:
            return jsonify({'success': False, 'error': 'Author must be max 100 characters'}), 400
        
        # Validate rating if provided
        if rating is not None:
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return jsonify({'success': False, 'error': 'Rating must be an integer between 1 and 5'}), 400
        
        # Verify post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'success': False, 'error': 'Post not found'}), 404
        
        # Create comment
        comment = Comment(
            post_id=post_id,
            author=author,
            content=content,
            rating=rating
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Comment created successfully',
            'data': comment.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@comments_bp.route('/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    """
    Update an existing comment.
    
    Args:
        comment_id: ID of the comment to update
    
    Request JSON:
        - author: Comment author name (optional)
        - content: Comment content (optional)
        - rating: Rating from 1-5 stars (optional)
    
    Returns:
        JSON with updated comment
    """
    try:
        comment = Comment.query.get(comment_id)
        
        if not comment:
            return jsonify({'success': False, 'error': 'Comment not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'Request body is required'}), 400
        
        # Update fields if provided
        if 'author' in data:
            author = data['author'].strip()
            if not author:
                return jsonify({'success': False, 'error': 'Author cannot be empty'}), 400
            if len(author) > 100:
                return jsonify({'success': False, 'error': 'Author must be max 100 characters'}), 400
            comment.author = author
        
        if 'content' in data:
            content = data['content'].strip()
            if not content:
                return jsonify({'success': False, 'error': 'Content cannot be empty'}), 400
            comment.content = content
        
        if 'rating' in data:
            rating = data['rating']
            if rating is not None:
                if not isinstance(rating, int) or rating < 1 or rating > 5:
                    return jsonify({'success': False, 'error': 'Rating must be an integer between 1 and 5'}), 400
            comment.rating = rating
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Comment updated successfully',
            'data': comment.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@comments_bp.route('/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    """
    Delete a comment.
    
    Args:
        comment_id: ID of the comment to delete
    
    Returns:
        JSON with success message
    """
    try:
        comment = Comment.query.get(comment_id)
        
        if not comment:
            return jsonify({'success': False, 'error': 'Comment not found'}), 404
        
        post_id = comment.post_id
        
        db.session.delete(comment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Comment deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
