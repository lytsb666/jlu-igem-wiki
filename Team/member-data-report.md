# Member data import report

Generated from the supplied `team member.zip` Word documents on 2026-09-30.

## Import summary

- Total people: 37
- Team Leaders: 2
- Wet Lab: 6
- Dry Lab: 5
- Human Practices: 8
- Hardware & Wiki: 3
- Visual Design: 5
- Advisors: 9

Group totals are not additive because Tonghui Yin belongs to both Human Practices and Hardware & Wiki.

## Photo audit

No true portrait or team photograph was found. The embedded Word images were template graphics or contribution screenshots, so none were imported as portraits.

Missing portraits (37): Liuyu Yang, Jingyi Kang, Hengqi Deng, Tong Li, Ziyi Dong, Zhiyuan Jin, Xiaojie Meng, Duo Zhang, Mo Jin, Guanbo Yin, Botao Zhang, Ziyan Qin, Haoyang Liu, Yu Xia, Ruiyao Guo, Jiale Wei, Shunyao Zhang, Wenxian Gao, Yujia Yang, Wensong Yao, Tonghui Yin, Yirui Lu, Bowen Xiao, Qianwen Luo, Wenqi Ai, Qianwen Wang, Jiale Zhang, Chen Xing, Feiyue Wang, Lanchao Sun, Ziqiao He, Hanyu Wang, Luozhao Wang, Sen Liang, Wang Pengtao, Chen Boyuan, and Ziyun Ma.

## Conflicts and normalization notes

### Liuyu Yang

- Source file: `Team Member-杨鏐玉.docx`
- The `Team Member` field says `Jingyi Kang`, while the file name identifies 杨鏐玉 and the Quote field introduces `Liuyu Yang`.
- Resolution: display `Liuyu Yang`, following the file name as requested. The raw value and resolution remain recorded in `member-data.js`.
- The Quote field is actually a self-introduction. It is retained as the introduction; the quote remains empty.

### Mo Jin

- Source file: `Dry Lab 金墨.docx`
- The `Team Member` field says `Mo Jin`, while the introduction says `Jin Mo`.
- Resolution: display `Mo Jin`, following the explicit `Team Member` field. Both source values remain recorded as a data issue.

### Zhiyuan Jin

- The raw role is the generic `Member`, but the file name and introduction identify Wet Lab work and Wet Lab subgroup leadership.
- Resolution: normalize the display role to `Wet Lab Leader`; preserve raw role `Member`.

### Haoyang Liu

- The raw role is the generic `Member`, while all described work concerns software, modeling, data, and dry–wet integration.
- Resolution: group under `Dry Lab`; preserve raw role `Member`.
- The Quote field contains an introduction rather than a quote. It is retained as the introduction; the quote remains empty.

## Role normalization

- `Wet Lab`, `Wetlab`, and variants display as `Wet Lab`.
- `Dry Lab`, `Drylab`, and variants display as `Dry Lab`.
- `HP`, `HP Member`, and `Human Practices` display as `Human Practices`.
- `Wiki`, `Hardware`, and `Instrument` are grouped under `Hardware & Wiki` where indicated by the source role.
- `Designer` and `Visual Designer` display as `Visual Design`.
- Raw names, roles, source files, and all issue markers are retained in the data source.

## 2026-10-03 photo and interaction update

Baseline: `8444af2`, branch `codex/02-team`, clean at start. This section supersedes the earlier photo audit only; original identity resolutions above remain authoritative.

### Personnel, photo and folder mapping (before UI implementation)

37 contribution filenames match the existing 37 source filenames exactly. No re-import was performed. All introductions, quotes, roles, groups, 186 specific task records and six original issue records are retained.

43 photo files: 37 existing-member candidates plus six PI/Secondary PI entries. 35 existing-member portraits and six faculty portraits are connected. Two candidate portraits are withheld until 00 resolves aliases. Originals remain unchanged in the supplied desktop directory; SHA-256, original size, individually reviewed 4:5 crop rectangles and web file sizes are preserved in `assets/team-member/photo-mapping.json`. Web versions are 800×1000 WebP, quality 82, EXIF orientation corrected, without source metadata.

