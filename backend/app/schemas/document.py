from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class DocumentBase(BaseModel):
    filename: str
    mime_type: str
    file_size: int

class DocumentResponse(DocumentBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DocumentChunkResponse(BaseModel):
    id: UUID
    document_id: UUID
    content: str

    model_config = ConfigDict(from_attributes=True)
