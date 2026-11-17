#!/usr/bin/env python3
"""Fast structural accessibility contract for the single public root client.

This is a heuristic source check, not a WCAG audit or a screen-reader test.
"""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "index.md"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
NON_LABEL_INPUT_TYPES = {"hidden", "button", "submit", "reset", "image"}
RUNTIME_LABEL_IDS = {
    "customSkillName",
    "customSkillInstructions",
    "customSkillOutput",
    "agentTeamCustomScenario",
    "agentCustomRoles",
    "cloudBaseUrl",
    "cloudModel",
    "cloudApiKey",
}


class Node:
    def __init__(self, tag: str, attrs: dict[str, str | None], parent: "Node | None") -> None:
        self.tag = tag
        self.attrs = attrs
        self.parent = parent
        self.text: list[str] = []

    @property
    def text_content(self) -> str:
        return " ".join(" ".join(self.text).split())


class SurfaceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[Node] = []
        self.nodes: list[Node] = []
        self.labels_for: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        node = Node(tag, values, self.stack[-1] if self.stack else None)
        self.nodes.append(node)
        if tag == "label" and values.get("for"):
            self.labels_for.add(str(values["for"]))
        if self.stack:
            for ancestor in self.stack:
                ancestor.text.append("")
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data: str) -> None:
        if self.stack:
            for node in self.stack:
                node.text.append(data)


def is_hidden(node: Node) -> bool:
    current: Node | None = node
    while current:
        classes = set((current.attrs.get("class") or "").split())
        if "hidden" in classes or current.attrs.get("aria-hidden") == "true":
            return True
        current = current.parent
    return False


def has_accessible_name(node: Node, ids: dict[str, Node], labels_for: set[str]) -> bool:
    attrs = node.attrs
    if attrs.get("aria-label") or attrs.get("data-i18n-aria-label") or attrs.get("title"):
        return True
    labelledby = (attrs.get("aria-labelledby") or "").split()
    if labelledby and all(ref in ids and ids[ref].text_content for ref in labelledby):
        return True
    element_id = attrs.get("id")
    if element_id and (element_id in labels_for or element_id in RUNTIME_LABEL_IDS):
        return True
    parent = node.parent
    while parent:
        if parent.tag == "label":
            return True
        parent = parent.parent
    return False


def main() -> int:
    source = SOURCE.read_text(encoding="utf-8")
    parser = SurfaceParser()
    parser.feed(source)
    ids = {str(node.attrs["id"]): node for node in parser.nodes if node.attrs.get("id")}
    issues: list[str] = []
    controls = [node for node in parser.nodes if node.tag in {"input", "select", "textarea"}]
    visible_controls = 0

    for node in controls:
        input_type = (node.attrs.get("type") or "").lower()
        if input_type in NON_LABEL_INPUT_TYPES or is_hidden(node):
            continue
        visible_controls += 1
        if not has_accessible_name(node, ids, parser.labels_for):
            issues.append(f"{node.tag}#{node.attrs.get('id', '(no id)')} has no explicit or runtime accessible name")

    buttons = [node for node in parser.nodes if node.tag == "button" and not is_hidden(node)]
    unnamed_buttons = [
        node for node in buttons
        if not has_accessible_name(node, ids, parser.labels_for) and not node.text_content
    ]

    script = re.search(r"const\\s+fieldTexts\\s*=\\s*\\{(.*?)\\}\\s*;\\s*Object\\.entries\\(fieldTexts\\)", source, re.S)
    if not script:
        issues.append("runtime fieldTexts accessibility map was not found")
    else:
        for field_id in sorted(RUNTIME_LABEL_IDS):
            if not re.search(rf"\\b{re.escape(field_id)}\\s*:", script.group(1)):
                issues.append(f"runtime accessible-name map is missing {field_id}")

    if unnamed_buttons:
        issues.extend(f"button#{node.attrs.get('id', '(no id)')} has no accessible name" for node in unnamed_buttons)

    if issues:
        print("FAIL accessible surface contract:")
        print("\n".join(f"- {issue}" for issue in issues))
        return 1

    print(f"PASS accessible surface contract: {visible_controls} visible form controls named; {len(buttons)} visible buttons have a non-empty name source.")
    print("NOTE heuristic source check only; not WCAG conformance or native screen-reader verification.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
