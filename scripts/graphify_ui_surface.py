#!/usr/bin/env python3
"""Add deterministic CSS/DOM/JS selector relationships to a Graphify code graph.

This is a CI-only bridge: it does not change the aLandi browser runtime or
claim that a selector match proves browser-computed styling.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable

import tinycss2


def stable_id(kind: str, *parts: object) -> str:
    raw = "\0".join(str(part) for part in parts).encode("utf-8")
    return f"ui_surface_{kind}_{hashlib.sha256(raw).hexdigest()[:20]}"


def line_of(path: Path, offset: int) -> int:
    # Offsets are only used for JS matches; CSS/HTML parsers provide line data.
    return 1


def selector_tokens(tokens: Iterable[object]) -> set[str]:
    """Extract simple class/id selectors from tinycss2 component-value tokens."""
    result: set[str] = set()
    values = list(tokens)
    for index, token in enumerate(values):
        token_type = getattr(token, "type", "")
        if token_type == "hash" and getattr(token, "is_identifier", True):
            value = getattr(token, "value", "")
            if value:
                result.add(f"#{value}")
        elif token_type == "literal" and getattr(token, "value", "") == ".":
            if index + 1 < len(values) and getattr(values[index + 1], "type", "") == "ident":
                value = getattr(values[index + 1], "value", "")
                if value:
                    result.add(f".{value}")
        elif token_type == "function":
            result.update(selector_tokens(getattr(token, "arguments", [])))
        elif token_type in {"() block", "[] block", "{} block"}:
            result.update(selector_tokens(getattr(token, "content", [])))
    return result


def split_selector_list(tokens: list[object]) -> list[list[object]]:
    parts: list[list[object]] = [[]]
    for token in tokens:
        if getattr(token, "type", "") == "literal" and getattr(token, "value", "") == ",":
            parts.append([])
        else:
            parts[-1].append(token)
    return [part for part in parts if part]


def iter_qualified_rules(rules: Iterable[object]):
    for rule in rules:
        kind = getattr(rule, "type", "")
        if kind == "qualified-rule":
            yield rule
        elif kind == "at-rule" and getattr(rule, "content", None) is not None:
            nested = tinycss2.parse_rule_list(
                rule.content, skip_comments=True, skip_whitespace=True
            )
            yield from iter_qualified_rules(nested)


class SurfaceHTMLParser(HTMLParser):
    def __init__(self, source_path: str):
        super().__init__(convert_charrefs=True)
        self.source_path = source_path
        self.found: dict[str, int] = {}

    def handle_starttag(self, tag, attrs):
        line = self.getpos()[0]
        for name, value in attrs:
            if not value:
                continue
            if name == "id":
                self.found.setdefault(f"#{value}", line)
            elif name == "class":
                for class_name in value.split():
                    if re.fullmatch(r"[-_a-zA-Z0-9]+", class_name):
                        self.found.setdefault(f".{class_name}", line)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def add_node(nodes: list[dict], known: set[str], node: dict) -> str:
    node_id = node["id"]
    if node_id not in known:
        nodes.append(node)
        known.add(node_id)
    return node_id


def add_edge(links: list[dict], known: set[tuple], edge: dict) -> None:
    key = (edge["source"], edge["target"], edge["relation"], edge.get("source_file"), edge.get("source_location"))
    if key not in known:
        links.append(edge)
        known.add(key)


def make_file_node(path: str) -> dict:
    name = Path(path).name
    return {
        "id": stable_id("file", path),
        "label": name,
        "_origin": "ui-surface",
        "file_type": "code",
        "norm_label": name.lower(),
        "source_file": path,
        "source_location": "L1",
        "ui_kind": "source_file",
    }


def make_selector_node(kind: str, selector: str, path: str, line: int, **extra) -> dict:
    return {
        "id": stable_id(kind, path, line, selector),
        "label": selector,
        "_origin": "ui-surface",
        "file_type": "code",
        "norm_label": selector.lower(),
        "source_file": path,
        "source_location": f"L{line}",
        "ui_kind": kind,
        "ui_selector": selector,
        **extra,
    }


def make_edge(source: str, target: str, relation: str, path: str, line: int,
              confidence: str = "EXTRACTED", score: float = 1.0) -> dict:
    return {
        "source": source,
        "target": target,
        "relation": relation,
        "_origin": "ui-surface",
        "confidence": confidence,
        "confidence_score": score,
        "source_file": path,
        "source_location": f"L{line}",
        "weight": score,
    }


def collect_css(root: Path):
    records = []
    for path in sorted((root / "assets" / "css").rglob("*.css")):
        relative = path.relative_to(root).as_posix()
        rules = tinycss2.parse_stylesheet(read_text(path), skip_comments=True, skip_whitespace=True)
        for rule in iter_qualified_rules(rules):
            selector_text = tinycss2.serialize(rule.prelude).strip()
            if not selector_text:
                continue
            for part in split_selector_list(list(rule.prelude)):
                normalized = tinycss2.serialize(part).strip()
                tokens = selector_tokens(part)
                for selector in sorted(tokens):
                    records.append({
                        "path": relative,
                        "line": int(getattr(rule, "source_line", 1)),
                        "selector": selector,
                        "selector_text": normalized,
                    })
    return records


def collect_dom(root: Path):
    records = []
    candidates = [root / "index.md", *sorted((root / "landing").rglob("*.html"))]
    for path in candidates:
        if not path.is_file():
            continue
        relative = path.relative_to(root).as_posix()
        parser = SurfaceHTMLParser(relative)
        parser.feed(read_text(path))
        for selector, line in sorted(parser.found.items()):
            records.append({"path": relative, "line": line, "selector": selector})
    return records


JS_PATTERNS = (
    re.compile(r"\bgetElementById\s*\(\s*(['\"])([^'\"]+)\1"),
    re.compile(r"\b(?:querySelector|querySelectorAll|matches|closest)\s*\(\s*(['\"])([^'\"]+)\1"),
    re.compile(r"\bgetElementsByClassName\s*\(\s*(['\"])([^'\"]+)\1"),
    re.compile(r"\bclassList\s*\.\s*(?:add|remove|toggle|contains)\s*\(\s*(['\"])([^'\"]+)\1"),
)
SIMPLE_SELECTOR = re.compile(r"(?<![\\\w-])([.#])([-_a-zA-Z0-9]+)")


def collect_js(root: Path, graph_nodes: list[dict]):
    records = []
    function_nodes: dict[str, list[tuple[int, str]]] = defaultdict(list)
    for node in graph_nodes:
        if node.get("_callable") and node.get("source_file") and node.get("id"):
            match = re.fullmatch(r"L(\d+)", str(node.get("source_location", "")))
            if match:
                function_nodes[node["source_file"]].append((int(match.group(1)), node["id"]))
    for values in function_nodes.values():
        values.sort()

    candidates = [root / "assets" / "js" / "app.js", *sorted((root / "assets" / "js").rglob("*.js"))]
    seen_paths = set()
    for path in candidates:
        if not path.is_file():
            continue
        relative = path.relative_to(root).as_posix()
        if relative in seen_paths:
            continue
        seen_paths.add(relative)
        source = read_text(path)
        for pattern in JS_PATTERNS:
            for match in pattern.finditer(source):
                literal = match.group(2)
                line = source.count("\n", 0, match.start()) + 1
                for selector_match in SIMPLE_SELECTOR.finditer(literal):
                    selector = selector_match.group(1) + selector_match.group(2)
                    owner = None
                    preceding = [item for item in function_nodes.get(relative, []) if item[0] <= line]
                    if preceding:
                        owner = preceding[-1][1]
                    records.append({
                        "path": relative,
                        "line": line,
                        "selector": selector,
                        "owner": owner,
                        "expression": match.group(0)[:180],
                    })
    return records


def enrich_graph(root: Path, graph_path: Path) -> dict:
    graph = json.loads(graph_path.read_text(encoding="utf-8"))
    nodes = graph.setdefault("nodes", [])
    links = graph.setdefault("links", [])
    known_nodes = {node.get("id") for node in nodes}
    known_edges = {
        (edge.get("source"), edge.get("target"), edge.get("relation"),
         edge.get("source_file"), edge.get("source_location"))
        for edge in links
    }

    css = collect_css(root)
    dom = collect_dom(root)
    js = collect_js(root, nodes)

    file_nodes: dict[str, str] = {}
    def ensure_file(path: str) -> str:
        if path not in file_nodes:
            file_nodes[path] = add_node(nodes, known_nodes, make_file_node(path))
        return file_nodes[path]

    css_by_selector: dict[str, list[str]] = defaultdict(list)
    dom_by_selector: dict[str, list[str]] = defaultdict(list)

    for record in css:
        file_id = ensure_file(record["path"])
        node = make_selector_node(
            "css_selector", record["selector"], record["path"], record["line"],
            selector_text=record["selector_text"],
        )
        node_id = add_node(nodes, known_nodes, node)
        css_by_selector[record["selector"]].append(node_id)
        add_edge(links, known_edges, make_edge(
            file_id, node_id, "contains", record["path"], record["line"]
        ))

    for record in dom:
        file_id = ensure_file(record["path"])
        node_id = add_node(nodes, known_nodes, make_selector_node(
            "dom_selector", record["selector"], record["path"], record["line"]
        ))
        dom_by_selector[record["selector"]].append(node_id)
        add_edge(links, known_edges, make_edge(
            file_id, node_id, "contains", record["path"], record["line"]
        ))

    for selector in sorted(set(css_by_selector) & set(dom_by_selector)):
        for css_id in css_by_selector[selector]:
            for dom_id in dom_by_selector[selector]:
                css_node = next(node for node in nodes if node["id"] == css_id)
                add_edge(links, known_edges, make_edge(
                    css_id, dom_id, "may_style", css_node["source_file"],
                    int(css_node["source_location"][1:]), "INFERRED", 0.9
                ))

    js_selector_ids = []
    for record in js:
        file_id = ensure_file(record["path"])
        ref_id = add_node(nodes, known_nodes, make_selector_node(
            "js_selector_reference", record["selector"], record["path"], record["line"],
            expression=record["expression"],
        ))
        js_selector_ids.append(ref_id)
        add_edge(links, known_edges, make_edge(
            file_id, ref_id, "contains", record["path"], record["line"]
        ))
        if record["owner"]:
            add_edge(links, known_edges, make_edge(
                record["owner"], ref_id, "references_ui_selector",
                record["path"], record["line"], "INFERRED", 0.85
            ))
        for target in css_by_selector.get(record["selector"], []):
            add_edge(links, known_edges, make_edge(
                ref_id, target, "references", record["path"], record["line"],
                "INFERRED", 0.9
            ))
        for target in dom_by_selector.get(record["selector"], []):
            add_edge(links, known_edges, make_edge(
                ref_id, target, "targets", record["path"], record["line"],
                "INFERRED", 0.9
            ))

    graph_path.write_text(json.dumps(graph, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {
        "css_selector_nodes": len(css),
        "dom_selector_nodes": len(dom),
        "js_selector_references": len(js),
        "new_graph_nodes": len(nodes),
        "new_graph_edges": len(links),
        "matched_css_dom_selectors": len(set(css_by_selector) & set(dom_by_selector)),
        "selectors_without_css": sorted(set(dom_by_selector) - set(css_by_selector))[:40],
        "css_selectors_without_dom": sorted(set(css_by_selector) - set(dom_by_selector))[:40],
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--graph", type=Path, default=Path("graphify-out/graph.json"))
    args = parser.parse_args()
    root = args.root.resolve()
    graph_path = args.graph if args.graph.is_absolute() else root / args.graph
    if not graph_path.is_file():
        raise SystemExit(f"Graphify graph not found: {graph_path}")
    result = enrich_graph(root, graph_path)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if not result["css_selector_nodes"] or not result["dom_selector_nodes"]:
        raise SystemExit("UI surface extraction found no CSS or DOM selectors; refusing an empty bridge")


if __name__ == "__main__":
    main()
