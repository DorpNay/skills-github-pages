"""Exact source citation utilities. Offsets are Unicode code-point offsets into the normalized source text."""
from __future__ import annotations

import hashlib
from dataclasses import dataclass
from urllib.parse import urlsplit


class CitationError(ValueError):
    pass


@dataclass(frozen=True)
class Citation:
    document_id: str
    chunk_id: str
    source_uri: str
    source_sha256: str
    page_number: int | None
    section: str | None
    start_offset: int
    end_offset: int
    text_snippet: str


class CitationManager:
    def create(self, *, document_id: str, chunk_id: str, source_uri: str,
               source_text: str, start_offset: int, end_offset: int,
               page_number: int | None = None, section: str | None = None) -> Citation:
        if not isinstance(document_id, str) or not document_id or len(document_id) > 160:
            raise CitationError("document_id is required and bounded")
        if not isinstance(chunk_id, str) or not chunk_id or len(chunk_id) > 160:
            raise CitationError("chunk_id is required and bounded")
        parsed = urlsplit(source_uri) if isinstance(source_uri, str) else None
        if parsed is None or parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
            raise CitationError("citation source must be an HTTPS URL without embedded credentials")
        if parsed.query or parsed.fragment:
            raise CitationError("citation URL must not contain query parameters or fragments")
        if not isinstance(source_text, str) or len(source_text) > 5_000_000:
            raise CitationError("source_text must be bounded text")
        if (isinstance(start_offset, bool) or isinstance(end_offset, bool) or
                not isinstance(start_offset, int) or not isinstance(end_offset, int) or
                start_offset < 0 or end_offset <= start_offset or end_offset > len(source_text)):
            raise CitationError("citation offsets must be a valid non-empty source span")
        if page_number is not None and (isinstance(page_number, bool) or not isinstance(page_number, int) or page_number < 1):
            raise CitationError("page_number must be a positive integer")
        if section is not None and (not isinstance(section, str) or len(section) > 256):
            raise CitationError("section must be bounded text")
        snippet = source_text[start_offset:end_offset]
        if not snippet.strip():
            raise CitationError("citation span cannot contain only whitespace")
        return Citation(document_id, chunk_id, source_uri, hashlib.sha256(source_text.encode("utf-8")).hexdigest(),
                        page_number, section, start_offset, end_offset, snippet)

    @staticmethod
    def validate(citation: Citation, *, source_text: str) -> bool:
        if not isinstance(citation, Citation) or not isinstance(source_text, str):
            return False
        actual_hash = hashlib.sha256(source_text.encode("utf-8")).hexdigest()
        return (
            actual_hash == citation.source_sha256
            and 0 <= citation.start_offset < citation.end_offset <= len(source_text)
            and source_text[citation.start_offset:citation.end_offset] == citation.text_snippet
            and bool(citation.text_snippet.strip())
        )
