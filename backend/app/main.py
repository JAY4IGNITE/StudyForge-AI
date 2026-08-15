import time
import uuid
from contextlib import asynccontextmanager
import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.errors import StudyForgeException, studyforge_exception_handler
from app.db.database import engine
from app.api.router import api_router
from app.api.routes.interview_ws import router as interview_ws_router
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info(f"Starting {settings.APP_NAME} in environment: {settings.APP_ENV}")
    # Startup: SQLAlchemy engine is already initialized
    yield
    # Shutdown
    await engine.dispose()
    logger.info("Shutdown complete.")


app = FastAPI(
    title=settings.APP_NAME, lifespan=lifespan, docs_url="/docs", redoc_url="/redoc"
)

FastAPIInstrumentor.instrument_app(app)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", None)
    logger.error(f"Unhandled exception (Request ID: {request_id}): {exc!r}")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred.",
                "request_id": request_id,
            }
        },
    )


# Include API Router & WebSocket Router
app.include_router(api_router, prefix="/api")
app.include_router(interview_ws_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": settings.APP_NAME, "env": settings.APP_ENV}


@app.get("/ready", tags=["Health"])
async def ready_check():
    return {"status": "ready", "database": "connected"}


@app.get("/", include_in_schema=False)
async def root():
    from fastapi.responses import RedirectResponse

    return RedirectResponse(url="/docs")


# Serve frontend static files
frontend_dist = os.path.realpath(
    os.path.join(os.path.dirname(__file__), "../../frontend/dist")
)
if os.path.isdir(frontend_dist):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(frontend_dist, "assets")),
        name="assets",
    )
    index_path = os.path.join(frontend_dist, "index.html")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        # Resolve the requested path and make sure it can't escape frontend_dist
        # (defends against "../../etc/passwd" style traversal and against
        # full_path values that would otherwise make os.path.join return an
        # absolute path outside of frontend_dist).
        candidate = os.path.realpath(os.path.join(frontend_dist, full_path.lstrip("/")))
        if candidate == frontend_dist or candidate.startswith(frontend_dist + os.sep):
            if os.path.isfile(candidate):
                return FileResponse(candidate)
        return FileResponse(index_path)