| Person / id | Contribution source | Photo source | Current groups | Status |
|---|---|---|---|---|
| Ziqiao He / ziqiao-he | ad/Advisor-何梓侨.docx | ad/何梓侨（ad）.jpg | Advisors | filename-match |
| Lanchao Sun / lanchao-sun | ad/Advisor  孙兰超.docx | ad/孙兰超（ad）.jpg | Advisors | filename-match |
| Sen Liang / sen-liang | ad/梁森.docx | ad/梁森ad.jpg | Advisors | filename-match |
| Hanyu Wang / hanyu-wang | ad/Advisor王晗宇.doc | ad/王晗宇ad.jpg | Advisors | filename-match |
| Luozhao Wang / luozhao-wang | ad/advisor王洛钊.docx | ad/王洛钊ad.jpg | Advisors | filename-match |
| Feiyue Wang / feiyue-wang | ad/20260924_王飞跃.docx | ad/王飞跃ad.jpg | Advisors | filename-match |
| Wang Pengtao / wang-pengtao | ad/王鹏涛-Team Member Contribution.docx | ad/王鹏涛（ad）.jpg | Advisors | filename-match |
| Chen Boyuan / chen-boyuan | ad/陈博远-Team Member Contribution(1).docx | ad/陈博远（ad）.jpg | Advisors | filename-match |
| Ziyun Ma / ziyun-ma | ad/马梓云.docx | ad/马子云ad.jpg | Advisors | pending-00-alias |
| Haoyang Liu / haoyang-liu | Dry/刘皓阳.docx | Dry/刘皓阳.jpg | Dry Lab | filename-match |
| Guanbo Yin / guanbo-yin | Dry/drylab尹冠博.docx | Dry/尹冠博.jpg | Dry Lab | filename-match |
| Botao Zhang / botao-zhang | Dry/Drylab张博韬.docx | Dry/张博韬.jpg | Dry Lab | filename-match |
| Ziyan Qin / ziyan-qin | Dry/秦梓严.docx | Dry/秦梓严.jpg | Dry Lab | filename-match |
| Bowen Xiao / bowen-xiao | Hardware/肖博文_Team_Member_Contribution.docx | Hardware/肖博文.jpg | Hardware & Wiki | filename-match |
| Mo Jin / mo-jin | Hardware/Dry Lab 金墨.docx | Hardware/金墨.jpg | Dry Lab | pending-00-group; photo filename matched |
| Yirui Lu / yirui-lu | Hardware/hardware鲁怡蕊(1).docx | Hardware/鲁怡蕊.jpg | Hardware & Wiki | filename-match |
| Yu Xia / yu-xia | HP/HP 夏宇.docx | HP/夏宇.jpg | Human Practices | filename-match |
| Wensong Yao / wensong-yao | HP/姚文松.docx | HP/姚文松.jpg | Human Practices | filename-match |
| Tonghui Yin / tonghui-yin | HP/尹桐辉 Team Member Contribution.docx | HP/尹桐辉.jpg | Human Practices, Hardware & Wiki | filename-match |
| Shunyao Zhang / shunyao-zhang | HP/HP组  张瞬尧.docx | HP/张瞬尧.jpg | Human Practices | filename-match |
| Yujia Yang / yujia-yang | HP/杨雨佳team member.docx | HP/杨雨佳.png | Human Practices | filename-match |
| Ruiyao Guo / ruiyao-guo | HP/HP+郭睿垚.docx | HP/郭睿垚.jpg | Human Practices | filename-match |
| Jiale Wei / jiale-wei | HP/HP韦佳乐.docx | HP/韦佳乐.jpg | Human Practices | filename-match |
| Wenxian Gao / wenxian-gao | HP/HP组+高文娴.docx | HP/高文娴.jpg | Human Practices | filename-match |
| Jingyi Kang / jingyi-kang | Leader/康靖宜.docx | Leader/康靖宜（team leader）.jpg | Team Leaders | filename-match |
| Xiaojie Meng / xiaojie-meng | Wet/wetlab 孟小杰.docx | Wet/孟小杰.png | Wet Lab | filename-match |
| Duo Zhang / duo-zhang | Wet/Wetlab 张朵.docx | Wet/张朵.jpg | Wet Lab | filename-match |
| Tong Li / tong-li | Wet/wet lab 李彤.docx | Wet/李彤.jpg | Wet Lab | filename-match |
| Zhiyuan Jin / zhiyuan-jin | Wet/Wetlab 金智媛.docx | Wet/金智媛.jpg | Wet Lab | filename-match |
| Hengqi Deng / hengqi-deng | Wet/Wet Lab 邓恒奇.docx | Wet/邓恒奇.jpg | Wet Lab | filename-match |
| Ziyi Dong / ziyi-dong | Wet/Wetlab 董梓伊.docx | Wet/董梓伊.jpg | Wet Lab | filename-match |
| Jiale Zhang / jiale-zhang | 美工/美工组张家乐(1).doc | 美工/张家乐.jpg | Visual Design | filename-match |
| Liuyu Yang / liuyu-yang | 美工/Team Member-杨鏐玉.docx | 美工/杨liu玉.jpg | Team Leaders | pending-00-alias |
| Qianwen Wang / qianwen-wang | 美工/美工组 王芊雯.docx | 美工/王芊雯.jpg | Visual Design | filename-match |
| Wenqi Ai / wenqi-ai | 美工/美工组 艾文琦(1).docx | 美工/艾文琦.jpg | Visual Design | filename-match |
| Chen Xing / chen-xing | 美工/邢辰Team Member Contribution.docx | 美工/邢辰.jpg | Visual Design | filename-match |
| Qianwen Luo / qianwen-luo | 美工/美工 骆茜雯.docx | 美工/骆茜雯.png | Visual Design | filename-match |
| 宋秀玲 / pi-song-xiuling | None supplied | PI/宋秀玲（pi）.jpg | PI | photo-filename-basic-information |
| 庞博 / pi-pang-bo | None supplied | PI/庞博（pi）.jpg | PI | photo-filename-basic-information |
| 李金华 / pi-li-jinhua | None supplied | PI/李金华（pi）.jpg | PI | photo-filename-basic-information |
| 王娟 / secondary-pi-wang-juan | None supplied | Secondary PI/王娟（secondary Pi.jpg | Secondary PI | photo-filename-basic-information |
| 苏国范 / secondary-pi-su-guofan | None supplied | Secondary PI/苏国范（secondary pi）.jpg | Secondary PI | photo-filename-basic-information |
| 赵超 / secondary-pi-zhao-chao | None supplied | Secondary PI/赵超（secondary Pi）.jpg | Secondary PI | photo-filename-basic-information |

