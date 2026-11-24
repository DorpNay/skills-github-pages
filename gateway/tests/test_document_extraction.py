import asyncio
import io
import zipfile

import httpx
import pytest
from fastapi.testclient import TestClient
from pypdf import PdfWriter
from pypdf.errors import LimitReachedError

from gateway.app import Settings, create_app

API_KEY = "d" * 64
AUTH = {"Authorization": f"Bearer {API_KEY}"}


def config(**overrides):
    values = dict(
        api_key=API_KEY,
        ollama_base_url="http://ollama.test:11434",
        allowed_models=("qwen3.5:4b",),
        cors_origins=("https://dorpnay.github.io",),
        cache_enabled=False,
        document_extraction_enabled=False,
    )
    values.update(overrides)
    return Settings(**values)


def client(settings):
    def upstream(request):
        if request.url.path == "/api/tags":
            return httpx.Response(200, json={"models": []})
        raise AssertionError(f"Unexpected upstream request: {request.url}")
    return TestClient(create_app(settings, transport=httpx.MockTransport(upstream)))


def zip_bytes(files):
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        for name, value in files.items():
            archive.writestr(name, value)
    return buffer.getvalue()


def pdf_bytes(text="PDF evidence"):
    writer = PdfWriter()
    page = writer.add_blank_page(width=300, height=300)
    from pypdf.generic import (
        DecodedStreamObject, DictionaryObject, NameObject,
    )
    font = DictionaryObject({
        NameObject("/Type"): NameObject("/Font"),
        NameObject("/Subtype"): NameObject("/Type1"),
        NameObject("/BaseFont"): NameObject("/Helvetica"),
    })
    page[NameObject("/Resources")] = DictionaryObject({
        NameObject("/Font"): DictionaryObject({NameObject("/F1"): font}),
    })
    stream = DecodedStreamObject()
    safe_text = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
    stream.set_data(f"BT /F1 12 Tf 10 200 Td ({safe_text}) Tj ET".encode("ascii"))
    page[NameObject("/Contents")] = stream
    buffer = io.BytesIO()
    writer.write(buffer)
    return buffer.getvalue()


def test_capabilities_require_auth_and_only_report_enabled_flags():
    settings = config(document_extraction_enabled=True, audio_transcription_enabled=True,
                      audio_speech_enabled=False, searxng_enabled=False)
    with client(settings) as app:
        assert app.get("/v1/capabilities").status_code == 401
        response = app.get("/v1/capabilities", headers=AUTH)
    assert response.status_code == 200
    assert response.headers["cache-control"] == "no-store"
    payload = response.json()
    assert {key: value for key, value in payload.items() if key != "documents"} == {
        "search": {"searxng": False},
        "audio": {"transcription": True, "speech": False, "speech_voices": []},
        "connectors": {"github_app": False},
        "rag": {"enabled": False, "evidence_ledger": False},
        "agent_runs": {"enabled": False, "worker_concurrency": 1, "tools_enabled": False},
    }
    assert payload["documents"]["extraction"] is True
    assert payload["documents"]["format_capabilities"]
    assert payload["documents"]["conversion"]["status"] == "unavailable"


    with client(config()) as app:
        assert app.post("/v1/documents/extract?filename=notes.txt", content=b"hello").status_code == 401
        response = app.post("/v1/documents/extract?filename=notes.txt", content=b"hello", headers=AUTH)
        assert response.status_code == 503


def test_extracts_utf8_text_and_marks_content_as_non_cached():
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post("/v1/documents/extract?filename=notes.md", content="Привет, aLandi".encode(),
                            headers={**AUTH, "Content-Type": "application/octet-stream"})
    assert response.status_code == 200, response.text
    assert response.headers["cache-control"] == "no-store"
    assert response.json()["text"] == "Привет, aLandi"
    assert response.json()["parser"] == "local-utf8"


def test_extracts_pdf_text_and_rejects_invalid_or_encrypted_pdf():
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post("/v1/documents/extract?filename=paper.pdf", content=pdf_bytes(), headers=AUTH)
        invalid = app.post("/v1/documents/extract?filename=paper.pdf", content=b"not a pdf", headers=AUTH)
    assert response.status_code == 200, response.text
    assert "PDF evidence" in response.json()["text"]
    assert response.json()["parser"] == "local-pypdf"
    assert invalid.status_code == 400


def test_pdf_parser_safety_limit_returns_413(monkeypatch):
    import gateway.app as gateway_app

    class LimitedPage:
        def extract_text(self):
            raise LimitReachedError("test parser safety limit")

    class LimitedReader:
        is_encrypted = False
        pages = [LimitedPage()]

    monkeypatch.setattr(gateway_app, "PdfReader", lambda *_args, **_kwargs: LimitedReader())
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post(
            "/v1/documents/extract?filename=limited.pdf",
            content=pdf_bytes(),
            headers=AUTH,
        )
    assert response.status_code == 413
    assert response.json()["detail"] == "PDF exceeds a parser safety limit"


