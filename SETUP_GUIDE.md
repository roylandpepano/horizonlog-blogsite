# 🚀 Blogsite Application - Complete Setup Guide

## 📋 Overview

A full-stack blogging platform built with:

-  **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Query, Framer Motion
-  **Backend**: Flask, SQLAlchemy, PostgreSQL, Redis
-  **Features**: CRUD operations, pagination, search, comments with ratings (1-5 stars), caching

---

## 📦 Prerequisites

Ensure you have the following installed:

-  **Node.js** 18+ and npm
-  **Python** 3.10+
-  **PostgreSQL** 14+
-  **Redis** 7+

---

## 🔧 Backend Setup (Flask/Python)

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows (bash):**

```bash
source venv/Scripts/activate
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
POSTGRES_USER=bloguser
POSTGRES_PASSWORD=blogpassword
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=blogsite_db
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
CORS_ORIGINS=http://localhost:3000
```

### 6. Setup PostgreSQL Database

**Create database and user:**

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE blogsite_db;
CREATE USER bloguser WITH PASSWORD 'blogpassword';
GRANT ALL PRIVILEGES ON DATABASE blogsite_db TO bloguser;
\q
```

### 7. Run Database Migrations

```bash
flask db upgrade
```

### 8. Seed Database (Optional)

Populate with sample data:

```bash
python seed.py
```

### 9. Start Redis Server

Make sure Redis is running:

```bash
redis-server
```

### 10. Run Flask Application

```bash
python app.py
```

Backend will run at: **http://localhost:5000**

**API Endpoints:**

-  `GET /api/posts` - Get all posts (with pagination & search)
-  `GET /api/posts/:id` - Get single post
-  `POST /api/posts` - Create post
-  `PUT /api/posts/:id` - Update post
-  `DELETE /api/posts/:id` - Delete post
-  `GET /api/comments` - Get all comments
-  `GET /api/comments/post/:post_id` - Get comments for post
-  `POST /api/comments` - Create comment
-  `PUT /api/comments/:id` - Update comment
-  `DELETE /api/comments/:id` - Delete comment

---

## 🎨 Frontend Setup (Next.js/TypeScript)

### 1. Navigate to Client Directory

```bash
cd client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run Development Server

```bash
npm run dev
```

Frontend will run at: **http://localhost:3000**

---

## 🧪 Testing

### Backend Tests

```bash
cd server
pytest
```

### Frontend Build Test

```bash
cd client
npm run build
```

---

## 📁 Project Structure

```
exam-1-blogsite/
├── client/                          # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Homepage (posts grid)
│   │   ├── globals.css             # Global styles
│   │   └── posts/
│   │       ├── create/
│   │       │   └── page.tsx        # Create post page
│   │       └── [id]/
│   │           ├── page.tsx        # Single post view
│   │           └── edit/
│   │               └── page.tsx    # Edit post page
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── textarea.tsx
│   │   ├── PostCard.tsx            # Post card component
│   │   ├── PostForm.tsx            # Create/edit post form
│   │   └── CommentsSection.tsx     # Comments component
│   └── lib/
│       ├── api.ts                  # API client & types
│       ├── providers.tsx           # React Query provider
│       └── utils.ts                # Utility functions
│
└── server/                          # Flask Backend
    ├── app.py                       # Flask app entry point
    ├── config.py                    # Configuration
    ├── models.py                    # SQLAlchemy models
    ├── seed.py                      # Database seeding script
    ├── routes/
    │   ├── posts.py                # Posts API routes
    │   └── comments.py             # Comments API routes
    ├── migrations/                  # Alembic migrations
    └── tests/                       # Backend tests
```

---

## ✨ Key Features

### Backend Features

✅ RESTful API with Flask  
✅ SQLAlchemy ORM with PostgreSQL  
✅ Post & Comment models with One-to-Many relationship  
✅ Redis caching for posts list and comments  
✅ Pagination support  
✅ Full-text search on posts  
✅ Input validation & error handling  
✅ Database migrations with Alembic  
✅ CORS configuration

### Frontend Features

✅ Server-side rendering with Next.js 14 App Router  
✅ TypeScript for type safety  
✅ Responsive grid layout with Tailwind CSS  
✅ shadcn/ui components  
✅ React Query for data fetching & caching  
✅ Framer Motion animations  
✅ Search functionality with debouncing  
✅ Pagination UI  
✅ CRUD operations for posts  
✅ Comments with 1-5 star ratings  
✅ Real-time comment updates  
✅ Form validation

---

## 🔍 Usage Examples

### Creating a Post

1. Click "New Post" button on homepage
2. Fill in title, author, and content
3. Click "Create Post"

### Searching Posts

1. Enter search term in search bar
2. Results filter by title, content, or author

### Adding Comments

1. Open a post
2. Scroll to comments section
3. Fill in name, rating (1-5 stars), and comment
4. Click "Post Comment"

### Editing/Deleting

-  Each post has Edit and Delete buttons
-  Each comment has Edit and Delete buttons

---

## 🛠️ Troubleshooting

### Database Connection Error

-  Ensure PostgreSQL is running
-  Verify database credentials in `.env`
-  Check database exists: `psql -U postgres -l`

### Redis Connection Error

-  Ensure Redis server is running: `redis-cli ping`
-  Should return `PONG`

### CORS Errors

-  Verify `CORS_ORIGINS` in backend `.env`
-  Should include frontend URL

### Module Not Found (Frontend)

-  Run `npm install` in client directory
-  Clear `.next` cache: `rm -rf .next`

### Import Errors (Backend)

-  Ensure virtual environment is activated
-  Reinstall dependencies: `pip install -r requirements.txt`

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable          | Description         | Default               |
| ----------------- | ------------------- | --------------------- |
| FLASK_ENV         | Flask environment   | development           |
| SECRET_KEY        | Flask secret key    | -                     |
| POSTGRES_USER     | PostgreSQL username | bloguser              |
| POSTGRES_PASSWORD | PostgreSQL password | blogpassword          |
| POSTGRES_HOST     | PostgreSQL host     | localhost             |
| POSTGRES_PORT     | PostgreSQL port     | 5432                  |
| POSTGRES_DB       | PostgreSQL database | blogsite_db           |
| REDIS_HOST        | Redis host          | localhost             |
| REDIS_PORT        | Redis port          | 6379                  |
| REDIS_DB          | Redis database      | 0                     |
| CORS_ORIGINS      | Allowed origins     | http://localhost:3000 |

### Frontend (.env.local)

| Variable            | Description     | Default                   |
| ------------------- | --------------- | ------------------------- |
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:5000/api |

---

## 🚀 Production Deployment

### Backend

1. Set `FLASK_ENV=production`
2. Use strong `SECRET_KEY`
3. Configure production database
4. Use gunicorn: `gunicorn -w 4 -b 0.0.0.0:5000 app:app`
5. Setup Redis cluster or managed Redis

### Frontend

1. Build: `npm run build`
2. Start: `npm start`
3. Or deploy to Vercel/Netlify

---

## 📄 License

This project is for educational/technical exam purposes.

---

## 🤝 Support

For issues or questions, please check the troubleshooting section above.
