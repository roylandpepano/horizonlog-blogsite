"""
Database seeding script to populate initial data for development/testing.
"""

import sys
import random
from datetime import datetime, timedelta
from app import create_app, db
from models import Post, Comment


def _sample_title(topic, i):
    templates = [
        "A {topic} Story #{i}",
        "Reflections on {topic} — Part {i}",
        "Remembering {topic}: Tale {i}",
        "Lessons from {topic} #{i}",
    ]
    return random.choice(templates).format(topic=topic.title(), i=i)


def _sample_content(topic):
    sentences = {
        "life": [
            "I still remember the small moments that changed everything.",
            "Life has a way of teaching us lessons when we least expect them.",
            "This story is about choices, mistakes, and quiet victories.",
            "Growing up taught me to value time over things."
        ],
        "travel": [
            "The road taught me more than any book could.",
            "I found friends in strangers and stories in every corner.",
            "A single journey can reshape how you see the world.",
            "Maps only show places; memories show meaning."
        ],
        "environment": [
            "I learned to listen to the rivers and watch the forests breathe.",
            "The smallest acts of care can help fragile ecosystems recover.",
            "Our town rallied to protect a wetland that once seemed forgotten.",
            "Nature's patience is a lesson for modern life."
        ],
        "world": [
            "Across borders I found shared laughter and similar fears.",
            "A market in a foreign city felt like home for a moment.",
            "Stories around the world often rhyme even when words differ.",
            "Travel teaches humility in the best ways."
        ],
        "personal": [
            "This is a small, honest account of a day that mattered.",
            "I write this to remember who I used to be and who I am becoming.",
            "A personal mistake became an unexpected gift in hindsight.",
            "Living openly changed the way I relate to others."
        ]
    }
    chunk = sentences.get(topic, sentences["life"])
    return "\n\n".join(random.sample(chunk, k=min(len(chunk), random.randint(3, 4))))


def seed_data():
    app = create_app()

    with app.app_context():
        print("Clearing existing data...")
        Comment.query.delete()
        Post.query.delete()
        db.session.commit()

        random.seed(0)
        topics = ["life", "travel", "environment", "world", "personal"]
        authors = [
            "Ava", "Liam", "Noah", "Olivia", "Emma", "Mason", "Sophia", "Lucas",
            "Isabella", "Mia", "Ethan", "Amelia", "Harper", "James", "Charlotte"
        ]

        print("Creating 50 posts...")
        posts = []
        now = datetime.utcnow()
        for i in range(1, 51):
            topic = topics[(i - 1) % len(topics)]
            title = _sample_title(topic, i)
            content = _sample_content(topic)
            author = random.choice(authors) + " " + random.choice(["Smith", "Lee", "Garcia", "Brown", "Patel", "Nguyen"]) 
            created_at = now - timedelta(days=random.randint(0, 365), hours=random.randint(0, 23))
            post = Post(title=title, content=content, author=author, created_at=created_at)
            posts.append(post)

        db.session.add_all(posts)
        db.session.commit()
        print(f"Created {len(posts)} posts")

        positive = [
            "Wonderful story — this warmed my heart.",
            "Thank you for sharing this uplifting experience!",
            "This is inspiring; love the perspective.",
            "Such a positive read — made my day!",
            "Beautifully written and thoughtful."
        ]
        negative = [
            "I disagree with parts of this and found it frustrating.",
            "This felt a bit dismissive of the issues raised.",
            "Not convinced — the argument feels shallow.",
            "I expected more nuance; this missed the mark for me."
        ]
        neutral = [
            "Interesting read, thanks for posting.",
            "I appreciate the info — neutral thoughts.",
            "Good to know; I have mixed feelings.",
            "A factual account; nothing more to add."
        ]

        total_comments = 100
        pos_count = int(total_comments * 0.6)
        neg_count = int(total_comments * 0.2)
        neu_count = total_comments - pos_count - neg_count

        print(f"Creating {total_comments} comments ({pos_count} pos, {neg_count} neg, {neu_count} neu)...")

        comments = []
        names = [
            "Alex", "Sam", "Jordan", "Taylor", "Jamie", "Morgan", "Riley", "Casey",
            "Drew", "Quinn", "Reese", "Skyler", "Bailey", "Sydney", "Parker"
        ]

        def make_comment(post_id, sentiment_pool, rating_range):
            return Comment(
                post_id=post_id,
                author=random.choice(names) + " " + random.choice(["Hill", "Wong", "Khan", "Flores"]),
                content=random.choice(sentiment_pool),
                rating=random.randint(*rating_range),
                created_at=now - timedelta(days=random.randint(0, 365), hours=random.randint(0, 23))
            )

        for _ in range(pos_count):
            post = random.choice(posts)
            comments.append(make_comment(post.id, positive, (4, 5)))

        for _ in range(neg_count):
            post = random.choice(posts)
            comments.append(make_comment(post.id, negative, (1, 2)))

        for _ in range(neu_count):
            post = random.choice(posts)
            comments.append(make_comment(post.id, neutral, (3, 3)))

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