def test_document_parser_runs_outside_event_loop_thread(monkeypatch):
    import gateway.app as gateway_app

    def parser(_filename, _data, _max_chars):
        with pytest.raises(RuntimeError, match="no running event loop"):
            asyncio.get_running_loop()
        return "worker-thread extraction", "test-worker"

    monkeypatch.setattr(gateway_app, "extract_local_document", parser)
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post(
            "/v1/documents/extract?filename=notes.txt",
            content=b"document",
            headers=AUTH,
        )
    assert response.status_code == 200, response.text
    assert response.json()["text"] == "worker-thread extraction"
    assert response.json()["parser"] == "test-worker"


def test_extracts_docx_paragraphs_without_unzipping_to_disk():
    body = zip_bytes({
        "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>',
        "word/document.xml": (
            '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            '<w:body><w:p><w:r><w:t>First paragraph</w:t></w:r></w:p>'
            '<w:p><w:r><w:t>Second paragraph</w:t></w:r></w:p></w:body></w:document>'
        ),
    })
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post("/v1/documents/extract?filename=brief.docx", content=body, headers=AUTH)
    assert response.status_code == 200, response.text
    assert response.json()["text"] == "First paragraph\nSecond paragraph"
    assert response.json()["parser"] == "local-docx-xml"


def test_extracts_xlsx_cells_and_sheet_names():
    body = zip_bytes({
        "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>',
        "xl/workbook.xml": (
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            '<sheets><sheet name="Budget" sheetId="1" r:id="rId1"/></sheets></workbook>'
        ),
        "xl/_rels/workbook.xml.rels": (
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="worksheet" Target="worksheets/sheet1.xml"/>'
            '</Relationships>'
        ),
        "xl/worksheets/sheet1.xml": (
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'
            '<row r="1"><c r="A1" t="inlineStr"><is><t>Revenue</t></is></c>'
            '<c r="B1"><v>42</v></c></row></sheetData></worksheet>'
        ),
    })
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post("/v1/documents/extract?filename=budget.xlsx", content=body, headers=AUTH)
    assert response.status_code == 200, response.text
    assert "[Sheet: Budget]" in response.json()["text"]
    assert "A1=Revenue" in response.json()["text"]
    assert "B1=42" in response.json()["text"]


@pytest.mark.parametrize("filename,body,expected", [
    ("../../secret.txt", b"secret", 400),
    ("image.png", b"image", 415),
    ("notes.txt", b"\xff\xfe", 415),
    ("empty.txt", b"", 400),
])
def test_rejects_unsafe_names_unsupported_types_and_invalid_text(filename, body, expected):
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post("/v1/documents/extract", params={"filename": filename}, content=body, headers=AUTH)
    assert response.status_code == expected


def test_rejects_oversized_body_and_archive_with_unsafe_path():
    with client(config(document_extraction_enabled=True, document_extraction_max_bytes=1024)) as app:
        oversized = app.post("/v1/documents/extract?filename=large.txt", content=b"x" * 1025, headers=AUTH)
        unsafe_archive = zip_bytes({
            "[Content_Types].xml": "<Types/>",
            "../outside": "should not be read",
            "word/document.xml": "<document/>",
        })
        unsafe = app.post("/v1/documents/extract?filename=unsafe.docx", content=unsafe_archive, headers=AUTH)
    assert oversized.status_code == 413
    assert unsafe.status_code == 400


def test_truncates_output_to_configured_character_limit():
    with client(config(document_extraction_enabled=True, document_extraction_max_chars=1000)) as app:
        response = app.post("/v1/documents/extract?filename=notes.txt", content=b"a" * 1200, headers=AUTH)
    assert response.status_code == 200
    assert response.json()["characters"] == 1000
    assert len(response.json()["text"]) == 1000
    with client(config()) as app:
        assert app.post("/v1/documents/extract?filename=notes.txt", content=b"hello").status_code == 401
        response = app.post("/v1/documents/extract?filename=notes.txt", content=b"hello", headers=AUTH)
        assert response.status_code == 503

@pytest.mark.parametrize("xml", [
    (
        '<!DOCTYPE w:document [<!ENTITY injected "expanded text">]>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        '<w:body><w:p><w:r><w:t>&injected;</w:t></w:r></w:p></w:body></w:document>'
    ),
    (
        '<!DOCTYPE w:document SYSTEM "file:///etc/passwd">'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        '<w:body/></w:document>'
    ),
])
def test_rejects_docx_doctype_and_entity_declarations(xml):
    body = zip_bytes({
        "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>',
        "word/document.xml": xml,
    })
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post("/v1/documents/extract?filename=hostile.docx", content=body, headers=AUTH)
    assert response.status_code == 400

def test_rejects_duplicate_zip_entry_names():
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')
        archive.writestr("word/document.xml", "<document><safe/></document>")
        archive.writestr("word/document.xml", "<!DOCTYPE document><document/>")

    with client(config(document_extraction_enabled=True)) as app:
        response = app.post(
            "/v1/documents/extract?filename=duplicate.docx",
            content=buffer.getvalue(),
            headers=AUTH,
        )
    assert response.status_code == 400
    assert response.json()["detail"] == "Document archive contains duplicate entry names"


