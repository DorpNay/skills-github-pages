import json
import tempfile
import unittest
from pathlib import Path

from graphify_ui_surface import enrich_graph


class GraphifyUiSurfaceTests(unittest.TestCase):
    def test_links_css_dom_and_javascript_selectors_with_provenance(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "assets/css").mkdir(parents=True)
            (root / "assets/js").mkdir(parents=True)
            (root / "landing").mkdir()
            (root / "assets/css/app.css").write_text(
                ".panel, #chatPane { display: grid; }\n"
                ".active { color: red; }\n"
                "@media (max-width: 600px) { .panel:hover { display: block; } }\n",
                encoding="utf-8",
            )
            (root / "index.md").write_text(
                '<main id="chatPane" class="panel active"></main>\n',
                encoding="utf-8",
            )
            (root / "landing/index.html").write_text(
                '<section class="panel"></section>\n',
                encoding="utf-8",
            )
            (root / "assets/js/app.js").write_text(
                "function renderPanel() { document.querySelector('.panel'); }\n"
                "document.getElementById('chatPane');\n$('#chatPane');\n"
                "document.querySelectorAll('.panel .active');\n"
                "element.classList.add('active');\n",
                encoding="utf-8",
            )
            graph_path = root / "graph.json"
            graph_path.write_text(json.dumps({
                "directed": True,
                "multigraph": True,
                "graph": {"schema_version": 1},
                "nodes": [{
                    "id": "assets_js_app_renderpanel",
                    "label": "renderPanel()",
                    "_callable": True,
                    "source_file": "assets/js/app.js",
                    "source_location": "L1",
                    "file_type": "code",
                }, {
                    "id": "assets_js_app",
                    "label": "app.js",
                    "source_file": "assets/js/app.js",
                    "source_location": "L1",
                    "file_type": "code",
                }],
                "links": [],
            }), encoding="utf-8")

            result = enrich_graph(root, graph_path)
            graph = json.loads(graph_path.read_text(encoding="utf-8"))
            labels = [node.get("label") for node in graph["nodes"]]
            relations = [edge["relation"] for edge in graph["links"]]

            self.assertGreaterEqual(result["css_selector_records"], 3)
            self.assertGreaterEqual(result["css_selector_nodes"], 2)
            self.assertGreaterEqual(result["dom_selector_nodes"], 2)
            self.assertGreaterEqual(result["js_selector_reference_nodes"], 2)
            self.assertIn("#chatPane", labels)
            self.assertIn(".panel", labels)
            self.assertIn("may_style", relations)
            self.assertIn("may_style_candidate", relations)
            self.assertNotIn("references_ui_selector", relations)
            self.assertIn("targets", relations)
            self.assertIn("candidate_targets", relations)
            self.assertIn("may_affect_style", relations)
            inferred = [edge for edge in graph["links"] if edge["confidence"] == "INFERRED"]
            self.assertTrue(inferred)
            self.assertTrue(all(edge["confidence_score"] <= 0.65 for edge in inferred))
            self.assertTrue(any(
                edge["relation"] == "may_style" and edge["match_kind"] == "exact_simple_selector"
                and edge["confidence_score"] == 0.65 for edge in inferred
            ))
            self.assertTrue(any(
                edge["relation"] == "may_style_candidate" and edge["match_kind"] == "token_overlap_only"
                and edge["confidence_score"] == 0.25 for edge in inferred
            ))
            mutation_nodes = {
                node["id"] for node in graph["nodes"] if node.get("ui_kind") == "js_class_mutation"
            }
            self.assertTrue(mutation_nodes)
            self.assertFalse(any(
                edge["source"] in mutation_nodes and edge["relation"] == "targets"
                for edge in graph["links"]
            ))
            self.assertEqual(result["js_class_mutation_nodes"], 1)
            self.assertTrue(all(edge.get("source_file") for edge in graph["links"]))


    def test_compound_selector_relationships_remain_candidates(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "assets/css").mkdir(parents=True)
            (root / "assets/js").mkdir(parents=True)
            (root / "assets/css/app.css").write_text(
                ".panel .child:hover { color: red; }\n", encoding="utf-8"
            )
            (root / "index.md").write_text(
                '<div class="panel child"></div>\n', encoding="utf-8"
            )
            (root / "assets/js/app.js").write_text(
                "document.querySelectorAll('.panel .child');\n", encoding="utf-8"
            )
            graph_path = root / "graph.json"
            graph_path.write_text(json.dumps({
                "directed": True,
                "multigraph": True,
                "graph": {"schema_version": 1},
                "nodes": [],
                "links": [],
            }), encoding="utf-8")

            enrich_graph(root, graph_path)
            graph = json.loads(graph_path.read_text(encoding="utf-8"))
            relations = [edge["relation"] for edge in graph["links"]]
            self.assertIn("may_style_candidate", relations)
            self.assertIn("candidate_targets", relations)
            self.assertIn("candidate_references", relations)
            self.assertNotIn("may_style", relations)
            self.assertNotIn("targets", relations)
            inferred = [edge for edge in graph["links"] if edge["confidence"] == "INFERRED"]
            self.assertTrue(inferred)
            self.assertTrue(all(edge["confidence_score"] == 0.25 for edge in inferred))


if __name__ == "__main__":
    unittest.main()
