"""
Database seeding script to populate initial data for development/testing.
"""

import sys
from datetime import datetime, timedelta
from app import create_app, db
from models import Post, Comment


def seed_data():
    """Seed the database with initial posts and comments."""
    
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        Comment.query.delete()
        Post.query.delete()
        db.session.commit()
        
        # Create sample posts
        print("Creating sample posts...")
        posts = [
            Post(
                title="Getting Started with Python Flask",
                content="""Flask is a lightweight WSGI web application framework in Python. 
                It's designed to make getting started quick and easy, with the ability to scale up to complex applications.
                
                Flask provides tools, libraries and technologies that allow you to build a web application. 
                This web application can be some web pages, a blog, a wiki or go as big as a web-based calendar application or a commercial website.
                
                Flask is part of the categories of the micro-framework. Micro-framework are normally framework with little to no dependencies to external libraries.""",
                author="John Smith",
                created_at=datetime.utcnow() - timedelta(days=5)
            ),
            Post(
                title="Understanding Next.js App Router",
                content="""The App Router is a new paradigm for building applications using React's latest features. 
                It introduces a new way to define routes using the file system, with support for layouts, nested routes, and loading states.
                
                Key features include:
                - Server Components by default
                - Streaming and Suspense
                - Data Fetching with async/await
                - Improved performance and user experience
                
                The App Router is built on top of React Server Components and provides a more intuitive developer experience.""",
                author="Jane Doe",
                created_at=datetime.utcnow() - timedelta(days=3)
            ),
            Post(
                title="PostgreSQL Best Practices",
                content="""PostgreSQL is a powerful, open source object-relational database system. 
                Here are some best practices for working with PostgreSQL:
                
                1. Use appropriate data types
                2. Index your queries properly
                3. Use EXPLAIN to analyze query performance
                4. Regular VACUUM and ANALYZE operations
                5. Monitor connection pooling
                6. Implement proper backup strategies
                
                Following these practices will help you build scalable and performant database applications.""",
                author="Mike Johnson",
                created_at=datetime.utcnow() - timedelta(days=2)
            ),
            Post(
                title="Redis Caching Strategies",
                content="""Redis is an in-memory data structure store used as a database, cache, and message broker.
                
                Common caching strategies:
                - Cache-Aside (Lazy Loading)
                - Write-Through Cache
                - Write-Behind Cache
                - Refresh-Ahead Cache
                
                Implementing Redis caching can significantly improve application performance by reducing database load and decreasing response times.
                Choose the right strategy based on your application's read/write patterns.""",
                author="Sarah Williams",
                created_at=datetime.utcnow() - timedelta(days=1)
            ),
            Post(
                title="Building RESTful APIs with Flask",
                content="""REST (Representational State Transfer) is an architectural style for designing networked applications.
                
                Key principles:
                - Use HTTP methods explicitly (GET, POST, PUT, DELETE)
                - Be stateless
                - Expose directory structure-like URIs
                - Transfer data in JSON or XML
                
                Flask makes it easy to build RESTful APIs with its simple routing system and request/response handling.
                Combined with Flask-RESTful or similar extensions, you can quickly build robust APIs.""",
                author="David Brown",
                created_at=datetime.utcnow() - timedelta(hours=12)
            ),
            Post(
                title="TypeScript Tips and Tricks",
                content="""TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
                
                Useful tips:
                - Use strict mode for better type safety
                - Leverage type inference
                - Create custom type guards
                - Use utility types (Partial, Pick, Omit, etc.)
                - Document your types with JSDoc comments
                
                TypeScript helps catch errors early in development and provides better IDE support with autocomplete and refactoring tools.""",
                author="Emily Davis",
                created_at=datetime.utcnow() - timedelta(hours=6)
            ),
            Post(
                title="Tailwind CSS: Utility-First Approach",
                content="""Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.
                
                Benefits:
                - Highly customizable
                - No naming conventions needed
                - Smaller production builds with PurgeCSS
                - Responsive design made easy
                - Consistent design system
                
                The utility-first approach allows you to build complex designs without leaving your HTML.""",
                author="Chris Wilson",
                created_at=datetime.utcnow() - timedelta(hours=3)
            ),
            Post(
                title="SQLAlchemy ORM Deep Dive",
                content="""SQLAlchemy is the Python SQL toolkit and Object Relational Mapper that gives developers the full power of SQL.
                
                Core concepts:
                - Declarative Base
                - Relationships (One-to-Many, Many-to-Many)
                - Session management
                - Query API
                - Migration with Alembic
                
                SQLAlchemy provides a Pythonic way to interact with your database while maintaining the flexibility to write raw SQL when needed.""",
                author="Anna Martinez",
                created_at=datetime.utcnow() - timedelta(hours=2)
            )
        ]
        
        db.session.add_all(posts)
        db.session.commit()
        print(f"Created {len(posts)} posts")
        
        # Create sample comments
        print("Creating sample comments...")
        comments = [
            # Comments for first post
            Comment(
                post_id=posts[0].id,
                author="Alice Thompson",
                content="Great introduction to Flask! Very helpful for beginners.",
                rating=5,
                created_at=datetime.utcnow() - timedelta(days=4, hours=12)
            ),
            Comment(
                post_id=posts[0].id,
                author="Bob Anderson",
                content="Could you provide more examples of routing?",
                rating=4,
                created_at=datetime.utcnow() - timedelta(days=4, hours=6)
            ),
            Comment(
                post_id=posts[0].id,
                author="Carol White",
                content="Flask is indeed easy to get started with. Thanks for sharing!",
                rating=5,
                created_at=datetime.utcnow() - timedelta(days=4, hours=2)
            ),
            
            # Comments for second post
            Comment(
                post_id=posts[1].id,
                author="David Lee",
                content="The App Router is a game-changer for Next.js development.",
                rating=5,
                created_at=datetime.utcnow() - timedelta(days=2, hours=18)
            ),
            Comment(
                post_id=posts[1].id,
                author="Emma Garcia",
                content="Still learning about Server Components. This helps a lot!",
                rating=4,
                created_at=datetime.utcnow() - timedelta(days=2, hours=12)
            ),
            
            # Comments for third post
            Comment(
                post_id=posts[2].id,
                author="Frank Miller",
                content="These PostgreSQL tips are gold! Especially the indexing part.",
                rating=5,
                created_at=datetime.utcnow() - timedelta(days=1, hours=20)
            ),
            Comment(
                post_id=posts[2].id,
                author="Grace Taylor",
                content="Would love to see more about connection pooling.",
                rating=4,
                created_at=datetime.utcnow() - timedelta(days=1, hours=16)
            ),
            Comment(
                post_id=posts[2].id,
                author="Henry Clark",
                content="Very comprehensive guide. Thank you!",
                rating=5,
                created_at=datetime.utcnow() - timedelta(days=1, hours=10)
            ),
            
            # Comments for fourth post
            Comment(
                post_id=posts[3].id,
                author="Ivy Rodriguez",
                content="Redis has transformed our application's performance!",
                rating=5,
                created_at=datetime.utcnow() - timedelta(hours=18)
            ),
            Comment(
                post_id=posts[3].id,
                author="Jack Martinez",
                content="Which caching strategy would you recommend for an e-commerce site?",
                rating=4,
                created_at=datetime.utcnow() - timedelta(hours=14)
            ),
            
            # Comments for fifth post
            Comment(
                post_id=posts[4].id,
                author="Kelly Harris",
                content="Clear explanation of REST principles. Well done!",
                rating=5,
                created_at=datetime.utcnow() - timedelta(hours=10)
            ),
            Comment(
                post_id=posts[4].id,
                author="Liam Young",
                content="Flask-RESTful makes API development so much easier.",
                rating=5,
                created_at=datetime.utcnow() - timedelta(hours=8)
            ),
            
            # Comments for sixth post
            Comment(
                post_id=posts[5].id,
                author="Mia Scott",
                content="TypeScript has really improved my code quality.",
                rating=5,
                created_at=datetime.utcnow() - timedelta(hours=5)
            ),
            
            # Comments for seventh post
            Comment(
                post_id=posts[6].id,
                author="Noah Green",
                content="Tailwind CSS is amazing! Never going back to traditional CSS.",
                rating=5,
                created_at=datetime.utcnow() - timedelta(hours=2, minutes=30)
            ),
            Comment(
                post_id=posts[6].id,
                author="Olivia King",
                content="The utility-first approach took some getting used to, but now I love it.",
                rating=4,
                created_at=datetime.utcnow() - timedelta(hours=2)
            ),
            
            # Comments for eighth post
            Comment(
                post_id=posts[7].id,
                author="Paul Wright",
                content="SQLAlchemy documentation can be overwhelming. This is helpful!",
                rating=4,
                created_at=datetime.utcnow() - timedelta(hours=1, minutes=30)
            ),
            Comment(
                post_id=posts[7].id,
                author="Quinn Adams",
                content="Great overview of ORM concepts.",
                rating=5,
                created_at=datetime.utcnow() - timedelta(hours=1)
            )
        ]
        
        db.session.add_all(comments)
        db.session.commit()
        print(f"Created {len(comments)} comments")
        
        print("\n✅ Database seeded successfully!")
        print(f"   Posts: {Post.query.count()}")
        print(f"   Comments: {Comment.query.count()}")


if __name__ == '__main__':
    try:
        seed_data()
    except Exception as e:
        print(f"\n❌ Error seeding database: {str(e)}")
        sys.exit(1)
