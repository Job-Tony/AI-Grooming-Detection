from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.upload import router as upload_router
from app.api.routes.ai import router as ai_router
from app.api.routes.analysis import router as analysis_router
from app.api.routes.health import router as health_router
from app.api.routes.incidents import router as incidents_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(upload_router)
api_router.include_router(ai_router)
api_router.include_router(analysis_router)
api_router.include_router(incidents_router)