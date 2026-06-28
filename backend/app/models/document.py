from sqlalchemy import String, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from uuid import UUID
from app.db.base import BaseModel

class Document(BaseModel):
    __tablename__ = "documents"

    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(BaseModel):
    __tablename__ = "document_chunks"

    document_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("documents.id", ondelete="CASCADE"), 
        nullable=False
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    # Using 768 dimensions for Google's text-embedding-004
    embedding: Mapped[list[float]] = mapped_column(Vector(768), nullable=False)

    document = relationship("Document", back_populates="chunks")
