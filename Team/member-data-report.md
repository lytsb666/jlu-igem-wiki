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
