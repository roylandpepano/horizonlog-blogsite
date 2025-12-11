"""
Main Flask application entry point for the Blogsite API.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_caching import Cache
from config import config

# Import db from models (it's created there)
from models import db

# Initialize extensions
migrate = Migrate()
cache = Cache()


def create_app(config_name=None):
    """
    Application factory pattern for creating Flask app instances.
    
    Args:
        config_name: Configuration to use (development, production, testing)
        
    Returns:
        Configured Flask application instance
    """
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    # Use Redis for caching in Docker environment. `REDIS_URL` is defined
    # in `server/config.py` (can be overridden with env vars).
    cache.init_app(app, config={
        'CACHE_TYPE': 'RedisCache',
        'CACHE_REDIS_URL': app.config.get('REDIS_URL'),
        'CACHE_DEFAULT_TIMEOUT': app.config['CACHE_DEFAULT_TIMEOUT']
    })
    
    # Configure CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Import models (needed for migrations)
    from models import Post, Comment
    
    # Register blueprints
    from routes.posts import posts_bp
    from routes.comments import comments_bp
    
    app.register_blueprint(posts_bp, url_prefix='/api/posts')
    app.register_blueprint(comments_bp, url_prefix='/api/comments')
    
    # Root endpoint
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Blogsite API',
            'version': '1.0.0',
            'endpoints': {
                'posts': '/api/posts',
                'comments': '/api/comments'
            }
        })
    
    # Health check endpoint
    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy'}), 200
    
    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
