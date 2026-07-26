from app.models.practice import Topic, LearningResource

async def seed_initial_data():
    existing_topics = await Topic.find_all().to_list()
    if not existing_topics:
        topics = [
            Topic(name="Python Fundamentals", slug="python-fundamentals", description="Core Python syntax, data structures, and functions", domain="programming"),
            Topic(name="System Design", slug="system-design", description="Scalable architecture, caching, microservices, and databases", domain="interview"),
            Topic(name="Data Structures & Algorithms", slug="dsa", description="Arrays, Trees, Graphs, Sorting, and Dynamic Programming", domain="programming"),
            Topic(name="Behavioral Interviewing", slug="behavioral-interviews", description="STAR method, leadership principles, conflict resolution", domain="interview"),
        ]
        for topic in topics:
            await topic.insert()
        
        # Add sample learning resources
        python_topic = await Topic.find_one(Topic.slug == "python-fundamentals")
        if python_topic:
            resources = [
                LearningResource(
                    title="Official Python Tutorial",
                    url="https://docs.python.org/3/tutorial/",
                    description="Official Python 3 tutorial covering syntax, control flows, and standard libraries.",
                    topic_id=str(python_topic.id),
                    difficulty="easy",
                    tags=["python", "basics", "official-docs"]
                ),
                LearningResource(
                    title="Real Python: Python Data Structures",
                    url="https://realpython.com/python-data-structures/",
                    description="In-depth guide to built-in data structures in Python.",
                    topic_id=str(python_topic.id),
                    difficulty="medium",
                    tags=["python", "data-structures"]
                )
            ]
            for r in resources:
                await r.insert()
