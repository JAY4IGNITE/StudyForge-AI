from fastapi import FastAPI

app = FastAPI(
    title="StudyForge AI",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {
        "message": "StudyForge AI Backend Running"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }