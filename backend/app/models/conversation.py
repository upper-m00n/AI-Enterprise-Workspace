from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID
from app.db.base import BaseModel

class Conversation(BaseModel):
    __tablename__ = "conversations"

    title: Mapped[str] = mapped_column(String(255), default="New Chat")
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
