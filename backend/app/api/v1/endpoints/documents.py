from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.document import Document, DocumentChunk
from app.schemas.document import DocumentResponse
from app.utils.text_splitter import SimpleTextSplitter
from app.embeddings.service import get_embeddings

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Document:
    allowed_types = ["text/plain", "text/markdown", "application/octet-stream"]
    ext = file.filename.split(".")[-1].lower() if file.filename else ""
    if file.content_type not in allowed_types and ext not in ["txt", "md"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only plain text (.txt) and markdown (.md) are supported."
        )

    try:
        content_bytes = await file.read()
        content = content_bytes.decode("utf-8")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read file content. Ensure it is UTF-8 encoded."
        )

    if not content.strip():
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    db_document = Document(
        filename=file.filename or "unknown.txt",
        mime_type=file.content_type or "text/plain",
        file_size=len(content_bytes),
        user_id=current_user.id
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)

    splitter = SimpleTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(content)

    if chunks:
        embeddings = get_embeddings(chunks)

        db_chunks = []
        for text, vector in zip(chunks, embeddings):
            chunk = DocumentChunk(
                document_id=db_document.id,
                content=text,
                embedding=vector
            )
            db_chunks.append(chunk)
        
        db.bulk_save_objects(db_chunks)
        db.commit()

    return db_document

@router.get("/", response_model=List[DocumentResponse])
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> List[Document]:
    return db.query(Document).filter(Document.user_id == current_user.id).all()

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Document:
    doc = db.query(Document).filter(
        Document.id == document_id, 
        Document.user_id == current_user.id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.delete("/{document_id}")
def delete_document(
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    doc = db.query(Document).filter(
        Document.id == document_id, 
        Document.user_id == current_user.id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(doc)
    db.commit()
    return {"message": "Document and associated chunks deleted successfully"}
