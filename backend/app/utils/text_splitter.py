from typing import List

class SimpleTextSplitter:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[str]:
        if not text:
            return []
        
        chunks = []
        start = 0
        text_len = len(text)
        
        while start < text_len:
            end = start + self.chunk_size
            if end >= text_len:
                chunks.append(text[start:])
                break
            
            # Search backward from the window end for a logical separation boundary
            boundary = -1
            for separator in ["\n\n", "\n", ". ", " ", ""]:
                if not separator:
                    break
                pos = text.rfind(separator, start, end)
                # Ensure the boundary is not too close to the beginning of the chunk
                if pos != -1 and pos > start + self.chunk_overlap:
                    boundary = pos + len(separator)
                    break
            
            if boundary != -1:
                chunks.append(text[start:boundary].strip())
                start = boundary - self.chunk_overlap
            else:
                chunks.append(text[start:end])
                start = end - self.chunk_overlap
                
        return [c for c in chunks if c.strip()]
