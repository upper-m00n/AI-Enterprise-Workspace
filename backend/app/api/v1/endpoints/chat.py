from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.chat import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse
)
from app.services.rag import retrieve_relevant_chunks, generate_rag_response

router = APIRouter()

@router.post("/", response_model=ConversationResponse)
def create_conversation(
    conv_in: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Conversation:
    conv = Conversation(
        title=conv_in.title or "New Chat",
        user_id=current_user.id
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

@router.get("/", response_model=List[ConversationResponse])
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> List[Conversation]:
    return db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.created_at.desc()).all()

@router.get("/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Conversation:
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv

@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(conv)
    db.commit()
    return {"message": "Conversation deleted successfully"}

@router.post("/{conversation_id}/messages", response_model=MessageResponse)
def create_message(
    conversation_id: UUID,
    msg_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Message:
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # 1. Save User Message
    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        content=msg_in.content
    )
    db.add(user_msg)
    db.commit()

    # Update conversation title if it's the first message
    if conv.title == "New Chat":
        conv.title = msg_in.content[:40] + ("..." if len(msg_in.content) > 40 else "")
        db.add(conv)
        db.commit()

    # 2. Get past chat history
    past_messages = db.query(Message).filter(
        Message.conversation_id == conv.id
    ).order_by(Message.created_at.asc()).all()
    
    chat_history = []
    # format past messages for the RAG engine (excluding the message we just saved)
    for m in past_messages[:-1]:
        chat_history.append({"role": m.role, "content": m.content})

    # 3. Retrieve relevant chunks
    chunks = retrieve_relevant_chunks(db, current_user.id, msg_in.content)

    # 4. Generate RAG Synthesis response from Groq
    answer, citations = generate_rag_response(msg_in.content, chunks, chat_history)

    # 5. Save Assistant Message with citations
    assistant_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=answer,
        citations=citations
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg
