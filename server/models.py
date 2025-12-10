"""
Database models for the Blogsite application.
Includes Post and Comment models with One-to-Many relationship.
"""

from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

# Create db instance here - will be used by both models and app
db = SQLAlchemy()


class Post(db.Model):
    """
    Post model representing blog posts.
    
    Attributes:
        id: Primary key
        title: Post title (required, max 200 chars)
        content: Post content (required)
        author: Author name (required, max 100 chars)
        created_at: Timestamp when post was created
        updated_at: Timestamp when post was last updated
        comments: Relationship to Comment model (One-to-Many)
    """
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationship: One Post has Many Comments
    comments = db.relationship(
        'Comment',
        back_populates='post',
        cascade='all, delete-orphan',
        lazy='dynamic'
    )
    
    def to_dict(self, include_comments=False):
        """
        Convert Post object to dictionary for JSON serialization.
        
        Args:
            include_comments: Whether to include related comments
            
        Returns:
            Dictionary representation of Post
        """
        post_dict = {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'author': self.author,
            'created_at': self.created_at.replace(tzinfo=timezone.utc).isoformat() if self.created_at else None,
            'updated_at': self.updated_at.replace(tzinfo=timezone.utc).isoformat() if self.updated_at else None,
            'comment_count': self.comments.count()
        }
        
        if include_comments:
            post_dict['comments'] = [comment.to_dict() for comment in self.comments.all()]
        
        return post_dict
    
    def __repr__(self):
        return f"<Post(id={self.id}, title='{self.title}', author='{self.author}')>"


class Comment(db.Model):
    """
    Comment model representing comments on blog posts.
    
    Attributes:
        id: Primary key
        post_id: Foreign key to Post (required)
        author: Comment author name (required, max 100 chars)
        content: Comment content (required)
        rating: Rating from 1-5 stars (optional)
        created_at: Timestamp when comment was created
        updated_at: Timestamp when comment was last updated
        post: Relationship to Post model (Many-to-One)
    """
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id', ondelete='CASCADE'), nullable=False, index=True)
    author = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=True)  # 1-5 stars, optional
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationship: Many Comments belong to One Post
    post = db.relationship('Post', back_populates='comments')
    
    def to_dict(self, include_post=False):
        """
        Convert Comment object to dictionary for JSON serialization.
        
        Args:
            include_post: Whether to include related post information
            
        Returns:
            Dictionary representation of Comment
        """
        comment_dict = {
            'id': self.id,
            'post_id': self.post_id,
            'author': self.author,
            'content': self.content,
            'rating': self.rating,
            'created_at': self.created_at.replace(tzinfo=timezone.utc).isoformat() if self.created_at else None,
            'updated_at': self.updated_at.replace(tzinfo=timezone.utc).isoformat() if self.updated_at else None
        }
        
        if include_post:
            comment_dict['post'] = {
                'id': self.post.id,
                'title': self.post.title,
                'author': self.post.author
            }
        
        return comment_dict
    
    def __repr__(self):
        return f"<Comment(id={self.id}, post_id={self.post_id}, author='{self.author}', rating={self.rating})>"
