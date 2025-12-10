# Blogsite Application

A full-stack blog application with Next.js frontend and Flask backend.

## Tech Stack

### Frontend

-  **Framework:** TypeScript, Next.js (App Router)
-  **Styling:** Tailwind CSS, shadcn/ui
-  **Animation:** Motion (Framer Motion) or GSAP
-  **State Management:** React Query or SWR

### Backend

-  **Language:** Python
-  **Framework:** Flask
-  **ORM:** SQLAlchemy
-  **Caching:** Redis
-  **Database:** PostgreSQL

## Project Structure

```
exam-1-blogsite/
├── client/                 # Next.js Frontend
│   ├── app/               # Next.js App Router
│   ├── public/            # Static assets
│   └── ...
└── server/                # Flask Backend
    ├── routes/            # API route handlers
    ├── utils/             # Utility functions
    ├── migrations/        # Database migrations
    ├── models.py          # SQLAlchemy models
    ├── config.py          # Configuration
    ├── app.py             # Flask application
    └── requirements.txt   # Python dependencies
```

## Getting Started

### Prerequisites

-  Python 3.10+
-  Node.js 18+
-  PostgreSQL 14+
-  Redis 7+

### Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Create virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis credentials
   ```

5. **Start PostgreSQL and Redis:**

   -  Ensure PostgreSQL is running on port 5432
   -  Ensure Redis is running on port 6379

6. **Initialize database:**

   ```bash
   # Create database
   createdb blogsite_db

   # Run migrations
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

7. **Seed database (optional):**

   ```bash
   python seed.py
   ```

8. **Run the Flask server:**

   ```bash
   python app.py
   # Or use Flask CLI
   flask run
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## API Endpoints

### Posts

-  `GET /api/posts` - Get all posts (with pagination & search)
-  `GET /api/posts/:id` - Get single post
-  `POST /api/posts` - Create new post
-  `PUT /api/posts/:id` - Update post
-  `DELETE /api/posts/:id` - Delete post

### Comments

-  `GET /api/comments` - Get all comments
-  `GET /api/comments/post/:postId` - Get comments for a post
-  `POST /api/comments` - Add new comment
-  `PUT /api/comments/:id` - Update comment
-  `DELETE /api/comments/:id` - Delete comment

## Database Models

### Post

-  `id` (Integer, Primary Key)
-  `title` (String, 200 chars)
-  `content` (Text)
-  `author` (String, 100 chars)
-  `created_at` (DateTime)
-  `updated_at` (DateTime)
-  `comments` (Relationship to Comment)

### Comment

-  `id` (Integer, Primary Key)
-  `post_id` (Foreign Key to Post)
-  `author` (String, 100 chars)
-  `content` (Text)
-  `rating` (Integer, 1-5 stars, optional)
-  `created_at` (DateTime)
-  `updated_at` (DateTime)

## Features

### Backend

-  ✅ RESTful API with Flask
-  ✅ PostgreSQL with SQLAlchemy ORM
-  ✅ Redis caching for posts and comments
-  ✅ Database migrations with Flask-Migrate
-  ✅ Input validation and error handling
-  ✅ CORS configuration

### Frontend

-  Blog post listing with grid layout
-  Single post view
-  Create/Edit post forms
-  Server-side search and pagination
-  Comment section with ratings
-  Responsive design with Tailwind CSS

## Development

### Running Tests

```bash
# Backend tests
cd server
pytest

# Frontend tests
cd client
npm test
```

### Database Migrations

```bash
cd server
flask db migrate -m "Description of changes"
flask db upgrade
```

## License

MIT
