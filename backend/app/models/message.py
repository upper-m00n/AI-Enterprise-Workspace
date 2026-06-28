from sqlalchemy import String, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID
from app.db.base import BaseModel

class Message(BaseModel):
    __tablename__ = "messages"

    conversation_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("conversations.id", ondelete="CASCADE"), 
        nullable=False
    )
    role: Mapped[str] = mapped_column(String(50), nullable=False) # 'user' or 'assistant'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    citations: Mapped[dict | list] = mapped_column(JSON, nullable=True) # list of citation info: {filename, content, similarity}

    conversation = relationship("Conversation", back_populates="messages")
