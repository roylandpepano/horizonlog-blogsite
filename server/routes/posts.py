"""
API routes for Post operations.
Handles CRUD operations, pagination, search, and caching.
"""

from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from models import db, Post

posts_bp = Blueprint('posts', __name__)


@posts_bp.route('', methods=['GET'])
def get_all_posts():
    """
    Get all posts with pagination and search support.
    
    Query Parameters:
        - page: Page number (default: 1)
        - search: Search term for title/content/author (optional)
        - per_page: Posts per page (default: 10)
    
    Returns:
        JSON with posts list and pagination info
    """
    try:
        page = request.args.get('page', 1, type=int)
        search = request.args.get('search', '', type=str).strip()
        per_page = request.args.get('per_page', 10, type=int)
        
        # Validate pagination inputs
        if page < 1:
            page = 1
        if per_page < 1 or per_page > 100:
            per_page = 10
        
        # Build query
        query = Post.query
        
        # Apply search filter if provided
        if search:
            query = query.filter(
                or_(
                    Post.title.ilike(f'%{search}%'),
                    Post.content.ilike(f'%{search}%'),
                    Post.author.ilike(f'%{search}%')
                )
            )
        
        # Order by created_at descending (newest first)
        query = query.order_by(Post.created_at.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        posts = [post.to_dict() for post in pagination.items]
        
        return jsonify({
            'success': True,
            'data': posts,
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


@posts_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """
    Get a single post with all its comments.
    
    Args:
        post_id: ID of the post
    
    Returns:
        JSON with post and all comments
    """
    try:
        post = Post.query.get(post_id)
        
        if not post:
            return jsonify({'success': False, 'error': 'Post not found'}), 404
        
        return jsonify({
            'success': True,
            'data': post.to_dict(include_comments=True)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@posts_bp.route('', methods=['POST'])
def create_post():
    """
    Create a new blog post.
    
    Request JSON:
        - title: Post title (required, max 200 chars)
        - content: Post content (required)
        - author: Author name (required, max 100 chars)
    
    Returns:
        JSON with created post
    """
    try:
        data = request.get_json()
        
        # Validation
        if not data:
            return jsonify({'success': False, 'error': 'Request body is required'}), 400
        
        title = data.get('title', '').strip()
        content = data.get('content', '').strip()
        author = data.get('author', '').strip()
        
        if not title or not content or not author:
            return jsonify({'success': False, 'error': 'Title, content, and author are required'}), 400
        
        if len(title) > 200:
            return jsonify({'success': False, 'error': 'Title must be max 200 characters'}), 400
        
        if len(author) > 100:
            return jsonify({'success': False, 'error': 'Author must be max 100 characters'}), 400
        
        # Create post
        post = Post(
            title=title,
            content=content,
            author=author
        )
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Post created successfully',
            'data': post.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@posts_bp.route('/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    """
    Update an existing blog post.
    
    Args:
        post_id: ID of the post to update
    
    Request JSON:
        - title: Post title (optional)
        - content: Post content (optional)
        - author: Author name (optional)
    
    Returns:
        JSON with updated post
    """
    try:
        post = Post.query.get(post_id)
        
        if not post:
            return jsonify({'success': False, 'error': 'Post not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'Request body is required'}), 400
        
        # Update fields if provided
        if 'title' in data:
            title = data['title'].strip()
            if not title:
                return jsonify({'success': False, 'error': 'Title cannot be empty'}), 400
            if len(title) > 200:
                return jsonify({'success': False, 'error': 'Title must be max 200 characters'}), 400
            post.title = title
        
        if 'content' in data:
            content = data['content'].strip()
            if not content:
                return jsonify({'success': False, 'error': 'Content cannot be empty'}), 400
            post.content = content
        
        if 'author' in data:
            author = data['author'].strip()
            if not author:
                return jsonify({'success': False, 'error': 'Author cannot be empty'}), 400
            if len(author) > 100:
                return jsonify({'success': False, 'error': 'Author must be max 100 characters'}), 400
            post.author = author
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Post updated successfully',
            'data': post.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@posts_bp.route('/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    """
    Delete a blog post.
    
    Args:
        post_id: ID of the post to delete
    
    Returns:
        JSON with success message
    """
    try:
        post = Post.query.get(post_id)
        
        if not post:
            return jsonify({'success': False, 'error': 'Post not found'}), 404
        
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Post deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
