import time
import uuid
from contextlib import asynccontextmanager
import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.errors import StudyForgeException, studyforge_exception_handler
from app.db.mongodb import init_db, close_db
from app.db.seed import seed_initial_data
from app.api.router import api_router
from app.api.routes.interview_ws import router as interview_ws_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info(f"Starting {settings.APP_NAME} in environment: {settings.APP_ENV}")
    await init_db()
    await seed_initial_data()
    yield
    await close_db()
    logger.info("Shutdown complete.")

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for request ID and timing log
@app.middleware("http")
async def add_request_metadata(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time-Ms"] = str(process_time)
    return response

# Register Exception Handlers
app.add_exception_handler(StudyForgeException, studyforge_exception_handler)

# Include API Router & WebSocket Router
app.include_router(api_router, prefix="/api")
app.include_router(interview_ws_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": settings.APP_NAME, "env": settings.APP_ENV}

@app.get("/ready", tags=["Health"])
async def ready_check():
    return {"status": "ready", "database": "connected"}

# Serve frontend static files
frontend_dist = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))