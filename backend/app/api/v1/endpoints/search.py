from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.schemas.chat import SearchResultResponse
from app.services.rag import retrieve_relevant_chunks

router = APIRouter()

@router.get("/", response_model=List[SearchResultResponse])
def semantic_search(
    q: str = Query(..., description="Query string for semantic search"),
    limit: int = Query(5, description="Number of results to retrieve"),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> List[dict]:
    if not q.strip():
        return []
    results = retrieve_relevant_chunks(db, current_user.id, q, limit=limit)
    return results
