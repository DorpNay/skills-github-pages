# Third-party browser runtime assets

These pinned upstream runtime files are served from the same GitHub Pages origin. No runtime CDN request is required for the UI shell, Markdown parsing or HTML sanitization.

| Asset | Version | Upstream | License |
|---|---:|---|---|
| `tailwindcss-3.4.17.js` | 3.4.17 | https://cdn.tailwindcss.com/3.4.17 | MIT |
| `marked-18.0.14.min.js` | 18.0.14 | https://github.com/markedjs/marked/tree/v18.0.14 | MIT |
| `purify-3.4.16.min.js` | 3.4.16 | https://github.com/cure53/DOMPurify/tree/3.4.16 | Apache-2.0 OR MPL-2.0 |

The versions are pinned in filenames and source URLs. Review upstream advisories and license terms before changing any asset. These files are vendor artifacts, not source-of-truth code; do not edit them manually.
