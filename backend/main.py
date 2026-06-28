from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
import os

app=FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

app.include_router(api_router, prefix="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return{
        "status":"Runnings",
        "app":settings.APP_NAME
    }
    
@app.get("/health")
def health():
    return {
        "status":"healthy"
    }

# For running with uvicorn directly
if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", settings.HOST)
    port = int(os.getenv("PORT", settings.PORT))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=settings.DEBUG
    )