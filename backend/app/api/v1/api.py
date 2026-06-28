from fastapi import APIRouter
from app.api.v1.endpoints import auth, documents, chat, search

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(chat.router, prefix="/conversations", tags=["conversations"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
