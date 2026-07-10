from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.exceptions.handlers import register_exception_handlers

from app.api.router import api_router
from app.config.logging_config import logger
from app.config.settings import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-assisted moderation platform using NLP and Explainable Deep Learning",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
    }


logger.info("Application initialized successfully.")