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
                "document.getElementById('chatPane');\n$('chatPane');\nelement.classList.add('active');\n",
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

            self.assertGreaterEqual(result["css_selector_nodes"], 3)
            self.assertIn("#chatPane", labels)
            self.assertIn(".panel", labels)
            self.assertIn("may_style", relations)
            self.assertIn("references_ui_selector", relations)
            self.assertIn("targets", relations)
            inferred = [edge for edge in graph["links"] if edge["relation"] in {
                "may_style", "references_ui_selector", "targets"
            }]
            self.assertTrue(inferred)
            self.assertTrue(all(edge["confidence"] == "INFERRED" for edge in inferred))
            self.assertTrue(all(edge.get("source_file") for edge in graph["links"]))


if __name__ == "__main__":
    unittest.main()
