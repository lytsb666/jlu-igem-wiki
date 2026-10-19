# IHP document reader

Uses Mozilla PDF.js 5.6.205 from the bundled runtime, distributed under the included Apache 2.0 license. Library, worker, CMaps, standard fonts and WASM decoders are served from this same website. There is no external document service or browser PDF plugin dependency.

Original PDFs remain in `public/ihp-resources/` unchanged. The reader accepts only same-origin paths within `/ihp-resources/`. All pages, text selection, document links, page navigation, zoom and the original-file toolbar action remain available. It is loaded only after an IHP document is expanded. Other pages retain their existing readers.

`index.htm` and its JS/CSS are intentionally static public files, preserving PDF.js module and worker paths in local development and the Pages upload.

Sources: https://mozilla.github.io/pdf.js/ and https://github.com/mozilla/pdfjs-dist/tree/v5.6.205