### Decisions required from 00

- Mo Jin / 金墨: both supplied photo and contribution folders say Hardware; existing role/group is Dry Lab. Photo identity matches the source filename, so the portrait is connected, while role/groups stay unchanged pending 00.
- Liuyu Yang / 杨鏐玉: supplied contribution and photo folders say 美工; existing role is Team Leader. Candidate photo is `美工/杨liu玉.jpg`. Keep original name-resolution record and Team Leader role; photo alias and group await 00. Use the existing initials placeholder meanwhile.
- Ziyun Ma: contribution source is `马梓云.docx`; candidate photo is `ad/马子云ad.jpg`. Alias awaits 00; retain original identity and initials placeholder.
- Tonghui Yin remains in Human Practices AND Hardware & Wiki. No duplicate person is created.

### Faculty data still needed

PI: 李金华、庞博、宋秀玲. Secondary PI: 苏国范、王娟、赵超. Only Chinese names and roles from photo filenames/folders are displayed. Verified English names, institution/title, biography, quote and contributions are missing and registered in `teamFaculty[].missingFields`. No Instructor is added. No collective team photo was supplied.

### Page relationship

Member retains the original 37 contribution profiles, now read inside the card back. Attribution remains the existing placeholder page and is untouched; it does not yet consume or duplicate these records.

