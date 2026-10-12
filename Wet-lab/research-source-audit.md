# October wet-lab manuscript synchronization and research handoff

Worktree: `D:\JLU—Wiki\IGEMwiki\worktrees\03-research`
Branch: `codex/03-research`

User authority: October 5 manuscripts; latest `湿实验wiki.需要修改的部分1.docx`; `配色.docx`; subsequent chat clarifications. BOX is the sole specially framed block. The flowchart and following text use the ordinary white content container. All experimental line charts are reduced in display size.

## Files and source fidelity

| Source | Page | Source blocks | Tables | Images | SHA-256 |
|---|---|---:|---:|---:|---|
| description.docx | `Project/description.html` | 107 | 2 | 9 | `d3b10d1155dbeb6ca1eabab194c594bfcf33fc32c68575da428346262735e757` |
| design.docx | `Project/design.html` | 59 | 2 | 2 | `ff9527a26c373fc64da41164b3ed7bf9b868a94e6dd9d034b85b60630a42bbab` |
| Safety.docx | `Project/safety.html` | 124 | 2 | 7 | `66a093f1d957586ff042e12dbee1db4c82bc75245d6de9e12b7169de4f9d39a8` |
| Measurement.docx | `Wet-lab/measurement.html` | 380 | 14 | 39 | `800933848aad1e5273d727771965aa4ba91382360091ab75087845a9f493c2c0` |
| notebook.docx | `Wet-lab/notebook.html` | 745 | 10 | 0 | `26ca2268580e85668dd66994f4114d7e6c3359b915f1b43b4b631f564d57058e` |
| protocol.docx | `Wet-lab/protocal.html` | 814 | 28 | 0 | `0e66d32fcb3a1a2d52014a66e980bb735455dc0e9d4f7858514e051be89414b1` |
| result.docx | `Wet-lab/result.html` | 224 | 0 | 52 | `3568ba926f6a71fbeb8c37e189bb3aa01c03b1573355bc7a279cc09e45a2677d` |

The seven sources are from `C:/Users/UserTech/Desktop/10.5最终版wiki湿实验/10.5最终版wiki湿实验/`. Content was checked block by block, including nonempty final table cells and paragraph superscripts/subscripts. Scientific numbers, sequences, formulas and conclusions were not invented or reconciled without author input. Word deletion revisions, comments and folding instructions are excluded from displayed prose. Empty deleted legacy tables in Description/Design are omitted.

Other edited files: `样式/measurement.css`, `样式/protocol.css`, `样式/protocol.js`. Other page-specific styling and fragment handling are embedded in the allowed HTML files. Source scientific assets are under `a  图片/research-2026-10-05/`. Original files are byte-identical to the corresponding embedded Word media. TIFFs retain their original files and use full-resolution, pixel-identical PNGs in browsers.

Public CSS/JS, Navbar, Loading, Footer, Hardware/Software, Parts, instrument/model and judging/model were not edited. No other branches were checked out or merged.

## Verification

- All seven pages: zero content omissions/mismatches, zero paragraph superscript/subscript mismatches, zero duplicate IDs, valid nesting, zero broken local main-content links.
- Source and production builds: original-image links follow the loaded image URL, including hashed production filenames.
- Production build and `git diff --check`: passed.
- Desktop 1280px, phone widths 390px/320px: all seven pages have zero document-width overflow; tables scroll inside their own containers.
- Directory: wider existing scroll frame; On this page text removed; generated links target existing source headings. Safety includes new sections 7–9.
- Protocol: five renamed cards, two-level directory, 15 panel selections passed with one visible panel and matching aria-expanded state; incoming hidden-panel fragments reveal their category/panel. Experimental equipment/reagent folds remain native details.
- Calendar: 47 experiment records, 52 dated events; monthly event counts March–September = 5, 7, 9, 7, 12, 12, 0. All actual date cells use #6A3F24 with white date text. Event clicks update the experiment fragment and focus the experiment heading.
- References: Description/Design/Measurement use native details; source reference fragments reveal folded content. Result has no References block.
- Flowchart: 25 mapped nodes; all 24 internal node clicks passed, and the remaining MD link resolves to an existing model fragment. Phone view provides expandable text links to the same nodes.
- Figures: 84 experiment-chart placements use maximum display width 640px and height 512px while retaining full-resolution originals. Example candidate plot measured 640px by 512px after reserving aspect ratio; object-fit contains the original plot. Captions use #7D521D.
- Production image resources: 96 distinct image URLs all returned HTTP 200. 16 TIFF-to-PNG conversions passed pixel equality.
- Registry: unchanged Parts page currently has pending IDs; no valid BBa identifiers exist, so no real Registry outbound link can be tested. The existing script only generates links for valid BBa IDs and leaves pending entries without destinations.

## Cross-page consistency and manuscript questions

These questions originate in the supplied manuscripts. They were retained rather than resolved by changing experimental facts.

1. Measurement B174/B220/B267/B314 says the other four assays use the optimized RSV parameters. Measurement B107 and Result B14 give RSV optimum 41 °C, while Result B60/B106/B148/B190 give hMPV-B 42 °C and SPN/BP/HI 40 °C. These manuscript statements require author reconciliation.
2. Measurement Figure workflow (image3.png) still labels MD Simulation as 1.2.2 and optimization branches as 2.3.3, whereas the new body uses enzyme kinetics and section 2.2.3. Existing figure artwork is kept exactly, with valid topical link destinations. The B25 prose still calls the schematic a Measurement tree, although the actual tree-shaped illustration was removed from the page.
3. Measurement section 8.2 says the figure below shows instrument validation results, but the source has no corresponding embedded result figure after that paragraph. No result graphic was invented.
4. Measurement B281 has an invalid ../NULL image relationship alongside a valid image31.png; the valid supplied graphic is rendered.
5. Safety B82 says No live organisms are used, while the Overview and expression-host section discuss E. coli BL21(DE3). Scope clarification remains an author question.
6. Description and Design retain editorial revisions and comments in their source Word files. Only final visible inserted/current text is rendered; the original DOCX files were not edited.
7. Some source reaction-volume/concentration relationships require stock concentrations not specified in the manuscripts. Existing Protocol source audit questions still apply; values were copied rather than reverse-calculated.

The five target-gene labels and major section links are consistent across the migrated pages. Retired source subsections retain legacy fragment aliases at the corresponding topic or document entry; an alias is not a claim that the retired subsection still exists.

## Integration for 00

Integration must be performed by 00. Only this branch may be committed here. The app thread-list/message tools returned Invalid app tool request, so automatic delivery to 00 is unavailable; a commit-specific handoff is provided locally after commit.
