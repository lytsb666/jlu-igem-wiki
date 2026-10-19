# Site document reader

Uses Mozilla PDF.js 5.6.205 from the bundled runtime, distributed under the included Apache 2.0 license. Library, worker, CMaps, standard fonts and WASM decoders are served from this same website. There is no external document service or browser PDF plugin dependency.

The shared reader covers IHP, Hardware, Software and Education (46 distinct original PDFs, 311 pages). Original PDFs are unchanged. The reader accepts same-origin `.pdf` paths within the deployed site root, including encoded Chinese names and spaces. All pages, text selection, document links, page navigation, zoom and the original-file toolbar action remain available.

`样式/pdf-readers.js` activates expanded documents only near the viewport and keeps at most two reader iframes active. Closing a disclosure or moving away unloads its iframe and worker. Page, zoom and PDF coordinates are retained in the parent page and restored when reopened. Education's 23 default-open plans and Hardware's four default-open Assembly and Reproduction readers keep their disclosure states without eagerly loading their PDFs at page entry.

Core and worker files are the upstream minified **legacy** builds of the same 5.6.205 release; the Apache license and compatibility polyfills are retained. Module preloads shorten the discovery chain inside an activated reader. `disableAutoFetch: true` avoids eager initialization of every page; `disableStream: true` enables on-demand range loading when the host supports it. Servers that do not advertise/support byte ranges still download the complete PDF. This is not a guarantee of a smaller PDF transfer or faster cold first-page display. HiDPI canvas allocations are bounded to 4 megapixels on narrow screens and 8 on desktop.

`index.htm` and its JS/CSS are intentionally static public files, preserving PDF.js module and worker paths in local development and the Pages upload.

Asset paths are relative to the reader. A future iGEM migration must separately map PDFs to the actual official asset URLs, adapt the allowed origins and validate the official build pipeline. This change does not publish to or modify the iGEM official site.

Sources: https://mozilla.github.io/pdf.js/ and https://github.com/mozilla/pdfjs-dist/tree/v5.6.205
