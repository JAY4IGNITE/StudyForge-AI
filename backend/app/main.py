import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.errors import StudyForgeException, studyforge_exception_handler
from app.db.mongodb import init_db, close_db
from app.db.seed import seed_initial_data
from app.api.router import api_router

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

# Include API Router
app.include_router(api_router, prefix="/api")

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": settings.APP_NAME, "env": settings.APP_ENV}

@app.get("/ready", tags=["Health"])
async def ready_check():
    return {"status": "ready", "database": "connected"}