# Third-party browser runtime assets

The application shell serves these pinned libraries from the same GitHub Pages origin. No runtime CDN request is required for styling, Markdown parsing or HTML sanitization.

| Asset | Version | Upstream | License | Runtime |
|---|---:|---|---|---|
| `tailwind.generated.css` | 3.4.17 | https://github.com/tailwindlabs/tailwindcss/tree/v3.4.17 | MIT | Static CSS compiled from `tailwind.config.cjs` and repository UI sources |
| `marked-18.0.14.min.js` | 18.0.14 | https://github.com/markedjs/marked/tree/v18.0.14 | MIT | Same-origin browser script |
| `purify-3.4.16.min.js` | 3.4.16 | https://github.com/cure53/DOMPurify/tree/3.4.16 | Apache-2.0 OR MPL-2.0 | Same-origin browser script |

Tailwind is a build-time dependency only. Regenerate the checked-in CSS with the pinned CLI command in the quality workflow; do not restore the Play CDN runtime in production. Review upstream advisories and license terms before changing any asset.