### Reference study and implementation

Read and interacted with https://2025.igem.wiki/jlu-cp/team on 2026-10-03. Borrowed photo cards, personnel sections, in-place rotation and section links, while retaining this site's warm brown palette and existing rem/clamp typography. The reference's 390px viewport produced document scrollWidth 429px; its clipping/overflow constraints were not adopted.

Member now contains a compact cover, PI, Secondary PI, Team Leaders, Members with the original group filters, and Advisors. There is no collective-photo placeholder panel and no Instructor section. Original contribution records remain one record per person. The original 37 people and seven group counts are unchanged; six photo-only faculty are held separately in `teamFaculty`, giving 43 displayed people, 41 real photos and two initials placeholders.

Each front is a native keyboard-accessible button containing the 4:5 photo, name, role and explicit flip hint. Its back has an independent return button, unchanged biography/Quote, contribution tags and native expandable contribution details. The back occupies the same grid cell and size as the front; its content scrolls inside that card without truncation or font reduction. The inactive face is `inert` and aria-hidden. Enter/Space flip, Tab reaches the reading region and disclosure, Esc returns focus to the original front. Filters synchronously reset open cards; no stale animations can hide a later selection. Only the return button or Esc flips back, so reading clicks/scrolls do not trigger a flip.

Section links use a normal wrapping page nav. The initially tested sticky nav was removed because it covered a return button. This is local Member content; public nav is unchanged. Advisors section link restores All when Advisors were hidden by a group filter.

### Validation results

Production build: Vite 8.1.3, `vite build --configLoader runner`, successful. Dependency manifests and build/deploy config are unchanged. `verify-data.mjs` passes: all 37 original member identities, roles, groups, introductions, quotes, task categories/indices/details, source records and six conflict records equal baseline `8444af2`, excluding only the new portrait fields. Public HTML before main and from footer onward is identical to baseline; Attribution remains unchanged.

| Check | 1440×900 | 390×844 |
|---|---|---|
| Original 37 + 6 faculty; 41 image URL/person mappings | Pass | Pass |
| Filters Wet/Dry/HP/Hardware & Wiki/Visual Design | 6 / 5 / 8 / 3 / 5 | 6 / 5 / 8 / 3 / 5 |
| Advisors / All | 9 advisors / 26 members + 9 advisors; faculty and leaders above | Same |
| In-place flip, return button, no dialog/navigation | Pass | Pass |
| Long Zhiyuan Jin profile: expanded six tasks, scroll to End of profile | 3133px content in 651px reading area; end reached | 3656px content in 554px reading area; end reached |
| Reading/expanding keeps card back, adjacent cards remain in layout | Pass | Pass |
| Keyboard Enter, Space, Tab, disclosure Return, End/Ctrl+End, Esc focus recovery | Pass | Esc focus recovery and reading checked |
| Horizontal document overflow | 0px | 0px |
| Application console errors/warnings | 0 | 0 |

Profile text computed at 20px in both sizes while retaining the original 1rem declarations; long text was not reduced. Original leader-name clamp sizes are retained. Browser-loaded Member `prefers-reduced-motion: reduce` rule was checked: no rotor transition/rotation, only active face visible. This browser connector exposes viewport sizing but no media preference emulation: reduce-mode runtime is unverified, not represented as a passed browser simulation. Narrow-screen click interaction was tested; a physical touch device was not used. Final real-device tap/scroll and OS reduce-motion spot checks remain for 00's integrated acceptance.

`verify-assets.py` passes: all 43 original SHA-256 hashes unchanged; 43 generated WebPs are 800×1000 without EXIF; all 41 connected built/hash URLs return HTTP 200 with bytes equal to source web versions. Original source photo total 313,536,569 bytes; 43 web versions total 2,985,230 bytes. The two pending alias images remain in `assets/team-member/pending/`, are not referenced by Member, and are not emitted as portraits in the production build.

