from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List, Optional, Any

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    citations: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"

class ConversationResponse(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

class SearchQuery(BaseModel):
    query: str
    limit: Optional[int] = 5

class SearchResultResponse(BaseModel):
    chunk_id: UUID
    document_id: UUID
    filename: str
    content: str
    similarity: float