def test_document_capabilities_expose_verified_extraction_edges_and_unavailable_paths():
    with client(config(document_extraction_enabled=True)) as app:
        response = app.get("/v1/capabilities", headers=AUTH)

    assert response.status_code == 200
    documents = response.json()["documents"]
    assert documents["extraction"] is True
    formats = {item["id"]: item for item in documents["format_capabilities"]}

    expected = {
        "extract.txt": ("text/plain", ".txt", "local-utf8"),
        "extract.md": ("text/markdown", ".md", "local-utf8"),
        "extract.csv": ("text/csv", ".csv", "local-utf8"),
        "extract.json": ("application/json", ".json", "local-utf8"),
        "extract.pdf": ("application/pdf", ".pdf", "local-pypdf"),
        "extract.docx": (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".docx",
            "local-docx-xml",
        ),
        "extract.xlsx": (
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".xlsx",
            "local-xlsx-xml",
        ),
    }
    for capability_id, (input_format, extension, parser_id) in expected.items():
        item = formats[capability_id]
        assert item["operation"] == "model_facing_extraction"
        assert item["input_format"] == input_format
        assert item["output_format"] == "text/plain; charset=utf-8"
        assert item["extensions"] == [extension]
        assert item["parser_id"] == parser_id
        assert item["status"] == "available"
        assert item["available"] is True
        assert item["engine"]
        assert item["engine_version"]
        assert item["engine_license"]
        assert item["engine_license_url"].startswith("https://")
        assert item["engine_source_urls"]
        assert all(url.startswith("https://") for url in item["engine_source_urls"])
        assert item["fidelity"]
        assert isinstance(item["limits"], dict)
        assert item["limits"]["max_input_bytes"] == 8 * 1024 * 1024
        assert item["limits"]["max_output_characters"] == 80_000

    assert formats["extract.pdf"]["engine"] == "pypdf"
    assert formats["extract.pdf"]["engine_license"] == "BSD-3-Clause"
    assert formats["extract.pdf"]["limits"]["max_pages"] == 40
    assert formats["extract.docx"]["engine_license"] == "PSF-2.0"
    assert formats["extract.docx"]["limits"]["max_archive_entries"] == 500
    assert formats["extract.xlsx"]["limits"]["max_sheets"] == 20

    unavailable_ids = {
        "extract.html",
        "extract.epub",
        "extract.image_metadata",
        "extract.url_capture",
        "extract.image_ocr",
        "extract.audio_metadata",
        "extract.video_metadata",
        "extract.scanned_pdf_ocr",
    }
    for capability_id in unavailable_ids:
        item = formats[capability_id]
        assert item["available"] is False
        assert item["status"] == "unavailable"
        assert item["unavailable_reason"]

    conversion = documents["conversion"]
    assert conversion["available"] is False
    assert conversion["status"] == "unavailable"
    assert "artifact" in conversion["unavailable_reason"].lower()
    assert "extraction" in conversion["unavailable_reason"].lower()


def test_document_capabilities_report_disabled_extraction_without_hiding_format_contracts():
    with client(config(document_extraction_enabled=False)) as app:
        response = app.get("/v1/capabilities", headers=AUTH)

    assert response.status_code == 200
    documents = response.json()["documents"]
    assert documents["extraction"] is False
    formats = {item["id"]: item for item in documents["format_capabilities"]}
    assert formats["extract.pdf"]["available"] is True
    assert formats["extract.pdf"]["status"] == "disabled"
    assert "disabled" in formats["extract.pdf"]["unavailable_reason"].lower()
    assert formats["extract.epub"]["status"] == "unavailable"


def test_document_extraction_response_includes_adapter_provenance_without_changing_parser_id():
    with client(config(document_extraction_enabled=True)) as app:
        response = app.post(
            "/v1/documents/extract?filename=notes.md",
            content=b"# Source note\n",
            headers=AUTH,
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["text"] == "# Source note"
    assert payload["parser"] == "local-utf8"
    assert payload["format_capability"]["id"] == "extract.md"
    assert payload["format_capability"]["input_format"] == "text/markdown"
    assert payload["format_capability"]["output_format"] == "text/plain; charset=utf-8"
    assert payload["format_capability"]["engine_license"] == "PSF-2.0"
    assert payload["format_capability"]["status"] == "available"


def test_unavailable_document_extensions_fail_with_the_registry_reason():
    with client(config(document_extraction_enabled=True)) as app:
        for filename in ("page.html", "book.epub", "photo.png", "clip.mp4"):
            response = app.post(
                f"/v1/documents/extract?filename={filename}",
                content=b"not-a-supported-extraction-format",
                headers=AUTH,
            )
            assert response.status_code == 415
            assert response.json()["detail"]