Evidence: `assets/team-member/crop-review.jpg`, `verification/browser-checks.json`, `verification/built-portrait-urls.json`, desktop long-contribution and faculty-card screenshots, mobile photo-card and long-contribution screenshots. New scripts, mapping, screenshots and photos are exclusively in `assets/team-member/`.

### File list and public handoff

Changed: `Team/member.html`, `Team/member-data.js`, `Team/member-data-report.md`, `样式/member.js`, `样式/member.css`. Added: `assets/team-member/` (41 connected portraits, two pending alias portraits, mapping with crop/source hashes, preparation/verification scripts, crop contact sheet, validation evidence).

No Navbar, Loading, Footer, cursor, global stylesheet, shared assets, Homepage, build config or deployment config changes. Public Navbar retains its existing horizontal internal scroll strip on a 390px screen; the Member page itself has no horizontal overflow. This is recorded for 00/10's shared-UI review, not changed here. No build/asset configuration problem was found, so no config patch for 10 is required. Cross-module integration and the pending photo aliases/group decisions are exclusively for 00. No other agent branch was switched or merged.

## 2026-10-03 controller integration and confirmed aliases

The controller reviewed source commit `d641423e56e57fc5bdb527856897f15af8b2c4d6` and integrated it as `3442513d9b0c8f52230517847c90d2375d8ba0ce` on `feat/wiki-ux-redesign`. The 02 worktree remains unchanged on its own branch. This section supersedes the earlier pending-photo and pending-group decisions; earlier validation evidence remains evidence for the original 02 commit only.

The user explicitly confirmed that both candidate photos correspond to their original members: `美工/杨liu玉.jpg` is Liuyu Yang / 杨鏐玉, and `ad/马子云ad.jpg` is Ziyun Ma / 马梓云. Their already-reviewed WebP files were copied into the connected portrait directory and attached to the original identities. Names, roles, groups, biographies, quotes, 186 task records and six original identity/conflict records are unchanged. The old pending WebP copies and all original desktop photos are retained. Current totals: 37 original member portraits plus six faculty portraits, 43 displayed people, 43 connected photos, zero initials placeholders.

The controller checked the original contribution documents. `Hardware/Dry Lab 金墨.docx` explicitly says `Team Role: Dry Lab`; Mo Jin therefore remains in Dry Lab. `美工/Team Member-杨鏐玉.docx` explicitly says `Team Role: Student leader`; Liuyu Yang remains a Team Leader. Folder placement does not override these explicit roles. Tonghui Yin remains one person with both existing groups. Photo aliases and group resolutions are recorded in `photo-mapping.json`. The initial-import photo generator now refuses to overwrite a mapping containing confirmed aliases.

Attribution retirement is handled by 00 separately from the Member implementation. The controller removed its shared navigation entry and added an old-address redirect to Member. Following this public HTML handoff, only the static Attribution link in Member's Navbar was removed; the remaining public HTML and Footer are unchanged. Other page owners must hand off their public HTML before the controller cleans corresponding static links.

Controller evidence is saved outside the repository at `D:/JLU—Wiki/acceptance/2026-10-03_member-d641423-controller/`. The data-preservation verifier passes with all 37 portraits connected. All 43 development portrait URLs return HTTP 200 with bytes equal to the reviewed WebP files; all original SHA-256 hashes remain unchanged and all connected images are 800×1000 without EXIF. Desktop 1440×900 and narrow 390×844 checks confirm the expected filters, in-place flipping, internal profile reading, keyboard navigation and zero document horizontal overflow. Production build/public release of the controller's final version is not claimed here and remains for 10.

Remaining content gaps: the six faculty still lack verified English names, institution/title, biography, quote and contributions. Physical-device touch/scroll and OS reduced-motion runtime still need final spot checks; available browser checks do not substitute for them. Public narrow Navbar scrolling is an existing shared-UI issue, not a Member regression repaired by this task.
